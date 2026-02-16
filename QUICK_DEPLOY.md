# 🚀 Quick Deployment Reference

## Backend → Railway

```bash
# 1. Go to railway.app → New Project → Deploy from GitHub
# 2. Select PostVault repo
# 3. Set Root Directory: server
# 4. Add PostgreSQL database (+ New → Database → PostgreSQL)
# 5. Add environment variables (see below)
# 6. Deploy!
```

### Required Environment Variables (Railway):
```
FRONTEND_URL=https://your-app.vercel.app
JWT_SECRET=your-long-random-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://your-railway-url.up.railway.app/api/auth/google/callback
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

## Frontend → Vercel

```bash
# 1. Go to vercel.com → New Project
# 2. Import GitHub repo
# 3. Set Root Directory: client
# 4. Add environment variable:
#    VITE_BACKEND_URL=https://your-railway-url.up.railway.app/api
# 5. Deploy!
```

### Required Environment Variable (Vercel):
```
VITE_BACKEND_URL=https://your-railway-url.up.railway.app/api
```

## Post-Deployment

1. **Run migrations** on Railway:
   - Go to service → Deployments → latest → Connect
   - Run: `npx drizzle-kit push`

2. **Update URLs**:
   - Update Railway `FRONTEND_URL` with Vercel URL
   - Update Vercel `VITE_BACKEND_URL` with Railway URL

3. **Configure Google OAuth**:
   - Add Railway and Vercel URLs to Google Console
   - Authorized JavaScript origins + Redirect URIs

4. **Test everything**:
   - Sign up / Login
   - Create post with image
   - Google OAuth
   - Email verification

## Useful Links

- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- Google Console: https://console.cloud.google.com/
- Cloudinary Dashboard: https://cloudinary.com/console

## Common Issues

**CORS Error**: Check `FRONTEND_URL` matches exactly (no trailing slash)
**Build Fails**: Check Railway logs, verify all dependencies exist
**Images Won't Upload**: Verify Cloudinary credentials
**DB Error**: Ensure migrations ran: `npx drizzle-kit push`

See DEPLOYMENT.md for full details and troubleshooting.
