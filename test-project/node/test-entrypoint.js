// CommonJS (require) テスト
const { createIcon } = require("@photosynthesic/nubui");

if (typeof createIcon !== "function") {
    throw new Error("createIcon is not a function (CJS)");
}

console.log("createIcon require OK");
