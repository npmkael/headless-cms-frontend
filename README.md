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
Email: admin@positivus.com
Password: admin123
```

Login at [http://localhost:3000/admin](http://localhost:3000/admin)

## Build

```bash
npm run build
npm start
```

## Screenshots

### Landing Page
<img width="1920" height="6339" alt="Image" src="https://github.com/user-attachments/assets/36b00f3c-40da-4ed7-8e2a-50f0b8533940" />

### Login page
<img width="1920" height="943" alt="Image" src="https://github.com/user-attachments/assets/c51d5064-662d-4eee-b3af-05745608c0eb" />

### Admin Dashboard
<img width="1905" height="948" alt="Image" src="https://github.com/user-attachments/assets/a05036bc-3a36-4da9-bb3d-15cf2ddefabf" />

<img width="1896" height="942" alt="Image" src="https://github.com/user-attachments/assets/59e02d63-763e-4861-a3c7-c1124b4f759e" />

<img width="1911" height="943" alt="Image" src="https://github.com/user-attachments/assets/a8d250ad-1c2b-4d94-81cb-08abc12feb09" />

<img width="1889" height="940" alt="Image" src="https://github.com/user-attachments/assets/e1988f33-ae99-4d8a-8e01-20fcc8783c78" />

<img width="1891" height="940" alt="Image" src="https://github.com/user-attachments/assets/cce72f3b-b394-4485-874f-2b15c1ca25ea" />

<img width="1904" height="940" alt="Image" src="https://github.com/user-attachments/assets/8c050369-69d8-48ee-ae9b-b30f07f55bbf" />
