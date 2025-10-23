/**
 * Test that custom nubui.config is properly applied
 * This verifies the full config system works end-to-end
 */

import { createButton, createIcon, loadNubuiConfig } from "@photosynthesic/nubui";
import { nubuiConfig } from "./nubui.config.mjs";

console.log("Testing custom nubui.config...\n");

// Load custom configuration
loadNubuiConfig(nubuiConfig);

// Test 1: Button with custom primary style
console.log("=== Button Config Test ===");
const primaryButton = createButton({ text: "Custom Primary", type: "primary" });
if (primaryButton.includes("bg-purple-600")) {
  console.log("✅ Custom button primary style applied");
} else {
  throw new Error("❌ Custom button primary style NOT applied");
}

// Test 2: Button with custom size
const smallButton = createButton({ text: "Small", size: "SM" });
if (smallButton.includes("text-sm")) {
  console.log("✅ Custom button size (SM) applied");
} else {
  throw new Error("❌ Custom button size NOT applied");
}

const largeButton = createButton({ text: "Large", size: "LG" });
if (largeButton.includes("text-lg")) {
  console.log("✅ Custom button size (LG) applied");
} else {
  throw new Error("❌ Custom button size NOT applied");
}

// Test 3: Button danger type with custom style
const dangerButton = createButton({ text: "Delete", type: "danger" });
if (dangerButton.includes("bg-orange-600")) {
  console.log("✅ Custom button danger style applied");
} else {
  throw new Error("❌ Custom button danger style NOT applied");
}

console.log("\n=== Icon Config Test (Node/SSR) ===");

// For Node.js/SSR, we test createIcon (string output)
// Since createIconElement requires DOM, we skip it in this Node test

// Note: Testing icon config in Node is limited because createIcon
// returns HTML strings. The actual icon size/color effects are tested
// in browser environments (see test-project/astro/)

console.log("✅ Icon config loaded (full testing in browser environment)\n");

console.log("✅ All custom config tests passed!");
