/**
 * Icon loading and mapping utilities for Node.js environment
 * @fileoverview Handles SVG file loading from filesystem instead of Vite glob imports
 */

import * as fs from "fs";
import * as path from "path";
import type { IconOutputMode } from "./types.js";
import { DEFAULT_ICON_DIRECTORIES } from "./constants.js";
import { getIconConfig } from "./config.js";

/**
 * Cache for loaded SVG content to avoid repeated file reads
 */
const iconCache: Record<string, string> = {};

/**
 * Cache for available icon names
 */
let availableIconsCache: string[] | null = null;

/**
 * Get the icon directory path
 * Priority: config > environment variable > default directories
 */
function getIconDirectory(): string {
  // Check config first
  const config = getIconConfig();
  if (config.directory && fs.existsSync(config.directory)) {
    return config.directory;
  }

  // Check environment variable
  const envIconDir = process.env.NUBUI_ICON_DIR;
  if (envIconDir && fs.existsSync(envIconDir)) {
    return envIconDir;
  }

  // Try default directories
  for (const dir of DEFAULT_ICON_DIRECTORIES) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }

  // If no directory exists, return the first default
  return DEFAULT_ICON_DIRECTORIES[0];
}

/**
 * Scan directory for SVG files
 * @private
 */
function scanSvgFiles(directory: string): string[] {
  try {
    if (!fs.existsSync(directory)) {
      return [];
    }

    return fs
      .readdirSync(directory)
      .filter((file) => file.endsWith(".svg"))
      .map((file) => path.basename(file, ".svg"));
  } catch (error) {
    console.warn(`Failed to scan icon directory ${directory}:`, error);
    return [];
  }
}

/**
 * Get list of all available icon names
 * @returns {string[]} Array of available icon names
 *
 * @example
 * ```typescript
 * const icons = getAvailableIcons();
 * console.log(icons); // ['heart-line', 'rocket-line', 'gift-line', ...]
 * ```
 */
export function getAvailableIcons(): string[] {
  if (availableIconsCache === null) {
    const iconDir = getIconDirectory();
    availableIconsCache = scanSvgFiles(iconDir);
  }

  return [...availableIconsCache];
}

/**
 * Check if an icon exists
 * @param {string} name - Name of the icon to check
 * @returns {boolean} True if icon exists, false otherwise
 *
 * @example
 * ```typescript
 * if (iconExists('heart-line')) {
 *   // Icon is available
 * }
 * ```
 */
export function iconExists(name: string): boolean {
  const availableIcons = getAvailableIcons();
  return availableIcons.includes(name);
}

/**
 * Get raw SVG content for an icon
 * @param {string} name - Name of the icon
 * @returns {string | null} SVG content or null if not found
 *
 * @example
 * ```typescript
 * const svgContent = getRawSvgContent('heart-line');
 * if (svgContent) {
 *   // Use the SVG content
 * }
 * ```
 */
export function getRawSvgContent(name: string): string | null {
  // Check cache first
  if (iconCache[name]) {
    return iconCache[name];
  }

  const iconDir = getIconDirectory();
  const svgPath = path.join(iconDir, `${name}.svg`);

  try {
    if (fs.existsSync(svgPath)) {
      const content = fs.readFileSync(svgPath, "utf-8");
      // Cache the content
      iconCache[name] = content;
      return content;
    }
  } catch (error) {
    console.warn(`Failed to read SVG file ${svgPath}:`, error);
  }

  return null;
}

/**
 * Get SVG file path for an icon (for img src)
 * @param {string} name - Name of the icon
 * @returns {string | null} SVG file path or null if not found
 *
 * @example
 * ```typescript
 * const svgPath = getSvgFilePath('heart-line');
 * if (svgPath) {
 *   img.src = svgPath;
 * }
 * ```
 */
export function getSvgFilePath(name: string): string | null {
  const iconDir = getIconDirectory();
  const svgPath = path.join(iconDir, `${name}.svg`);

  if (fs.existsSync(svgPath)) {
    // Return relative path for web usage
    // In browser environment, this should be handled by build tools
    return svgPath;
  }

  return null;
}

/**
 * Validate icon arguments and provide detailed error messages
 * @param {string} name - Name of the icon
 * @param {IconOutputMode} mode - Output mode
 * @throws {Error} If arguments are invalid
 *
 * @example
 * ```typescript
 * try {
 *   validateIconArgs('heart-line', 'mask');
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export function validateIconArgs(name: string, mode: IconOutputMode): void {
  // Validate icon name
  if (!name || typeof name !== "string") {
    throw new Error("Icon name must be a non-empty string");
  }

  // Check if icon exists
  if (!iconExists(name)) {
    const availableIcons = getAvailableIcons();
    const iconDir = getIconDirectory();
    throw new Error(
      `Icon "${name}" not found in directory "${iconDir}". Available icons: ${availableIcons.join(
        ", "
      )}`
    );
  }

  // Validate mode
  const validModes: IconOutputMode[] = ["img", "inline", "mask"];
  if (!validModes.includes(mode)) {
    throw new Error(
      `Invalid mode "${mode}". Valid modes are: ${validModes.join(", ")}`
    );
  }
}

/**
 * Set the icon directory (useful for testing or custom configurations)
 * @param {string} directory - Path to the icon directory
 */
export function setIconDirectory(directory: string): void {
  if (!fs.existsSync(directory)) {
    throw new Error(`Icon directory does not exist: ${directory}`);
  }

  process.env.NUBUI_ICON_DIR = directory;
  // Clear caches
  availableIconsCache = null;
  Object.keys(iconCache).forEach((key) => delete iconCache[key]);
}

/**
 * Clear icon caches (useful for testing or when icons are updated)
 */
export function clearIconCache(): void {
  availableIconsCache = null;
  Object.keys(iconCache).forEach((key) => delete iconCache[key]);
}
