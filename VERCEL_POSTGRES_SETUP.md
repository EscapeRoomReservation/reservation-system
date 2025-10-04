# Vercel Postgres Setup Guide

## Changes Made
✅ Updated `prisma/schema.prisma` to use PostgreSQL
✅ Added `.env.example` with DATABASE_URL template
✅ Added `postinstall` script to `package.json`

## Step-by-Step Setup

### 1. Create Vercel Postgres Database

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a name for your database
7. Select a region (choose closest to your users)
8. Click **Create**

### 2. Connect Database to Your Project

1. After creating the database, Vercel will show you environment variables
2. Click **Connect** or go to **Settings** → **Environment Variables**
3. Vercel automatically adds these variables to your project:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL` ← **Use this one for Prisma**
   - `POSTGRES_URL_NON_POOLING`
   - Others...

### 3. Add DATABASE_URL Environment Variable

In your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name:** `DATABASE_URL`
   - **Value:** Copy the value from `POSTGRES_PRISMA_URL`
   - **Environments:** Select all (Production, Preview, Development)
3. Click **Save**

### 4. Add NEXTAUTH_SECRET (if not already set)

1. Generate a secret: Run in terminal:
   ```bash
   openssl rand -base64 32
   ```
   Or use: https://generate-secret.vercel.app/32

2. Add to Vercel:
   - **Name:** `NEXTAUTH_SECRET`
   - **Value:** Your generated secret
   - **Environments:** All

### 5. Run Database Migration

You have two options:

#### Option A: Via Vercel CLI (Recommended)
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Pull environment variables
vercel env pull .env

# Run migration
npx prisma migrate dev --name init

# Push to Vercel
git add .
git commit -m "Migrate to PostgreSQL"
git push
```

#### Option B: Direct Migration on Vercel
```bash
# After pushing your code, run this in Vercel's terminal or locally with production DATABASE_URL
npx prisma migrate deploy
```

### 6. Seed Database (Optional)

If you have a seed file:
```bash
npx prisma db seed
```

### 7. Redeploy

After setting up environment variables:
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger deployment

## Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your local PostgreSQL or use Vercel's database:
   ```bash
   # Pull Vercel env vars for local dev
   vercel env pull .env
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Start dev server:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Error: "Can't reach database server"
- Check if `DATABASE_URL` is set in Vercel environment variables
- Make sure you're using `POSTGRES_PRISMA_URL` value (with connection pooling)

### Error: "Prepared statement already exists"
- Use `POSTGRES_PRISMA_URL` instead of `POSTGRES_URL`
- The Prisma URL includes `?pgbouncer=true` for connection pooling

### Migration Issues
- Run `npx prisma migrate deploy` instead of `migrate dev` in production
- Check Vercel build logs for errors

## Verification

After deployment, test:
1. Visit your app URL
2. Try registering a new user
3. Check Vercel Postgres dashboard for data

## Need Help?

- Vercel Postgres Docs: https://vercel.com/docs/storage/vercel-postgres
- Prisma with Vercel: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
