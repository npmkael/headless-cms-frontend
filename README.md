# Positivus - Headless CMS

Next.js headless CMS with Supabase backend.

## Prerequisites

- Node.js 18+
- Supabase account

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Get credentials from Supabase Dashboard → Project Settings → API

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up database via Supabase SQL Editor:
   - Run `supabase/migrations/001_create_tables.sql`
   - Run `supabase/seed.sql`

> Migration and seed files are for reference/dump only. Use SQL Editor to execute them.

3. Run development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Admin Credentials

```
Email: admin@example.com
Password: admin123
```

Login at [http://localhost:3000/admin](http://localhost:3000/admin)

## Build

```bash
npm run build
npm start
```
