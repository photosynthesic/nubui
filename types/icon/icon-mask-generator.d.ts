/**
 * Icon Mask Generator - SCSS Mask Icon Utilities Generator for NPM package
 * @fileoverview Generates SCSS utilities for mask-based icons with currentColor support
 */
import { type Config as OptimizeOptions } from "svgo";
/**
 * Configuration for icon mask generation
 */
export interface MaskGeneratorConfig {
    /** Path to SVG icons directory */
    iconDir: string;
    /** Output path for generated SCSS file */
    outputPath: string;
    /** Whether to include before/after pseudo-element variants */
    includePseudoElements: boolean;
    /** Whether to optimize SVG with svgo (default: true) */
    optimizeSvg?: boolean;
    /** Custom svgo configuration (optional) */
    svgoConfig?: OptimizeOptions;
}
/**
 * Generate icon mask SCSS utilities
 */
export declare function generateIconMasks(config?: Partial<MaskGeneratorConfig>): void;
