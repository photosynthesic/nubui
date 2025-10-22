/**
 * Icon system configuration constants
 * @fileoverview Centralized configuration for icon directories and paths
 */

/**
 * Default source directory for original SVG icons
 */
export const DEFAULT_ICON_SOURCE_DIR = "./src/assets/icon";

/**
 * Default output directory for optimized SVG icons
 */
export const DEFAULT_OPTIMIZED_ICON_DIR = "./src/assets/icon/format";

/**
 * Default output path for generated SCSS file
 */
export const DEFAULT_SCSS_OUTPUT_PATH = "./src/assets/scss/_icon-masks.scss";

/**
 * Default output path for preview HTML file
 */
export const DEFAULT_PREVIEW_OUTPUT_PATH = "./docs/icon-preview.html";

/**
 * Cache file path for storing build configuration
 */
export const CACHE_FILE_PATH = "./.nubui-cache.json";

/**
 * Default icon directories to search for SVG files (in priority order)
 * Priority: optimized directory > source directory > fallback directories
 */
export const DEFAULT_ICON_DIRECTORIES = [
  DEFAULT_OPTIMIZED_ICON_DIR,
  DEFAULT_ICON_SOURCE_DIR,
  "./assets/icons",
  "./icons",
  "./src/icons",
];
