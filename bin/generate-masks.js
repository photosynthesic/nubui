#!/usr/bin/env node

/**
 * @photosynthesic/nubui CLI - Generate SCSS mask utilities
 * @fileoverview Command-line interface for generating icon mask utilities
 */

const { generateIconMasks } = require('../lib/icon/icon-mask-generator.js');

/**
 * Parse command line arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const result = {
        includePseudoElements: true,
        optimizeSvg: true,
        showHelp: false,
        showVersion: false,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        switch (arg) {
            case '--icon-dir':
            case '-i':
                result.iconDir = args[++i];
                break;
            case '--output':
            case '-o':
                result.outputPath = args[++i];
                break;
            case '--no-pseudo':
                result.includePseudoElements = false;
                break;
            case '--no-optimize':
                result.optimizeSvg = false;
                break;
            case '--svgo-config':
                result.svgoConfigPath = args[++i];
                break;
            case '--help':
            case '-h':
                result.showHelp = true;
                break;
            case '--version':
            case '-v':
                result.showVersion = true;
                break;
            default:
                if (arg.startsWith('-')) {
                    console.error(`Unknown option: ${arg}`);
                    process.exit(1);
                }
                break;
        }
    }

    return result;
}

/**
 * Show help message
 */
function showHelp() {
    console.log(`
@photosynthesic/nubui - Generate SCSS mask utilities

USAGE:
  npx @photosynthesic/nubui generate-masks [OPTIONS]

OPTIONS:
  -i, --icon-dir <path>       SVG icon directory path
                              (default: ./src/assets/images/format/icon)

  -o, --output <path>         Output SCSS file path
                              (default: ./src/assets/css/_icon-masks.scss)

  --no-pseudo                 Disable pseudo-element variants (::before, ::after)

  --no-optimize               Skip SVG optimization with svgo
                              (default: optimization enabled)

  --svgo-config <path>        Custom svgo configuration file path

  -h, --help                  Show this help message

  -v, --version               Show version number

EXAMPLES:
  # Basic usage (with SVG optimization)
  npx @photosynthesic/nubui generate-masks

  # Custom paths
  npx @photosynthesic/nubui generate-masks --icon-dir ./assets/icons --output ./styles/_icons.scss

  # Disable SVG optimization
  npx @photosynthesic/nubui generate-masks --no-optimize

  # Use custom svgo config
  npx @photosynthesic/nubui generate-masks --svgo-config ./svgo.config.js

For more information, visit: https://github.com/photosynthesic/nubui
`);
}

/**
 * Show version
 */
function showVersion() {
    try {
        // Try to read package.json from the installed package
        const packageJson = require('../package.json');
        console.log(`@photosynthesic/nubui v${packageJson.version}`);
    } catch {
        console.log('@photosynthesic/nubui v1.0.0');
    }
}

/**
 * Main CLI function
 */
function main() {
    const args = parseArgs();

    if (args.showHelp) {
        showHelp();
        return;
    }

    if (args.showVersion) {
        showVersion();
        return;
    }

    // Execute the mask generation
    try {
        const config = {
            ...(args.iconDir && { iconDir: args.iconDir }),
            ...(args.outputPath && { outputPath: args.outputPath }),
            includePseudoElements: args.includePseudoElements,
            optimizeSvg: args.optimizeSvg,
        };

        // Load custom svgo config if provided
        if (args.svgoConfigPath) {
            try {
                const svgoConfig = require(require('path').resolve(args.svgoConfigPath));
                config.svgoConfig = svgoConfig;
            } catch (error) {
                console.error(`Failed to load svgo config from ${args.svgoConfigPath}: ${error.message}`);
                process.exit(1);
            }
        }

        generateIconMasks(config);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

// Run the CLI
main();