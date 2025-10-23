/**
 * Button Component - Simple button with progressive enhancement capabilities
 * @fileoverview NPM package version with SSR support
 */

import { createIcon } from "../icon/icon.js";
import type { ButtonProps } from "./types.js";
import {
  getButtonStyle,
  getButtonSize,
  getButtonShape,
  getDisabledStyle,
} from "./config.js";

/**
 * Create a button element (SSR compatible - returns HTML string)
 *
 * @param {ButtonProps} props - Button configuration
 * @returns {string} HTML string for the button element
 *
 * @example
 * Basic usage:
 * ```typescript
 * const button = createButton({ text: "Click me" });
 * // → <button type="button" class="...">Click me</button>
 * ```
 *
 * Navigation button:
 * ```typescript
 * const link = createButton({ text: "Go", href: "/page" });
 * // → <a href="/page" class="...">Go</a>
 * ```
 */
export function createButton(props: ButtonProps): string {
  const { text, disabled, element, htmlType, href, target, rel, autoSecurity, icon, iconPosition } = props;

  // Default element is <a> (anchor), unless explicitly set to "button"
  // However, if htmlType is specified, automatically use button element
  // This reflects real-world usage: links are more common than buttons
  const elementType = element ?? (htmlType ? "button" : "a");

  // Validation: href with button element is invalid
  if (elementType === "button" && href) {
    throw new Error(
      "ValidationError: 'href' cannot be used with element='button'. Use element='a' for navigation."
    );
  }

  // Validation: htmlType with anchor element is invalid
  if (elementType === "a" && htmlType) {
    throw new Error(
      "ValidationError: 'htmlType' cannot be used with element='a'. Use element='button' for form controls."
    );
  }

  // Build class list
  const classes = buildButtonClasses(props);

  // Build attributes string
  let attributes = "";

  if (elementType === "button") {
    attributes += ` type="${htmlType ?? "button"}"`;
    if (disabled) {
      attributes += " disabled";
    }
  } else {
    // anchor element
    attributes += ` href="${href ?? "#"}"`;
    if (target) {
      attributes += ` target="${target}"`;
      // Security: auto-add rel="noopener noreferrer" for target="_blank" (can be disabled with autoSecurity=false)
      if (target === "_blank" && autoSecurity !== false) {
        attributes += ` rel="${rel || 'noopener noreferrer'}"`;
      } else if (rel) {
        attributes += ` rel="${rel}"`;
      }
    } else if (rel) {
      attributes += ` rel="${rel}"`;
    }
    if (disabled) {
      attributes += ' aria-disabled="true" tabindex="-1" role="button"';
    }
  }

  // Build content (text + icon)
  let content = "";
  if (icon && text) {
    const iconHtml = createIcon({
      name: icon,
      mode: props.iconMode ?? "mask",
      size: props.iconSize ?? 16,
    });

    const iconElement = `<span class="inline-flex items-center">${iconHtml}</span>`;
    const textElement = `<span>${escapeHtml(text)}</span>`;

    if (iconPosition === "end") {
      content = `${textElement}${iconElement}`;
    } else {
      content = `${iconElement}${textElement}`;
    }
  } else if (text) {
    content = escapeHtml(text);
  }

  return `<${elementType}${attributes} class="${classes}">${content}</${elementType}>`;
}

/**
 * Build button class list
 * @private
 */
function buildButtonClasses(props: ButtonProps): string {
  const classes: string[] = [];

  // Base classes
  classes.push("inline-block", "font-medium", "transition-colors");

  // Type-based classes (from config)
  const typeStyle = getButtonStyle(props.type);
  if (typeStyle) {
    classes.push(...typeStyle.split(" "));
  }

  // Size classes (from config)
  const sizeStyle = getButtonSize(props.size);
  if (sizeStyle) {
    classes.push(...sizeStyle.split(" "));
  }

  // Shape classes (from config)
  const shapeStyle = getButtonShape(props.shape);
  if (shapeStyle) {
    classes.push(...shapeStyle.split(" "));
  }

  // Block button
  if (props.block) {
    classes.push("w-full");
  }

  // Icon button
  if (props.icon && props.text) {
    classes.push("flex", "items-center", "gap-2");
  }

  // Disabled state (from config)
  if (props.disabled) {
    const disabledStyle = getDisabledStyle();
    if (disabledStyle) {
      classes.push(...disabledStyle.split(" "));
    }
  }

  // Custom classes
  if (props.classes && props.classes.length > 0) {
    classes.push(...props.classes);
  }

  return classes.join(" ");
}

/**
 * Escape HTML special characters
 * @private
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
