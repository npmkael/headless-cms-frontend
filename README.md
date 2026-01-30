# Positivus - Headless CMS

A production-quality, responsive Next.js template with a headless CMS admin dashboard for managing website content.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (JWT-based)

## Features

### Public Website

- Responsive design (Mobile 375px, Tablet 768px, Desktop 1280px+)
- Dynamic content fetched from CMS
- Contact form with database storage

### Admin Dashboard

- Protected routes with authentication
- CRUD operations for:
  - Services
  - Case Studies
  - Working Processes
  - Team Members
  - Testimonials
- Contact form submissions viewer with status filtering

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase account (free tier works)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd headless-cms
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under **Settings > API**.

### 4. Database Setup

#### Create Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Case Studies table
CREATE TABLE case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  cover_image_url TEXT,
  link_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Working Processes table
CREATE TABLE working_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_no INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_url TEXT,
  socials_json TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role_company TEXT NOT NULL,
  message TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Submissions table
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. Seed Data

Run the following SQL to insert sample data:

```sql
-- Seed Admin User (1 item)
-- Note: Password hash is for 'Admin123!' using bcrypt
-- The actual authentication is handled by Supabase Auth (see step 6)
INSERT INTO users (email, password_hash, role) VALUES
('admin@positivus.com', '$2a$10$PwJpXvFz3g8ZkQZJqK5HXuVJYvBhqXCQVHNBKQPZ6TpGkVqLqBnPy', 'admin');

-- Seed Services (4 items)
INSERT INTO services (title, description, sort_order, is_active) VALUES
('Search Engine Optimization', 'Boost your online visibility and drive organic traffic with our expert SEO strategies tailored to your business goals.', 1, true),
('Pay-per-Click Advertising', 'Maximize your ROI with targeted PPC campaigns that reach your ideal customers at the right time.', 2, true),
('Social Media Marketing', 'Build brand awareness and engage with your audience through strategic social media management.', 3, true),
('Content Marketing', 'Create compelling content that resonates with your audience and establishes your brand as an industry leader.', 4, true);

-- Seed Case Studies (3 items)
INSERT INTO case_studies (title, short_description, link_url, sort_order, is_active) VALUES
('E-commerce Growth Strategy', 'Increased online sales by 250% through integrated digital marketing campaigns.', '#', 1, true),
('B2B Lead Generation', 'Generated 500+ qualified leads per month for a SaaS company using targeted content marketing.', '#', 2, true),
('Brand Awareness Campaign', 'Achieved 10M+ impressions and 40% increase in brand recognition for a startup.', '#', 3, true);

-- Seed Working Processes (4 items)
INSERT INTO working_processes (step_no, title, description, sort_order, is_active) VALUES
(1, 'Discovery & Research', 'We dive deep into understanding your business, target audience, and competitive landscape to create a solid foundation.', 1, true),
(2, 'Strategy Development', 'Based on our research, we develop a comprehensive digital marketing strategy aligned with your goals.', 2, true),
(3, 'Implementation', 'Our expert team executes the strategy across all relevant channels with precision and creativity.', 3, true),
(4, 'Monitoring & Optimization', 'We continuously track performance and optimize campaigns to maximize your ROI.', 4, true);

-- Seed Team Members (3 items)
INSERT INTO team_members (name, role, sort_order, is_active) VALUES
('John Smith', 'CEO & Founder', 1, true),
('Jane Doe', 'Marketing Director', 2, true),
('Mike Johnson', 'Lead Developer', 3, true);

-- Seed Testimonials (3 items)
INSERT INTO testimonials (name, role_company, message, rating, sort_order, is_active) VALUES
('Sarah Williams', 'CEO at TechStart', 'Working with Positivus transformed our digital presence. Their strategic approach delivered results beyond our expectations.', 5, 1, true),
('David Chen', 'Marketing Manager at GrowthCo', 'The team expertise in SEO and content marketing helped us achieve top rankings and significant traffic growth.', 5, 2, true),
('Emily Brown', 'Founder at StartupX', 'Professional, responsive, and results-driven. Highly recommend their services to any business looking to grow online.', 5, 3, true);
```

### 6. Create Admin User in Supabase Auth

The seed data above creates a record in the `users` table. You also need to create the user in Supabase Auth for login to work:

1. Go to your Supabase dashboard
2. Navigate to **Authentication > Users**
3. Click **Add User** → **Create new user**
4. Enter the admin credentials:
   - **Email**: `admin@positivus.com`
   - **Password**: `Admin123!`
5. Click **Create user**

**Admin Credentials:**

```
Email: admin@positivus.com
Password: Admin123!
```

> **Note**: The `users` table stores user metadata as required by the exam schema, while Supabase Auth handles the actual authentication (password verification, session management, JWT tokens).

### 7. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin dashboard.

## Admin Routes

| Route                        | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| `/admin/login`               | Admin login page                                 |
| `/admin/services`            | Manage services (CRUD)                           |
| `/admin/case-studies`        | Manage case studies (CRUD)                       |
| `/admin/working-processes`   | Manage working processes (CRUD)                  |
| `/admin/team-members`        | Manage team members (CRUD)                       |
| `/admin/testimonials`        | Manage testimonials (CRUD)                       |
| `/admin/contact-submissions` | View contact form submissions (filter by status) |

## Project Structure

```
├── app/
│   ├── (admin)/           # Admin dashboard
│   │   ├── admin/         # Admin pages
│   │   └── components/    # Admin-specific components
│   └── (public)/          # Public website
│       ├── components/    # Public components
│       └── page.tsx       # Homepage
├── components/            # Shared components
├── lib/
│   ├── supabase/          # Supabase client configuration
│   └── database.types.ts  # TypeScript types for database
└── middleware.ts          # Route protection
```

## API Endpoints

The application uses Supabase's auto-generated REST API:

### Public Endpoints (Read-only for active content)

- `GET /rest/v1/services?is_active=eq.true`
- `GET /rest/v1/case_studies?is_active=eq.true`
- `GET /rest/v1/working_processes?is_active=eq.true`
- `GET /rest/v1/team_members?is_active=eq.true`
- `GET /rest/v1/testimonials?is_active=eq.true`
- `POST /rest/v1/contact_submissions` (public can submit)

### Admin Endpoints (Authenticated)

Full CRUD access to all tables when authenticated.

## License

MIT
