// TypeScript importテスト
import { createIcon } from "@photosynthesic/nubui";

if (typeof createIcon !== "function") {
  throw new Error("createIcon is not a function (TS)");
}

console.log("createIcon typescript import OK");
