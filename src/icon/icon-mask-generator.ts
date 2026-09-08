/**
 * Icon Mask Generator - SCSS Mask Icon Utilities Generator for NPM package
 * @fileoverview Generates SCSS utilities for mask-based icons with currentColor support
 */

import * as fs from "fs";
import * as path from "path";
import { optimize, type Config as OptimizeOptions } from "svgo";
import {
  DEFAULT_ICON_SOURCE_DIR,
  DEFAULT_OPTIMIZED_ICON_DIR,
  DEFAULT_SCSS_OUTPUT_PATH,
  CACHE_FILE_PATH,
} from "./constants.js";

/**
 * Configuration for icon mask generation
 */
export interface MaskGeneratorConfig {
  /** Path to SVG icons directory */
  iconDir: string;
  /** Output directory for optimized SVG files */
  optimizedIconDir: string;
  /** Output path for generated SCSS or CSS file */
  outputPath: string;
  /** Whether to include before/after pseudo-element variants */
  includePseudoElements: boolean;
  /** Whether to optimize SVG with svgo (default: true) */
  optimizeSvg?: boolean;
  /** Custom svgo configuration (optional) */
  svgoConfig?: OptimizeOptions;
  /** Output format: 'scss' or 'css' (default: 'css') */
  format?: 'scss' | 'css';
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: MaskGeneratorConfig = {
  iconDir: DEFAULT_ICON_SOURCE_DIR,
  optimizedIconDir: DEFAULT_OPTIMIZED_ICON_DIR,
  outputPath: DEFAULT_SCSS_OUTPUT_PATH,
  includePseudoElements: true,
  optimizeSvg: true,
};

/**
 * Icon data structure for SCSS generation
 */
interface IconData {
  name: string;
  base64: string;
  optimizedSvg: string;
}

/**
 * Optimize SVG content using svgo
 */
function optimizeSvgContent(
  svgContent: string,
  svgoConfig?: OptimizeOptions
): string {
  try {
    const result = optimize(svgContent, svgoConfig);
    return result.data;
  } catch (error) {
    console.warn(
      `⚠️  SVG optimization failed, using original content: ${error}`
    );
    return svgContent;
  }
}

/**
 * Convert SVG content to base64 data URL
 */
function svgToBase64(
  svgContent: string,
  shouldOptimize: boolean = true,
  svgoConfig?: OptimizeOptions
): string {
  let processedSvg = svgContent;

  // Optimize SVG if enabled
  if (shouldOptimize) {
    processedSvg = optimizeSvgContent(processedSvg, svgoConfig);
  }

  // Clean the SVG content - remove XML declarations and comments
  const cleanedSvg = processedSvg
    .replace(/<\?xml[^>]*>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();

  // Encode to base64
  const base64 = Buffer.from(cleanedSvg, "utf8").toString("base64");
  return base64;
}

/**
 * Read and process all SVG files from the icon directory
 */
function loadIconData(
  iconDir: string,
  optimizeSvg: boolean = true,
  svgoConfig?: OptimizeOptions
): IconData[] {
  const iconData: IconData[] = [];

  try {
    if (!fs.existsSync(iconDir)) {
      throw new Error(`Icon directory does not exist: ${iconDir}`);
    }

    const files = fs.readdirSync(iconDir);
    const svgFiles = files.filter((file) => file.endsWith(".svg"));

    for (const file of svgFiles) {
      const filePath = path.join(iconDir, file);
      const svgContent = fs.readFileSync(filePath, "utf8");
      const name = path.basename(file, ".svg");

      // Get optimized SVG content
      let processedSvg = svgContent;
      if (optimizeSvg) {
        processedSvg = optimizeSvgContent(svgContent, svgoConfig);
      }

      // Clean the SVG content
      const cleanedSvg = processedSvg
        .replace(/<\?xml[^>]*>/g, "")
        .replace(/<!--[\s\S]*?-->/g, "")
        .trim();

      iconData.push({
        name: name,
        base64: svgToBase64(svgContent, optimizeSvg, svgoConfig),
        optimizedSvg: cleanedSvg,
      });
    }

    console.log(`✅ Loaded ${iconData.length} SVG icons from ${iconDir}`);
    if (optimizeSvg) {
      console.log(`🔧 SVG optimization enabled`);
    }
    return iconData;
  } catch (error) {
    throw new Error(`Failed to load icons from ${iconDir}: ${String(error)}`);
  }
}

/**
 * Mask positioning properties, in the order they are emitted.
 */
const MASK_POSITION_PROPERTIES: ReadonlyArray<readonly [string, string]> = [
  ["mask-size", "contain"],
  ["mask-repeat", "no-repeat"],
  ["mask-position", "center"],
];

/**
 * Render the mask declarations shared by every generated rule, `-webkit-` twin
 * first.
 *
 * WebKit before Safari 15.4 (iOS Safari included) only implements the prefixed
 * mask properties. Emitting the unprefixed form alone does not degrade to "no
 * icon" there: the `mask-image` declaration is dropped while the neighbouring
 * `background-color: currentColor` survives, so the element paints as a solid
 * box in the icon's color.
 */
function maskBaseDeclarations(indent: string): string {
  const lines = MASK_POSITION_PROPERTIES.flatMap(([property, value]) => [
    `${indent}-webkit-${property}: ${value};`,
    `${indent}${property}: ${value};`,
  ]);
  lines.push(`${indent}background-color: currentColor;`);
  return lines.join("\n");
}

/**
 * Render a `mask-image` pair, `-webkit-` twin first. `url` is the full CSS
 * value, so callers can pass a literal data URI or an SCSS interpolation.
 */
function maskImageDeclarations(indent: string, url: string): string {
  return [
    `${indent}-webkit-mask-image: ${url};`,
    `${indent}mask-image: ${url};`,
  ].join("\n");
}

/**
 * Feature query matching only browsers that implement neither mask property.
 * Shared by both output formats so the condition cannot drift between them.
 */
const MASK_UNSUPPORTED_QUERY =
  "@supports not ((-webkit-mask-image: none) or (mask-image: none))";

/**
 * Build the fallback that neutralizes `background-color` where masks are
 * unavailable, so the icon renders as nothing rather than as a solid block.
 * Browsers too old to understand `@supports` skip it and keep the pre-existing
 * behaviour.
 */
function maskFallbackRule(selectors: string[], indent: string): string {
  const selectorList = selectors
    .map((selector) => `${indent}${selector}`)
    .join(",\n");

  return `${MASK_UNSUPPORTED_QUERY} {
${selectorList} {
${indent}${indent}background-color: transparent;
${indent}}
}`;
}

/**
 * Generate CSS content with icon classes
 */
function generateCssContent(
  iconData: IconData[],
  includePseudoElements: boolean
): string {
  const timestamp = new Date().toISOString();
  const iconCount = iconData.length;

  let cssContent = `/* Auto-generated icon mask utilities */
/* Generated on: ${timestamp} */
/* Total icons: ${iconCount} */
/* Generated by @photosynthesic/nubui */

/* Base styles for mask icons */
.mask-icon-base {
${maskBaseDeclarations("  ")}
}

/* Icon mask classes */
`;

  // Generate icon classes
  for (const icon of iconData) {
    cssContent += `.mask-icon-${icon.name} {
${maskBaseDeclarations("  ")}
${maskImageDeclarations("  ", `url("data:image/svg+xml;base64,${icon.base64}")`)}
}

`;
  }

  // Generate pseudo-element variants if enabled
  if (includePseudoElements) {
    cssContent += `/* Pseudo-element variants */
`;
    for (const icon of iconData) {
      cssContent += `.before\\:mask-icon-${icon.name}::before {
${maskBaseDeclarations("  ")}
${maskImageDeclarations("  ", `url("data:image/svg+xml;base64,${icon.base64}")`)}
  content: '';
  display: inline-block;
}

.after\\:mask-icon-${icon.name}::after {
${maskBaseDeclarations("  ")}
${maskImageDeclarations("  ", `url("data:image/svg+xml;base64,${icon.base64}")`)}
  content: '';
  display: inline-block;
}

`;
    }
  }

  // Neutralize the solid `background-color` where masks are unsupported. Must
  // trail the rules above so it wins on source order.
  const fallbackSelectors = [
    ".mask-icon-base",
    ...iconData.map((icon) => `.mask-icon-${icon.name}`),
  ];
  if (includePseudoElements) {
    for (const icon of iconData) {
      fallbackSelectors.push(
        `.before\\:mask-icon-${icon.name}::before`,
        `.after\\:mask-icon-${icon.name}::after`
      );
    }
  }

  cssContent += `/* Fallback for browsers without mask support: drop the fill so
   the element renders as nothing rather than a solid block. */
${maskFallbackRule(fallbackSelectors, "  ")}

`;

  cssContent += `/* Usage examples:
 *
 * Basic usage:
 * <div class="mask-icon-heart-line w-6 h-6 text-blue-500"></div>
 *
 * With pseudo-elements:
 * <button class="after:mask-icon-arrow-right after:w-4 after:h-4 after:ml-2">
 *   Next
 * </button>
 *
 * Color customization with currentColor:
 * <span class="mask-icon-star-fill text-yellow-400 hover:text-yellow-500"></span>
 */
`;

  return cssContent;
}

/**
 * Generate SCSS content with mixins and icon classes
 */
function generateScssContent(
  iconData: IconData[],
  includePseudoElements: boolean
): string {
  const timestamp = new Date().toISOString();
  const iconCount = iconData.length;

  // Create icon data map for SCSS
  const iconMapEntries = iconData
    .map((icon) => `  '${icon.name}': '${icon.base64}'`)
    .join(",\n");

  const scssContent = `// Auto-generated icon mask utilities
// Generated on: ${timestamp}
// Total icons: ${iconCount}
// Generated by @photosynthesic/nubui

// Base mixin for all mask icons
@mixin mask-icon-base {
${maskBaseDeclarations("\t")}

	// Without mask support the fill above paints a solid block, so drop it and
	// render nothing instead. Nested in the mixin so every \`@include\` site is
	// covered — the generated classes below and hand-written rules alike.
	${MASK_UNSUPPORTED_QUERY} {
		background-color: transparent;
	}
}

// Icon data map
$icon-masks: (
${iconMapEntries}
);

// Generate mask icon classes
@each $name, $data in $icon-masks {
	.mask-icon-#{$name} {
		@include mask-icon-base;
${maskImageDeclarations("\t\t", 'url("data:image/svg+xml;base64,#{$data}")')}
	}
}
${
  includePseudoElements
    ? `
// Generate pseudo-element variants for flexible usage
@each $name, $data in $icon-masks {
	.before\\:mask-icon-#{$name}::before {
		@include mask-icon-base;
${maskImageDeclarations("\t\t", 'url("data:image/svg+xml;base64,#{$data}")')}
		content: '';
		display: inline-block;
	}

	.after\\:mask-icon-#{$name}::after {
		@include mask-icon-base;
${maskImageDeclarations("\t\t", 'url("data:image/svg+xml;base64,#{$data}")')}
		content: '';
		display: inline-block;
	}
}
`
    : ""
}
// Usage examples:
//
// Basic usage:
// <div class="mask-icon-heart-line w-6 h-6 text-blue-500"></div>
//
// With pseudo-elements:
// <button class="after:mask-icon-arrow-right after:w-4 after:h-4 after:ml-2">
//   Next
// </button>
//
// Color customization with currentColor:
// <span class="mask-icon-star-fill text-yellow-400 hover:text-yellow-500"></span>
`;

  return scssContent;
}

/**
 * Write generated mask file (CSS or SCSS) to file
 */
function writeMaskFile(content: string, outputPath: string, format: 'scss' | 'css'): void {
  try {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(outputPath, content, "utf8");
    const formatUpper = format.toUpperCase();
    console.log(`✅ Generated ${formatUpper} file: ${outputPath}`);
  } catch (error) {
    throw new Error(
      `Failed to write mask file to ${outputPath}: ${String(error)}`
    );
  }
}

/**
 * Write optimized SVG files to format directory
 */
function writeOptimizedSvgs(iconData: IconData[], outputDir: string): void {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let writtenCount = 0;
    for (const icon of iconData) {
      const outputPath = path.join(outputDir, `${icon.name}.svg`);
      fs.writeFileSync(outputPath, icon.optimizedSvg, "utf8");
      writtenCount++;
    }

    console.log(`✅ Saved ${writtenCount} optimized SVG files to ${outputDir}`);
  } catch (error) {
    throw new Error(
      `Failed to write optimized SVG files to ${outputDir}: ${String(error)}`
    );
  }
}

/**
 * Write cache file with build configuration
 */
function writeCacheFile(config: MaskGeneratorConfig): void {
  try {
    const cacheData = {
      iconDir: config.iconDir,
      optimizedIconDir: config.optimizedIconDir,
      outputPath: config.outputPath,
      timestamp: new Date().toISOString(),
    };

    fs.writeFileSync(
      CACHE_FILE_PATH,
      JSON.stringify(cacheData, null, 2),
      "utf8"
    );
    console.log(`✅ Saved build configuration to ${CACHE_FILE_PATH}`);
  } catch (error) {
    console.warn(`⚠️  Failed to write cache file: ${String(error)}`);
    // Don't fail the entire build if cache write fails
  }
}

/**
 * Generate icon mask utilities (CSS or SCSS)
 */
export function generateIconMasks(
  config: Partial<MaskGeneratorConfig> = {}
): void {
  const finalConfig: MaskGeneratorConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    format: config.format || 'css',
  };

  // If optimizedIconDir is not explicitly provided, derive it from iconDir
  if (!config.optimizedIconDir) {
    const baseIconDir = config.iconDir || DEFAULT_ICON_SOURCE_DIR;
    finalConfig.optimizedIconDir = path.join(baseIconDir, "format");
  }

  console.log("🚀 Starting icon mask generation...");
  console.log(`📁 Icon directory: ${finalConfig.iconDir}`);
  console.log(`📁 Optimized icon output: ${finalConfig.optimizedIconDir}`);
  console.log(`📄 Output file: ${finalConfig.outputPath}`);
  console.log(`📋 Format: ${finalConfig.format?.toUpperCase()}`);
  console.log(
    `🔄 Pseudo-elements: ${
      finalConfig.includePseudoElements ? "enabled" : "disabled"
    }`
  );
  console.log(
    `🔧 SVG optimization: ${finalConfig.optimizeSvg ? "enabled" : "disabled"}`
  );

  try {
    // Load icon data
    const iconData = loadIconData(
      finalConfig.iconDir,
      finalConfig.optimizeSvg,
      finalConfig.svgoConfig
    );

    if (iconData.length === 0) {
      console.warn("⚠️  No SVG files found in the icon directory");
      return;
    }

    // Write optimized SVG files
    writeOptimizedSvgs(iconData, finalConfig.optimizedIconDir);

    // Generate content based on format
    let content: string;
    if (finalConfig.format === 'scss') {
      content = generateScssContent(
        iconData,
        finalConfig.includePseudoElements
      );
    } else {
      content = generateCssContent(
        iconData,
        finalConfig.includePseudoElements
      );
    }

    // Write file
    writeMaskFile(content, finalConfig.outputPath, finalConfig.format!);

    console.log("✨ Icon mask generation completed successfully!");
    console.log(`📊 Generated ${iconData.length} icon mask utilities`);

    // Write cache file after all operations succeed
    writeCacheFile(finalConfig);
  } catch (error) {
    console.error(`❌ Icon mask generation failed: ${String(error)}`);
    process.exit(1);
  }
}
// tsup entrypoint enforcement (dummy export)
export const __tsup_force_entry = true;
