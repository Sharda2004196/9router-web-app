# 9Router × Claude Code

> **Use Claude Code for free.** Route requests through free AI providers — iFlow, Kiro, Qwen, Gemini CLI — and code at $0/month.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sharda2004196/9router-web-app)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://9router-web-app.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🚀 Live Demo

**[View Live Site →](https://9router-web-app.vercel.app)**

## 📖 What is 9Router?

9Router is a local proxy that runs on `http://localhost:20128/v1` and intelligently routes Claude Code requests through free AI providers. It translates API formats, tracks quota, auto-refreshes tokens, and provides seamless fallback routing: **Subscription → Cheap → Free**.

### Key Features

- ⚡ **Smart Fallback** — Auto-routes subscription → cheap → free providers
- 📊 **Quota Tracking** — Live token count + reset timer
- 🔄 **Format Translation** — OpenAI ↔ Claude ↔ Gemini compatibility
- 🌐 **Multi-Account** — Load balancing across multiple accounts
- ☁️ **Cloud Sync** — Sync config across devices
- 📈 **Usage Analytics** — Track tokens and optimize spending

## 🎯 Built For Developers Who...

- Hit Claude's 5-hour quota mid-session
- Run multiple AI tools simultaneously
- Want Claude-grade coding without the monthly bill
- Are juggling multiple API keys manually

## 🆓 Free Providers

| Provider | Auth Method | Models | Quota |
|----------|-------------|--------|-------|
| **iFlow** | OAuth login | glm-4.7, minimax-m2.1, kimi-k2-thinking, 5+ more | Unlimited |
| **Kiro** | AWS Builder ID | claude-opus-4-6, claude-sonnet-4-5, claude-haiku-4-5 | 50 credits/month (500 first month) |
| **Qwen** | Device auth | qwen3-coder-plus | Unlimited |
| **Gemini CLI** | Google OAuth | gemini-3-flash, gemini-2.5-pro | 180K/month |

## 🛠️ Tech Stack

- **Single HTML file** — No framework, no build step
- **Vanilla CSS** with CSS variables
- **Vanilla JavaScript** for interactions
- **GSAP 3.12.2** for scroll animations
- **Deployable anywhere** — GitHub Pages, Vercel, Netlify

## 🎨 Design System

### Colors
```css
--bg: #0d1117          /* GitHub dark background */
--surface: #161b22     /* Card backgrounds */
--border: #30363d      /* Subtle borders */
--accent: #e84a1e      /* Orange accent */
--green: #3fb950       /* Success/free badges */
--text: #e6edf3        /* Primary text */
--muted: #8b949e       /* Secondary text */
```

### Typography
- **Display/Headings:** JetBrains Mono (monospace)
- **Body:** Inter
- **Code:** JetBrains Mono

## 📦 Installation

### Quick Start (3 Steps)

1. **Install 9Router**
   ```bash
   npm install -g 9router
   ```

2. **Start & Connect Providers**
   ```bash
   9router
   # Dashboard opens at: http://localhost:20128
   ```

3. **Configure Claude Code**

   **Mac/Linux:**
   ```bash
   export ANTHROPIC_BASE_URL="http://localhost:20128/v1"
   export ANTHROPIC_AUTH_TOKEN="9router"
   ```

   **Windows (PowerShell):**
   ```powershell
   $env:ANTHROPIC_BASE_URL="http://localhost:20128/v1"
   $env:ANTHROPIC_AUTH_TOKEN="9router"
   ```

## 🌐 Deploy Your Own

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sharda2004196/9router-web-app)

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Sharda2004196/9router-web-app)

### Manual Deployment

1. Clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/9router-web-app.git
   cd 9router-web-app
   ```

2. Deploy the `index.html` file to any static hosting service

## 🎬 Animations

- GSAP scroll-triggered animations for sections and cards
- Hero headline fade-up on load
- Terminal lines appear sequentially
- Stats counter animation on scroll
- SVG arrows draw on scroll with animated routing dot
- Card hover effects with translateY and box-shadow
- Blinking terminal cursor
- Scrolling ticker (CSS animation)
- FAQ accordion expand/collapse

## 📱 Mobile Responsive

- Hamburger menu for navigation on mobile
- 1-column grid for provider cards on small screens
- Reduced hero headline size
- Optimized code block font size
- Horizontal scroll for feature table

## ♿ Accessibility

- All animations respect `prefers-reduced-motion`
- ARIA labels on all interactive elements
- Visible focus outlines (2px solid accent color)
- WCAG AA color contrast compliance
- Keyboard navigation support

## 🔧 Development

### Local Development

Simply open `index.html` in your browser. No build step required!

### Project Structure

```
9router-web-app/
├── index.html          # Single-page website
├── CLAUDE.md          # Project documentation
└── README.md          # This file
```

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- **Live Demo:** [9router-web-app.vercel.app](https://9router-web-app.vercel.app)
- **9Router GitHub:** [github.com/decolua/9router](https://github.com/decolua/9router)
- **9Router Docs:** [github.com/decolua/9router/wiki](https://github.com/decolua/9router/wiki)
- **Issues:** [github.com/decolua/9router/issues](https://github.com/decolua/9router/issues)
- **Changelog:** [github.com/decolua/9router/releases](https://github.com/decolua/9router/releases)

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ for developers who want to code without limits**

Version: v0.3.64
