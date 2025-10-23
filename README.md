# @photosynthesic/nubui

**Tailwind CSS Icon and Button Components**

A lightweight, framework-agnostic component library featuring custom SVG icons and accessible button components. Perfect for teams managing custom icons from various sources and need consistent, accessible button styling. Includes icon CSS mask generation, config-based button styling, and full TypeScript support.

## 🎯 Key Features

### Icon System

- **🎨 SVG → CSS Mask Conversion**: Automatically convert icons to `currentColor`-compatible CSS masks
- **🎛️ Three Output Modes**: Mask (recommended), Inline SVG, and IMG modes available
- **⚡ CLI Automation**: `icon:build` command for one-step workflow with preview
- **👁️ Interactive Preview**: Visual preview page with color/size controls
- **🔍 SVGO Integration**: Automatic SVG optimization (configurable)

### Button Component

- **🎯 Smart Element Selection**: Auto-selects `<a>` or `<button>` based on context
- **🎨 Config-Based Styling**: Unified design system with customizable presets
- **🔗 Anchor-First Design**: Reflects real-world usage patterns
- **♿ Accessibility Built-In**: ARIA attributes and keyboard navigation handled automatically
- **🔒 Security Features**: Auto `rel="noopener noreferrer"` for external links
- **🎭 Icon Integration**: Seamless icon positioning and sizing

### General

- **🏷️ Full TypeScript Support**: Type-safe development experience
- **🚀 Framework Support**:
  - Icons: Vue, React, Svelte, Astro, vanilla JavaScript
  - Buttons: Astro, Next.js, and other SSR frameworks
- **📦 SSR Ready**: Button component returns HTML strings for server-side rendering

## Installation

```bash
npm install @photosynthesic/nubui
```

## Quick Start

### 1. Generate Icons

```bash
npx nubui icon:build
```

This generates CSS mask utilities from your SVG icons.

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

### 3. Create Buttons

```typescript
import { createButton } from "@photosynthesic/nubui";

const link = createButton({ text: "Visit", href: "/page" });
const submit = createButton({ text: "Submit", htmlType: "submit" });
```

## Configuration

Configure Button and Icon components globally using `nubui.config.ts`.

### Setup Config File

Create `nubui.config.ts` at your project root:

```typescript
import type { NubuiConfig } from "@photosynthesic/nubui";

export const nubuiConfig: NubuiConfig = {
  button: {
    // Button style presets
    primary: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",
    danger: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",

    // Button sizes
    sizes: {
      SM: "px-2 py-1 text-sm",
      MD: "px-4 py-2 text-base",
      LG: "px-6 py-3 text-lg",
    },

    // Button shapes
    shapes: {
      round: "rounded-full",
      square: "rounded-none",
    },
  },

  icon: {
    // Icon size mapping (Tailwind classes)
    sizeMap: {
      "16px": "w-4 h-4",
      "24px": "w-6 h-6",
      "32px": "w-8 h-8",
    },

    // Default icon size
    defaultSize: "24px",

    // Default color
    defaultColor: "currentColor",

    // SVG optimization
    svgOptimization: {
      enabled: true,
    },
  },
};
```

### Load Config at Startup

```typescript
// app.ts or main.ts
import { loadNubuiConfig } from "@photosynthesic/nubui";
import { nubuiConfig } from "./nubui.config";

loadNubuiConfig(nubuiConfig);
```

Now all buttons and icons will use your configured styles.

### Advanced: Use Icons Programmatically

```typescript
import { createIcon } from "@photosynthesic/nubui";

// Basic usage (CSS mask mode - default)
const icon = createIcon({ name: "heart" });
document.body.appendChild(icon);

// Customized icon
const customIcon = createIcon({
  name: "star",
  mode: "mask", // 'mask' | 'inline' | 'img'
  size: 32, // number | string
  color: "blue-500", // Tailwind color | hex | CSS color
  attributes: { "aria-label": "Star icon" },
  styles: { cursor: "pointer" },
});
```

## Icon Output Modes

### 1. Mask Mode (Default, Recommended)

```typescript
const icon = createIcon({
  name: "star",
  mode: "mask",
  color: "yellow-500",
});
// Output: <span class="mask-icon-star text-yellow-500 w-6 h-6"></span>
```

**Features:**

- `currentColor` support for dynamic theming
- Tailwind CSS `text-*` classes for color
- Single `<span>` element in DOM
- Perfect compatibility with pseudo-elements (`::before`, `::after`)
- Reusable across multiple instances (CSS defined once)

### 2. Inline Mode

```typescript
const icon = createIcon({
  name: "heart",
  mode: "inline",
  color: "#3b82f6",
});
// Output: <svg xmlns="..." viewBox="0 0 24 24" class="w-6 h-6">
//           <path fill="#3b82f6" d="..."/>
//         </svg>
```

**Features:**

- Direct SVG manipulation for animations
- Support for CSS pseudo-selectors on SVG elements
- Individual color control per icon instance
- Useful for complex icon interactions

### 3. IMG Mode

```typescript
const icon = createIcon({
  name: "home",
  mode: "img",
  alt: "Home icon",
});
// Output: <img src="./src/assets/icon/format/home.svg"
//              alt="Home icon"
//              class="w-6 h-6" />
```

**Features:**

- Standard HTML `<img>` element
- Browser can cache SVG files separately
- **Limitation**: Cannot change colors (use mask or inline mode for color control)

## CLI Commands

### Main Commands

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

  --no-pseudo             Disable pseudo-element variants (::before, ::after)

  --no-optimize           Skip SVG optimization (svgo)

  --svgo-config <path>    Custom svgo configuration file

  -h, --help              Show help message
```

### icon:preview Options

```bash
npx nubui icon:preview [OPTIONS]

OPTIONS:
  -o, --output <path>     Output HTML file path
                          (default: ./docs/icon-preview.html)

  --icon-dir <path>       Icon directory (auto-detected)

  -h, --help              Show help message
```

## API Reference

### Icon System

```typescript
interface IconArgs {
  name: string;
  mode?: 'mask' | 'inline' | 'img';
  size?: string | number;
  color?: string;
  attributes?: Record<string, string>;
  styles?: Record<string, string>;
  alt?: string;
}

// Functions
createIcon(args: IconArgs): HTMLElement
getAvailableIcons(): string[]
iconExists(name: string): boolean
getRawSvgContent(name: string): string | null
getSvgFilePath(name: string): string | null
```

## Button System

A Tailwind CSS button component system with icon integration and config-based styling.

### Key Features

- **🎯 Smart Element Selection**: Auto-selects `<a>` or `<button>` based on context
- **🎨 Config-Based Styling**: Unified design system with customizable presets
- **🔗 Anchor-First Design**: Reflects real-world usage (links more common than buttons)
- **♿ Accessibility Built-In**: ARIA attributes and keyboard navigation handled automatically
- **🔒 Security Features**: Auto `rel="noopener noreferrer"` for external links (configurable)
- **🎭 Icon Integration**: Seamless icon positioning and sizing
- **🚀 SSR Compatible**: Returns HTML strings, works with Astro, Next.js, etc.

### Quick Button Example

```typescript
import { createButton } from "@photosynthesic/nubui";

// Default anchor link
const link = createButton({ text: "Visit", href: "/page" });
// → <a href="/page" class="...">Visit</a>

// Form submit button
const submit = createButton({ text: "Submit", htmlType: "submit" });
// → <button type="submit" class="...">Submit</button>

// With icon
const download = createButton({
  text: "Download",
  icon: "download",
  type: "primary",
  size: "LG",
});
// → <a href="#" class="flex items-center gap-2 px-6 py-3 bg-blue-600 ...">
//     <span class="mask-icon-download ..."></span>
//     <span>Download</span>
//   </a>

// External link (auto security)
const external = createButton({
  text: "External",
  href: "https://example.com",
  target: "_blank", // Auto adds rel="noopener noreferrer"
});
```

### Customize with Config

```typescript
import { configureButton } from "@photosynthesic/nubui/button";

configureButton({
  // Custom button types
  primary: "px-4 py-2 bg-blue-600 text-white rounded",
  danger: "px-4 py-2 bg-red-600 text-white rounded",

  // Custom sizes
  sizes: {
    SM: "px-2 py-1 text-sm",
    LG: "px-6 py-3 text-lg",
  },

  // Custom shapes
  shapes: {
    pill: "rounded-full px-6",
  },

  // Custom disabled state
  disabled: "opacity-40 cursor-not-allowed",
});
```

### Full API Reference

See [spec.md](./spec.md) for complete ButtonProps interface and examples.

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

   This will:

   - Generate optimized SVGs to `./src/assets/icon/format/`
   - Generate `./src/assets/scss/_icon-masks.scss`
   - Create `./docs/icon-preview.html`
   - Open preview in your browser

4. **Import generated SCSS**

   ```scss
   // main.scss
   @import "./assets/scss/_icon-masks";
   ```

5. **Use in your components**

   ```typescript
   import { createIcon } from "@photosynthesic/nubui";
   ```

   Or use directly in HTML:

   ```html
   <span class="mask-icon-heart w-6 h-6 text-red-500"></span>
   ```

## Requirements

- **Node.js**: 18.0.0 or higher
- **TypeScript**: 5.0.0 or higher (for development)
- **Tailwind CSS**: 3.0.0 or higher

## Example Projects

### Astro Usage

**Option 1: Using Icon Component (Recommended)**

```astro
---
import { Icon } from '@photosynthesic/nubui/astro';
---

<!-- Mask mode (default) - supports currentColor -->
<Icon name="heart" size={24} color="red-500" />

<!-- Inline SVG mode - for animations and styling -->
<Icon name="star" mode="inline" size={32} color="#fbbf24" />

<!-- IMG mode - for caching -->
<Icon name="home" mode="img" size={48} alt="Home icon" />

<!-- With buttons -->
<button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded">
  <Icon name="star" size={20} color="white" />
  Favorite
</button>
```

**Option 2: Direct Tailwind Classes**

```astro
---
// No imports needed - just use the CSS classes
---
<button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded">
  <span class="mask-icon-star w-5 h-5"></span>
  Favorite
</button>

<div class="flex gap-4">
  <span class="mask-icon-heart w-6 h-6 text-red-500"></span>
  <span class="mask-icon-home w-6 h-6 text-blue-500"></span>
</div>
```

### Next.js Usage

**Option 1: Direct Tailwind Usage (Recommended)**

```tsx
// app/page.tsx or pages/index.tsx
export default function Home() {
  return (
    <div>
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded">
        <span className="mask-icon-star w-5 h-5"></span>
        Favorite
      </button>

      <div className="flex gap-4">
        <span className="mask-icon-heart w-6 h-6 text-red-500"></span>
        <span className="mask-icon-home w-6 h-6 text-blue-500"></span>
      </div>
    </div>
  );
}
```

**Option 2: Reusable Icon Component**

```tsx
// components/Icon.tsx
"use client"; // Only needed in App Router

import { useEffect, useRef } from "react";
import { createIcon } from "@photosynthesic/nubui";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export function Icon({
  name,
  size = 24,
  color = "currentColor",
  className,
}: IconProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = ""; // Clear previous icon
      const icon = createIcon({
        name: name,
        size,
        color,
      });
      ref.current.appendChild(icon);
    }
  }, [name, size, color]);

  return <div ref={ref} className={className} />;
}

// Usage:
// <Icon name="heart" size={24} color="red-500" />
```

**Option 3: Server Component with Mask Classes (App Router)**

```tsx
// app/components/Icon.tsx (no "use client" needed)
interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className = "" }: IconProps) {
  return <span className={`mask-icon-${name} ${className}`} />;
}

// Usage:
// <Icon name="heart" className="w-6 h-6 text-red-500" />
```

### React Usage

```tsx
import { createIcon } from "@photosynthesic/nubui";
import { useRef, useEffect } from "react";

function IconComponent({ name, size = 24, color = "currentColor" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const icon = createIcon({
        name: name,
        size,
        color,
      });
      ref.current.appendChild(icon);
    }
  }, [name, size, color]);

  return <div ref={ref} />;
}
```

### Vue Usage

```vue
<template>
  <div ref="iconContainer"></div>
</template>

<script setup>
import { createIcon } from "@photosynthesic/nubui";
import { ref, onMounted } from "vue";

const props = defineProps(["name", "size", "color"]);
const iconContainer = ref();

onMounted(() => {
  const icon = createIcon({
    name: props.name,
    size: props.size || 24,
    color: props.color || "currentColor",
  });
  iconContainer.value.appendChild(icon);
});
</script>
```

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## Support

For issues and questions, please visit our [GitHub repository](https://github.com/photosynthesic/nubui).
