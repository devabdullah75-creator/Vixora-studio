import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, rename, unlink } from 'node:fs/promises';
import { basename, dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import argon2 from 'argon2';
import express from 'express';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import { fileTypeFromFile } from 'file-type';
import helmet from 'helmet';
import multer from 'multer';
import { z } from 'zod';
import {
  database,
  mediaDirectory,
  privateDirectory,
  storageDirectory,
  temporaryDirectory,
} from './database.js';
import { SQLiteSessionStore } from './sqliteSessionStore.js';

const backendDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const frontendDirectory = resolve(backendDirectory, '..', 'Frontend');
const frontendBuildDirectory = resolve(frontendDirectory, 'dist');
const sessionSecret = process.env.SESSION_SECRET;
const isProduction = process.env.NODE_ENV === 'production';
const configuredOrigin = process.env.APP_ORIGIN || (isProduction ? '' : 'http://localhost:5173');
const sessionCookieName = isProduction ? '__Host-vixora.sid' : 'vixora.sid';
const passwordHashOptions = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

if (!sessionSecret || sessionSecret.length < 32 || sessionSecret === 'replace-with-at-least-32-random-bytes') {
  throw new Error('Set SESSION_SECRET to a private random value of at least 32 characters.');
}
if (!configuredOrigin) throw new Error('Set APP_ORIGIN to the canonical production website origin.');
let appOrigin;
try {
  const parsedOrigin = new URL(configuredOrigin);
  if (parsedOrigin.pathname !== '/' || parsedOrigin.search || parsedOrigin.hash) throw new Error();
  if (isProduction && parsedOrigin.protocol !== 'https:') throw new Error();
  appOrigin = parsedOrigin.origin;
} catch {
  throw new Error('APP_ORIGIN must be a valid HTTPS origin without a path in production.');
}

const dummyPasswordHash = await argon2.hash(randomUUID(), passwordHashOptions);

const relativeStoragePath = relative(frontendDirectory, storageDirectory);
if (relativeStoragePath === '' || (!relativeStoragePath.startsWith('..') && !isAbsolute(relativeStoragePath))) {
  throw new Error('STORAGE_DIR must be outside the frontend web root.');
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const productSchema = z.object({
  title: z.string().trim().min(1).max(100),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortDescription: z.string().trim().min(1).max(220),
  fullDescription: z.string().trim().min(1).max(6000),
  price: z.number().finite().min(0).max(9999999)
    .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-7),
  discountPrice: z.number().finite().min(0).max(9999999)
    .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-7).nullable().optional(),
  category: z.string().trim().min(1).max(60),
  version: z.string().trim().min(1).max(40),
  features: z.array(z.string().trim().min(1).max(180)).max(20),
  compatibility: z.array(z.string().trim().min(1).max(180)).max(20),
  featured: z.boolean(),
  status: z.enum(['draft', 'published', 'unpublished']),
  galleryAssetIds: z.array(z.string().uuid()).max(8).optional(),
  removeThumbnail: z.boolean().optional(),
  removePreviewVideo: z.boolean().optional(),
  removeDownloadFile: z.boolean().optional(),
}).superRefine((product, context) => {
  if (product.discountPrice !== undefined && product.discountPrice !== null && product.discountPrice > product.price) {
    context.addIssue({ code: 'custom', path: ['discountPrice'], message: 'Discount price cannot exceed the regular price.' });
  }
});

const statusSchema = z.object({ status: z.enum(['draft', 'published', 'unpublished']) });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_request, _file, callback) => callback(null, temporaryDirectory),
    filename: (_request, _file, callback) => callback(null, randomUUID()),
  }),
  limits: {
    fileSize: 512 * 1024 * 1024,
    files: 11,
    fields: 1,
    fieldSize: 1024 * 1024,
  },
});

const uploadFields = [
  { name: 'thumbnail', maxCount: 1 },
  { name: 'gallery', maxCount: 8 },
  { name: 'previewVideo', maxCount: 1 },
  { name: 'downloadFile', maxCount: 1 },
];

const parseProductUpload = (request, response, next) => {
  upload.fields(uploadFields)(request, response, async (error) => {
    if (!error) return next();
    try {
      await cleanupTemporaryUploads(request.files);
    } catch (cleanupError) {
      console.error('Unable to clean up a rejected upload.', cleanupError);
    }
    return next(error);
  });
};

const asyncFileTypes = {
  thumbnail: new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  gallery: new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  previewVideo: new Set(['video/mp4', 'video/webm', 'video/quicktime']),
  downloadFile: new Set(['application/zip', 'application/x-zip-compressed', 'application/pdf', 'video/mp4', 'video/quicktime']),
};

const maxBytesByKind = {
  thumbnail: 12 * 1024 * 1024,
  gallery: 12 * 1024 * 1024,
  previewVideo: 120 * 1024 * 1024,
  downloadFile: 512 * 1024 * 1024,
};

const getUploadedFiles = (files = {}) => Object.entries(files)
  .flatMap(([field, entries]) => entries.map((file) => ({ field, file })));

const cleanupTemporaryUploads = async (files) => {
  await Promise.all(getUploadedFiles(files).map(async ({ file }) => {
    try {
      await unlink(file.path);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }));
};

const safeOriginalName = (name) => {
  const normalized = basename(name.replace(/\\/g, '/'))
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, 180);
  return normalized || 'uploaded-file';
};

const readProductPayload = (request) => {
  let value;
  try {
    value = JSON.parse(request.body.product);
  } catch {
    throw new HttpError(400, 'Product details must be valid JSON.');
  }
  return productSchema.parse(value);
};

const getAssetSummary = (assetId) => {
  if (!assetId) return null;
  const asset = database.prepare(`
    SELECT id, kind, mime_type, original_name, size_bytes
    FROM assets WHERE id = ?
  `).get(assetId);
  if (!asset) return null;
  return {
    id: asset.id,
    kind: asset.kind,
    name: asset.original_name,
    mimeType: asset.mime_type,
    sizeBytes: asset.size_bytes,
    url: asset.kind === 'downloadFile' ? null : `/api/admin/assets/${asset.id}`,
  };
};

const serializePublicProduct = (product) => ({
  id: product.id,
  title: product.title,
  slug: product.slug,
  description: product.short_description,
  fullDescription: product.full_description,
  price: product.price_cents / 100,
  discountPrice: product.discount_price_cents === null ? null : product.discount_price_cents / 100,
  category: product.category,
  version: product.version,
  thumbnail: product.thumbnail_asset_id ? `/api/media/${product.thumbnail_asset_id}` : null,
  previewVideo: product.preview_video_asset_id ? `/api/media/${product.preview_video_asset_id}` : null,
  gallery: JSON.parse(product.gallery_asset_ids).map((assetId) => `/api/media/${assetId}`),
  features: JSON.parse(product.features_json),
  compatibility: JSON.parse(product.compatibility_json),
  featured: Boolean(product.featured),
  status: product.status,
});

const serializeAdminProduct = (product) => ({
  id: product.id,
  title: product.title,
  slug: product.slug,
  shortDescription: product.short_description,
  fullDescription: product.full_description,
  price: product.price_cents / 100,
  discountPrice: product.discount_price_cents === null ? null : product.discount_price_cents / 100,
  category: product.category,
  version: product.version,
  features: JSON.parse(product.features_json),
  compatibility: JSON.parse(product.compatibility_json),
  featured: Boolean(product.featured),
  status: product.status,
  thumbnail: getAssetSummary(product.thumbnail_asset_id),
  previewVideo: getAssetSummary(product.preview_video_asset_id),
  gallery: JSON.parse(product.gallery_asset_ids).map(getAssetSummary).filter(Boolean),
  downloadFile: getAssetSummary(product.download_asset_id),
  createdAt: product.created_at,
  updatedAt: product.updated_at,
});

const productById = database.prepare('SELECT * FROM products WHERE id = ? AND deleted_at IS NULL');

const requireAdmin = (request, response, next) => {
  const adminId = request.session.adminId;
  if (!adminId) return response.status(401).json({ error: 'Authentication required.' });
  const admin = database.prepare('SELECT id, email FROM admins WHERE id = ?').get(adminId);
  if (!admin) {
    request.session.destroy((error) => {
      if (error) return next(error);
      response.status(401).json({ error: 'Authentication required.' });
    });
    return;
  }
  request.admin = admin;
  return next();
};

const sameOrigin = (request, response, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return next();
  const origin = request.get('Origin');
  if (!origin || origin !== appOrigin) return response.status(403).json({ error: 'Request origin is not allowed.' });
  if (request.get('Sec-Fetch-Site') === 'cross-site') return response.status(403).json({ error: 'Cross-site requests are not allowed.' });
  return next();
};

const moveAndRecordUploads = async (files, productId) => {
  const uploads = getUploadedFiles(files);
  const checkedUploads = [];
  for (const { field, file } of uploads) {
    if (file.size > maxBytesByKind[field]) throw new HttpError(413, `The ${field} file exceeds its size limit.`);
    const detectedType = await fileTypeFromFile(file.path);
    if (!detectedType || !asyncFileTypes[field].has(detectedType.mime)) {
      throw new HttpError(415, `The ${field} file type is not supported.`);
    }
    checkedUploads.push({ field, file, detectedType });
  }

  const stagedAssets = [];
  try {
    for (const { field, file, detectedType } of checkedUploads) {
      const id = randomUUID();
      const storageName = randomUUID();
      const kind = field === 'downloadFile' ? 'downloadFile' : field === 'previewVideo' ? 'previewVideo' : field;
      const directory = kind === 'downloadFile' ? privateDirectory : mediaDirectory;
      const finalPath = resolve(directory, storageName);
      await mkdir(directory, { recursive: true, mode: 0o700 });
      await rename(file.path, finalPath);
      stagedAssets.push({
        id,
        productId,
        kind,
        storageName,
        mimeType: detectedType.mime,
        originalName: safeOriginalName(file.originalname),
        sizeBytes: file.size,
        finalPath,
      });
    }
  } catch (error) {
    await Promise.all(stagedAssets.map(async (asset) => {
      try {
        await unlink(asset.finalPath);
      } catch (cleanupError) {
        if (cleanupError.code !== 'ENOENT') console.error('Unable to clean up a rejected upload.', cleanupError);
      }
    }));
    throw error;
  }
  return stagedAssets;
};

const persistProduct = async (request, existingProduct = null) => {
  const product = readProductPayload(request);
  const productId = existingProduct?.id ?? randomUUID();
  const duplicateSlug = database.prepare('SELECT id FROM products WHERE slug = ? AND id != ?').get(product.slug, productId);
  if (duplicateSlug) throw new HttpError(409, 'That product slug is already in use.');

  const uploadedFiles = request.files ?? {};
  const oldGalleryIds = existingProduct ? JSON.parse(existingProduct.gallery_asset_ids) : [];
  const requestedGalleryIds = product.galleryAssetIds ?? oldGalleryIds;

  if (new Set(requestedGalleryIds).size !== requestedGalleryIds.length) {
    throw new HttpError(400, 'The gallery includes duplicate assets.');
  }
  if (!existingProduct && requestedGalleryIds.length) {
    throw new HttpError(400, 'Gallery assets cannot be supplied when creating a product.');
  }
  if (existingProduct && requestedGalleryIds.length) {
    const retainedGallery = database.prepare(`
      SELECT id FROM assets WHERE product_id = ? AND kind = 'gallery' AND id IN (${requestedGalleryIds.map(() => '?').join(',')})
    `).all(productId, ...requestedGalleryIds).map((asset) => asset.id);
    if (retainedGallery.length !== new Set(requestedGalleryIds).size) {
      throw new HttpError(400, 'The gallery includes an invalid asset.');
    }
  }

  const newAssets = await moveAndRecordUploads(uploadedFiles, productId);
  const newAssetFor = (kind) => newAssets.find((asset) => asset.kind === kind);
  const thumbnailAssetId = newAssetFor('thumbnail')?.id
    ?? (product.removeThumbnail ? null : existingProduct?.thumbnail_asset_id ?? null);
  const previewVideoAssetId = newAssetFor('previewVideo')?.id
    ?? (product.removePreviewVideo ? null : existingProduct?.preview_video_asset_id ?? null);
  const downloadAssetId = newAssetFor('downloadFile')?.id
    ?? (product.removeDownloadFile ? null : existingProduct?.download_asset_id ?? null);
  const galleryAssetIds = [...requestedGalleryIds, ...newAssets.filter((asset) => asset.kind === 'gallery').map((asset) => asset.id)];
  const now = new Date().toISOString();
  const insertAsset = database.prepare(`
    INSERT INTO assets (id, product_id, kind, storage_name, mime_type, original_name, size_bytes, created_at)
    VALUES (@id, @productId, @kind, @storageName, @mimeType, @originalName, @sizeBytes, @createdAt)
  `);

  try {
    const save = database.transaction(() => {
      if (existingProduct) {
        const result = database.prepare(`
          UPDATE products SET
            title = @title, slug = @slug, short_description = @shortDescription,
            full_description = @fullDescription, price_cents = @priceCents,
            discount_price_cents = @discountPriceCents, category = @category, version = @version,
            features_json = @featuresJson, compatibility_json = @compatibilityJson, featured = @featured,
            status = @status, thumbnail_asset_id = @thumbnailAssetId,
            preview_video_asset_id = @previewVideoAssetId, gallery_asset_ids = @galleryAssetIds,
            download_asset_id = @downloadAssetId, updated_at = @updatedAt
          WHERE id = @id AND deleted_at IS NULL
        `).run({
          id: productId,
          title: product.title,
          slug: product.slug,
          shortDescription: product.shortDescription,
          fullDescription: product.fullDescription,
          priceCents: Math.round(product.price * 100),
          discountPriceCents: product.discountPrice == null ? null : Math.round(product.discountPrice * 100),
          category: product.category,
          version: product.version,
          featuresJson: JSON.stringify(product.features),
          compatibilityJson: JSON.stringify(product.compatibility),
          featured: Number(product.featured),
          status: product.status,
          thumbnailAssetId,
          previewVideoAssetId,
          galleryAssetIds: JSON.stringify(galleryAssetIds),
          downloadAssetId,
          updatedAt: now,
        });
        if (!result.changes) throw new HttpError(404, 'Product not found.');
      } else {
        database.prepare(`
          INSERT INTO products (
            id, title, slug, short_description, full_description, price_cents, discount_price_cents,
            category, version, features_json, compatibility_json, featured, status, thumbnail_asset_id,
            preview_video_asset_id, gallery_asset_ids, download_asset_id, created_by, created_at, updated_at
          ) VALUES (
            @id, @title, @slug, @shortDescription, @fullDescription, @priceCents, @discountPriceCents,
            @category, @version, @featuresJson, @compatibilityJson, @featured, @status, @thumbnailAssetId,
            @previewVideoAssetId, @galleryAssetIds, @downloadAssetId, @createdBy, @createdAt, @updatedAt
          )
        `).run({
          id: productId,
          title: product.title,
          slug: product.slug,
          shortDescription: product.shortDescription,
          fullDescription: product.fullDescription,
          priceCents: Math.round(product.price * 100),
          discountPriceCents: product.discountPrice == null ? null : Math.round(product.discountPrice * 100),
          category: product.category,
          version: product.version,
          featuresJson: JSON.stringify(product.features),
          compatibilityJson: JSON.stringify(product.compatibility),
          featured: Number(product.featured),
          status: product.status,
          thumbnailAssetId,
          previewVideoAssetId,
          galleryAssetIds: JSON.stringify(galleryAssetIds),
          downloadAssetId,
          createdBy: request.admin.id,
          createdAt: now,
          updatedAt: now,
        });
      }

      for (const asset of newAssets) insertAsset.run({ ...asset, createdAt: now });
    });
    save();
  } catch (error) {
    await Promise.all(newAssets.map(async (asset) => {
      try {
        await unlink(asset.finalPath);
      } catch (cleanupError) {
        if (cleanupError.code !== 'ENOENT') console.error('Unable to clean up an uncommitted upload.', cleanupError);
      }
    }));
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') throw new HttpError(409, 'That product slug is already in use.');
    throw error;
  } finally {
    await cleanupTemporaryUploads(uploadedFiles);
  }

  return serializeAdminProduct(productById.get(productId));
};

export const createApp = () => {
  const app = express();
  const secureCookie = isProduction;
  const publicMedia = database.prepare(`
    SELECT a.id, a.kind, a.storage_name, a.mime_type,
      p.thumbnail_asset_id, p.preview_video_asset_id, p.gallery_asset_ids
    FROM assets a JOIN products p ON p.id = a.product_id
    WHERE a.id = ? AND a.kind != 'downloadFile' AND p.status = 'published' AND p.deleted_at IS NULL
  `);
  const sessionStore = new SQLiteSessionStore();

  app.disable('x-powered-by');
  if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }));
  app.use(express.json({ limit: '1mb' }));
  app.use('/api', sameOrigin);
  app.use(session({
    name: sessionCookieName,
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: secureCookie,
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60 * 1000,
    },
  }));

  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many login attempts. Please try again later.' },
  });

  app.get('/api/auth/me', (request, response, next) => {
    const adminId = request.session.adminId;
    if (!adminId) return response.set('Cache-Control', 'no-store').json({ admin: null });
    const admin = database.prepare('SELECT id, email FROM admins WHERE id = ?').get(adminId);
    if (!admin) {
      request.session.destroy((error) => {
        if (error) return next(error);
        response.set('Cache-Control', 'no-store').json({ admin: null });
      });
      return;
    }
    response.set('Cache-Control', 'no-store').json({ admin: { email: admin.email } });
  });

  app.post('/api/auth/login', loginLimiter, async (request, response, next) => {
    try {
      const credentials = z.object({
        email: z.string().trim().email().max(254),
        password: z.string().min(1).max(128),
      }).parse(request.body);
      const admin = database.prepare('SELECT id, email, password_hash FROM admins WHERE email = ?')
        .get(credentials.email.toLowerCase());
      const passwordMatches = await argon2.verify(
        admin?.password_hash ?? dummyPasswordHash,
        credentials.password,
      ).catch(() => false);
      if (!admin || !passwordMatches) return response.status(401).json({ error: 'Email or password is incorrect.' });
      request.session.regenerate((error) => {
        if (error) return next(error);
        request.session.adminId = admin.id;
        request.session.save((saveError) => {
          if (saveError) return next(saveError);
          response.set('Cache-Control', 'no-store').json({ admin: { email: admin.email } });
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) return response.status(400).json({ error: 'Enter a valid email and password.' });
      return next(error);
    }
  });

  app.post('/api/auth/logout', (request, response, next) => {
    request.session.destroy((error) => {
      if (error) return next(error);
      response.clearCookie(sessionCookieName, {
        httpOnly: true,
        secure: secureCookie,
        sameSite: 'lax',
        path: '/',
      });
      response.status(204).end();
    });
  });

  app.get('/api/products', (_request, response) => {
    const rows = database.prepare(`
      SELECT * FROM products
      WHERE status = 'published' AND deleted_at IS NULL
      ORDER BY featured DESC, created_at DESC
      LIMIT 2000
    `).all();
    response.set('Cache-Control', 'no-store').json({ products: rows.map(serializePublicProduct) });
  });

  app.get('/api/products/:slug', (request, response) => {
    const product = database.prepare(`
      SELECT * FROM products
      WHERE slug = ? AND status = 'published' AND deleted_at IS NULL
    `).get(request.params.slug);
    if (!product) return response.status(404).json({ error: 'Product not found.' });
    response.set('Cache-Control', 'no-store').json({ product: serializePublicProduct(product) });
  });

  app.get('/api/media/:assetId', (request, response, next) => {
    const asset = publicMedia.get(request.params.assetId);
    if (!asset) return response.status(404).json({ error: 'Media not found.' });
    const attached = asset.kind === 'thumbnail'
      ? asset.thumbnail_asset_id === asset.id
      : asset.kind === 'previewVideo'
        ? asset.preview_video_asset_id === asset.id
        : JSON.parse(asset.gallery_asset_ids).includes(asset.id);
    if (!attached) return response.status(404).json({ error: 'Media not found.' });
    const filePath = resolve(mediaDirectory, asset.storage_name);
    response.set({
      'Cache-Control': 'no-store',
      'Content-Type': asset.mime_type,
      'X-Content-Type-Options': 'nosniff',
    });
    response.sendFile(filePath, { dotfiles: 'deny' }, (error) => {
      if (error && !response.headersSent) next(error);
    });
  });

  app.use('/api/admin', (request, response, next) => {
    response.set('Cache-Control', 'no-store');
    return requireAdmin(request, response, next);
  });

  app.get('/api/admin/overview', (_request, response) => {
    const counts = database.prepare(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS published,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS drafts,
        SUM(CASE WHEN status = 'unpublished' THEN 1 ELSE 0 END) AS unpublished
      FROM products WHERE deleted_at IS NULL
    `).get();
    response.json({
      totalProducts: counts.total,
      publishedProducts: counts.published ?? 0,
      draftProducts: counts.drafts ?? 0,
      unpublishedProducts: counts.unpublished ?? 0,
    });
  });

  app.get('/api/admin/products', (_request, response) => {
    const rows = database.prepare(`
      SELECT * FROM products WHERE deleted_at IS NULL ORDER BY updated_at DESC
    `).all();
    response.json({ products: rows.map(serializeAdminProduct) });
  });

  app.post('/api/admin/products', parseProductUpload, async (request, response, next) => {
    try {
      const product = await persistProduct(request);
      response.status(201).json({ product });
    } catch (error) {
      try {
        await cleanupTemporaryUploads(request.files);
      } catch (cleanupError) {
        console.error('Unable to clean up a failed upload.', cleanupError);
      }
      next(error);
    }
  });

  app.put('/api/admin/products/:id', parseProductUpload, async (request, response, next) => {
    try {
      const existing = productById.get(request.params.id);
      if (!existing) {
        await cleanupTemporaryUploads(request.files);
        return response.status(404).json({ error: 'Product not found.' });
      }
      const product = await persistProduct(request, existing);
      response.json({ product });
    } catch (error) {
      try {
        await cleanupTemporaryUploads(request.files);
      } catch (cleanupError) {
        console.error('Unable to clean up a failed upload.', cleanupError);
      }
      next(error);
    }
  });

  app.patch('/api/admin/products/:id/status', (request, response) => {
    const { status } = statusSchema.parse(request.body);
    const result = database.prepare(`
      UPDATE products SET status = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL
    `).run(status, new Date().toISOString(), request.params.id);
    if (!result.changes) return response.status(404).json({ error: 'Product not found.' });
    response.json({ status });
  });

  app.delete('/api/admin/products/:id', (request, response) => {
    const result = database.prepare(`
      UPDATE products SET deleted_at = ?, updated_at = ? WHERE id = ? AND deleted_at IS NULL
    `).run(new Date().toISOString(), new Date().toISOString(), request.params.id);
    if (!result.changes) return response.status(404).json({ error: 'Product not found.' });
    response.status(204).end();
  });

  app.get('/api/admin/assets/:assetId', (request, response, next) => {
    const asset = database.prepare(`
      SELECT storage_name, mime_type, kind FROM assets WHERE id = ?
    `).get(request.params.assetId);
    if (!asset || asset.kind === 'downloadFile') return response.status(404).json({ error: 'Media not found.' });
    response.set({
      'Cache-Control': 'private, no-store',
      'Content-Type': asset.mime_type,
      'X-Content-Type-Options': 'nosniff',
    });
    response.sendFile(resolve(mediaDirectory, asset.storage_name), { dotfiles: 'deny' }, (error) => {
      if (error && !response.headersSent) next(error);
    });
  });

  app.use('/api', (_request, response) => response.status(404).json({ error: 'API route not found.' }));

  if (existsSync(frontendBuildDirectory)) {
    app.use(express.static(frontendBuildDirectory, { dotfiles: 'deny', maxAge: '1h' }));
    app.use((request, response, next) => {
      if (request.method !== 'GET' || request.path.startsWith('/api/')) return next();
      response.sendFile(resolve(frontendBuildDirectory, 'index.html'), { dotfiles: 'deny' });
    });
  }

  app.use((error, _request, response, _next) => {
    if (response.headersSent) return;
    if (error instanceof z.ZodError) {
      return response.status(400).json({ error: 'Product details failed validation.', issues: error.issues.map(({ path, message }) => ({ path, message })) });
    }
    if (error instanceof multer.MulterError) {
      const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return response.status(status).json({ error: 'Upload could not be accepted. Check the file count and size limits.' });
    }
    if (error instanceof HttpError) return response.status(error.status).json({ error: error.message });
    console.error('Unhandled API error.', error);
    return response.status(500).json({ error: 'The request could not be completed.' });
  });

  return app;
};

export default createApp;
