# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Shopify theme called "Vitamin" based on the Prestige theme framework (v10.5.1). It's an e-commerce theme for a health supplement store with custom features and styling.

## Development Commands

### Shopify Theme Development
- `npm run dev` - Start development server with live reload (connects to vitaminh2.myshopify.com theme ID 187771945291)
- `npm run push` - Push local changes to the Shopify store
- `npm run pull` - Pull changes from the Shopify store to local

### CSS Development
- `npm run tail` - Watch and compile Tailwind CSS (from `./assets/tailwind.input.css` to `./assets/tailwind.output.css`)

Note: No test suite is configured (`npm test` returns an error).

## Architecture & Structure

### Theme Structure (Shopify Liquid)
- **`layout/theme.liquid`** - Main theme layout with head, body, and script imports
- **`sections/`** - Modular content sections (60+ sections including landing pages, testimonials, product displays)
- **`templates/`** - Page templates for different content types (product, collection, blog, etc.)
- **`snippets/`** - Reusable code snippets
- **`config/settings_schema.json`** - Theme customization settings schema

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
- **Landing page variants** with A/B testing templates
- **Study/research content system** with dedicated templates
- **Advanced product features** (quick buy, color swatches, ratings)
- **Multiple testimonial systems** (text, video, custom)
- **Responsive design** with mobile-first approach

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

## Development Notes
- This is a Shopify theme, so changes should be tested with `npm run dev` before pushing
- Tailwind compilation must be run separately with `npm run tail` when making CSS changes
- The theme integrates with Shopify's section groups (header-group, footer-group, overlay-group)
- Custom fonts are loaded via CSS and configured through theme settings