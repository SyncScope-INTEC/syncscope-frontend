# Environment Variables Configuration Guide

## Overview

This document outlines the environment variables needed for the SyncScope Frontend application. Currently, the application is a static frontend, but these variables are prepared for future backend integration.

## Current Status

⚠️ **Important**: The codebase currently has **NO active API calls or backend integrations**. All data displayed is hardcoded/mocked. Environment variables will be needed when:

1. Backend API is developed and deployed
2. GitHub/GitLab integrations are implemented
3. Authentication system is added
4. Real-time features are implemented

## Environment Variables by Category

### 🔌 API Configuration (Future Use)

These will be needed when the backend API is ready:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.railway.app/api
```

- **Required**: Yes (when backend is deployed)
- **Description**: Base URL for the backend API
- **Example**: `https://api.syncscope.com/api`

### 🔐 Authentication (Future Use)

If implementing NextAuth.js or similar:

```bash
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters
NEXTAUTH_URL=https://your-app.railway.app
```

- **Required**: Yes (if using authentication)
- **Description**: Secret key for session encryption and app URL
- **Generate secret**: `openssl rand -base64 32`

### 🐙 GitHub Integration (Future Use)

For fetching developer metrics from GitHub:

```bash
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_secret
```

- **Required**: No (optional feature)
- **Description**: GitHub OAuth credentials for API access
- **Setup**: Create OAuth app at https://github.com/settings/developers

### 🦊 GitLab Integration (Future Use)

For fetching developer metrics from GitLab:

```bash
NEXT_PUBLIC_GITLAB_CLIENT_ID=your_gitlab_application_id
GITLAB_CLIENT_SECRET=your_gitlab_application_secret
```

- **Required**: No (optional feature)
- **Description**: GitLab OAuth credentials for API access

### 📊 Analytics

Already included in package.json (`@vercel/analytics`):

```bash
# Usually auto-configured by Vercel, but can be set manually
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

### ⚙️ General Settings

```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Railway Deployment

### Setting Environment Variables on Railway

1. **Via Dashboard**:
   - Go to your project on Railway
   - Click on your service
   - Navigate to "Variables" tab
   - Add variables one by one or use "Raw Editor" for bulk add

2. **Via CLI**:
   ```bash
   railway variables set NEXT_PUBLIC_API_URL=https://your-api.railway.app/api
   railway variables set NODE_ENV=production
   ```

3. **Using Railway's Service Variables**:
   Railway automatically provides:
   - `PORT` - Port your app should listen on
   - `RAILWAY_ENVIRONMENT` - Current environment (production/staging)
   - `RAILWAY_PUBLIC_DOMAIN` - Your app's public domain

### Important Notes for Railway

1. **Public vs Private Variables**:
   - Variables prefixed with `NEXT_PUBLIC_` are embedded in the client bundle
   - Other variables are only available server-side
   - Never put sensitive data in `NEXT_PUBLIC_` variables

2. **Build-time vs Runtime**:
   - `NEXT_PUBLIC_*` variables must be set **before** build time
   - Changes to these require a rebuild
   - Railway rebuilds automatically when you update variables

3. **Current Deployment (No Backend)**:
   ```bash
   # Minimal configuration for current static frontend
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   ```

## Local Development

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update with your local values:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NODE_ENV=development
   ```

3. Restart your dev server:
   ```bash
   pnpm dev
   ```

## Security Best Practices

1. ✅ Never commit `.env` or `.env.local` files
2. ✅ Always use `.env.example` for documentation
3. ✅ Rotate secrets regularly
4. ✅ Use different values for production and development
5. ✅ Never expose sensitive keys in `NEXT_PUBLIC_` variables
6. ✅ Use Railway's secret management for sensitive data

## Migration Checklist

When the backend is ready:

- [ ] Deploy backend API to Railway
- [ ] Get backend API URL from Railway
- [ ] Add `NEXT_PUBLIC_API_URL` to Railway variables
- [ ] Update frontend code to use `process.env.NEXT_PUBLIC_API_URL`
- [ ] Test API connectivity
- [ ] Set up GitHub/GitLab OAuth apps (if needed)
- [ ] Add OAuth credentials to Railway
- [ ] Configure authentication (if needed)
- [ ] Test all integrations

## Current Recommendation

**For now, you don't need to set any environment variables** except:

```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

These are already set in the Dockerfile, so Railway deployment will work out of the box! 🚀