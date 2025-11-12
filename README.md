# UX Flow Logic

A Figma Design plugin for creating annotated UX flow diagrams.

---

## About

UX Flow Logic helps designers create professional, annotated user flow diagrams. Generate structured templates with flowchart stencils and linked detail notes. Supports light and dark themes.

---

## Features

- **Structured templates** - Generate flow diagram frames with three-column layout
- **Flowchart components** - Reusable stencils for rectangles, diamonds, ovals, and connectors
- **Light/dark themes** - Coordinated visual styles for different presentation contexts
- **Component library** - Access shapes from canvas or Assets panel
- **Separate component pages** - Components organized in dedicated pages by theme
- **Auto-expanding frames** - Frames automatically grow to fit long text content

---

## What's New in v2.0

- **🎨 Separate component pages**: Components now organized in "Components - UX Flow Logic - Light Mode" and "Components - UX Flow Logic - Dark Mode" pages
- **📏 Smart frame expansion**: Frames automatically expand vertically to fit long text without truncation
- **🧹 Cleaner workspace**: Your working page stays clean with only the flow diagram and sticker sheet
- **🔄 Dual theme support**: Run the plugin in both light and dark modes to have both component sets available

---

## Installation

Install from the [Figma Community page](https://www.figma.com/community/plugin/1548695544263550149/ux-flow-logic).

1. Visit the plugin page and select "Open in…"
2. In your Figma Design file, select "Save"
3. Access the plugin: Right-click → Plugins → UX Flow Logic

---

## User Guide

- **[In this GitHub repository](https://github.com/linda-n-design/figma-ux-flow-logic/blob/main/docs/UserGuide.md)**
- **[In plugin developer's personal website](https://lindadesign.net/figma-plugin/ux_flow_logic.html)**, which includes screenshots and video tutorial

---

## Quick Start

1. Open the plugin on an empty page in Figma
2. Configure your flow in the "Summary" tab (name and theme)
3. Optionally add initial steps in "Define flow steps"
4. Click "Initialize flow" to generate your diagram template
5. Build your flow using the sticker sheet components

---

## Development

### File Structure
```
├── code.ts              # Main TypeScript source
├── code.js              # Compiled JavaScript
├── manifest.json        # Plugin configuration
├── ui.html              # User interface
├── tsconfig.json        # TypeScript config
├── package.json         # Dependencies
└── node_modules/        # Installed packages
```

### Build Commands

**Compile TypeScript:**
```bash
npx tsc
```

**Reload plugin in Figma:**
Plugins → Development → Reload plugin

### Making Changes

1. Navigate to your plugin folder in Terminal

2. Edit `code.ts` or `ui.html` in VS Code

3. Recompile TypeScript:
   ```bash
   npx tsc
   ```

4. Reload plugin in Figma

---

## Technical Details

- **Plugin ID:** 1548695544263550149
- **Plugin Name:** UX Flow Logic
- **Version:** 2.0
- **TypeScript:** ES2017 target
- **UI Architecture:** Inline CSS/JS in ui.html (Figma requirement)

---

## Changelog

### v2.0 (2025)
- Added separate component pages by theme (Light Mode / Dark Mode)
- Removed "User guide" tab from plugin UI
- Implemented automatic frame expansion for long text content
- Improved component organization with dedicated pages
- Components positioned at x=0, y=0 on component pages

### v1.0.0 (2025)
- Initial release
- Flow diagram generation with three-column layout
- Light and dark theme support
- Flowchart component library
- Sticker sheet with reusable components

---

## License

MIT License - Copyright (c) 2025 Linda Nakasone

See [LICENSE](LICENSE) for details.

---

## Author

Created and maintained by Linda Nakasone

- Website: [lindadesign.net](http://lindadesign.net)
- Support: Contact information available on website

---

*Thank you for using UX Flow Logic! If you find this plugin helpful, please consider leaving a review on the [Figma Community page](https://www.figma.com/community/plugin/1548695544263550149/ux-flow-logic).*