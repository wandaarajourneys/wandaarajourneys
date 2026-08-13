# Deployment Guide — Wandaara Tours and Travel

This guide covers running the app locally with Docker, and deploying it to production on Vercel from scratch.

---

## Part 1: Local Development with Docker

### 1. Spin up Postgres

```bash
docker run --name wandaara-db \
  -e POSTGRES_USER=wandaara \
  -e POSTGRES_PASSWORD=wandaara \
  -e POSTGRES_DB=wandaara \
  -p 5432:5432 \
  -d postgres:16
```

This creates and starts a Postgres 16 container named `wandaara-db`, exposed on port 5432, with a database called `wandaara`.

### 2. Set `DATABASE_URL` in `.env.local`

```
DATABASE_URL="postgresql://wandaara:wandaara@localhost:5432/wandaara"
```

### 3. Install, migrate, seed, run

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) — sign in with the `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` you set in `.env.local`. You'll be forced to change the password on first login.

### Useful Docker commands

```bash
docker stop wandaara-db     # stop the container
docker start wandaara-db    # start it again later — data persists
docker rm -f wandaara-db    # delete the container and its data permanently
```

---

## Part 2: Deploying to Vercel (from scratch)

### 1. Push your code to GitHub

If the repo doesn't exist yet:

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create wandaara-tours --private --source=. --push
```

Or push manually to an existing GitHub repo if you already have one set up.

### 2. Provision production Postgres

Pick a hosted Postgres provider — Neon is the fastest to set up for free:

- Go to [neon.tech](https://neon.tech) → sign up → create a project
- Copy the connection string it gives you (starts with `postgresql://...`) — this becomes your production `DATABASE_URL`

Supabase or RDS work the same way if you prefer those instead.

### 3. Import the project into Vercel

- Go to [vercel.com/new](https://vercel.com/new)
- Import your GitHub repo (`wandaara-tours`)
- Vercel auto-detects Next.js — leave the build settings as default for now
- **Don't deploy yet** — go to "Environment Variables" first

### 4. Add environment variables

Add every variable from `.env.example`. At minimum:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Your Neon (or other) connection string |
| `ADMIN_SESSION_SECRET` | Run `openssl rand -base64 48` locally, paste the output |
| `ADMIN_SEED_EMAIL` | Your admin email |
| `ADMIN_SEED_PASSWORD` | A strong password (you'll change it after first login) |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL, e.g. `https://wandaara-tours.vercel.app` (or custom domain once set up) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` | Optional — skip initially; emails will just log server-side instead of sending |
| `INQUIRY_TO_EMAIL` / `INQUIRY_FROM_EMAIL` | Where inquiries should be delivered/sent from, if SMTP is configured |

Set these for the **Production** environment. If you want Preview deploys to work too, either set the same vars for Preview, or use a separate branch database in Neon so preview builds don't touch production data.

### 5. Set the build command to run migrations

By default Vercel just runs `next build`, which does **not** touch your database. In **Project Settings → Build & Development Settings**, override the build command:

```bash
npm run db:migrate:deploy && npm run build
```

This applies any pending migrations before every production build. Note: `generateStaticParams` for destination/package/blog pages queries the database at build time, so `DATABASE_URL` must be reachable from Vercel's build environment.

### 6. Deploy

Click **Deploy**. Vercel builds the project and gives you a live URL.

### 7. Seed the database (one-time only)

Migrations now run automatically on every deploy, but seeding should only run once — do it from your local machine, pointed at the production database:

```bash
DATABASE_URL="your-neon-connection-string" npm run db:seed
```

This creates the 6 destinations/packages/testimonials/blog posts and the first admin account.

### 8. First login and cleanup

- Go to `https://your-domain/admin/login`
- Sign in with `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`
- You'll be forced to change the password immediately on first login

---

## Part 3: Optional Next Steps (in detail)

### Custom domain

1. In Vercel, go to **Project Settings → Domains**
2. Add your domain (e.g. `wandaaratours.com`)
3. Vercel will show you DNS records to add — either:
   - **A record** pointing to Vercel's IP, or
   - **CNAME record** pointing to `cname.vercel-dns.com` (for subdomains like `www`)
4. Add those records at your domain registrar (Namecheap, Google Domains, etc.)
5. Wait for DNS propagation (usually minutes, can take up to 24-48 hours)
6. Once verified, update `NEXT_PUBLIC_SITE_URL` in Vercel's environment variables to match your new domain exactly (e.g. `https://wandaaratours.com`)
7. Redeploy so the new value takes effect (metadata, sitemap, and password-reset links all read from this variable)

### Real email delivery (SMTP)

The app uses Nodemailer, so any SMTP provider works. Common options:

**SendGrid** (popular, generous free tier):
1. Sign up at [sendgrid.com](https://sendgrid.com), verify a sender identity/domain
2. Create an API key under Settings → API Keys
3. Set in Vercel:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=<your SendGrid API key>
   ```

**Gmail SMTP** (fine for low volume):
1. Enable 2-Step Verification on the Google account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Set in Vercel:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=youraddress@gmail.com
   SMTP_PASSWORD=<the app password>
   ```

**Mailgun / SES** work similarly — grab SMTP credentials from their respective dashboards and set the four `SMTP_*` variables accordingly.

Then also set:
```
INQUIRY_TO_EMAIL=you@yourdomain.com
INQUIRY_FROM_EMAIL=noreply@yourdomain.com
```

Redeploy after adding these. Test by submitting the contact form — you should receive a real email instead of seeing it logged to the console.

### Image uploads (Vercel Blob)

Without this, admins can still add images by pasting URLs directly — this just enables actual file uploads from the admin panel.

1. In your Vercel project, go to **Storage → Create Database → Blob**
2. Create a new Blob store and connect it to your project
3. Vercel automatically injects `BLOB_READ_WRITE_TOKEN` into your project's environment variables — no manual copy-paste needed
4. Redeploy for the variable to take effect
5. Test by uploading an image in `/admin/destinations` (or packages/blog) — it should upload directly instead of requiring a pasted URL

### Ongoing maintenance

- **Dependency audits**: run `npm audit` periodically, and update packages with known vulnerabilities
- **Migrations**: any time you change `prisma/schema.prisma`, run `npm run db:migrate` locally to generate a new migration file, commit it, then push — the Vercel build command (`db:migrate:deploy`) will apply it automatically on the next deploy
- **Rate limiting at scale**: the current rate limiter (`lib/ratelimit.ts`) is in-memory, which works for a single instance but resets on each serverless cold start and doesn't share state across instances. If spam or abuse becomes an issue in production, swap it for `@upstash/ratelimit` — the env vars (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) are already scaffolded in `.env.example`
- **CAPTCHA**: if spam volume warrants it, wire in hCaptcha using the reserved `HCAPTCHA_SITE_KEY` / `HCAPTCHA_SECRET_KEY` env vars in `InquiryForm.tsx` and `app/api/inquiry/route.ts`
