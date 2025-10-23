/**
 * Icon System - Comprehensive SVG icon management for NPM package
 * @fileoverview Production-ready icon system with multiple output modes and color customization
 * @version 2.0.0
 */

import type { IconArgs } from "./types";
import { applySvgColor, cleanSvgContent } from "./svg-utils";
import {
  validateIconArgs,
  getRawSvgContent,
  getSvgFilePath,
} from "./icon-loader";

/**
 * Create an icon element with specified options
 *
 * @param {IconArgs} args - Icon configuration object
 * @returns {HTMLElement} Configured icon element ready for DOM insertion
 * @throws {Error} If icon file is not found or arguments are invalid
 *
 * @example
 * Basic usage (CSS mask mode - default):
 * ```typescript
 * const icon = createIcon({ name: 'phone-line' });
 * document.body.appendChild(icon);
 * ```
 *
 * @example
 * Colored icon with custom size:
 * ```typescript
 * const icon = createIcon({
 *   name: 'rocket-line',
 *   color: '#3b82f6',
 *   size: 32
 * });
 * ```
 */

// SSR/build compatible: returns HTML/SVG string
export function createIcon(args: IconArgs): string {
  const {
    name,
    mode = "mask",
    size = 24,
    color,
    attributes = {},
    styles = {},
    alt,
  } = args;

  validateIconArgs(name, mode);
  const tailwindSizeClasses = getTailwindSizeClasses(size);
  const processedStyles = { ...styles };
  const svgContent = getRawSvgContent(name);
  if (!svgContent) {
    throw new Error(`SVG content not found for icon: ${name}`);
  }

  // Utility: convert HTML attributes and styles to string
  const attrsToString = (attrs: Record<string, string>) =>
    Object.entries(attrs)
      .map(([k, v]) => `${k}="${v.replace(/"/g, "&quot;")}"`)
      .join(" ");
  const stylesToString = (styles: Record<string, string>) =>
    Object.entries(styles).length
      ? ` style=\"${Object.entries(styles)
          .map(([k, v]) => `${k}:${v}`)
          .join(";")}\"`
      : "";

  switch (mode) {
    case "img": {
      const svgPath = getSvgFilePath(name);
      if (!svgPath) throw new Error(`SVG file not found for icon: ${name}`);
      const altAttr = alt ? ` alt="${alt}"` : "";
      const classAttr = tailwindSizeClasses.length
        ? ` class="${tailwindSizeClasses.join(" ")}"`
        : "";
      return `<img src="${svgPath}"${altAttr}${classAttr}${stylesToString(
        processedStyles
      )}${attrsToString(attributes) ? " " + attrsToString(attributes) : ""} />`;
    }
    case "inline": {
      // Add classes and attributes to SVG
      let svg = cleanSvgContent(svgContent);
      // Add classes
      svg = svg.replace(
        /<svg(\s|>)/,
        `<svg class=\"${tailwindSizeClasses.join(" ")}${
          color ? " text-" + color : ""
        }\"$1`
      );
      // alt/title
      if (alt) {
        svg = svg.replace(/<svg([^>]*)>/, `<svg$1><title>${alt}</title>`);
      }
      // Add attributes
      if (Object.keys(attributes).length > 0) {
        svg = svg.replace(
          /<svg([^>]*)>/,
          `<svg$1 ${attrsToString(attributes)}>`
        );
      }
      // Add style
      if (Object.keys(processedStyles).length > 0) {
        svg = svg.replace(
          /<svg([^>]*)>/,
          `<svg$1 style=\"${Object.entries(processedStyles)
            .map(([k, v]) => `${k}:${v}`)
            .join(";")}\">`
        );
      }
      return svg;
    }
    case "mask":
    default: {
      // Add mask class to span
      const classList = [
        `mask-icon-${name}`,
        "inline-block",
        ...tailwindSizeClasses,
      ];
      if (color) {
        if (color.startsWith("text-") || color.startsWith("bg-")) {
          classList.push(
            color.startsWith("bg-") ? color.replace("bg-", "text-") : color
          );
        } else {
          classList.push(
            color.includes("#") ||
              color.includes("rgb") ||
              color.includes("hsl")
              ? `text-[${color}]`
              : `text-${color}`
          );
        }
      }
      const altAttr = alt ? ` role="img" aria-label="${alt}"` : "";
      return `<span class="${classList.join(" ")}"${altAttr}${stylesToString(
        processedStyles
      )}${
        attrsToString(attributes) ? " " + attrsToString(attributes) : ""
      }></span>`;
    }
  }
}

// Client-only: returns HTMLElement
export function createIconElement(args: IconArgs): HTMLElement {
  if (typeof document === "undefined") {
    throw new Error(
      "createIconElement is only available in the browser (document is undefined)"
    );
  }
  const {
    name,
    mode = "mask",
    size = 24,
    color,
    attributes = {},
    styles = {},
    alt,
  } = args;

  validateIconArgs(name, mode);
  const tailwindSizeClasses = getTailwindSizeClasses(size);
  const processedStyles = { ...styles };
  const svgContent = getRawSvgContent(name);
  if (!svgContent) {
    throw new Error(`SVG content not found for icon: ${name}`);
  }

  switch (mode) {
    case "img":
      return createImgIcon(
        name,
        attributes,
        processedStyles,
        tailwindSizeClasses,
        alt,
        size
      );
    case "inline":
      return createInlineIcon(
        svgContent,
        color,
        attributes,
        processedStyles,
        tailwindSizeClasses,
        alt
      );
    case "mask":
    default:
      return createCSSBackgroundIcon(
        name,
        color,
        attributes,
        processedStyles,
        size,
        alt
      );
  }
}

/**
 * Create an img element icon
 * @private
 */
function createImgIcon(
  name: string,
  attributes: Record<string, string>,
  styles: Record<string, string>,
  tailwindSizeClasses: string[],
  alt?: string,
  size?: string | number
): HTMLImageElement {
  // Create img element without template dependency
  const img = document.createElement("img");

  // Get SVG file path and set as src
  const svgPath = getSvgFilePath(name);
  if (svgPath) {
    img.src = svgPath;
  } else {
    throw new Error(`SVG file not found for icon: ${name}`);
  }

  // Set alt attribute for accessibility
  if (alt) {
    img.alt = alt;
  }

  // Set width and height attributes based on size
  if (size) {
    if (typeof size === "number") {
      img.width = size;
      img.height = size;
    } else if (typeof size === "string") {
      // Parse string size for width/height attributes
      const numericValue = parseFloat(size);
      if (!isNaN(numericValue)) {
        // If string contains a number, use it
        if (size.includes("px") || !isNaN(Number(size))) {
          img.width = numericValue;
          img.height = numericValue;
        }
      }
    }
  }

  // Apply Tailwind size classes
  img.classList.add(...tailwindSizeClasses);

  // Apply attributes
  Object.entries(attributes).forEach(([key, value]) => {
    img.setAttribute(key, value);
  });

  // Apply styles
  Object.entries(styles).forEach(([key, value]) => {
    img.style.setProperty(key, value);
  });

  return img;
}

/**
 * Create an inline SVG icon
 * @private
 */
function createInlineIcon(
  svgContent: string,
  color: string | undefined,
  attributes: Record<string, string>,
  styles: Record<string, string>,
  tailwindSizeClasses: string[],
  alt?: string
): HTMLElement {
  // Clean SVG content
  const cleanedSvg = cleanSvgContent(svgContent);

  // Create container
  const container = document.createElement("div");
  container.innerHTML = cleanedSvg;

  // Get the SVG element
  let svgElement = container.firstElementChild as SVGElement;
  if (!svgElement) {
    throw new Error("Invalid SVG content");
  }

  // Apply Tailwind size classes
  svgElement.classList.add(...tailwindSizeClasses);

  // Apply color if provided
  if (color) {
    if (
      color.startsWith("#") ||
      color.startsWith("rgb") ||
      color.startsWith("hsl")
    ) {
      // For hex, rgb, hsl values, apply directly via CSS
      const coloredSvg = applySvgColor(cleanedSvg, color);
      container.innerHTML = coloredSvg;
      const updatedSvgElement = container.firstElementChild as SVGElement;
      if (updatedSvgElement) {
        // Re-apply classes after content update
        updatedSvgElement.classList.add(...tailwindSizeClasses);
        // Update reference to the new element
        svgElement = updatedSvgElement;
      }
    } else {
      // For Tailwind color names, add as CSS class
      if (
        color.startsWith("text-") ||
        color.startsWith("stroke-") ||
        color.startsWith("fill-")
      ) {
        svgElement.classList.add(color);
      } else if (color.includes("-")) {
        // Convert color name to text class (e.g., "blue-500" -> "text-blue-500")
        svgElement.classList.add(`text-${color}`);
      } else {
        // Handle other color formats
        svgElement.classList.add(`text-${color}`);
      }
    }
  }

  // Set accessibility attributes
  if (alt) {
    const titleTag = document.createElement("title");
    titleTag.textContent = alt;
    svgElement.prepend(titleTag);
    svgElement.setAttribute("role", "img");
  }

  // Apply attributes to SVG
  Object.entries(attributes).forEach(([key, value]) => {
    svgElement.setAttribute(key, value);
  });

  // Apply styles
  Object.entries(styles).forEach(([key, value]) => {
    svgElement.style.setProperty(key, value);
  });

  return svgElement as unknown as HTMLElement;
}

/**
 * Convert size value to Tailwind size classes
 * @private
 */
function getTailwindSizeClasses(size?: string | number): string[] {
  if (!size) return ["w-6", "h-6"]; // Default 24px

  // Normalize size to string with px unit
  let sizeStr: string;
  if (typeof size === "number") {
    sizeStr = `${size}px`;
  } else if (typeof size === "string") {
    sizeStr = size;
  } else {
    return ["w-6", "h-6"];
  }

  // Standard Tailwind size mappings
  const sizeMap: Record<string, string> = {
    "16px": "w-4 h-4",
    "20px": "w-5 h-5",
    "24px": "w-6 h-6",
    "28px": "w-7 h-7",
    "32px": "w-8 h-8",
    "36px": "w-9 h-9",
    "40px": "w-10 h-10",
    "44px": "w-11 h-11",
    "48px": "w-12 h-12",
    "56px": "w-14 h-14",
    "60px": "w-15 h-15",
    "64px": "w-16 h-16",
  };

  // Use standard mapping if available
  if (sizeMap[sizeStr]) {
    return sizeMap[sizeStr].split(" ");
  }

  // For non-standard sizes, use Tailwind arbitrary values
  if (typeof size === "number") {
    return [`w-[${size}px]`, `h-[${size}px]`];
  } else {
    // Check if string is a pure number (no units)
    const numericValue = parseFloat(size);
    const isNumericString =
      !isNaN(numericValue) && numericValue.toString() === size;

    if (isNumericString) {
      // Pure numeric string - add px unit
      return [`w-[${size}px]`, `h-[${size}px]`];
    } else {
      // String with units or non-numeric - use as is
      return [`w-[${size}]`, `h-[${size}]`];
    }
  }
}

/**
 * Creates a CSS background icon using CSS mask for currentColor support
 * @private
 */
function createCSSBackgroundIcon(
  name: string,
  color: string | undefined,
  attributes: Record<string, string>,
  styles: Record<string, string>,
  size?: string | number,
  alt?: string
): HTMLSpanElement {
  // Create span element for mask icon
  const span = document.createElement("span");

  // Set the mask utility class and display
  span.classList.add(`mask-icon-${name}`, "inline-block");

  // Check if we can use Tailwind size classes
  const tailwindSizes = size ? getTailwindSizeClasses(size) : [];

  // Add size classes
  if (tailwindSizes.length > 0) {
    span.classList.add(...tailwindSizes);
  }

  // Set accessibility attributes
  if (alt) {
    span.setAttribute("role", "img");
    span.setAttribute("aria-label", alt);
  }

  // Add color class if provided
  if (color) {
    if (color.startsWith("text-") || color.startsWith("bg-")) {
      // Convert bg- classes to text- for currentColor support
      const colorClass = color.startsWith("bg-")
        ? color.replace("bg-", "text-")
        : color;
      span.classList.add(colorClass);
    } else {
      // Convert any color to Tailwind text class format
      const textColorClass =
        color.includes("#") || color.includes("rgb") || color.includes("hsl")
          ? `text-[${color}]` // Arbitrary value for exact colors
          : `text-${color}`; // Standard Tailwind color name
      span.classList.add(textColorClass);
    }
  }

  // Create final styles
  const finalStyles = { ...styles };

  if (tailwindSizes.length === 0 && size) {
    // Apply custom size if no Tailwind classes
    const sizeValue = typeof size === "number" ? `${size}px` : size;
    finalStyles.width = sizeValue;
    finalStyles.height = sizeValue;
  }

  // Apply all styles
  Object.entries(finalStyles).forEach(([key, value]) => {
    span.style.setProperty(key, value);
  });

  // Apply all attributes
  Object.entries(attributes).forEach(([key, value]) => {
    span.setAttribute(key, value);
  });

  return span;
}

// Re-export utilities for external use
export { getAvailableIcons, iconExists } from "./icon-loader";
export type { IconArgs, IconOutputMode } from "./types";
