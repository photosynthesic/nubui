/**
 * Icon module exports
 * @fileoverview Main exports for the icon system
 */

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
