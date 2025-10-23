import { createIcon, createButton } from "@photosynthesic/nubui";

if (typeof createIcon !== "function") {
    throw new Error("createIcon is not a function");
}
if (typeof createButton !== "function") {
    throw new Error("createButton is not a function");
}

console.log("createIcon import OK");
console.log("createButton import OK");

// Test createButton
const basicButton = createButton({ text: "Click me" });
console.log("Basic button generated:", basicButton.substring(0, 50) + "...");

const primaryButton = createButton({ text: "Primary", type: "primary" });
console.log("Primary button generated:", primaryButton.substring(0, 50) + "...");

const linkButton = createButton({ text: "Link", href: "/page" });
console.log("Link button generated:", linkButton.substring(0, 50) + "...");

console.log("\nAll tests passed!");
