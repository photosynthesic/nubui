/**
 * Icon module exports
 * @fileoverview Main exports for the icon system
 */
export { createIcon } from "./icon";
export { getAvailableIcons, iconExists, setIconDirectory, clearIconCache, } from "./icon-loader";
export { applySvgColor, encodeSvgToBase64, encodeSvgToBase64String, cleanSvgContent, extractSvgDimensions, } from "./svg-utils";
export { generateIconMasks } from "./icon-mask-generator";
export type { MaskGeneratorConfig } from "./icon-mask-generator";
export type { IconArgs, IconOutputMode } from "./types";
