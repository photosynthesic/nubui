// TypeScript importテスト
import { createIcon, createButton, type ButtonProps } from "@photosynthesic/nubui";

if (typeof createIcon !== "function") {
  throw new Error("createIcon is not a function (TS)");
}
if (typeof createButton !== "function") {
  throw new Error("createButton is not a function (TS)");
}

console.log("createIcon typescript import OK");
console.log("createButton typescript import OK");

// Type-safe button props
const buttonProps: ButtonProps = {
  text: "Test",
  type: "primary",
  size: "LG",
};

createButton(buttonProps);
console.log("Button created with type-safe props");

console.log("\nAll TypeScript tests passed!");
