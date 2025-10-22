/**
 * Icon System - Comprehensive SVG icon management for NPM package
 * @fileoverview Production-ready icon system with multiple output modes and color customization
 * @version 2.0.0
 */
import type { IconArgs } from "./types";
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
 * const icon = createIcon({ iconName: 'phone-line' });
 * document.body.appendChild(icon);
 * ```
 *
 * @example
 * Colored icon with custom size:
 * ```typescript
 * const icon = createIcon({
 *   iconName: 'rocket-line',
 *   color: '#3b82f6',
 *   size: 32
 * });
 * ```
 */
export declare function createIcon(args: IconArgs): HTMLElement;
export { getAvailableIcons, iconExists } from "./icon-loader";
export type { IconArgs, IconOutputMode } from "./types";
