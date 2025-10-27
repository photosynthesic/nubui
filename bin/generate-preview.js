#!/usr/bin/env node

/**
 * Generate icon preview HTML page
 * Scans available icons and creates an interactive preview page
 */

const fs = require("fs");
const path = require("path");
const {
  DEFAULT_PREVIEW_OUTPUT_PATH,
  CACHE_FILE_PATH,
} = require("../lib/icon/constants.cjs");

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    outputPath: DEFAULT_PREVIEW_OUTPUT_PATH,
    iconDir: null,
    showHelp: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "--help":
      case "-h":
        result.showHelp = true;
        break;
      case "--output":
      case "-o":
        result.outputPath = args[++i];
        break;
      case "--icon-dir":
        result.iconDir = args[++i];
        break;
      default:
        console.warn(`⚠️  Unknown argument: ${arg}`);
    }
  }

  return result;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
📊 Nubui Icon Preview Generator

Usage:
  npx nubui generate-preview [options]

Options:
  --output, -o <path>     Output HTML file path (default: ${DEFAULT_PREVIEW_OUTPUT_PATH})
  --icon-dir <path>       Icon directory path (default: read from cache)
  --help, -h              Show this help message

Note:
  This command requires 'icon:masks' to be run first to generate the cache file.

Examples:
  npx nubui icon:masks                # First, generate masks
  npx nubui generate-preview          # Then, generate preview
  npx nubui generate-preview --output public/preview.html
  npx nubui generate-preview --icon-dir ./custom-icons
`);
}

/**
 * Read cache file to get build configuration
 */
function readCacheFile() {
  try {
    if (!fs.existsSync(CACHE_FILE_PATH)) {
      return null;
    }
    const cacheContent = fs.readFileSync(CACHE_FILE_PATH, "utf8");
    return JSON.parse(cacheContent);
  } catch (error) {
    console.warn(`⚠️  Failed to read cache file: ${error.message}`);
    return null;
  }
}

/**
 * Get icon directory path
 */
function getIconDirectory(customPath) {
  if (customPath && fs.existsSync(customPath)) {
    return customPath;
  }

  // Try to read from cache file first
  const cache = readCacheFile();
  if (cache && cache.optimizedIconDir && fs.existsSync(cache.optimizedIconDir)) {
    return cache.optimizedIconDir;
  }

  // If no cache, show error
  if (!cache) {
    console.error("❌ No build cache found. Please run 'npx nubui icon:masks' first.");
    process.exit(1);
  }

  // Cache exists but directory doesn't exist
  console.error(`❌ Optimized icon directory not found: ${cache.optimizedIconDir}`);
  console.error("Please run 'npx nubui icon:masks' to regenerate icons.");
  process.exit(1);
}

/**
 * Scan for SVG files in directory
 */
function scanIcons(iconDir) {
  if (!fs.existsSync(iconDir)) {
    console.warn(`⚠️  Icon directory not found: ${iconDir}`);
    return [];
  }

  const files = fs.readdirSync(iconDir);
  return files
    .filter((file) => file.endsWith(".svg"))
    .map((file) => path.basename(file, ".svg"));
}

/**
 * Load SVG content for each icon
 */
function loadSVGContent(iconDir, iconNames) {
  const svgContent = {};

  iconNames.forEach(iconName => {
    const svgPath = path.join(iconDir, `${iconName}.svg`);
    try {
      if (fs.existsSync(svgPath)) {
        svgContent[iconName] = fs.readFileSync(svgPath, 'utf-8').trim();
      }
    } catch (error) {
      console.warn(`⚠️  Failed to load SVG for ${iconName}: ${error.message}`);
    }
  });

  return svgContent;
}


/**
 * Load generated mask file (CSS or SCSS)
 */
function loadIconCSS() {
  // Read file path from cache
  const cache = readCacheFile();
  if (!cache) {
    console.error("❌ No build cache found. Please run 'npx nubui icon:masks' first.");
    process.exit(1);
  }

  if (!cache.outputPath) {
    console.error("❌ Cache file is missing outputPath. Please run 'npx nubui icon:masks' again.");
    process.exit(1);
  }

  if (!fs.existsSync(cache.outputPath)) {
    console.error(`❌ Mask file not found: ${cache.outputPath}`);
    console.error("Please run 'npx nubui icon:masks' to regenerate.");
    process.exit(1);
  }

  // Read the mask file
  const maskContent = fs.readFileSync(cache.outputPath, 'utf-8');

  // Check if it's SCSS format (contains SCSS-specific syntax)
  if (maskContent.includes('@mixin') || maskContent.includes('$icon-masks')) {
    console.warn("⚠️  SCSS format detected. Preview may not work correctly.");
    console.warn("ℹ️  For preview generation, use CSS format: --format css");
    console.warn("ℹ️  You can still use SCSS format for your build pipeline.\n");
  }

  return maskContent;
}

/**
 * Generate HTML content
 */
function generateHTML(icons, iconCSS, outputPath, svgContent) {
  // Copy CSS file to same directory as HTML for reference
  const outputDir = path.dirname(outputPath);
  const cssFileName = 'icon-masks.css';
  const cssFilePath = path.join(outputDir, cssFileName);

  // Write the CSS file
  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(cssFilePath, iconCSS, 'utf-8');
    console.log(`✅ Icon CSS file saved: ${cssFilePath}`);
  } catch (error) {
    console.warn(`⚠️  Failed to save CSS file: ${error.message}`);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nubui Icon Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="${cssFileName}">
</head>
<body class="bg-gray-50 min-h-screen">
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Nubui Icon Preview</h1>
      <p class="text-gray-600">Visual preview of ${icons.length} available icons</p>
    </header>

    <!-- Controls -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div class="flex flex-wrap gap-4 items-center">
        <!-- Size Selector -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <select id="sizeSelect" class="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="w-4 h-4">16px (w-4 h-4)</option>
            <option value="w-6 h-6" selected>24px (w-6 h-6)</option>
            <option value="w-8 h-8">32px (w-8 h-8)</option>
            <option value="w-12 h-12">48px (w-12 h-12)</option>
          </select>
        </div>

        <!-- Color Presets -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <div class="flex gap-2">
            <button class="color-btn w-8 h-8 rounded bg-red-500 hover:ring-2 ring-offset-2 ring-red-500" data-color="text-red-500"></button>
            <button class="color-btn w-8 h-8 rounded bg-blue-500 hover:ring-2 ring-offset-2 ring-blue-500" data-color="text-blue-500"></button>
            <button class="color-btn w-8 h-8 rounded bg-green-500 hover:ring-2 ring-offset-2 ring-green-500" data-color="text-green-500"></button>
            <button class="color-btn w-8 h-8 rounded bg-yellow-500 hover:ring-2 ring-offset-2 ring-yellow-500" data-color="text-yellow-500"></button>
            <button class="color-btn w-8 h-8 rounded bg-purple-500 hover:ring-2 ring-offset-2 ring-purple-500" data-color="text-purple-500"></button>
            <button class="color-btn w-8 h-8 rounded bg-gray-700 hover:ring-2 ring-offset-2 ring-gray-700" data-color="text-gray-700"></button>
            <button class="color-btn w-8 h-8 rounded bg-black hover:ring-2 ring-offset-2 ring-black" data-color="text-black"></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Icon Rendering Modes Documentation -->
    <section class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Icon Rendering Modes</h2>
      <p class="text-gray-600 mb-4">Icons can be used in multiple ways. Click any icon to see code examples:</p>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="text-sm">
          <h3 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span class="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
            Mask Mode
          </h3>
          <p class="text-gray-600">CSS mask-image with Tailwind classes and dynamic colors.</p>
        </div>
        <div class="text-sm">
          <h3 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span class="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            Inline SVG
          </h3>
          <p class="text-gray-600">Embed SVG directly in HTML for full control.</p>
        </div>
        <div class="text-sm">
          <h3 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span class="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
            IMG Tag
          </h3>
          <p class="text-gray-600">Reference external SVG files via img tag.</p>
        </div>
      </div>
    </section>

    <!-- Icon Grid -->
    <div id="iconGrid" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
      <!-- Icons will be dynamically inserted here -->
    </div>

    <!-- Modal for Code Sample -->
    <div id="codeModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6">
        <div class="flex justify-between items-start mb-6">
          <h3 class="text-xl font-bold text-gray-900" id="modalTitle">Icon Code</h3>
          <button id="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Mode Tabs -->
        <div class="flex gap-2 mb-4 border-b border-gray-200">
          <button class="mode-tab px-4 py-2 font-medium text-sm border-b-2 border-blue-500 text-blue-600 cursor-pointer" data-mode="mask">
            Mask Mode
          </button>
          <button class="mode-tab px-4 py-2 font-medium text-sm border-b-2 border-transparent text-gray-600 hover:text-gray-900 cursor-pointer" data-mode="inline">
            Inline SVG
          </button>
          <button class="mode-tab px-4 py-2 font-medium text-sm border-b-2 border-transparent text-gray-600 hover:text-gray-900 cursor-pointer" data-mode="img">
            IMG Tag
          </button>
        </div>

        <!-- Code Content -->
        <pre id="codeContent" class="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm"><code></code></pre>

        <!-- Buttons -->
        <button id="copyCode" class="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium">
          Copy to Clipboard
        </button>
      </div>
    </div>
  </div>

  <script>
    const ICONS = ${JSON.stringify(icons)};
    const SVG_CONTENT = ${JSON.stringify(svgContent)};

    let currentSize = 'w-6 h-6';
    let currentColor = 'text-gray-700';
    let currentMode = 'mask';
    let currentIconName = '';

    function generateMaskCode(iconName) {
      return \`<span class="mask-icon-\${iconName} \${currentSize} \${currentColor}"></span>\`;
    }

    function generateInlineCode(iconName) {
      const svgCode = SVG_CONTENT[iconName] || '<svg><!-- SVG content --></svg>';
      return svgCode;
    }

    function generateImgCode(iconName) {
      const sizeMap = {
        'w-4 h-4': '16',
        'w-6 h-6': '24',
        'w-8 h-8': '32',
        'w-12 h-12': '48'
      };
      const size = sizeMap[currentSize] || '24';
      return \`<img src="icons/\${iconName}.svg" alt="\${iconName}" width="\${size}" height="\${size}" />\`;
    }

    function getCodeForMode(iconName, mode) {
      switch(mode) {
        case 'mask':
          return generateMaskCode(iconName);
        case 'inline':
          return generateInlineCode(iconName);
        case 'img':
          return generateImgCode(iconName);
        default:
          return generateMaskCode(iconName);
      }
    }

    function renderIcons() {
      const grid = document.getElementById('iconGrid');
      grid.innerHTML = '';

      ICONS.forEach(iconName => {
        const iconCard = document.createElement('div');
        iconCard.className = 'flex flex-col items-center gap-2 p-4 hover:bg-white rounded-lg cursor-pointer transition-colors';

        const iconContainer = document.createElement('div');
        iconContainer.className = 'flex items-center justify-center';

        // Render mask icon
        const icon = document.createElement('span');
        icon.className = \`mask-icon-\${iconName} \${currentSize} \${currentColor}\`;
        iconContainer.appendChild(icon);

        const iconLabel = document.createElement('p');
        iconLabel.className = 'text-xs text-gray-600 text-center break-all';
        iconLabel.textContent = iconName;

        iconCard.appendChild(iconContainer);
        iconCard.appendChild(iconLabel);

        iconCard.addEventListener('click', () => showCodeModal(iconName));

        grid.appendChild(iconCard);
      });
    }

    function updateCodeDisplay(iconName, mode) {
      const codeContent = document.getElementById('codeContent');
      const code = getCodeForMode(iconName, mode);
      codeContent.querySelector('code').textContent = code;
    }

    function showCodeModal(iconName) {
      const modal = document.getElementById('codeModal');
      const title = document.getElementById('modalTitle');

      currentIconName = iconName;
      currentMode = 'mask';

      title.textContent = \`\${iconName} - Code Sample\`;

      // Reset mode tabs
      document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.classList.remove('border-blue-500', 'text-blue-600');
        tab.classList.add('border-transparent', 'text-gray-600');
      });
      document.querySelector('[data-mode="mask"]').classList.add('border-blue-500', 'text-blue-600');
      document.querySelector('[data-mode="mask"]').classList.remove('border-transparent', 'text-gray-600');

      updateCodeDisplay(iconName, 'mask');
      modal.classList.remove('hidden');
    }

    function switchMode(mode) {
      currentMode = mode;

      // Update tab styling
      document.querySelectorAll('.mode-tab').forEach(tab => {
        if (tab.dataset.mode === mode) {
          tab.classList.remove('border-transparent', 'text-gray-600');
          tab.classList.add('border-blue-500', 'text-blue-600');
        } else {
          tab.classList.remove('border-blue-500', 'text-blue-600');
          tab.classList.add('border-transparent', 'text-gray-600');
        }
      });

      updateCodeDisplay(currentIconName, mode);
    }

    // Event Listeners

    document.getElementById('sizeSelect').addEventListener('change', (e) => {
      currentSize = e.target.value;
      renderIcons();
      if (currentIconName) {
        updateCodeDisplay(currentIconName, currentMode);
      }
    });

    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentColor = btn.dataset.color;
        renderIcons();
        if (currentIconName) {
          updateCodeDisplay(currentIconName, currentMode);
        }
      });
    });

    document.querySelectorAll('.mode-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        switchMode(tab.dataset.mode);
      });
    });

    document.getElementById('closeModal').addEventListener('click', () => {
      document.getElementById('codeModal').classList.add('hidden');
    });

    document.getElementById('copyCode').addEventListener('click', () => {
      const code = document.getElementById('codeContent').querySelector('code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('copyCode');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      });
    });

    // Close modal on outside click
    document.getElementById('codeModal').addEventListener('click', (e) => {
      if (e.target.id === 'codeModal') {
        document.getElementById('codeModal').classList.add('hidden');
      }
    });

    // Initial render
    renderIcons();
  </script>
</body>
</html>`;
}

/**
 * Main function
 */
function main() {
  const args = parseArgs();

  if (args.showHelp) {
    showHelp();
    return;
  }

  console.log("🚀 Generating icon preview page...");

  const iconDir = getIconDirectory(args.iconDir);
  console.log(`📁 Icon directory: ${iconDir}`);

  const icons = scanIcons(iconDir);
  console.log(`✅ Found ${icons.length} icons`);

  if (icons.length === 0) {
    console.warn("⚠️  No icons found. Preview page will be empty.");
  }

  const iconCSS = loadIconCSS();
  console.log(`📝 Icon CSS loaded`);

  const svgContent = loadSVGContent(iconDir, icons);
  console.log(`✅ SVG content loaded`);

  const html = generateHTML(icons, iconCSS, args.outputPath, svgContent);

  // Create output directory if it doesn't exist
  const outputDir = path.dirname(args.outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(args.outputPath, html, "utf-8");

  console.log(`✅ Preview page generated: ${args.outputPath}`);
  console.log(`📊 Total icons: ${icons.length}`);
  console.log("\n💡 Open the file in your browser to view the preview!");
}

main();
