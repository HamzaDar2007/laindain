# Assets Directory

This directory contains static assets used in the application:

## Structure

- `/images` - Image files (logos, backgrounds, illustrations)
- `/icons` - Icon files (SVG, PNG icons for UI)
- `/fonts` - Custom font files (if not using Google Fonts CDN)

## Usage

Import assets in your React components:

```typescript
import logo from '@/assets/images/logo.png';
import icon from '@/assets/icons/dashboard.svg';
```

## Best Practices

1. Use SVG for icons when possible (scalable, small file size)
2. Optimize images before adding them (use tools like TinyPNG)
3. Use WebP format for better compression
4. Keep file names lowercase with hyphens (e.g., `company-logo.png`)
