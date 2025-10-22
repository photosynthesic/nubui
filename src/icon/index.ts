/**
 * Icon module exports
 * @fileoverview Main exports for the icon system
 */

// Main icon creation function
export { createIcon } from "./icon";

// Icon utilities
export {
  getAvailableIcons,
  iconExists,
  setIconDirectory,
  clearIconCache,
} from "./icon-loader";

// SVG utilities
export {
  applySvgColor,
  encodeSvgToBase64,
  encodeSvgToBase64String,
  cleanSvgContent,
  extractSvgDimensions,
} from "./svg-utils";

// Mask generator (CLI functionality)
export { generateIconMasks } from "./icon-mask-generator";
export type { MaskGeneratorConfig } from "./icon-mask-generator";

// Types
export type { IconArgs, IconOutputMode } from "./types";
