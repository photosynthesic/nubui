/**
 * Button Component - Simple button with progressive enhancement capabilities
 * @fileoverview NPM package version without HTML template dependencies
 */

import { addClasses } from "../utils/component-utilities";
import { createIcon } from "../icon/icon";
import type { ButtonProps } from "./types";

/**
 * Create a button element
 * @param {ButtonProps} props - Button configuration
 * @returns {HTMLElement} Configured button element
 */
export function createButton(props: ButtonProps): HTMLElement {
  const elementType = props.element ?? "a";

  // Create the base element
  const element = document.createElement(elementType) as HTMLElement;

  // Set basic attributes based on element type
  if (elementType === "button") {
    const buttonElement = element as HTMLButtonElement;
    buttonElement.type = props.htmlType ?? "button";
  } else if (elementType === "a") {
    const anchorElement = element as HTMLAnchorElement;
    anchorElement.href = props.href ?? "#";
    if (props.target) {
      anchorElement.target = props.target;
    }
  }

  // Set text content
  if (props.text) {
    // If icon is specified, create a container structure
    if (props.icon) {
      setupButtonWithIcon(element, props);
    } else {
      element.textContent = props.text;
    }
  }

  // Handle disabled state
  if (props.disabled) {
    if (element instanceof HTMLButtonElement) {
      element.disabled = true;
    } else if (element instanceof HTMLAnchorElement) {
      // For anchor elements, prevent default behavior and add disabled styling
      element.setAttribute("aria-disabled", "true");
      element.addEventListener("click", (e) => {
        e.preventDefault();
      });
    }
  }

  // Add custom classes (override default styles)
  if (props.classes && props.classes.length > 0) {
    addClasses(element, props.classes);
  }

  return element;
}

/**
 * Setup button with icon
 * @private
 */
function setupButtonWithIcon(element: HTMLElement, props: ButtonProps): void {
  if (!props.icon || !props.text) return;

  try {
    const iconElement = createIcon({
      iconName: props.icon,
      mode: props.iconMode ?? "mask",
      size: props.iconSize ?? 16,
    });

    // Create text span
    const textSpan = document.createElement("span");
    textSpan.textContent = props.text;

    // Add elements based on icon position
    if (props.iconPosition === "end") {
      element.appendChild(textSpan);
      element.appendChild(iconElement);
    } else {
      // Default to start position
      element.appendChild(iconElement);
      element.appendChild(textSpan);
    }

    // Add flex classes for proper layout
    element.classList.add("flex", "items-center", "gap-2");
  } catch (error) {
    // If icon creation fails, just add text
    console.warn(`Failed to create icon ${props.icon}:`, error);
    element.textContent = props.text;
  }
}

// Button presets
export const buttonPresets = {
  // Basic button (default appearance)
  basic: {
    text: "Button",
    classes: [
      "px-4",
      "py-2",
      "border",
      "border-gray-300",
      "rounded-md",
      "hover:bg-gray-50",
      "disabled:bg-gray-100",
      "disabled:text-gray-400",
      "disabled:cursor-not-allowed",
      "disabled:hover:bg-gray-100",
      "aria-disabled:bg-gray-100",
      "aria-disabled:text-gray-400",
      "aria-disabled:cursor-not-allowed",
      "aria-disabled:hover:bg-gray-100",
    ],
    href: "#",
  },

  // Primary button
  primary: {
    text: "Primary",
    type: "primary" as const,
    classes: [
      "bg-blue-600",
      "text-white",
      "border",
      "border-blue-600",
      "hover:bg-blue-700",
      "px-4",
      "py-2",
      "rounded-md",
      "disabled:bg-gray-100",
      "disabled:text-gray-400",
      "disabled:border-gray-300",
      "disabled:cursor-not-allowed",
      "disabled:hover:bg-gray-100",
      "aria-disabled:bg-gray-100",
      "aria-disabled:text-gray-400",
      "aria-disabled:border-gray-300",
      "aria-disabled:cursor-not-allowed",
      "aria-disabled:hover:bg-gray-100",
    ],
    href: "#",
  },

  // Other type presets (to be expanded)
  dashed: {
    text: "Dashed",
    type: "dashed" as const,
    classes: [
      "border-2",
      "border-dashed",
      "border-gray-300",
      "px-4",
      "py-2",
      "rounded-md",
      "hover:border-gray-400",
    ],
    href: "#",
  },

  text: {
    text: "Text",
    type: "text" as const,
    classes: [
      "text-blue-600",
      "hover:text-blue-700",
      "px-2",
      "py-1",
      "hover:bg-blue-50",
      "rounded",
    ],
    href: "#",
  },

  link: {
    text: "Link",
    type: "link" as const,
    classes: [
      "text-blue-600",
      "hover:text-blue-700",
      "underline",
      "hover:no-underline",
    ],
    href: "#",
  },

  danger: {
    text: "Danger",
    type: "danger" as const,
    classes: [
      "bg-red-600",
      "text-white",
      "border",
      "border-red-600",
      "hover:bg-red-700",
      "px-4",
      "py-2",
      "rounded-md",
    ],
    href: "#",
  },

  // Size presets
  sm: {
    text: "Small",
    size: "SM" as const,
    classes: ["px-2", "py-1", "text-sm", "rounded"],
    href: "#",
  },

  md: {
    text: "Medium",
    size: "MD" as const,
    classes: ["px-4", "py-2", "text-base", "rounded-md"],
    href: "#",
  },

  lg: {
    text: "Large",
    size: "LG" as const,
    classes: ["px-6", "py-3", "text-lg", "rounded-lg"],
    href: "#",
  },

  // Shape presets
  circle: {
    text: "○",
    shape: "circle" as const,
    classes: [
      "w-10",
      "h-10",
      "rounded-full",
      "flex",
      "items-center",
      "justify-center",
    ],
    href: "#",
  },

  round: {
    text: "Round",
    shape: "round" as const,
    classes: ["px-6", "py-2", "rounded-full"],
    href: "#",
  },

  // Block button
  block: {
    text: "Block",
    block: true,
    classes: ["w-full", "px-4", "py-2", "rounded-md"],
    href: "#",
  },

  // Icon buttons
  iconStart: {
    text: "Icon Start",
    icon: "heart-line",
    iconPosition: "start" as const,
    classes: ["px-4", "py-2", "rounded-md", "flex", "items-center", "gap-2"],
    href: "#",
  },

  iconEnd: {
    text: "Icon End",
    icon: "arrow-right",
    iconPosition: "end" as const,
    classes: ["px-4", "py-2", "rounded-md", "flex", "items-center", "gap-2"],
    href: "#",
  },

  // HTML button elements
  htmlButton: {
    text: "HTML Button",
    element: "button" as const,
    classes: ["px-4", "py-2", "rounded-md", "border", "border-gray-300"],
  },

  submitButton: {
    text: "Submit",
    element: "button" as const,
    htmlType: "submit" as const,
    classes: [
      "bg-blue-600",
      "text-white",
      "px-4",
      "py-2",
      "rounded-md",
      "hover:bg-blue-700",
    ],
  },

  resetButton: {
    text: "Reset",
    element: "button" as const,
    htmlType: "reset" as const,
    classes: [
      "bg-gray-100",
      "text-gray-700",
      "px-4",
      "py-2",
      "rounded-md",
      "hover:bg-gray-200",
    ],
  },
};
