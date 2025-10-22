/**
 * Button Component - Simple button with progressive enhancement capabilities
 * @fileoverview NPM package version without HTML template dependencies
 */

import { addClasses } from "../utils/component-utilities";
import { createIcon } from "../icon/icon";
import type { ButtonProps } from "./types";

// --- Button component logic is temporarily disabled during development ---
// export function createButton(props: ButtonProps): HTMLElement {
//   const elementType = props.element ?? "a";
//   const element = document.createElement(elementType) as HTMLElement;
//   if (elementType === "button") {
//     const buttonElement = element as HTMLButtonElement;
//     buttonElement.type = props.htmlType ?? "button";
//   } else if (elementType === "a") {
//     const anchorElement = element as HTMLAnchorElement;
//     anchorElement.href = props.href ?? "#";
//     if (props.target) {
//       anchorElement.target = props.target;
//     }
//   }
//   if (props.text) {
//     if (props.icon) {
//       setupButtonWithIcon(element, props);
//     } else {
//       element.textContent = props.text;
//     }
//   }
//   if (props.disabled) {
//     if (element instanceof HTMLButtonElement) {
//       element.disabled = true;
//     } else if (element instanceof HTMLAnchorElement) {
//       element.setAttribute("aria-disabled", "true");
//       element.addEventListener("click", (e) => {
//         e.preventDefault();
//       });
//     }
//   }
//   if (props.classes && props.classes.length > 0) {
//     addClasses(element, props.classes);
//   }
//   return element;
// }

/**
 * Setup button with icon
 * @private
 */
function setupButtonWithIcon(element: HTMLElement, props: ButtonProps): void {
  if (!props.icon || !props.text) return;

  // --- Icon logic temporarily disabled during development ---
  // try {
  //   const iconElement = createIconElement({
  //     iconName: props.icon,
  //     mode: props.iconMode ?? "mask",
  //     size: props.iconSize ?? 16,
  //   });
  //   const textSpan = document.createElement("span");
  //   textSpan.textContent = props.text;
  //   if (props.iconPosition === "end") {
  //     element.appendChild(textSpan);
  //     element.appendChild(iconElement);
  //   } else {
  //     element.appendChild(iconElement);
  //     element.appendChild(textSpan);
  //   }
  //   element.classList.add("flex", "items-center", "gap-2");
  // } catch (error) {
  //   console.warn(`Failed to create icon ${props.icon}:`, error);
  //   element.textContent = props.text;
  // }
  // --- fallback: just add text ---
  element.textContent = props.text;
}

// Button presets
export const buttonPresets = {
  // Basic button (default appearance)
  basic: {
    text: "Button",
    classes: [
      "px-4",
      "py-2",
      // function setupButtonWithIcon(element: HTMLElement, props: ButtonProps): void {
      //   // ...icon logic...
      // }
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
  // export const buttonPresets = {
  //   basic: { text: "Button", classes: [/* ... */], href: "#" },
  //   primary: { text: "Primary", type: "primary" as const, classes: [/* ... */], href: "#" },
  //   dashed: { text: "Dashed", type: "dashed" as const, classes: [/* ... */], href: "#" },
  //   text: { text: "Text", type: "text" as const, classes: [/* ... */], href: "#" },
  //   link: { text: "Link", type: "link" as const, classes: [/* ... */], href: "#" },
  //   danger: { text: "Danger", type: "danger" as const, classes: [/* ... */] },
  // };
};
