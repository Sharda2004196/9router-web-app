# VibeKit Studio

A full-stack SaaS page builder application built with React, Netlify Functions, Prisma, and PostgreSQL.

## Features

✅ User authentication (signup, login, logout)  
✅ Visual page builder with drag-and-drop sections  
✅ 3 theme variants (minimal, modern, bold)  
✅ Contact form with submissions  
✅ View count tracking  
✅ Responsive design (mobile-first)  
✅ Accessibility (WCAG AAA)  
✅ Draft/published status  

## Tech Stack

**Frontend:** React 19, React Router, Vite, CSS Variables  
**Backend:** Netlify Functions, Prisma, PostgreSQL (Neon)  
**Auth:** JWT with HttpOnly cookies, bcrypt password hashing  

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your Neon DATABASE_URL and JWT_SECRET.

### 3. Run Database Migrations
```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start Development Server
```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:8888 (Netlify Dev)

## Project Structure

```
vibekit-studio/
├── netlify/functions/     # Serverless API endpoints
├── prisma/                # Database schema & migrations
├── src/
│   ├── pages/            # React components
│   ├── App.jsx           # Main app with routing
│   └── App.css           # Design system
├── .env                  # Environment variables
├── netlify.toml          # Netlify configuration
└── package.json
```

## API Endpoints

**Auth:**
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user

**Pages:**
- `GET /api/pages` - List user pages
- `POST /api/pages` - Create page
- `GET /api/pages/:slug` - Get page by slug
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page

**Contact:**
- `POST /api/contact` - Submit contact form

## Database Schema

```prisma
User {
  id, email, password, createdAt
  pages: Page[]
}

Page {
  id, userId, title, slug, status, theme, content (JSON)
  viewCount, createdAt, updatedAt
  contacts: ContactSubmission[]
}

ContactSubmission {
  id, pageId, name, email, message, createdAt
}
```

## Design System

**Colors:**
- Primary: #2563EB
- CTA: #F97316
- Background: #F8FAFC

**Typography:**
- Font: Plus Jakarta Sans
- Scale: 1rem base, 1.25rem h3, 1.5rem h2, 2rem h1

**Spacing:** 4pt/8dp scale  
**Transitions:** 150-300ms ease  
**Accessibility:** WCAG AAA compliant  

## Deployment

### Deploy to Netlify

```bash
netlify deploy --prod
```

Set environment variables in Netlify:
- `DATABASE_URL` - Neon connection string
- `JWT_SECRET` - Random 32+ character string

## Documentation

- [EXECUTION_PLAN.md](../EXECUTION_PLAN.md) - Implementation plan
- [PHASE1_COMPLETE.md](PHASE1_COMPLETE.md) - Database setup
- [PHASE2_COMPLETE.md](PHASE2_COMPLETE.md) - Backend API
- [PHASE3_COMPLETE.md](PHASE3_COMPLETE.md) - Frontend UI

## License

MIT

---

**Built with ❤️ using Claude Code**
