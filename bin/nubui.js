#!/usr/bin/env node

/**
 * Nubui CLI - Main entry point
 * Routes commands to appropriate handlers
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const COMMANDS = {
  "icon:masks": {
    description: "Generate icon mask CSS utilities",
    script: "./bin/generate-masks.js",
  },
  "icon:preview": {
    description: "Generate icon preview HTML page",
    script: "./bin/generate-preview.js",
  },
  "icon:build": {
    description: "Generate masks, preview, and open in browser",
    handler: iconBuild,
  },
  "icon:clean": {
    description: "Remove generated icon files (SCSS and preview HTML)",
    handler: iconClean,
  },
};

function showHelp() {
  console.log(`
🎨 Nubui CLI - Custom SVG icons for Tailwind CSS

Usage:
  npx nubui <command> [options]

Commands:
  icon:masks      Generate icon mask CSS utilities
  icon:preview    Generate icon preview HTML page
  icon:build      Generate masks + preview and open in browser
  icon:clean      Remove generated icon files

Options:
  --help, -h      Show this help message

Examples:
  npx nubui icon:masks
  npx nubui icon:preview --output public/preview.html
  npx nubui icon:build
  npx nubui icon:clean

For command-specific help:
  npx nubui icon:masks --help
  npx nubui icon:preview --help
`);
}

function iconClean() {
  console.log("🧹 Cleaning generated icon files...\n");

  const filesToRemove = [
    "./src/assets/css/_icon-masks.scss",
    "./docs/icon-preview.html",
  ];

  let removedCount = 0;

  filesToRemove.forEach((file) => {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
        console.log(`✅ Removed: ${file}`);
        removedCount++;
      } catch (error) {
        console.error(`❌ Failed to remove: ${file}`, error.message);
      }
    } else {
      console.log(`⏭️  Not found (skipped): ${file}`);
    }
  });

  console.log(`\n✨ Cleanup completed! Removed ${removedCount} file(s).\n`);
}

function iconBuild() {
  console.log("🚀 Building icons...\n");

  const generateMasksPath = path.join(__dirname, "generate-masks.js");
  const generatePreviewPath = path.join(__dirname, "generate-preview.js");

  // Step 1: Generate masks
  console.log("📝 Step 1/3: Generating icon masks...");
  try {
    execSync(`node "${generateMasksPath}"`, { stdio: "inherit" });
  } catch (error) {
    console.error("❌ Failed to generate masks");
    process.exit(1);
  }

  console.log("\n");

  // Step 2: Generate preview
  console.log("📄 Step 2/3: Generating preview page...");
  try {
    execSync(`node "${generatePreviewPath}"`, { stdio: "inherit" });
  } catch (error) {
    console.error("❌ Failed to generate preview");
    process.exit(1);
  }

  console.log("\n");

  // Step 3: Open in browser
  console.log("🌐 Step 3/3: Opening preview in browser...");
  const previewPath = "docs/icon-preview.html";

  try {
    // Determine OS and use appropriate command
    const platform = process.platform;
    if (platform === "darwin") {
      execSync(`open ${previewPath}`);
    } else if (platform === "win32") {
      execSync(`start ${previewPath}`);
    } else {
      execSync(`xdg-open ${previewPath}`);
    }
    console.log("✅ Preview opened in browser!");
  } catch (error) {
    console.warn(`⚠️  Could not open browser automatically. Please open ${previewPath} manually.`);
  }

  console.log("\n✨ Icon build completed successfully!\n");
}

function main() {
  const args = process.argv.slice(2);

  // Show help if no arguments or --help
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    showHelp();
    return;
  }

  const command = args[0];

  // Check if command exists
  if (!COMMANDS[command]) {
    console.error(`❌ Unknown command: ${command}\n`);
    showHelp();
    process.exit(1);
  }

  const commandConfig = COMMANDS[command];

  // Execute command
  if (commandConfig.handler) {
    // Custom handler function
    commandConfig.handler();
  } else if (commandConfig.script) {
    // Delegate to script
    const scriptPath = path.resolve(__dirname, "..", commandConfig.script);
    const scriptArgs = args.slice(1).join(" ");

    try {
      execSync(`node ${scriptPath} ${scriptArgs}`, { stdio: "inherit" });
    } catch (error) {
      process.exit(1);
    }
  }
}

main();
