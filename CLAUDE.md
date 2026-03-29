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
