# VibeKit Studio — Claude Code Execution Plan
> Purple Merit Technologies | Full Stack Vibe Coder Intern Assessment
> Deadline: 4th April 2026, 10:00 AM IST | ~72 hours from start

---

## CONTEXT FOR CLAUDE CODE

You are building **VibeKit Studio** — a full-stack web app where users can select a design "vibe" (theme), build a mini-site using a page builder, and publish it to a public URL.

**Constraints (non-negotiable):**
- Frontend: React (Vite)
- Deployment: **Netlify** (NOT Vercel)
- Backend: **Netlify Functions** (serverless, Node.js)
- Database: **PostgreSQL via Neon** (free tier) + **Prisma ORM**
- Auth: Email + password, bcrypt hashed, JWT in httpOnly cookies
- No secrets committed to repo — Netlify env vars only

---

## TECH STACK

```
Frontend:   React (Vite) + React Router v6
Styling:    Plain CSS with CSS custom properties (design tokens) — NO Tailwind
Animations: GSAP or CSS keyframes
Backend:    Netlify Functions (Node.js 18)
ORM:        Prisma
Database:   Neon PostgreSQL (free)
Auth:       bcryptjs + jsonwebtoken (httpOnly cookie)
Deploy:     Netlify (frontend + functions together)
```

---

## PROJECT STRUCTURE

```
vibekit-studio/
├── netlify/
│   └── functions/
│       ├── auth-signup.js
│       ├── auth-login.js
│       ├── auth-logout.js
│       ├── pages-list.js
│       ├── pages-create.js
│       ├── pages-get.js
│       ├── pages-update.js
│       ├── pages-publish.js
│       ├── pages-unpublish.js
│       ├── pages-duplicate.js
│       ├── public-page.js
│       ├── public-view.js
│       └── public-contact.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles/
│   │   ├── global.css         ← CSS reset + base
│   │   ├── tokens.css         ← All CSS custom properties
│   │   └── themes.css         ← 6 vibe theme classes
│   ├── pages/
│   │   ├── Landing.jsx        ← /
│   │   ├── Login.jsx          ← /login
│   │   ├── Signup.jsx         ← /signup
│   │   ├── Dashboard.jsx      ← /app
│   │   ├── Editor.jsx         ← /app/editor/:id
│   │   └── PublishedPage.jsx  ← /p/:slug
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ThemePicker.jsx
│   │   ├── PageCard.jsx
│   │   ├── SectionEditor/
│   │   │   ├── HeroEditor.jsx
│   │   │   ├── FeaturesEditor.jsx
│   │   │   ├── GalleryEditor.jsx
│   │   │   └── ContactEditor.jsx
│   │   ├── PreviewFrame.jsx   ← iframe-based live preview
│   │   └── MiniSite/
│   │       ├── HeroSection.jsx
│   │       ├── FeaturesSection.jsx
│   │       ├── GallerySection.jsx
│   │       └── ContactSection.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useAutoSave.js
│   └── lib/
│       ├── api.js             ← fetch wrapper for all API calls
│       └── themes.js          ← theme preset definitions
├── public/
│   └── _redirects             ← Netlify SPA routing fix
├── netlify.toml
├── vite.config.js
├── package.json
└── .env.example
```

---

## PHASE 1 — PROJECT SETUP & DATABASE (Day 1, ~3 hours)

### Step 1.1 — Scaffold the project

```bash
npm create vite@latest vibekit-studio -- --template react
cd vibekit-studio
npm install
npm install react-router-dom
npm install -D netlify-cli
```

### Step 1.2 — Install backend dependencies

```bash
npm install @prisma/client bcryptjs jsonwebtoken cookie
npm install -D prisma
npx prisma init
```

### Step 1.3 — Prisma Schema

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  pages     Page[]
}

model Page {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String
  slug        String   @unique
  status      String   @default("draft") // draft | published
  theme       String   @default("minimal")
  content     Json     // stores all section data as JSON
  viewCount   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  contacts    ContactSubmission[]
}

model ContactSubmission {
  id        String   @id @default(cuid())
  pageId    String
  page      Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)
  name      String
  email     String
  message   String
  createdAt DateTime @default(now())
}
```

### Step 1.4 — Neon DB Setup

1. Go to neon.tech → create free project → copy connection string
2. Create `.env`:
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-random-32-char-secret"
```
3. Add `.env` to `.gitignore`
4. Run: `npx prisma migrate dev --name init`
5. Run: `npx prisma generate`

### Step 1.5 — Netlify config

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[dev]
  command = "npm run dev"
  port = 8888
  targetPort = 5173

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Create `public/_redirects`:
```
/api/*  /.netlify/functions/:splat  200
/*      /index.html                 200
```

---

## PHASE 2 — BACKEND: NETLIFY FUNCTIONS (Day 1, ~4 hours)

Create a shared Prisma client helper `netlify/functions/_prisma.js`:

```js
const { PrismaClient } = require('@prisma/client')
let prisma
if (!global.__prisma) {
  global.__prisma = new PrismaClient()
}
prisma = global.__prisma
module.exports = prisma
```

Create a shared auth helper `netlify/functions/_auth.js`:

```js
const jwt = require('jsonwebtoken')
const cookie = require('cookie')

function verifyToken(event) {
  const cookies = cookie.parse(event.headers.cookie || '')
  const token = cookies.token
  if (!token) throw new Error('Unauthorized')
  return jwt.verify(token, process.env.JWT_SECRET)
}

function setCookieHeader(token) {
  return cookie.serialize('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
}

module.exports = { verifyToken, setCookieHeader }
```

### Auth Functions

**`auth-signup.js`**
- Parse body: { email, password }
- Validate: email format, password >= 8 chars
- Check if user exists → 409 if yes
- Hash password: `bcrypt.hash(password, 10)`
- Create user in DB
- Sign JWT: `jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })`
- Return 201 with Set-Cookie header

**`auth-login.js`**
- Parse body: { email, password }
- Find user by email → 401 if not found
- `bcrypt.compare(password, user.password)` → 401 if fails
- Sign JWT, return 200 with Set-Cookie

**`auth-logout.js`**
- Return 200 with expired cookie (maxAge: 0)

### Pages Functions (all require verifyToken)

**`pages-list.js`** (GET)
- verifyToken → get userId
- `prisma.page.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } })`
- Return array (exclude content JSON for performance)

**`pages-create.js`** (POST)
- verifyToken
- Parse body: { title, theme }
- Auto-generate slug from title: `title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')`
- Check slug collision → append `-2`, `-3` etc.
- Create page with default content JSON structure
- Return created page

**Default content JSON structure:**
```json
{
  "hero": {
    "title": "Welcome",
    "subtitle": "Your tagline here",
    "buttonText": "Get Started",
    "buttonUrl": "#"
  },
  "features": [
    { "title": "Feature 1", "description": "Short description" },
    { "title": "Feature 2", "description": "Short description" },
    { "title": "Feature 3", "description": "Short description" }
  ],
  "gallery": [
    "https://picsum.photos/seed/1/800/600",
    "https://picsum.photos/seed/2/800/600",
    "https://picsum.photos/seed/3/800/600"
  ],
  "contact": {
    "heading": "Get in Touch"
  }
}
```

**`pages-get.js`** (GET /:id)
- verifyToken
- `prisma.page.findFirst({ where: { id, userId } })` ← userId check = security
- 404 if not found or not owned

**`pages-update.js`** (PUT /:id)
- verifyToken
- Parse body: { title?, theme?, content?, slug? }
- Re-validate slug collision if slug changed
- `prisma.page.update({ where: { id }, data: {...} })`
- Only update fields that were passed

**`pages-publish.js`** (POST /:id/publish)
- verifyToken + ownership check
- `prisma.page.update({ where: { id }, data: { status: 'published' } })`

**`pages-unpublish.js`** (POST /:id/unpublish)
- verifyToken + ownership check
- `prisma.page.update({ where: { id }, data: { status: 'draft' } })`

**`pages-duplicate.js`** (POST /:id/duplicate)
- verifyToken + ownership check
- Fetch original page
- Create new page: same content/theme, title = "Copy of X", new slug, status = draft

### Public Functions (no auth)

**`public-page.js`** (GET /public/pages/:slug)
- `prisma.page.findFirst({ where: { slug, status: 'published' } })`
- 404 if not found
- Return full page data including content + theme

**`public-view.js`** (POST /public/pages/:slug/view)
- `prisma.page.update({ where: { slug }, data: { viewCount: { increment: 1 } } })`
- Return { viewCount }

**`public-contact.js`** (POST /public/pages/:slug/contact)
- Parse body: { name, email, message }
- Validate all fields present
- Find page by slug
- `prisma.contactSubmission.create({ data: { pageId, name, email, message } })`
- Return 201

---

## PHASE 3 — THEME SYSTEM (Day 1, ~1 hour)

Create `src/lib/themes.js`:

```js
export const THEMES = {
  minimal: {
    name: 'Minimal / Editorial',
    vars: {
      '--bg': '#FAFAF8',
      '--surface': '#FFFFFF',
      '--text': '#1A1A1A',
      '--text-muted': '#666666',
      '--accent': '#1A1A1A',
      '--accent-text': '#FFFFFF',
      '--radius': '2px',
      '--font-display': "'Playfair Display', serif",
      '--font-body': "'DM Sans', sans-serif",
      '--btn-style': 'solid',
      '--border': '#E5E5E5',
      '--shadow': '0 1px 3px rgba(0,0,0,0.08)',
    }
  },
  neobrutал: {
    name: 'Neo-Brutal',
    vars: {
      '--bg': '#F5F500',
      '--surface': '#FFFFFF',
      '--text': '#0A0A0A',
      '--text-muted': '#333333',
      '--accent': '#0A0A0A',
      '--accent-text': '#F5F500',
      '--radius': '0px',
      '--font-display': "'Space Mono', monospace",
      '--font-body': "'Space Mono', monospace",
      '--btn-style': 'brutal',
      '--border': '#0A0A0A',
      '--shadow': '4px 4px 0px #0A0A0A',
    }
  },
  darkneon: {
    name: 'Dark / Neon',
    vars: {
      '--bg': '#0D0D0D',
      '--surface': '#1A1A1A',
      '--text': '#F0F0F0',
      '--text-muted': '#888888',
      '--accent': '#00FF94',
      '--accent-text': '#0D0D0D',
      '--radius': '6px',
      '--font-display': "'Syne', sans-serif",
      '--font-body': "'Inter', sans-serif",
      '--btn-style': 'glow',
      '--border': '#2A2A2A',
      '--shadow': '0 0 20px rgba(0,255,148,0.3)',
    }
  },
  pastel: {
    name: 'Pastel / Soft',
    vars: {
      '--bg': '#FFF5F5',
      '--surface': '#FFFFFF',
      '--text': '#2D2D2D',
      '--text-muted': '#888888',
      '--accent': '#FF8FAB',
      '--accent-text': '#FFFFFF',
      '--radius': '16px',
      '--font-display': "'Fraunces', serif",
      '--font-body': "'Nunito', sans-serif",
      '--btn-style': 'rounded',
      '--border': '#FFD6E0',
      '--shadow': '0 4px 20px rgba(255,143,171,0.15)',
    }
  },
  luxury: {
    name: 'Luxury / Serif',
    vars: {
      '--bg': '#0C0C0A',
      '--surface': '#161610',
      '--text': '#E8E0D0',
      '--text-muted': '#8A8070',
      '--accent': '#C9A84C',
      '--accent-text': '#0C0C0A',
      '--radius': '1px',
      '--font-display': "'Cormorant Garamond', serif",
      '--font-body': "'Jost', sans-serif",
      '--btn-style': 'outline-gold',
      '--border': '#2A2820',
      '--shadow': '0 2px 12px rgba(201,168,76,0.1)',
    }
  },
  retro: {
    name: 'Retro / Pixel',
    vars: {
      '--bg': '#1A1A2E',
      '--surface': '#16213E',
      '--text': '#E0E0E0',
      '--text-muted': '#A0A0C0',
      '--accent': '#E94560',
      '--accent-text': '#FFFFFF',
      '--radius': '0px',
      '--font-display': "'Press Start 2P', monospace",
      '--font-body': "'VT323', monospace",
      '--btn-style': 'pixel',
      '--border': '#E94560',
      '--shadow': '3px 3px 0px #E94560',
    }
  }
}
```

Create `src/styles/themes.css` — apply theme vars to a `.theme-[name]` class on the mini-site wrapper. This ensures published page = preview exactly.

---

## PHASE 4 — FRONTEND CORE (Day 2, ~6 hours)

### Step 4.1 — Global CSS Setup

`src/styles/global.css`:
- CSS reset (box-sizing, margin 0, etc.)
- Import Google Fonts: Playfair Display, DM Sans, Space Mono, Syne, Fraunces, Nunito, Cormorant Garamond, Jost, Press Start 2P, VT323
- Base typography using `--font-body`
- Responsive container utility

`src/styles/tokens.css`:
- All spacing, radius, shadow, color design tokens
- Media query breakpoints as comments for reference

### Step 4.2 — API Client

`src/lib/api.js` — fetch wrapper:
```js
const BASE = '/api'

async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    credentials: 'include', // sends httpOnly cookie
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Request failed')
  }
  return res.json()
}

export const api = {
  signup: (data) => req('POST', '/auth/signup', data),
  login: (data) => req('POST', '/auth/login', data),
  logout: () => req('POST', '/auth/logout'),
  getPages: () => req('GET', '/pages'),
  createPage: (data) => req('POST', '/pages', data),
  getPage: (id) => req('GET', `/pages/${id}`),
  updatePage: (id, data) => req('PUT', `/pages/${id}`, data),
  publishPage: (id) => req('POST', `/pages/${id}/publish`),
  unpublishPage: (id) => req('POST', `/pages/${id}/unpublish`),
  duplicatePage: (id) => req('POST', `/pages/${id}/duplicate`),
  getPublicPage: (slug) => req('GET', `/public/pages/${slug}`),
  incrementView: (slug) => req('POST', `/public/pages/${slug}/view`),
  submitContact: (slug, data) => req('POST', `/public/pages/${slug}/contact`, data),
}
```

### Step 4.3 — Auth Hook

`src/hooks/useAuth.js`:
- useState for user
- On mount: fetch `/api/auth/me` (add this lightweight endpoint) to restore session
- login(), logout(), signup() methods
- Return { user, loading, login, logout, signup }

### Step 4.4 — React Router Setup

`src/App.jsx`:
```jsx
<Router>
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/app/editor/:id" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
    <Route path="/p/:slug" element={<PublishedPage />} />
  </Routes>
</Router>
```

ProtectedRoute: if no user → redirect to /login.

### Step 4.5 — Landing Page `/`

Sections:
1. **Hero** — "Generate a theme, build a mini-site, publish it." Big heading, CTA button "Create your first page" → /signup
2. **How it works** — 3-step flow (Pick a vibe → Build your page → Publish)
3. **Theme Showcase** — Show 3 static theme previews (Minimal, Dark/Neon, Neo-Brutal) as card mockups
4. **Footer**

Design direction: Use the `minimal` theme aesthetic for the landing itself — clean, editorial. Big display type. High contrast.

### Step 4.6 — Auth Pages (Login / Signup)

- Centered card layout
- Email + password fields
- Error display
- Link to switch between login/signup
- Loading state on button

### Step 4.7 — Dashboard `/app`

Layout:
- Top navbar with logo + logout
- "New Page" button → opens modal (title + theme picker)
- Grid of PageCards (title, status badge, view count, updated date)
- Each card: Edit | Duplicate | Delete actions

PageCard component:
- Status badge: "Published" (green) / "Draft" (gray)
- Actions row with icon buttons

Empty state: illustrated/styled empty state when no pages yet.

### Step 4.8 — Editor `/app/editor/:id`

**Layout (split view):**
```
┌─────────────────┬──────────────────────────────┐
│  Left Panel     │  Right Panel (Preview)        │
│  - Theme picker │  ┌─────────────────────────┐  │
│  - Section list │  │  [Desktop|Tablet|Mobile] │  │
│  - Section      │  │                         │  │
│    editors      │  │   Live iframe preview   │  │
│                 │  │                         │  │
│  [Save] [Pub]   │  └─────────────────────────┘  │
└─────────────────┴──────────────────────────────┘
```

**Preview toggle behavior:**
- Desktop: iframe width = 100%
- Tablet: iframe width = 768px, centered
- Mobile: iframe width = 375px, centered
- These must change actual layout width, NOT just zoom

**Live preview implementation:**
- Render MiniSite components inside an `<iframe srcdoc={...}>` OR use a same-page preview panel
- Recommended: render preview in a `<div>` with a CSS `transform: scale()` + fixed width container for the different viewport sizes
- Content data flows from editor state → preview in real time

**Section editors** (left panel accordion):
- Hero: inputs for title, subtitle, button text, button URL
- Features: add/remove feature cards (title + description)
- Gallery: add/remove image URLs with preview thumbnails
- Contact: just a heading input (form itself is static)
- Reorder: up/down arrow buttons on each section

**Auto-save:**
- Debounce 1.5s after last change
- Show "Saving..." → "Saved ✓" state in top bar

**Publish/Unpublish toggle:**
- Button in top bar
- On publish: update status → show live URL

**Slug display:**
- Show current slug below title
- Edit button to change it
- Validate uniqueness on blur

### Step 4.9 — MiniSite Components

These render the actual published look. Used in both Preview (editor) and PublishedPage.

Each section reads from CSS variables set by the active theme class.

**HeroSection.jsx:**
```jsx
<section className="hero" style={{ background: 'var(--bg)' }}>
  <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
    {hero.title}
  </h1>
  <p style={{ color: 'var(--text-muted)' }}>{hero.subtitle}</p>
  <a href={hero.buttonUrl} className={`btn btn--${theme}`}>{hero.buttonText}</a>
</section>
```

**FeaturesSection.jsx:** Grid of cards (1 col mobile, 2 col tablet, 3 col desktop)

**GallerySection.jsx:** CSS grid of images (masonry-ish or uniform)

**ContactSection.jsx:** Form with name, email, message — on submit calls `api.submitContact(slug, data)`

### Step 4.10 — PublishedPage `/p/:slug`

- On mount: `api.getPublicPage(slug)` — 404 if not found/unpublished
- On mount: `api.incrementView(slug)` (fire and forget)
- Apply theme class to wrapper div
- Render all 4 MiniSite sections
- Show view count somewhere (footer?)
- Must be fast: no auth checks, pure public render

---

## PHASE 5 — DESIGN EXTRAS (Choose 3) (Day 2, ~2 hours)

**Recommended picks for max impact:**

### Extra 1 — Micro-interactions
- Buttons: `transform: translateY(-2px)` on hover, `scale(0.97)` on active
- Cards: subtle lift shadow on hover
- Form inputs: focus ring using `--accent` color
- All transitions: `transition: all 0.15s ease`

### Extra 2 — Subtle Animations
- Landing page: staggered fade-up on sections using Intersection Observer
- Dashboard cards: stagger in on load
- Section editors: slide-in animation when opening
- Preview panel: smooth width transition on viewport toggle

### Extra 3 — Skeleton Loaders
- Dashboard: skeleton cards while pages are loading
- Editor: skeleton for preview while content loads
- PublishedPage: skeleton sections before data arrives
- Implement with CSS animation: `@keyframes shimmer`

---

## PHASE 6 — RESPONSIVENESS PASS (Day 3, ~2 hours)

Test and fix at exactly these widths: **320px, 375px, 768px, 1024px, 1280px**

**Checklist:**
- [ ] No horizontal scroll at 320px
- [ ] Touch targets ≥ 44px (buttons, nav items)
- [ ] Hamburger menu or mobile nav (no hover-only)
- [ ] Dashboard grid: 1 col (mobile), 2 col (tablet), 3 col (desktop)
- [ ] Editor: stacked layout on mobile (preview above/below editor)
- [ ] MiniSite sections all stack to 1 col on mobile
- [ ] Gallery grid: 1 col mobile, 2 col tablet, 3 col desktop
- [ ] Forms: full width on mobile, padded properly
- [ ] Typography scales down gracefully (use `clamp()`)

**CSS breakpoints to use consistently:**
```css
/* Mobile first */
@media (min-width: 768px) { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
@media (min-width: 1280px) { /* wide desktop */ }
```

---

## PHASE 7 — NETLIFY DEPLOY (Day 3, ~1.5 hours)

### Step 7.1 — Environment Variables in Netlify

In Netlify dashboard → Site settings → Environment variables:
```
DATABASE_URL = <your neon connection string>
JWT_SECRET   = <your secret>
```

### Step 7.2 — Prisma in Netlify Functions

Add to `package.json` scripts:
```json
"scripts": {
  "build": "prisma generate && vite build",
  "postinstall": "prisma generate"
}
```

### Step 7.3 — Deploy Checklist
- [ ] `netlify.toml` correctly configured
- [ ] `public/_redirects` in place (SPA routing + API routing)
- [ ] All env vars set in Netlify dashboard
- [ ] No `.env` file committed
- [ ] Deep link `/p/my-slug` works after page refresh
- [ ] `/app` redirect works after page refresh
- [ ] API calls work in production (test in browser network tab)

### Step 7.4 — Run Production Test
1. Sign up with test user
2. Create a page
3. Edit all sections
4. Switch themes — verify preview updates
5. Publish → open `/p/slug` in incognito
6. Submit contact form
7. Unpublish → verify 404 in incognito
8. Duplicate page

---

## PHASE 8 — README + SUBMISSION (Day 3, ~1 hour)

### README.md structure:

```md
# VibeKit Studio

> Generate a theme, build a mini-site, publish it.

**Live URL:** https://your-site.netlify.app
**Demo credentials:** test@vibekit.com / password123

## Local Setup

1. Clone the repo
2. `npm install`
3. Copy `.env.example` to `.env` and fill in values
4. `npx prisma migrate dev`
5. `npx prisma generate`
6. `netlify dev` (starts both Vite + Functions locally)

## Required Env Vars

| Variable | Description |
|----------|-------------|
| DATABASE_URL | Neon PostgreSQL connection string |
| JWT_SECRET | Random 32+ char secret for JWT signing |

## Auth Implementation

JWT stored in httpOnly cookie (not localStorage). Token expires in 7 days.
Server validates token on every authenticated request.

## Tradeoffs + What I'd Improve Next

1. **Image uploads**: Currently accepts URLs only — would add Cloudinary/S3 uploads
2. **Real-time collaboration**: Would use WebSockets for multi-user editing
3. **More section types**: CTA, testimonials, pricing table
4. **Custom domain mapping**: Let users map their own domain to /p/:slug
5. **Analytics dashboard**: Detailed view breakdown by day/device
```

### Submission email:
- To: career@purplemerit.com
- Subject: Full Stack Vibe Coder Intern Assessment Submission - [Your Name]
- File: Full Stack Vibe Coder Intern_[Your_Name]_March2026 (the README or a summary doc)
- Attach: screen recording (1-2 min)

---

## EXECUTION ORDER SUMMARY

| Phase | Task | Time | Day |
|-------|------|------|-----|
| 1 | Project setup + DB + Netlify config | 3h | Day 1 |
| 2 | All Netlify Functions (API) | 4h | Day 1 |
| 3 | Theme system (6 presets, CSS vars) | 1h | Day 1 |
| 4 | Frontend: Landing + Auth + Dashboard | 3h | Day 2 |
| 4 cont. | Frontend: Editor + MiniSite components | 3h | Day 2 |
| 5 | Design extras (3 chosen) | 2h | Day 2 |
| 6 | Responsiveness pass | 2h | Day 3 |
| 7 | Netlify deploy + production testing | 1.5h | Day 3 |
| 8 | README + screen recording + submit | 1h | Day 3 |
| **Buffer** | Bug fixes, polish | 1.5h | Day 3 |

**Total: ~22 hours across 3 days ✅**

---

## CRITICAL THINGS TO NOT MESS UP

1. **Never trust client for ownership** — always verify `page.userId === req.userId` server-side before any page mutation
2. **Published page = Preview** — both must use the same MiniSite components + same CSS variable application
3. **Slug collisions** — handle gracefully: `my-page`, `my-page-2`, `my-page-3`
4. **httpOnly cookie** — set `credentials: 'include'` on every fetch call
5. **Prisma in serverless** — use the global singleton pattern to avoid connection limit issues on Neon free tier
6. **SPA routing on Netlify** — the `_redirects` file is mandatory or `/p/:slug` will 404 on refresh
7. **No secrets in code** — all env vars via `process.env.X` in functions, never hardcoded

---

*Good luck — ship it clean.*
