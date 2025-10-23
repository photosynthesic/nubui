// CommonJS (require) テスト
const { createIcon, createButton } = require("@photosynthesic/nubui");

if (typeof createIcon !== "function") {
    throw new Error("createIcon is not a function (CJS)");
}
if (typeof createButton !== "function") {
    throw new Error("createButton is not a function (CJS)");
}

console.log("createIcon require OK");
console.log("createButton require OK");

// Test createButton
const basicButton = createButton({ text: "Click me" });
console.log("Basic button generated:", basicButton.substring(0, 50) + "...");

const primaryButton = createButton({ text: "Primary", type: "primary" });
console.log("Primary button generated:", primaryButton.substring(0, 50) + "...");

console.log("\nAll CJS tests passed!");
