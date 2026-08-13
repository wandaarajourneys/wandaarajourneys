# 🚀 Production Setup & Deployment Guide

This guide outlines the complete, end-to-end steps required to deploy the Wandaara Tours Next.js application to a production environment. We highly recommend **Vercel** for hosting, as it natively supports Next.js features (SSR, Server Actions, Middleware, Edge Functions).

---

## 📋 Prerequisites for Production

1. A [Vercel](https://vercel.com/) account (linked to your GitHub or GitLab).
2. A live PostgreSQL Database (e.g., Vercel Postgres, Neon, or Supabase).
3. An SMTP provider for reliable email delivery (SendGrid, Mailgun, AWS SES, or Gmail App Passwords).
4. (Optional) Upstash Redis for distributed rate limiting.
5. (Optional) hCaptcha or reCAPTCHA for advanced spam protection.

---

## 🌐 Step 1: Prepare Your Environment Variables

Before deploying, ensure you have all the necessary environment variables prepared. You will need to add these to your Vercel project settings.

### 1. Site Identity
*   `NEXT_PUBLIC_SITE_URL`: The domain of your site (e.g., `https://www.wandaaratours.com`). Vercel provides a default one (e.g., `https://your-app.vercel.app`), but use your custom domain here if you have one.

### 2. Database Connection
*   `DATABASE_URL`: The connection string for your production PostgreSQL database. 
    *   *Note: Vercel's native "Vercel Postgres" has been deprecated.*
    *   **If you want a free database directly through Vercel:** You can provision **Prisma Postgres** or **Neon** via the Vercel Marketplace. This will automatically inject the `DATABASE_URL` in Step 3.
    *   **If you are using an external provider directly:** (like Neon, Supabase, or RDS), add your connection string here. Note: most hosted providers require `?sslmode=require` at the end of the URL.

### 3. Authentication Security
Run this command in your terminal to generate a highly secure secret for admin sessions:
```bash
openssl rand -base64 48
```
*   `ADMIN_SESSION_SECRET`: The exact output from the command above.

### 4. Initial Admin Credentials (Seeding)
These are used to generate the very first admin user in your database.
*   `ADMIN_SEED_EMAIL`: The email you will use to log in (e.g., `wandaarajourneys@gmail.com`).
*   `ADMIN_SEED_PASSWORD`: Choose a strong, temporary password (you **must** change this upon first login).

### 5. Storage (Vercel Blob)
*   `BLOB_READ_WRITE_TOKEN`: Required for admin image uploads (destinations, packages, blogs). Without this, editors must use external URLs for images. *(You will get this token in Step 3).*

### 6. Email / SMTP Setup
Required for the inquiry pipeline to deliver emails.
*   `SMTP_HOST`: The SMTP server host (e.g., `smtp.gmail.com` or `smtp.sendgrid.net`).
*   `SMTP_PORT`: Usually `587` (TLS) or `465` (SSL).
*   `SMTP_USER`: Your SMTP username.
*   `SMTP_PASSWORD`: Your SMTP password or App Password.
*   `INQUIRY_TO_EMAIL`: The inbox that should receive customer inquiries (e.g., `info@wandaaratours.com`).
*   `INQUIRY_FROM_EMAIL`: The authenticated sender address (e.g., `no-reply@wandaaratours.com`).

### 7. Optional Enhancements
*   **Upstash Redis (Recommended for multi-instance deployments):**
    *   `UPSTASH_REDIS_REST_URL`: Provided by the Upstash dashboard.
    *   `UPSTASH_REDIS_REST_TOKEN`: Provided by the Upstash dashboard.
*   **hCaptcha (Optional Spam Protection):**
    *   `HCAPTCHA_SITE_KEY`: Public site key.
    *   `HCAPTCHA_SECRET_KEY`: Secret verification key.

---

## 🚀 Step 2: Deploy to Vercel

### 1. Push Your Code to GitHub
Vercel deploys directly from your Git repository. Ensure the Wandaara codebase is committed and pushed to a GitHub, GitLab, or Bitbucket repository.

If you haven't created a repository yet, run these commands in your project folder:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### 2. Import Project to Vercel
1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** > **Project** and select your Wandaara GitHub repository.
3. **Wait! Do not click Deploy yet.**

### 3. Build Command Configuration
Because Wandaara uses Prisma for the database, database migrations must be applied *before* building the Next.js app.
The `package.json` is already configured with the correct `build` script (`prisma generate && prisma migrate deploy && next build`). 
You **do not** need to override the build command in Vercel. Leave the default settings as they are.

### 4. Add Initial Environment Variables
Expand the **Environment Variables** section and add the keys you prepared in Step 1. At a minimum, you need:
*   `ADMIN_SESSION_SECRET`: Paste the secure string you generated.
*   `ADMIN_SEED_EMAIL`: The email for your initial admin account.
*   `ADMIN_SEED_PASSWORD`: A temporary password for your first login.
*   `NEXT_PUBLIC_SITE_URL`: Your site's domain (e.g., `https://your-repo-name.vercel.app`).
*   *(Optional)* If you already set up an external database (like Neon), add `DATABASE_URL` with the connection string. If you want to use Vercel's built-in Postgres, skip this for now.

### 5. Initial Deployment
Click **Deploy**. 
*(Note: The app will build successfully, but it won't be fully functional yet because it lacks image storage and, if skipped, a database).*

---

## 🗄️ Step 3: Configure Database & Storage on Vercel

Once the initial deployment finishes, you need to configure persistent storage for your database and images.

1. **Image Storage (Required):** Go to the **Storage** tab in your Vercel project dashboard. Click **Create** > **Blob** and follow the prompts. This automatically injects a `BLOB_READ_WRITE_TOKEN` environment variable so your admin panel can upload destination and blog images.
2. **Database (If you didn't configure an external one):** 
   Since Vercel's native Postgres is deprecated, you should use the Vercel Marketplace:
   * Go to the **Marketplace** tab in your Vercel dashboard.
   * Search for **Prisma Postgres** (or **Neon**).
   * Add the integration to your Wandaara project. This will automatically create and inject your `DATABASE_URL`.
3. **Redeploy:** Go back to the **Deployments** tab, click the three dots on your latest deployment, and hit **Redeploy** so the app picks up these new storage and database credentials.

---

## 🌱 Step 4: Seed the Production Database (Crucial)

Right now, your live database is completely empty. You need to create the initial admin user and baseline data (destinations, packages).

We have included a temporary, one-time seed endpoint to make this easy.

1. Navigate to your live Vercel URL and append `/api/admin/seed` (e.g., `https://your-domain.vercel.app/api/admin/seed`).
2. Wait a few seconds for the database to populate. You should see a JSON response saying "Database seeded successfully!".
3. **🚨 CRITICAL:** Once seeded, you **must delete** the file `app/api/admin/seed/route.ts` from your repository and push the update. Leaving this file exposed is a security risk.

---

## 🔒 Step 5: Post-Launch Security & Verification

1. **First Login:** Navigate to your live Vercel URL (specifically `https://your-domain.vercel.app/admin/login`).
2. **Change Admin Password:** Log in using the `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD`. You will be prompted (or should manually go) to change the password immediately.
3. **Create Additional Users:** As a Super Admin, navigate to the User Management page to create accounts for your team members. You can assign them specific roles (`Tour Manager`, `Content Editor`, `Customer Support`) based on their responsibilities.
4. **Test Image Uploads:** Go to the Destinations tab in the admin panel and attempt to upload an image to verify that Vercel Blob storage is working.
5. **Test Inquiries:** Submit a test inquiry on the public site to verify that your SMTP configuration is successfully delivering emails to your `INQUIRY_TO_EMAIL` address (if you configured SMTP).
6. **Custom Domain:** If you purchased a domain name, add it under Vercel's **Settings > Domains**. Ensure your `NEXT_PUBLIC_SITE_URL` environment variable matches the primary custom domain and redeploy so password resets and sitemaps use the correct link.
