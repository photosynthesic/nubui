// CommonJS (require) テスト
const { getAvailableIcons } = require("@photosynthesic/nubui");

if (typeof getAvailableIcons !== "function") {
    throw new Error("getAvailableIcons is not a function (CJS)");
}

console.log("getAvailableIcons require OK");

// Test getAvailableIcons
const icons = getAvailableIcons();
console.log("Available icons:", icons.length);

console.log("\nAll CJS tests passed!");
