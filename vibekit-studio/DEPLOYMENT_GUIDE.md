# Phase 7: Netlify Deployment Guide

## Prerequisites
- Neon PostgreSQL database created
- GitHub repository with code pushed
- Netlify account

## Step 1: Environment Variables

In Netlify Dashboard → Site settings → Environment variables, add:

```
DATABASE_URL = postgresql://neondb_owner:npg_ceus4qOvxZ1S@ep-muddy-hall-a1ehsrsz.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET = your-super-secret-jwt-key-change-this-in-production
```

**IMPORTANT:** Use a strong, random JWT_SECRET in production. Generate one with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 2: Verify Configuration Files

### ✅ netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### ✅ public/_redirects
```
/api/*  /.netlify/functions/:splat  200
/*      /index.html                 200
```

### ✅ package.json scripts
```json
"scripts": {
  "build": "prisma generate && vite build",
  "postinstall": "prisma generate"
}
```

## Step 3: Deploy to Netlify

### Option A: Netlify CLI
```bash
cd vibekit-studio
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Option B: Netlify Dashboard
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Build settings should auto-detect from netlify.toml
5. Add environment variables (DATABASE_URL, JWT_SECRET)
6. Click "Deploy site"

## Step 4: Post-Deployment Checklist

### Database Migration
After first deploy, run migrations:
```bash
netlify env:import .env
netlify functions:invoke --name=migrate
```

Or manually run:
```bash
npx prisma migrate deploy
```

### Test Checklist
- [ ] Site loads at your-site.netlify.app
- [ ] Landing page renders correctly
- [ ] Sign up creates new user
- [ ] Login works and redirects to dashboard
- [ ] Create new page works
- [ ] Editor loads with split view
- [ ] Theme switching updates preview
- [ ] Section editing updates preview in real-time
- [ ] Auto-save works (check "Saving..." → "Saved ✓")
- [ ] Publish button works
- [ ] Published page accessible at /p/slug
- [ ] Contact form submission works
- [ ] Unpublish makes page return 404
- [ ] Logout works
- [ ] Deep links work after page refresh (/dashboard, /builder/123)

## Step 5: Production Testing Script

Run this in browser console on production site:

```javascript
// Test API endpoints
const testAPI = async () => {
  console.log('Testing signup...');
  const signup = await fetch('/.netlify/functions/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'testpass123'
    })
  });
  console.log('Signup:', signup.status);

  console.log('Testing login...');
  const login = await fetch('/.netlify/functions/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'testpass123'
    })
  });
  console.log('Login:', login.status);

  console.log('Testing me...');
  const me = await fetch('/.netlify/functions/me');
  console.log('Me:', me.status, await me.json());
};

testAPI();
```

## Step 6: Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS:
   - Add CNAME record pointing to your-site.netlify.app
   - Or use Netlify DNS for automatic configuration
4. Enable HTTPS (automatic with Let's Encrypt)

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Verify all dependencies in package.json
- Ensure DATABASE_URL is set in environment variables
- Check that prisma generate runs successfully

### Functions Return 500
- Check function logs in Netlify dashboard
- Verify DATABASE_URL format is correct
- Ensure Prisma client is generated during build
- Check JWT_SECRET is set

### Pages Don't Load After Refresh
- Verify _redirects file is in public/ directory
- Check netlify.toml has SPA redirect rule
- Clear browser cache and try again

### Database Connection Fails
- Verify DATABASE_URL includes ?sslmode=require
- Check Neon database is active (not paused)
- Test connection string locally first

## Status: ✅ READY TO DEPLOY

All configuration files are in place. Follow the steps above to deploy to Netlify.

---

**Deployment Date:** 2026-04-02
**Deadline:** 2026-04-04 10:00 AM IST
**Time Remaining:** ~47 hours
