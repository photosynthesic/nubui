/**
 * nubui configuration for Astro test project
 * Tests that custom configuration is properly applied in SSR environment
 */

import type { NubuiConfig } from "@photosynthesic/nubui";

export const nubuiConfig: NubuiConfig = {
  button: {
    // Custom button styles
    primary: "px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold",
    danger: "px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700",
    sizes: {
      SM: "px-2 py-1 text-sm",
      MD: "px-3 py-1.5 text-base",
      LG: "px-6 py-3 text-lg font-bold",
    },
    shapes: {
      default: "rounded-lg",
      round: "rounded-full",
      circle: "rounded-full w-10 h-10 flex items-center justify-center",
    },
  },
  icon: {
    // Custom icon configuration
    defaultSize: "24px",
    defaultColor: "gray-700",
  },
};
