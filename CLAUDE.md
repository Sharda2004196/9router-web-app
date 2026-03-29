# 9router web app

## Project Overview

This is a single-page marketing website for 9Router - a local proxy that routes Claude Code requests through free AI providers (iFlow, Kiro, Qwen, Gemini CLI) enabling developers to code at $0/month.

## Tech Stack

- Single HTML file (index.html)
- No framework, no build step
- Vanilla CSS with CSS variables
- Vanilla JavaScript for interactions
- GSAP 3.12.2 for scroll animations
- Deployable on GitHub Pages, Vercel, or Netlify

## Design System

### Colors
- Background: Radial gradient from dark red (#3d0f00) to black (#0a0a0a)
- Accent: #e84a1e (orange)
- Green: #3fb950
- Surface: #161b22
- Border: #30363d
- Text: #e6edf3
- Muted: #8b949e

### Typography
- Display/Headings: JetBrains Mono (monospace)
- Body: Inter
- Code: JetBrains Mono

### Components
- Floating pill navigation (max-width 700px, centered, sticky)
- Provider cards with colored letter badges (if, ki, qw, gc)
- Accordion FAQ section
- Scrolling ticker with model names
- Terminal block with blinking cursor
- SVG flow diagram with animated dot
- Stats with gradient text
- Feature comparison table

## Key Features

1. **Hero Section**: Terminal demo with blinking cursor
2. **Ticker**: Scrolling list of available free models
3. **Works With**: Compatible tools badges
4. **Built For**: Target audience cards
5. **How It Works**: SVG diagram with animated routing visualization
6. **Setup Guide**: 3-step installation with platform-specific commands (Mac/Linux, Windows PowerShell, Windows CMD)
7. **Providers**: 4 free provider cards (iFlow, Kiro, Qwen, Gemini CLI) with auth methods and models
8. **Trust Section**: Clear explanation that 9Router never charges
9. **Combos**: Ready-made configuration examples
10. **Features Table**: What 9Router does and why it matters
11. **FAQ**: 5 common questions with accordion UI
12. **Footer**: Links to GitHub, Docs, Issues, Changelog

## Animations

- GSAP scroll-triggered animations for sections and cards
- Hero headline fade-up on load
- Terminal lines appear sequentially
- Stats counter animation on scroll
- SVG arrows draw on scroll
- Animated orange dot traveling through routing diagram
- Card hover effects with translateY and box-shadow
- Blinking terminal cursor
- Scrolling ticker (CSS animation)
- FAQ accordion expand/collapse

## Mobile Responsive

- Hamburger menu for navigation on mobile
- 1-column grid for provider cards on small screens
- Reduced hero headline size
- Smaller code block font size
- Horizontal scroll for feature table

## Version

Current version: v0.3.64 (displayed in nav badge)

## Deployment

Single file deployment - just upload index.html to any static hosting:
- GitHub Pages
- Vercel
- Netlify
- Any CDN or web server

## Development Notes

- All animations respect `prefers-reduced-motion`
- Accessibility: aria-labels on all interactive elements, focus outlines visible
- SEO: Meta description and Open Graph tags included
- Favicon: Lightning bolt emoji (⚡) as SVG data URI
- No external dependencies except Google Fonts and GSAP CDN

## Session Rules
- At the end of every session, automatically update this CLAUDE.md with:
  - What was built
  - Issues encountered and fixes
  - Current project status
  - Next tasks
- Do this without being asked

---

## Session History

### Session: 2026-03-29 (13:29 IST)

**What Was Built:**
- Complete single-page marketing website for 9Router
- Enhanced README.md with deploy buttons, badges, and comprehensive documentation
- GitHub repository setup and deployment
- Vercel deployment with live URL
- Git repository initialization with proper commit history

**Key Features Implemented:**
- Hero section with terminal demo and blinking cursor
- Scrolling ticker with free model names
- "Works with" tools badges section
- "Built for developers who..." section
- SVG flow diagram with animated orange dot traveling through routing paths
- 3-step setup guide with platform-specific commands (Mac/Linux, Windows PowerShell, Windows CMD)
- 4 provider cards with colored letter badges (if, ki, qw, gc)
- Trust section explaining 9Router never charges
- 3 ready-made combo configurations
- Features comparison table
- FAQ accordion section (5 questions)
- Compatible tools section
- Footer with GitHub, Docs, Issues, Changelog links
- Version badge (v0.3.64) in navigation

**Design & Animations:**
- Radial gradient background (dark red to black)
- Floating pill navigation with orange accent (#e84a1e)
- GSAP scroll-triggered animations
- Card hover effects with translateY and box-shadow
- Stats with gradient text (orange gradient)
- Blinking terminal cursor
- SVG arrow drawing animation
- FAQ accordion functionality
- Mobile responsive with hamburger menu

**Issues Encountered & Fixes:**
1. **Vercel CLI not installed** → Installed globally with npm
2. **Project name validation error** → Used `--name` flag with valid project name
3. **Git not initialized** → Initialized git repository
4. **Git user not configured** → Set user.email and user.name
5. **GitHub CLI not available** → Created repository manually via web interface
6. **README had placeholder URLs** → Updated with actual GitHub username

**Deployments:**
- **Vercel:** https://9router-web-app.vercel.app (Live)
- **GitHub:** https://github.com/Sharda2004196/9router-web-app (Public)

**Current Project Status:**
✅ Website fully functional and deployed
✅ GitHub repository public and accessible
✅ README enhanced with all necessary documentation
✅ Vercel deployment live and working
✅ Git history clean with meaningful commits
✅ All animations and interactions working
✅ Mobile responsive design implemented
✅ Accessibility features included

**Next Tasks:**
- Consider adding a blog section for 9Router updates
- Add testimonials from real users (currently using placeholder data)
- Create a video demo for the hero section
- Add analytics tracking (Google Analytics or Plausible)
- Consider adding a newsletter signup form
- Add more provider integrations as they become available
- Create a changelog page for version updates
- Add social media meta tags for better sharing
- Consider adding a dark/light mode toggle
- Set up GitHub Actions for automated deployments
