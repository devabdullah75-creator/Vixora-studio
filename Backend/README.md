# Vixora Studio Store

The existing site is a React 19 / TypeScript / Vite frontend with custom pathname routing, GSAP transitions, and Lenis on portfolio pages. There was no existing backend, database, authentication service, or cloud-storage provider. The Store now uses a separate Express API, SQLite product/session records, and local media storage. No MongoDB, Cloudinary, or S3 credentials were present to reuse.

## Local setup

1. Install Node.js 22.5+.
2. In `Backend`, run `npm install` and copy `.env.example` to `.env`.
3. Generate a session secret with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"` and replace the example `SESSION_SECRET`.
4. Set `ADMIN_EMAIL` and a private `ADMIN_PASSWORD` of at least 14 characters, then run `npm run admin:create` from `Backend`. The command hashes the password with Argon2id and refuses to create another administrator. Remove the credentials from `.env` after the one-time setup.
5. Run `npm run dev` in `Backend` and `npm run dev` in `Frontend`. Vite proxies `/api` to the backend.

`SESSION_SECRET` must be a private random value of at least 32 characters. In local development the API expects the frontend origin `http://localhost:5173`; set `APP_ORIGIN` if Vite uses another origin. The admin interface is at `/admin`.

## Access and product lifecycle

- There is no public registration, seller account, or role-editing endpoint. The only administrator is created by the private CLI seed command.
- Admin endpoints require a server-side session in an HttpOnly, SameSite cookie. Mutating API requests must originate from `APP_ORIGIN`; login attempts are rate limited.
- Public `/api/products` and `/api/products/:slug` responses include published, non-deleted products only. Draft and unpublished products return 404 on public detail routes.
- Images and preview videos are validated by file signature, assigned opaque names, and served publicly only while the owning product is published. Download files are stored separately and are never returned by public APIs or served by a download route.
- Delete is a soft-delete: the product is hidden immediately but the record and files remain in private storage. No cleanup or purge job is configured.
- The dashboard provides product counts only. There is no payment, checkout, order, or download-delivery functionality.

Uploads accept JPEG/PNG/WebP/GIF images (12 MB each), MP4/WebM/MOV previews (120 MB), and ZIP/PDF/MP4/MOV digital files (512 MB). The upload form reports transfer progress and the API rejects unsupported signatures and oversized files.

## Production

Keep `STORAGE_DIR` and `DATABASE_PATH` outside the frontend web root and mount `STORAGE_DIR` on persistent storage. For production, set `NODE_ENV=production`, a strong `SESSION_SECRET`, and `APP_ORIGIN` to the canonical HTTPS origin. Set `TRUST_PROXY=1` only when there is exactly one trusted reverse proxy. Build the frontend with `npm run build` in `Frontend`; the Express server serves `Frontend/dist` when it exists.

The integration test suite uses a temporary database and removes its test files on completion: `npm test` from `Backend`.
