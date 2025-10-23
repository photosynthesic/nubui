import { createIcon } from "@photosynthesic/nubui";

if (typeof createIcon !== "function") {
    throw new Error("createIcon is not a function");
}

console.log("createIcon import OK");
