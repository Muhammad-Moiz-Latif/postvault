# 🚀 PostVault Deployment Guide

Complete guide to deploy PostVault to **Railway** (Backend) and **Vercel** (Frontend).

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Part 1: Backend Deployment (Railway)](#part-1-backend-deployment-railway)
3. [Part 2: Frontend Deployment (Vercel)](#part-2-frontend-deployment-vercel)
4. [Part 3: Environment Variables Setup](#part-3-environment-variables-setup)
5. [Part 4: Database Migrations](#part-4-database-migrations)
6. [Part 5: Google OAuth Setup](#part-5-google-oauth-setup)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- ✅ [Railway Account](https://railway.app) - Sign up (free tier available)
- ✅ [Vercel Account](https://vercel.com) - Sign up with GitHub
- ✅ [GitHub Account](https://github.com) - For code repository
- ✅ [Cloudinary Account](https://cloudinary.com) - For image uploads
- ✅ [Google Cloud Console](https://console.cloud.google.com) - For OAuth (if using Google login)

### Local Setup
```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## Part 1: Backend Deployment (Railway)

Railway automatically detects and deploys Node.js applications. Here's how to deploy:

### Step 1: Create Railway Project

1. Go to **[https://railway.app](https://railway.app)**
2. Click **"Start a New Project"**
3. Choose **"Deploy from GitHub repo"**
4. Select your **PostVault** repository
5. Railway will detect it's a Node.js project

### Step 2: Configure Build Settings

Railway auto-detects from `package.json`, but verify:

- **Root Directory**: `server` (if monorepo)
- **Build Command**: `npm run build` (auto-detected)
- **Start Command**: `npm start` (auto-detected)

To set root directory:
1. Go to your project in Railway
2. Click **Settings** tab
3. Scroll to **Service Settings**
4. Set **Root Directory**: `server`
5. Click **Save**

### Step 3: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will create and link the database automatically
4. It sets `DATABASE_URL` environment variable automatically

### Step 4: Set Environment Variables

1. Click on your **web service** (not database)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add the following variables:

#### Required Environment Variables:

```bash
# Frontend URL (you'll update this after Vercel deployment)
FRONTEND_URL=https://your-app-name.vercel.app

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Cloudinary (get from cloudinary.com dashboard)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://your-railway-url.up.railway.app/api/auth/google/callback

# Email Configuration (for Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

> **Note**: Railway automatically provides `DATABASE_URL` and `PORT` - don't add them manually.

### Step 5: Deploy

1. Railway automatically deploys when you add variables
2. Click **"Deploy"** if it doesn't start automatically
3. Wait for deployment to complete (logs appear in real-time)
4. Once deployed, click **"Settings"** → **"Domains"**
5. Click **"Generate Domain"** to get your public URL
6. Your backend URL will be something like: `https://your-project-name.up.railway.app`

**Save this URL!** You'll need it for Vercel.

### Step 6: Run Database Migrations

After deployment, you need to run Drizzle migrations:

**Option A: Using Railway Dashboard**
1. In Railway, go to your service
2. Click on **Deployments** tab
3. Find the latest deployment
4. Click the **three dots** (⋮) → **"Connect"**
5. Run in the terminal:
   ```bash
   npm install
   npx drizzle-kit push
   ```
6. Type `exit` to close

**Option B: Add to package.json (Recommended)**

Update your `server/package.json`:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "npm run migrate && node dist/index.js",
    "migrate": "npx drizzle-kit push"
  }
}
```

Then redeploy on Railway.

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Create `.env` file in `client/` folder (if not exists):
```bash
VITE_BACKEND_URL=http://localhost:4000/api
```

2. Ensure `.env` is in `.gitignore` (it should be)

### Step 2: Deploy to Vercel

1. Go to **[https://vercel.com/dashboard](https://vercel.com/dashboard)**
2. Click **"Add New Project"** or **"Import Project"**
3. Select your **PostVault** GitHub repository
4. Configure project:

   **Framework Preset**: Vite (auto-detected)
   
   **Root Directory**: `client` ⚠️ (Important for monorepo)
   - Click **"Edit"** next to root directory
   - Select `client` folder
   
   **Build Command**: `npm run build` (auto-detected)
   
   **Output Directory**: `dist` (auto-detected)
   
   **Install Command**: `npm install` (auto-detected)

5. Click **"Environment Variables"** (expand section)

### Step 3: Add Environment Variable

Add this variable:

| Name | Value |
|------|-------|
| `VITE_BACKEND_URL` | `https://your-railway-url.up.railway.app/api` |

Replace `your-railway-url.up.railway.app` with your actual Railway domain.

6. Click **"Deploy"**

7. Wait for deployment (2-3 minutes)

8. Once complete, you'll get your Vercel URL: `https://your-app-name.vercel.app`

### Step 4: Update Railway Environment Variable

Now update the Railway backend with your Vercel URL:

1. Go back to **Railway dashboard**
2. Click on your **web service**
3. Go to **"Variables"** tab
4. Find `FRONTEND_URL`
5. Update it to: `https://your-app-name.vercel.app` (without trailing slash!)
6. Railway will automatically redeploy

---

## Part 3: Environment Variables Setup

### Backend (Railway) - Complete List

```bash
# Automatically provided by Railway:
DATABASE_URL=postgresql://... (auto-set when you add PostgreSQL)
PORT=... (auto-set by Railway)

# You must add these:
FRONTEND_URL=https://your-app-name.vercel.app
JWT_SECRET=generate-a-long-random-secret-key-here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-railway-app.up.railway.app/api/auth/google/callback
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Frontend (Vercel) - Complete List

```bash
VITE_BACKEND_URL=https://your-railway-app.up.railway.app/api
```

---

## Part 4: Database Migrations

### Run Migrations on Railway

#### Method 1: One-Time Console Access

```bash
# In Railway project dashboard:
# 1. Go to your service
# 2. Click "Deployments"
# 3. Click latest deployment → three dots (⋮) → "Connect"
# 4. Run in terminal:
npx drizzle-kit push
```

#### Method 2: Auto-Migrate on Deploy (Recommended)

Update `server/package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "npx drizzle-kit push && node dist/index.js",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts"
  }
}
```

Commit and push. Railway will auto-redeploy and run migrations.

---

## Part 5: Google OAuth Setup

If you're using Google OAuth for login:

### Step 1: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Go to **"APIs & Services"** → **"Credentials"**
4. Click on your OAuth 2.0 Client ID
5. Add **Authorized JavaScript origins**:
   ```
   https://your-app-name.vercel.app
   https://your-railway-app.up.railway.app
   ```

6. Add **Authorized redirect URIs**:
   ```
   https://your-railway-app.up.railway.app/api/auth/google/callback
   https://your-app-name.vercel.app/auth/success
   ```

7. Click **"Save"**

### Step 2: Update Environment Variables

Make sure these are set in Railway:

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://your-railway-app.up.railway.app/api/auth/google/callback
```

---

## Part 6: Email Configuration (Gmail)

To send verification/reset emails:

### Step 1: Enable 2FA on Gmail

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**

### Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **"Mail"** and **"Other (Custom name)"**
3. Enter "PostVault" as the name
4. Click **"Generate"**
5. Copy the 16-character password

### Step 3: Add to Railway

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

---

## ✅ Verification Checklist

After deployment, test these:

- [ ] **Frontend loads**: Visit your Vercel URL
- [ ] **Backend is running**: Visit `https://your-railway-url.up.railway.app` (should show something)
- [ ] **CORS working**: Try logging in/signing up
- [ ] **Database connected**: User registration creates a database entry
- [ ] **Images upload**: Create a post with an image (Cloudinary)
- [ ] **Google OAuth**: Test Google login (if implemented)
- [ ] **Emails send**: Test password reset email
- [ ] **Posts CRUD**: Create, read, update, delete posts

---

## 🔧 Troubleshooting

### Common Issues

#### ❌ CORS Error: "Access-Control-Allow-Origin"

**Problem**: Frontend can't connect to backend.

**Solution**:
1. Check `FRONTEND_URL` in Railway matches your Vercel URL exactly
2. Ensure there's **no trailing slash**: ✅ `https://app.vercel.app` ❌ `https://app.vercel.app/`
3. Verify the variable is saved (refresh Railway page)
4. Force redeploy on Railway

#### ❌ "Failed to fetch" or Network Error

**Problem**: Frontend can't reach backend.

**Solution**:
1. Check `VITE_BACKEND_URL` in Vercel includes `/api` at the end
2. Should be: `https://your-app.railway.app/api`
3. Check Railway service is running (not crashed)
4. View Railway logs for errors

#### ❌ Database Connection Error

**Problem**: Backend can't connect to PostgreSQL.

**Solution**:
1. Ensure PostgreSQL database is created in Railway
2. Check if `DATABASE_URL` variable exists (should be automatic)
3. Verify database is in the same Railway project
4. Check Railway logs: `Error: connect ECONNREFUSED`

#### ❌ Build Fails on Railway

**Problem**: Deployment fails during build.

**Solution**:
1. Check your `package.json` has `build` script
2. Ensure all dependencies are in `dependencies`, not `devDependencies`
3. Test build locally: `cd server && npm run build`
4. Check Railway logs for specific error
5. Verify tsconfig.json is correct

#### ❌ "Cannot find module" in Production

**Problem**: App crashes with module not found.

**Solution**:
1. Move required packages from `devDependencies` to `dependencies`
2. Especially: `typescript`, `@types/*` packages
3. Run: `npm install --save typescript`
4. Commit and push

#### ❌ Images Not Uploading

**Problem**: Image upload fails.

**Solution**:
1. Verify all Cloudinary credentials are correct
2. Check Cloudinary dashboard for errors
3. Ensure `CLOUDINARY_*` variables are set in Railway
4. Test locally first with same credentials

#### ❌ Google OAuth Not Working

**Problem**: Google login fails.

**Solution**:
1. Check authorized URIs in Google Console
2. Verify `GOOGLE_CALLBACK_URL` matches exactly
3. Ensure both Railway and Vercel URLs are added
4. Check Railway logs for OAuth errors
5. Make sure cookies work (HTTPS required)

#### ❌ Environment Variables Not Loading

**Problem**: App behaves like env vars don't exist.

**Solution**:
1. Railway: Variables tab → verify all are there
2. Click "Redeploy" after adding variables
3. Vercel: Settings → Environment Variables → check spelling
4. Vercel: Redeploy after adding variables
5. Remember: Vercel vars must start with `VITE_`

---

## 🎯 Useful Commands & Tips

### Railway CLI (Optional)

Install Railway CLI for advanced usage:

```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Run commands in Railway
railway run npm run migrate

# SSH into container
railway shell
```

### Vercel CLI (Optional)

```bash
# Install
npm install -g vercel

# Login
vercel login

# Deploy
cd client
vercel

# View logs
vercel logs
```

### Viewing Logs

**Railway Logs:**
- Go to your project dashboard
- Click on your service
- Logs appear at the bottom in real-time
- Filter by error/warn/info

**Vercel Logs:**
- Go to your project → Deployments
- Click on a deployment
- View Function Logs (for errors)

---

## 💰 Free Tier Limits

### Railway Free Tier
- **$5 of usage per month** (~500 hours)
- **1GB RAM** per service
- **100GB bandwidth** per month
- **1GB persistent storage** per database
- Services don't sleep (unlike Heroku free tier)
- Credit card required (but won't charge beyond free tier)

### Vercel Free Tier
- **100GB bandwidth** per month
- **100 deployments** per day
- **Unlimited** projects
- **Serverless Functions**: 100GB-hours
- Auto HTTPS
- Instant deployments from GitHub
- No credit card required

---

## 📈 Monitoring & Maintenance

### Check App Health

**Railway Dashboard:**
- CPU usage
- Memory usage
- HTTP requests
- Build history
- Deployment logs

**Vercel Dashboard:**
- Pageviews
- Build duration
- Function execution time
- Error monitoring

### Setting Up Alerts

**Railway:**
- Go to Project Settings
- Enable email notifications for deployment failures

**Vercel:**
- Settings → Notifications
- Enable Discord/Slack webhooks (optional)

---

## 🔄 Continuous Deployment

Both Railway and Vercel support automatic deployment:

### Auto-Deploy from GitHub

**Railway:**
1. Already set up when you connected GitHub
2. Push to `main` branch → auto deploys
3. Disable: Project Settings → Deployments → Disable auto-deploy

**Vercel:**
1. Already set up when you connected GitHub
2. Push to any branch → creates preview deployment
3. Push to `main` → deploys to production
4. Disable: Settings → Git → Disable Production/Preview deployments

### Manual Deploy

**Railway:**
- Click "Deploy" button in dashboard

**Vercel:**
- Deployments tab → "Redeploy"
- Or use Vercel CLI: `vercel --prod`

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** (already in `.gitignore`)
2. **Use strong JWT secrets** (32+ characters, random)
3. **Rotate secrets regularly** (change JWT_SECRET every few months)
4. **Use app passwords for Gmail** (not your actual password)
5. **Enable 2FA** on Railway, Vercel, and GitHub accounts
6. **Review OAuth scopes** in Google Console
7. **Set up rate limiting** (optional, for production)
8. **Monitor logs** for suspicious activity

---

## 🎉 You're Live!

Your PostVault app is now deployed!

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://your-project.up.railway.app`

### Share Your App

1. Test all features thoroughly
2. Share the Vercel URL with users
3. Monitor Railway usage to stay within free tier

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord Community](https://discord.gg/railway)
- [Vercel Documentation](https://vercel.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [PostgreSQL on Railway](https://docs.railway.app/databases/postgresql)

---

## 🆘 Need Help?

- **Railway Support**: [Discord](https://discord.gg/railway)
- **Vercel Support**: [GitHub Discussions](https://github.com/vercel/vercel/discussions)
- **PostgreSQL Issues**: Check Railway logs
- **App Bugs**: Check both Railway and Vercel logs

---

## 🔄 Updating Your App

### When You Make Code Changes:

1. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Your change description"
   git push origin main
   ```

2. **Railway automatically deploys** the backend changes

3. **Vercel automatically deploys** the frontend changes

4. **Check deployment status**:
   - Railway: Dashboard → Deployments
   - Vercel: Dashboard → Deployments

5. **If deployment fails**, check:
   - Build logs in Railway/Vercel
   - TypeScript compilation errors
   - Missing dependencies
   - Environment variables

### Rollback if Needed:

**Railway:**
- Go to Deployments
- Click on a previous successful deployment
- Click "Rollback to this version"

**Vercel:**
- Go to Deployments
- Click on previous deployment
- Click "Promote to Production"

---

**Good luck with your deployment! 🚀**
