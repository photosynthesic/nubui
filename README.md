# @photosynthesic/nubui

**Custom SVG Icons with Tailwind CSS**

A lightweight, framework-agnostic tool for managing custom SVG icons and generating Tailwind CSS utility classes. Perfect for teams managing custom icons from various sources and needing a simple, automated workflow.

## 🎯 Key Features

- **🎨 SVG → CSS Mask Conversion**: Automatically convert icons to `currentColor`-compatible CSS masks
- **⚡ CLI Automation**: `icon:build` command for one-step workflow with preview
- **👁️ Interactive Preview**: Visual preview page for generated icons
- **🔍 SVGO Integration**: Automatic SVG optimization (configurable)
- **🏷️ Full TypeScript Support**: Type-safe development experience
- **🚀 Framework Support**: Vue, React, Svelte, Astro, vanilla JavaScript, and more

## Installation

```bash
npm install @photosynthesic/nubui
```

## Quick Start

### 1. Generate Icons

Place your SVG files in `src/assets/icon/` and run:

```bash
npx nubui icon:build
```

This generates CSS mask utilities from your SVG icons and opens an interactive preview.

### 2. Use Icons in HTML

```html
<!-- Basic icon -->
<span class="mask-icon-heart w-6 h-6 text-red-500"></span>

<!-- Icon in button -->
<button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded">
  <span class="mask-icon-star w-5 h-5"></span>
  Favorite
</button>
```

## CLI Commands

```bash
npx nubui icon:build    # Generate masks + preview and open browser
npx nubui icon:masks    # Generate CSS masks only
npx nubui icon:preview  # Generate preview HTML only
npx nubui icon:clean    # Remove generated files
npx nubui --help        # Show all commands
```

### icon:masks Options

```bash
npx nubui icon:masks [OPTIONS]

OPTIONS:
  -i, --icon-dir <path>   SVG icon directory path
                          (default: ./src/assets/icon)

  -o, --output <path>     Output SCSS file path
                          (default: ./src/assets/scss/_icon-masks.scss)

  --no-optimize           Skip SVG optimization (svgo)

  -h, --help              Show help message
```

## Development Workflow

1. **Install the package**

   ```bash
   npm install @photosynthesic/nubui
   ```

2. **Add SVG icons to your project**

   ```
   src/assets/icon/
   ├── heart.svg
   ├── star.svg
   └── home.svg
   ```

3. **Generate masks and preview**

   ```bash
   npx nubui icon:build
   ```

4. **Import generated SCSS**

   ```scss
   // main.scss
   @import "./assets/scss/_icon-masks";
   ```

5. **Use in your components**

   ```html
   <span class="mask-icon-heart w-6 h-6 text-red-500"></span>
   ```

## Framework Integration

### Astro

```astro
---
// No imports needed - just use the CSS classes
---

<button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded">
  <span class="mask-icon-star w-5 h-5"></span>
  Favorite
</button>
```

### React

```tsx
export function FavoriteButton() {
  return (
    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded">
      <span className="mask-icon-star w-5 h-5"></span>
      Favorite
    </button>
  );
}
```

### Vue

```vue
<template>
  <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded">
    <span class="mask-icon-star w-5 h-5"></span>
    Favorite
  </button>
</template>
```

## Icon Rendering Modes

nubui supports three ways to use your icons:

### 1. Mask Mode (Default, Recommended)

```html
<span class="mask-icon-star w-6 h-6 text-yellow-500"></span>
```

**Features:**
- `currentColor` support for dynamic theming
- Tailwind CSS `text-*` classes for color
- Single `<span>` element in DOM
- Perfect compatibility with pseudo-elements (`::before`, `::after`)

### 2. Inline Mode

When you need to animate or style individual SVG paths, use inline SVG directly.

### 3. IMG Mode

For static references that can be cached by the browser.

## Requirements

- **Node.js**: 18.0.0 or higher
- **TypeScript**: 5.0.0 or higher (for development)
- **Tailwind CSS**: 3.0.0 or higher

## For Full Documentation

See [spec.md](./spec.md) for complete package structure, configuration options, and implementation examples.

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## Support

For issues and questions, please visit our [GitHub repository](https://github.com/photosynthesic/nubui).
