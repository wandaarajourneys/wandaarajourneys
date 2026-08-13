<div align="center">
  <h1>🌍 Wandaara Tours & Travel</h1>
  <p><strong>A production-ready travel & tourism marketing platform.</strong></p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

## 📖 Overview

Wandaara Tours is a high-performance, multi-page travel & tourism marketing site built with **Next.js (App Router)**. It showcases safaris, beach escapes, and treks across Kenya and East Africa. 

Features include:
- **Transparent Pricing:** Dynamic KES/USD conversion and detailed breakdown.
- **Secure Inquiry Pipeline:** Built-in form validation, rate-limiting, and honeypot protection.
- **Full Admin Panel:** A secure, custom-built CMS to manage destinations, packages, testimonials, blog posts, and inquiries without touching code.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, SSG & SSR)
- **Database:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Forms & Validation:** React Hook Form + Zod
- **Authentication:** Custom JWT sessions (bcryptjs + jose) with HttpOnly cookies
- **Storage:** Vercel Blob (for admin image uploads)
- **Email:** Nodemailer

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: `v18.17.0` or higher (required by Next.js)
- **npm**: `v9.0.0` or higher (or yarn/pnpm equivalent)
- **PostgreSQL**: A local or hosted instance (e.g., Neon, Supabase, Vercel Postgres)

---

## 🚀 Getting Started (Local Development)

### 1. Installation

Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Configuration

Copy the example environment variables to create your local setup:
```bash
cp .env.example .env.local
```

Fill in the `.env.local` file with your local credentials. Key requirements for local development:
- `DATABASE_URL`: Your PostgreSQL connection string (e.g. `postgresql://user:pass@localhost:5432/wandaara`)
- `ADMIN_SESSION_SECRET`: Generate a secure random string: `openssl rand -base64 48`.
- `ADMIN_SEED_EMAIL` & `ADMIN_SEED_PASSWORD`: Initial admin credentials for seeding the database.
- `NEXT_PUBLIC_SITE_URL`: Set this to `http://localhost:3000` for local testing.
- `SMTP_*`: Needed if you want to test email sending locally (you can use Mailtrap or an App Password from Gmail).

*(See [setup.md](setup.md) for a comprehensive list and explanation of all environment variables.)*

### 3. Database Initialization

Generate the Prisma Client, run migrations to create the schema, and seed initial content:
```bash
npm run db:generate  # Generates the Prisma client
npm run db:migrate   # Applies migrations to your local DB
npm run db:seed      # Seeds destinations, packages, and the admin account
```

### 4. Run the Development Server

Start the local server:
```bash
npm run dev
```

Your application should now be running!
- **Public Site**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

*(Log in using the `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD` you configured in `.env.local`)*

---

## 🛡️ Security & Architecture

Wandaara is built with production security in mind:
- **Auth:** No third-party auth provider. Secure email + password hashing, issuing signed JWTs in `SameSite=Strict` cookies.
- **Rate Limiting:** In-memory fixed-window limiters protect public forms and admin login endpoints against brute-force attacks (Upstash Redis optionally supported for multi-instance deployments).
- **Anti-Spam:** Hidden honeypot fields on public inquiry forms natively catch bots, with optional hCaptcha support.
- **CSRF Protection:** Double-submit cookie tokens issued at login validate session-mutating requests.
- **Audit Logs:** Every admin action (login, content CRUD) is recorded in the `AdminActivityLog`.

---

## 📦 Deployment & Production Setup

For detailed instructions on deploying Wandaara Tours to a production environment (specifically Vercel), configuring domain names, retrieving necessary API keys (like Vercel Blob and Upstash), and setting up persistent storage, please see the **[Production Setup Guide (setup.md)](setup.md)**.

---

## 🗂️ Project Structure

```text
app/
  (site)/              Public marketing routes (Destinations, Packages, Blog)
  admin/               Admin panel — separate visual shell, protected by proxy.ts
  api/                 API routes for inquiries, newsletter, and admin auth
components/            Reusable UI components
lib/
  admin/               Admin authentication, Server Actions, and audit logs
  auth/                bcrypt, JWT session handling, CSRF
  data/                Public-facing read layer wrappers around Prisma
prisma/
  schema.prisma        Database models (Destinations, Packages, Users, Inquiries)
  seed.ts              Initial data population
```

---

## 📜 Available Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build (also runs the TypeScript check)
- `npm run start` — serve the production build
- `npm run lint` — run ESLint against the codebase
- `npm run db:generate` — generate the Prisma client
- `npm run db:migrate` — apply migrations in development (resets db if needed)
- `npm run db:migrate:deploy` — apply existing migrations safely (used in CI/Production)
- `npm run db:seed` — seed content + the first admin account
- `npm run db:studio` — browse/edit the database with a local UI (Prisma Studio)
