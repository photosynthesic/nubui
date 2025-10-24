import { getAvailableIcons } from "@photosynthesic/nubui";

if (typeof getAvailableIcons !== "function") {
    throw new Error("getAvailableIcons is not a function");
}

console.log("getAvailableIcons import OK");

// Test getAvailableIcons
const icons = getAvailableIcons();
console.log("Available icons:", icons.length);

console.log("\nAll tests passed!");
