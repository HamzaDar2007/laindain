# Resources Directory

This directory contains application resources for Electron builds:

- `icon.png` - Application icon for Linux (512x512)
- `icon.ico` - Application icon for Windows
- `icon.icns` - Application icon for macOS

## Generating Icons

You can use tools like `electron-icon-builder` to generate platform-specific icons from a source image:

```bash
npm install -g electron-icon-builder
electron-icon-builder --input=./icon.png --output=./resources
```

## Icon Requirements

- **Windows (.ico)**: 256x256 pixels
- **macOS (.icns)**: 512x512 pixels  
- **Linux (.png)**: 512x512 pixels

Place your source icon (512x512 PNG) in this directory and run the icon builder.
