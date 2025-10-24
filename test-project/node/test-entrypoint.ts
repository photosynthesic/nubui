// TypeScript importテスト
import { getAvailableIcons } from "@photosynthesic/nubui";

if (typeof getAvailableIcons !== "function") {
  throw new Error("getAvailableIcons is not a function (TS)");
}

console.log("getAvailableIcons typescript import OK");

// Get available icons
const icons = getAvailableIcons();
console.log("Available icons:", icons.length);

console.log("\nAll TypeScript tests passed!");
