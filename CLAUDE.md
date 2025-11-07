# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Shopify theme called "Vitamin" based on the Prestige theme framework (v10.5.1). It's an e-commerce theme for a health supplement store with custom features and styling.

## Development Commands

### Shopify Theme Development
- `npm run dev` - Start development server with live reload (connects to vitaminh2.myshopify.com theme ID 190719852875)
- `npm run push` - Push local changes to the Shopify store
- `npm run pull` - Pull changes from the Shopify store to local

### CSS Development
- `npm run tail` - Watch and compile Tailwind CSS (from `./assets/tailwind.input.css` to `./assets/tailwind.output.css`)

### Development Workflow
When developing with both Shopify and Tailwind changes, run both commands in separate terminals:
1. Terminal 1: `npm run dev` (Shopify theme development)
2. Terminal 2: `npm run tail` (Tailwind CSS compilation)

Note: No test suite is configured (`npm test` returns an error).

## Architecture & Structure

### Theme Structure (Shopify Liquid)
- **`layout/theme.liquid`** - Main theme layout with head, body, and script imports
- **`sections/`** - Modular content sections (75+ sections including landing pages, testimonials, product displays)
- **`templates/`** - Page templates for different content types (product, collection, blog, etc.) with specialized templates for landing pages, studies, and A/B testing
- **`snippets/`** - Reusable code snippets (80+ snippets including custom icons, product cards, ecom integrations)
- **`config/settings_schema.json`** - Theme customization settings schema (950+ lines)
- **`locales/`** - Internationalization files for multi-language support

### CSS & Styling
- **Tailwind CSS 4.x** - Primary CSS framework
- **Custom CSS files**: `theme.css`, `custom.css`, specialized CSS for testimonials, studies, and blog posts
- **Custom fonts**: Hoss Round and Duckie fonts with configurable settings
- Theme uses a sophisticated color scheme system with configurable options

### JavaScript
- **ES Modules architecture** with importmap support
- **`assets/theme.js`** - Main theme JavaScript
- **`assets/vendor.min.js`** - Third-party dependencies
- **PhotoSwipe integration** for image galleries
- ES module shims for older browser support

### Key Features
- **Custom vitamin/supplement focused sections** (ingredient displays, health tips, testimonials)
- **Landing page variants** with A/B testing templates (`page.landing1.json`, `page.landing-page-a-b-testing.json`)
- **Study/research content system** with dedicated templates and search functionality:
  - `page.study.json` and `page.study-detail.json` templates
  - `sections/study-search.liquid` and `sections/study-detail.liquid`
  - `assets/study.js` and `assets/study.css` for study-specific functionality
- **Advanced product features** (quick buy, color swatches, ratings)
- **Multiple testimonial systems** (text, video, custom testimonials)
- **Responsive design** with mobile-first approach
- **Third-party integrations** via ecom snippets (filters, predictive search, product hooks)

### Customization System
The theme uses Shopify's native settings system with extensive customization options:
- Typography (custom fonts with Hoss Round/Duckie options)
- Color schemes and theming
- Animation preferences
- Product card displays
- Cart functionality

## Important Files
- **`package.json`** - Contains all npm scripts and dependencies
- **`config/settings_schema.json`** - Theme settings configuration (950+ lines)
- **`layout/theme.liquid`** - Main layout template
- **`assets/tailwind.input.css`** - Tailwind source file
- **`assets/tailwind.output.css`** - Compiled Tailwind styles

## Scroll Prevention System

The theme includes a production-ready scroll prevention system that prevents unwanted auto-scrolling during page load, particularly caused by app scripts focusing form elements like radio buttons.

### Problem Solved
- App scripts (like `prvw_app.js`) were automatically focusing radio inputs during page load
- This caused the page to scroll to ~2287px automatically, creating poor UX
- The scroll prevention system blocks this behavior during the critical loading phase

### Implementation
- **Script**: `assets/scroll-prevention.js` - Main implementation
- **Configuration**: `layout/theme.liquid` (lines 5-15) - Settings injection
- **Settings**: Theme Settings > Developer Settings > Page Load Behavior
- **Duration**: Configurable (default: 4 seconds)
- **Methods**: Function overrides, event prevention, CSS locks, focus blocking

### Settings Available
1. **Enable scroll prevention** - Toggle the entire system on/off
2. **Debug logs** - Enable console logging for troubleshooting
3. **Duration** - How long to prevent scrolling (1-10 seconds)

### Manual Control
```javascript
// Enable/disable manually
window.scrollPrevention.enable()
window.scrollPrevention.disable()

// Check status
window.scrollPrevention.isEnabled()
```

### Performance Impact
- Minimal - Only active during page load
- Auto-disables after timeout
- Graceful error handling prevents script crashes
- No permanent DOM modifications

## Development Notes
- This is a Shopify theme, so changes should be tested with `npm run dev` before pushing
- Tailwind compilation must be run separately with `npm run tail` when making CSS changes
- The theme integrates with Shopify's section groups (header-group, footer-group, overlay-group)
- Custom fonts are loaded via CSS and configured through theme settings
- When making TypeScript changes, verify there are no type errors (as per user preferences)
- Use `console.log()` for debugging, not logger utilities
- For Shopify liquid templates, prefer `image_url` filter over deprecated `img_url`
- Follow mobile-first approach when writing CSS

## Custom Sections Architecture
The theme includes specialized landing page sections:
- **`landing-hero.liquid`** - Hero sections for landing pages
- **`landing-testimonials.liquid`** - Testimonial displays
- **`landing-video-testimonials.liquid`** - Video testimonial sections
- **`landing-vitamin-ingredients.liquid`** - Ingredient showcases
- **`landing-health-awareness.liquid`** - Health awareness content
- **`landing-energy-comparision.liquid`** - Product comparison displays
- **`landing-from-fatigue.liquid`** - Problem/solution focused content
- **`landing-marquee.liquid`** - Scrolling announcement/feature displays