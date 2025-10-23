/**
 * nubui configuration for test project
 * Tests that custom configuration is properly applied
 */

export const nubuiConfig = {
  button: {
    // Override default button styles
    primary: "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold",
    danger: "px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700",
    sizes: {
      SM: "px-2 py-1 text-sm",
      LG: "px-6 py-3 text-lg font-bold",
    },
  },
  icon: {
    // Custom icon configuration
    defaultSize: "32px",
    defaultColor: "blue-600",
    sizeMap: {
      "16px": "w-4 h-4",
      "20px": "w-5 h-5",
      "24px": "w-6 h-6",
      "32px": "w-8 h-8",
      "40px": "w-10 h-10",
    },
  },
};
