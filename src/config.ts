/**
 * Unified nubui configuration
 * Manages settings for Button and Icon components
 */

import { configureButton, type ButtonConfig } from "./button/config.js";
import { configureIcon, type IconConfig } from "./icon/config.js";

export interface NubuiConfig {
  button?: Partial<ButtonConfig>;
  icon?: Partial<IconConfig>;
}

/**
 * Configure nubui components globally
 *
 * @example
 * // nubui.config.ts
 * import type { NubuiConfig } from '@photosynthesic/nubui'
 *
 * export const nubuiConfig: NubuiConfig = {
 *   button: {
 *     primary: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",
 *     danger: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",
 *     sizes: {
 *       SM: "px-2 py-1 text-sm",
 *       LG: "px-6 py-3 text-lg",
 *     },
 *   },
 *   icon: {
 *     directory: "./src/assets/icons",
 *   },
 * }
 *
 * // app.ts
 * import { loadNubuiConfig } from '@photosynthesic/nubui'
 * import { nubuiConfig } from './nubui.config'
 *
 * loadNubuiConfig(nubuiConfig)
 */
export function loadNubuiConfig(config: NubuiConfig): void {
  if (config.button) {
    configureButton(config.button);
  }
  if (config.icon) {
    configureIcon(config.icon);
  }
}

/**
 * Configure button component settings
 */
export function setButtonConfig(config: Partial<ButtonConfig>): void {
  configureButton(config);
}

/**
 * Configure icon component settings
 */
export function setIconConfig(config: Partial<IconConfig>): void {
  configureIcon(config);
}

/**
 * Export types for user-facing config
 */
export type { ButtonConfig } from "./button/config.js";
export type { IconConfig } from "./icon/config.js";
