import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate as animateValue, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Box, Check, ChevronDown, CircleAlert, LoaderCircle, LogOut, Plus, Search, ShieldCheck, Trash2, Upload, X } from 'lucide-react';
import { siteConfig } from '../config/site';

interface AdminAnimatedPageProps {
  children: React.ReactNode;
  className: string;
  reduceMotion: boolean;
}

const AdminAnimatedPage: React.FC<AdminAnimatedPageProps> = ({ children, className, reduceMotion }) => (
  <motion.main
    className={className}
    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={reduceMotion ? undefined : {
      opacity: 0,
      y: -5,
      transition: { duration: 0.12, ease: [0.4, 0, 1, 1] },
    }}
    transition={{ duration: reduceMotion ? 0.01 : 0.48, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.main>
);

const AnimatedCount: React.FC<{ value: number }> = ({ value }) => {
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const roundedCount = useTransform(count, (current) => Math.round(current));

  useEffect(() => {
    const controls = animateValue(count, value, {
      duration: reduceMotion ? 0.01 : 0.7,
      ease: 'easeOut',
    });
    return () => controls.stop();
  }, [count, reduceMotion, value]);

  return <motion.strong>{roundedCount}</motion.strong>;
};

type ProductStatus = 'draft' | 'published' | 'unpublished';

interface AssetSummary {
  id: string;
  kind: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  url: string | null;
}

interface AdminProduct {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  discountPrice: number | null;
  category: string;
  version: string;
  features: string[];
  compatibility: string[];
  featured: boolean;
  status: ProductStatus;
  thumbnail: AssetSummary | null;
  previewVideo: AssetSummary | null;
  gallery: AssetSummary[];
  downloadFile: AssetSummary | null;
  createdAt: string;
  updatedAt: string;
}

interface Overview {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  unpublishedProducts: number;
}

interface AdminPageProps {
  navigate: (destination: string) => void;
}

interface ProductFields {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  discountPrice: string;
  category: string;
  version: string;
  features: string;
  compatibility: string;
  featured: boolean;
  status: ProductStatus;
  galleryAssetIds: string[];
  removeThumbnail: boolean;
  removePreviewVideo: boolean;
  removeDownloadFile: boolean;
}

const emptyOverview: Overview = {
  totalProducts: 0,
  publishedProducts: 0,
  draftProducts: 0,
  unpublishedProducts: 0,
};

const formatPrice = (price: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(price);

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const readJson = async <T,>(response: Response): Promise<T> => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error ?? 'The request could not be completed.');
  return payload as T;
};

const postProduct = (
  product: ProductFields,
  source: AdminProduct | null,
  files: { thumbnail?: File; gallery: File[]; previewVideo?: File; downloadFile?: File },
  onProgress: (progress: number) => void,
): Promise<AdminProduct> => new Promise((resolve, reject) => {
  const formData = new FormData();
  const payload = {
    title: product.title,
    slug: product.slug,
    shortDescription: product.shortDescription,
    fullDescription: product.fullDescription,
    price: Number(product.price),
    discountPrice: product.discountPrice === '' ? null : Number(product.discountPrice),
    category: product.category,
    version: product.version,
    features: product.features.split('\n').map((feature) => feature.trim()).filter(Boolean),
    compatibility: product.compatibility.split('\n').map((item) => item.trim()).filter(Boolean),
    featured: product.featured,
    status: product.status,
    galleryAssetIds: product.galleryAssetIds,
    removeThumbnail: product.removeThumbnail,
    removePreviewVideo: product.removePreviewVideo,
    removeDownloadFile: product.removeDownloadFile,
  };
  formData.append('product', JSON.stringify(payload));
  if (files.thumbnail) formData.append('thumbnail', files.thumbnail);
  files.gallery.forEach((file) => formData.append('gallery', file));
  if (files.previewVideo) formData.append('previewVideo', files.previewVideo);
  if (files.downloadFile) formData.append('downloadFile', files.downloadFile);

  const request = new XMLHttpRequest();
  request.open(source ? 'PUT' : 'POST', source ? `/api/admin/products/${source.id}` : '/api/admin/products');
  request.withCredentials = true;
  request.upload.onprogress = (event) => {
    if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
  };
  request.onerror = () => reject(new Error('The upload failed. Check your connection and try again.'));
  request.onload = () => {
    let response: { error?: string; product?: AdminProduct };
    try {
      response = JSON.parse(request.responseText || '{}') as { error?: string; product?: AdminProduct };
    } catch {
      reject(new Error('The server returned an invalid response.'));
      return;
    }
    if (request.status < 200 || request.status >= 300) {
      reject(new Error(response.error ?? 'The product could not be saved.'));
      return;
    }
    if (!response.product) {
      reject(new Error('The product was saved without a response.'));
      return;
    }
    resolve(response.product);
  };
  request.send(formData);
});

const initialProductFields = (product: AdminProduct | null): ProductFields => ({
  title: product?.title ?? '',
  slug: product?.slug ?? '',
  shortDescription: product?.shortDescription ?? '',
  fullDescription: product?.fullDescription ?? '',
  price: product ? String(product.price) : '',
  discountPrice: product?.discountPrice === null || product?.discountPrice === undefined ? '' : String(product.discountPrice),
  category: product?.category ?? '',
  version: product?.version ?? '1.0',
  features: product?.features.join('\n') ?? '',
  compatibility: product?.compatibility.join('\n') ?? '',
  featured: product?.featured ?? false,
  status: product?.status ?? 'draft',
  galleryAssetIds: product?.gallery.map((asset) => asset.id) ?? [],
  removeThumbnail: false,
  removePreviewVideo: false,
  removeDownloadFile: false,
});

const ProductEditor: React.FC<{
  product: AdminProduct | null;
  onCancel: () => void;
  onSaved: () => void;
}> = ({ product, onCancel, onSaved }) => {
  const reduceMotion = useReducedMotion() ?? false;
  const [fields, setFields] = useState(() => initialProductFields(product));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [galleryAssets, setGalleryAssets] = useState(product?.gallery ?? []);
  const thumbnail = product?.thumbnail ?? null;
  const previewVideo = product?.previewVideo ?? null;
  const downloadFile = product?.downloadFile ?? null;
  const slugManuallyEdited = useRef(Boolean(product));
  const thumbnailInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const downloadInput = useRef<HTMLInputElement>(null);

  const update = <K extends keyof ProductFields>(key: K, value: ProductFields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
  };

  const handleTitleChange = (title: string) => {
    setFields((current) => ({
      ...current,
      title,
      slug: slugManuallyEdited.current ? current.slug : slugify(title),
    }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    setProgress(0);
    try {
      await postProduct(fields, product, {
        thumbnail: thumbnailInput.current?.files?.[0],
        gallery: Array.from(galleryInput.current?.files ?? []),
        previewVideo: videoInput.current?.files?.[0],
        downloadFile: downloadInput.current?.files?.[0],
      }, setProgress);
      onSaved();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'The product could not be saved.');
      setSaving(false);
      setProgress(null);
    }
  };

  const removeGalleryAsset = (assetId: string) => {
    setGalleryAssets((current) => current.filter((asset) => asset.id !== assetId));
    update('galleryAssetIds', fields.galleryAssetIds.filter((id) => id !== assetId));
  };

  return (
    <section className="admin-editor">
      <div className="admin-editor__heading">
        <div>
          <button className="admin-back-button" type="button" onClick={onCancel} disabled={saving}><ArrowLeft size={15} /> Dashboard</button>
          <p className="admin-eyebrow">{product ? 'PRODUCT MANAGEMENT / EDIT' : 'PRODUCT MANAGEMENT / NEW'}</p>
          <h1>{product ? 'Edit product' : 'Add a product'}</h1>
        </div>
        <button className="admin-icon-button" type="button" onClick={onCancel} disabled={saving} aria-label="Close editor"><X size={19} /></button>
      </div>

      <form className="admin-product-form" onSubmit={handleSave}>
        <AnimatePresence initial={false}>
          {error && (
            <motion.div
              key="product-error"
              className="admin-alert"
              role="alert"
              initial={{ opacity: 0, y: reduceMotion ? 0 : -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -3 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.24 }}
            >
              <CircleAlert size={18} />{error}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Product title</span>
            <input required maxLength={100} value={fields.title} onChange={(event) => handleTitleChange(event.target.value)} />
          </label>
          <label className="admin-field">
            <span>Product slug</span>
            <input
              required
              maxLength={120}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              value={fields.slug}
              onChange={(event) => {
                slugManuallyEdited.current = true;
                update('slug', slugify(event.target.value));
              }}
            />
          </label>
          <label className="admin-field admin-field--wide">
            <span>Short description</span>
            <textarea required maxLength={220} rows={2} value={fields.shortDescription} onChange={(event) => update('shortDescription', event.target.value)} />
          </label>
          <label className="admin-field admin-field--wide">
            <span>Full description</span>
            <textarea required maxLength={6000} rows={5} value={fields.fullDescription} onChange={(event) => update('fullDescription', event.target.value)} />
          </label>
          <label className="admin-field">
            <span>Price (USD)</span>
            <input required type="number" min="0" max="9999999" step="0.01" value={fields.price} onChange={(event) => update('price', event.target.value)} />
          </label>
          <label className="admin-field">
            <span>Discount price (optional)</span>
            <input type="number" min="0" max="9999999" step="0.01" value={fields.discountPrice} onChange={(event) => update('discountPrice', event.target.value)} />
          </label>
          <label className="admin-field">
            <span>Category</span>
            <input required maxLength={60} value={fields.category} onChange={(event) => update('category', event.target.value)} />
          </label>
          <label className="admin-field">
            <span>Version</span>
            <input required maxLength={40} value={fields.version} onChange={(event) => update('version', event.target.value)} />
          </label>
          <label className="admin-field admin-field--wide">
            <span>Product features <small>One per line</small></span>
            <textarea rows={4} value={fields.features} onChange={(event) => update('features', event.target.value)} />
          </label>
          <label className="admin-field admin-field--wide">
            <span>Software compatibility <small>One per line</small></span>
            <textarea rows={3} value={fields.compatibility} onChange={(event) => update('compatibility', event.target.value)} />
          </label>
        </div>

        <div className="admin-assets">
          <h2>Product assets</h2>
          <p>Images and video previews are only public while this product is published. Download files remain private.</p>
          <div className="admin-assets__grid">
            <div className="admin-asset-field">
              <span>Thumbnail <small>JPG, PNG, WebP or GIF · 12 MB max</small></span>
              {thumbnail && !fields.removeThumbnail && (
                <div className="admin-asset-current">
                  {thumbnail.url && <img src={thumbnail.url} alt="" />}
                  <span>{thumbnail.name} · {formatSize(thumbnail.sizeBytes)}</span>
                  <button type="button" onClick={() => update('removeThumbnail', true)} aria-label="Remove current thumbnail"><X size={14} /></button>
                </div>
              )}
              {fields.removeThumbnail && <button className="admin-restore-asset" type="button" onClick={() => update('removeThumbnail', false)}>Keep current thumbnail</button>}
              <label className="admin-upload-button"><Upload size={15} />Choose thumbnail<input ref={thumbnailInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" /></label>
            </div>
            <div className="admin-asset-field">
              <span>Preview gallery <small>Up to 8 retained images and 8 new images · 12 MB each</small></span>
              {galleryAssets.length > 0 && (
                <div className="admin-gallery-assets">
                  {galleryAssets.map((asset) => (
                    <div className="admin-gallery-asset" key={asset.id}>
                      {asset.url && <img src={asset.url} alt="" />}
                      <button type="button" onClick={() => removeGalleryAsset(asset.id)} aria-label={`Remove ${asset.name}`}><X size={13} /></button>
                    </div>
                  ))}
                </div>
              )}
              <label className="admin-upload-button"><Upload size={15} />Add gallery images<input ref={galleryInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple /></label>
            </div>
            <div className="admin-asset-field">
              <span>Preview video <small>MP4, WebM or MOV · 120 MB max</small></span>
              {previewVideo && !fields.removePreviewVideo && (
                <div className="admin-asset-current">
                  <span>{previewVideo.name} · {formatSize(previewVideo.sizeBytes)}</span>
                  <button type="button" onClick={() => update('removePreviewVideo', true)} aria-label="Remove current preview video"><X size={14} /></button>
                </div>
              )}
              {fields.removePreviewVideo && <button className="admin-restore-asset" type="button" onClick={() => update('removePreviewVideo', false)}>Keep current video</button>}
              <label className="admin-upload-button"><Upload size={15} />Choose preview video<input ref={videoInput} type="file" accept="video/mp4,video/webm,video/quicktime" /></label>
            </div>
            <div className="admin-asset-field">
              <span>Digital file <small>ZIP, PDF or MP4 · 512 MB max · private storage</small></span>
              {downloadFile && !fields.removeDownloadFile && (
                <div className="admin-asset-current">
                  <span>{downloadFile.name} · {formatSize(downloadFile.sizeBytes)}</span>
                  <button type="button" onClick={() => update('removeDownloadFile', true)} aria-label="Remove current download file"><X size={14} /></button>
                </div>
              )}
              {fields.removeDownloadFile && <button className="admin-restore-asset" type="button" onClick={() => update('removeDownloadFile', false)}>Keep current download</button>}
              <label className="admin-upload-button"><Upload size={15} />Choose digital file<input ref={downloadInput} type="file" accept=".zip,.pdf,.mp4,.mov,application/zip,application/pdf,video/mp4,video/quicktime" /></label>
            </div>
          </div>
        </div>

        <div className="admin-form-options">
          <label className="admin-check"><input type="checkbox" checked={fields.featured} onChange={(event) => update('featured', event.target.checked)} /><span>Feature this product on the Store home page</span></label>
          <label className="admin-field admin-field--status">
            <span>Publication status</span>
            <select value={fields.status} onChange={(event) => update('status', event.target.value as ProductStatus)}>
              <option value="draft">Draft — private</option>
              <option value="published">Published — public</option>
              <option value="unpublished">Unpublished — hidden</option>
            </select>
          </label>
        </div>

        {progress !== null && (
          <div className="admin-upload-progress" role="status">
            <div><span>Saving product and uploading assets</span><strong>{progress}%</strong></div>
            <progress max={100} value={progress} />
          </div>
        )}
        <div className="admin-form-actions">
          <button className="admin-button admin-button--quiet" type="button" onClick={onCancel} disabled={saving}>Cancel</button>
          <button className="admin-button admin-button--primary" type="submit" disabled={saving}>
            {saving ? <><motion.span className="admin-spinner" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}><LoaderCircle size={16} /></motion.span>Saving…</> : <>{product ? 'Save changes' : 'Create product'}<Check size={16} /></>}
          </button>
        </div>
      </form>
    </section>
  );
};

export const AdminPage: React.FC<AdminPageProps> = ({ navigate }) => {
  const reduceMotion = useReducedMotion() ?? false;
  const [authState, setAuthState] = useState<'checking' | 'signedOut' | 'signedIn' | 'error'>('checking');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [dashboardError, setDashboardError] = useState('');
  const [overview, setOverview] = useState(emptyOverview);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [editorProduct, setEditorProduct] = useState<AdminProduct | null | undefined>(undefined);
  const [workingProductId, setWorkingProductId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const refreshDashboard = useCallback(async () => {
    setLoadingDashboard(true);
    setDashboardError('');
    try {
      const [overviewResponse, productResponse] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch('/api/admin/products'),
      ]);
      if (overviewResponse.status === 401 || productResponse.status === 401) {
        setOverview(emptyOverview);
        setProducts([]);
        setAuthState('signedOut');
        return;
      }
      const [overviewPayload, productPayload] = await Promise.all([
        readJson<Overview>(overviewResponse),
        readJson<{ products: AdminProduct[] }>(productResponse),
      ]);
      setOverview(overviewPayload);
      setProducts(productPayload.products);
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : 'Unable to load the dashboard.');
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me')
      .then(async (response) => {
        const payload = await readJson<{ admin: { email: string } | null }>(response);
        if (!payload.admin) {
          if (active) setAuthState('signedOut');
          return;
        }
        if (active) {
          setAdminEmail(payload.admin.email);
          setAuthState('signedIn');
          void refreshDashboard();
        }
      })
      .catch((error: unknown) => {
        if (!active) return;
        setAuthError(error instanceof Error ? error.message : 'The admin service is unavailable.');
        setAuthState('error');
      });
    return () => { active = false; };
  }, [refreshDashboard]);

  useEffect(() => {
    document.title = authState === 'signedIn'
      ? 'Store Admin — Vixora Studio'
      : 'Admin Login — Vixora Studio';
    return () => { document.title = 'Vixora Studio — Abdullah | Custom Motion Design & Visual Art'; };
  }, [authState]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = await readJson<{ admin: { email: string } }>(response);
      setAdminEmail(payload.admin.email);
      setPassword('');
      void refreshDashboard();
      setAuthState('signedIn');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to sign in.');
    }
  };

  const handleLogout = async () => {
    setDashboardError('');
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) await readJson(response);
      setProducts([]);
      setOverview(emptyOverview);
      setEditorProduct(undefined);
      setAuthState('signedOut');
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : 'Unable to sign out.');
    }
  };

  const updateStatus = async (product: AdminProduct) => {
    const nextStatus: ProductStatus = product.status === 'published' ? 'unpublished' : 'published';
    setWorkingProductId(product.id);
    setDashboardError('');
    try {
      const response = await fetch(`/api/admin/products/${product.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      await readJson(response);
      await refreshDashboard();
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : 'Unable to update publication status.');
    } finally {
      setWorkingProductId(null);
    }
  };

  const deleteProduct = async (product: AdminProduct) => {
    if (!window.confirm(`Delete “${product.title}”? It will be removed from the Store and retained in private storage.`)) return;
    setWorkingProductId(product.id);
    setDashboardError('');
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      if (!response.ok) await readJson(response);
      await refreshDashboard();
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : 'Unable to delete the product.');
    } finally {
      setWorkingProductId(null);
    }
  };

  const filteredProducts = products.filter((product) => (
    `${product.title} ${product.category} ${product.slug}`.toLowerCase().includes(search.trim().toLowerCase())
  ));

  if (authState === 'checking') {
    return (
      <AnimatePresence mode={reduceMotion ? 'sync' : 'wait'} initial={false}>
        <AdminAnimatedPage key="checking" className="admin-page" reduceMotion={reduceMotion}>
          <div className="admin-checking"><img className="admin-brand-mark" src={siteConfig.about.portraitImage} alt="Abdullah" /><p>Verifying secure session…</p></div>
        </AdminAnimatedPage>
      </AnimatePresence>
    );
  }

  if (authState === 'error') {
    return (
      <AnimatePresence mode={reduceMotion ? 'sync' : 'wait'} initial={false}>
        <AdminAnimatedPage key="error" className="admin-page" reduceMotion={reduceMotion}>
          <div className="admin-login-card">
            <img className="admin-brand-mark" src={siteConfig.about.portraitImage} alt="Abdullah" />
            <p className="admin-eyebrow">VIXORA STUDIO / PRIVATE ACCESS</p>
            <h1>Admin unavailable</h1>
            <p className="admin-login-copy">{authError}</p>
            <button className="admin-button admin-button--primary" type="button" onClick={() => window.location.reload()}>Try again</button>
            <button className="admin-text-button" type="button" onClick={() => navigate('/')}>Back to portfolio</button>
          </div>
        </AdminAnimatedPage>
      </AnimatePresence>
    );
  }

  if (authState === 'signedOut') {
    return (
      <AnimatePresence mode={reduceMotion ? 'sync' : 'wait'} initial={false}>
        <AdminAnimatedPage key="login" className="admin-page admin-page--login" reduceMotion={reduceMotion}>
          <div className="admin-login-card">
            <button className="admin-login-back" type="button" onClick={() => navigate('/')}><ArrowLeft size={15} /> Back to portfolio</button>
            <img className="admin-brand-mark" src={siteConfig.about.portraitImage} alt="Abdullah" />
            <p className="admin-eyebrow">VIXORA STUDIO / PRIVATE ACCESS</p>
            <h1>Store admin</h1>
            <p className="admin-login-copy">Sign in with the authorized studio account to manage your products.</p>
            {authError && <div className="admin-alert" role="alert"><CircleAlert size={18} />{authError}</div>}
            <form className="admin-login-form" onSubmit={handleLogin}>
              <label className="admin-field"><span>Email</span><input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
              <label className="admin-field"><span>Password</span><input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
              <button className="admin-button admin-button--primary" type="submit" disabled={authState !== 'signedOut'}><ShieldCheck size={16} />Sign in securely</button>
            </form>
            <p className="admin-login-footnote">Access is provisioned privately. There is no public registration.</p>
          </div>
        </AdminAnimatedPage>
      </AnimatePresence>
    );
  }

  if (editorProduct !== undefined) {
    return (
      <AnimatePresence mode={reduceMotion ? 'sync' : 'wait'} initial={false}>
        <AdminAnimatedPage key={`editor-${editorProduct?.id ?? 'new'}`} className="admin-page" reduceMotion={reduceMotion}>
          <ProductEditor
            product={editorProduct}
            onCancel={() => setEditorProduct(undefined)}
            onSaved={async () => {
              setEditorProduct(undefined);
              await refreshDashboard();
            }}
          />
        </AdminAnimatedPage>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode={reduceMotion ? 'sync' : 'wait'} initial={false}>
    <AdminAnimatedPage key="dashboard" className="admin-page" reduceMotion={reduceMotion}>
      <header className="admin-topbar">
        <a className="admin-brand" href="/admin" onClick={(event) => event.preventDefault()}>
          <img className="admin-brand-mark" src={siteConfig.about.portraitImage} alt="" />
          <span>VIXORA STUDIO<small>STORE ADMIN</small></span>
        </a>
        <div className="admin-topbar__actions">
          <span className="admin-user">
            <img src={siteConfig.about.portraitImage} alt="" />
            <span className="admin-user__email">{adminEmail}</span>
          </span>
          <button type="button" onClick={() => navigate('/store')}><ArrowUpRight size={15} /> View store</button>
          <button type="button" onClick={() => navigate('/')}><ArrowUpRight size={15} /> Portfolio</button>
          <button className="admin-logout" type="button" onClick={() => void handleLogout()}><LogOut size={15} /> Sign out</button>
        </div>
      </header>

      <div className="admin-dashboard">
        <div className="admin-dashboard__heading">
          <div><p className="admin-eyebrow">YOUR DIGITAL GOODS / OVERVIEW</p><h1>Store dashboard</h1><p>Manage your products, previews and publication status.</p></div>
          <button className="admin-button admin-button--primary" type="button" onClick={() => setEditorProduct(null)}><Plus size={17} />Add product</button>
        </div>

        <AnimatePresence initial={false}>
          {dashboardError && (
            <motion.div
              key="dashboard-error"
              className="admin-alert"
              role="alert"
              initial={{ opacity: 0, y: reduceMotion ? 0 : -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -3 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.24 }}
            >
              <CircleAlert size={18} />{dashboardError}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="admin-stats">
          {[
            { label: 'Total products', value: overview.totalProducts, icon: <Box size={18} /> },
            { label: 'Published', value: overview.publishedProducts, icon: <Check size={18} /> },
            { label: 'Drafts', value: overview.draftProducts, icon: <ChevronDown size={18} /> },
            { label: 'Unpublished', value: overview.unpublishedProducts, icon: <X size={18} /> },
          ].map((stat, index) => (
            <motion.article
              key={stat.label}
              initial={reduceMotion ? false : { opacity: 0, y: 9 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={reduceMotion ? undefined : {
                y: -4,
                boxShadow: '0 12px 28px rgba(10, 10, 11, 0.07)',
                transition: { duration: 0.2, delay: 0 },
              }}
              transition={{ duration: reduceMotion ? 0.01 : 0.42, delay: reduceMotion ? 0 : 0.07 + index * 0.055, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>{stat.label}</span><AnimatedCount value={stat.value} />{stat.icon}
            </motion.article>
          ))}
        </div>

        <section className="admin-products-panel">
          <div className="admin-products-panel__heading">
            <div><p className="admin-eyebrow">CATALOG / PRODUCT MANAGEMENT</p><h2>All products <span>{products.length}</span></h2></div>
            <label className="admin-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" aria-label="Search admin products" /></label>
          </div>

          {loadingDashboard ? (
            <div className="admin-table-state admin-skeleton-list" role="status" aria-label="Loading your product catalog">
              <span /><span /><span />
            </div>
          ) : products.length === 0 ? (
            <div className="admin-empty-state">
              <span className="admin-empty-state__icon"><Box size={22} /></span>
              <h3>Your catalog is ready</h3>
              <p>Add your first product. Drafts are private until published.</p>
              <button className="admin-button admin-button--primary" type="button" onClick={() => setEditorProduct(null)}><Plus size={16} />Add product</button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="admin-table-state">No products match that search.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-product-table">
                <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Status</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  <AnimatePresence initial={false}>
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      layout="position"
                      initial={reduceMotion ? false : { opacity: 0, y: 7 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
                      transition={{ duration: reduceMotion ? 0.01 : 0.3, delay: reduceMotion ? 0 : Math.min(index * 0.035, 0.2), ease: [0.22, 1, 0.36, 1] }}
                    >
                      <td><div className="admin-product-name">{product.thumbnail?.url ? <img src={product.thumbnail.url} alt="" /> : <span className="admin-product-placeholder">V</span>}<div><strong>{product.title}</strong><small>/{product.slug}{product.featured && <em>FEATURED</em>}</small></div></div></td>
                      <td>{product.category}</td>
                      <td>{formatPrice(product.discountPrice ?? product.price)}{product.discountPrice !== null && <small className="admin-old-price">{formatPrice(product.price)}</small>}</td>
                      <td><motion.span layout className={`admin-status admin-status--${product.status}`} transition={{ duration: reduceMotion ? 0.01 : 0.24 }}>{product.status}</motion.span></td>
                      <td>{new Date(product.updatedAt).toLocaleDateString()}</td>
                      <td><div className="admin-row-actions">
                        <button type="button" onClick={() => setEditorProduct(product)} disabled={workingProductId === product.id}>Edit</button>
                        <button type="button" onClick={() => void updateStatus(product)} disabled={workingProductId === product.id}>{product.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                        <button className="admin-delete-button" type="button" onClick={() => void deleteProduct(product)} disabled={workingProductId === product.id} aria-label={`Delete ${product.title}`}><Trash2 size={15} /></button>
                      </div></td>
                    </motion.tr>
                  ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </section>
        <footer className="admin-dashboard__footer"><span><ShieldCheck size={14} /> Private single-owner dashboard</span><button type="button" onClick={() => navigate('/store')}>Open public Store <ArrowUpRight size={14} /></button></footer>
      </div>
    </AdminAnimatedPage>
    </AnimatePresence>
  );
};
