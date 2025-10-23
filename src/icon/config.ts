/**
 * Icon system configuration
 * Manages icon-related settings including sizing and color defaults
 */

export interface IconSizeMap {
  [key: string]: string; // e.g., "16px": "w-4 h-4"
}

export interface IconConfig {
  // Icon directory path (can be set via environment variable NUBUI_ICON_DIR)
  directory?: string;

  // Tailwind size class mappings for icons
  sizeMap?: IconSizeMap;

  // Default icon size (in pixels or string like "24px")
  defaultSize?: string | number;

  // Default icon color
  defaultColor?: string;

  // SVG optimization settings
  svgOptimization?: {
    enabled?: boolean;
  };
}

const defaultIconConfig: IconConfig = {
  // Icon directory is auto-detected or set via NUBUI_ICON_DIR env var
  sizeMap: {
    "16px": "w-4 h-4",
    "20px": "w-5 h-5",
    "24px": "w-6 h-6",
    "28px": "w-7 h-7",
    "32px": "w-8 h-8",
    "36px": "w-9 h-9",
    "40px": "w-10 h-10",
    "48px": "w-12 h-12",
    "56px": "w-14 h-14",
    "64px": "w-16 h-16",
  },
  defaultSize: "24px",
  defaultColor: "currentColor",
  svgOptimization: {
    enabled: true,
  },
};

let currentIconConfig: IconConfig = createDefaultConfig();

function createDefaultConfig(): IconConfig {
  return {
    sizeMap: { ...defaultIconConfig.sizeMap },
    defaultSize: defaultIconConfig.defaultSize,
    defaultColor: defaultIconConfig.defaultColor,
    svgOptimization: { ...defaultIconConfig.svgOptimization },
  };
}

export function getIconConfig(): IconConfig {
  return currentIconConfig;
}

export function configureIcon(config: Partial<IconConfig>): void {
  currentIconConfig = {
    ...createDefaultConfig(),
    ...config,
    // Merge sizeMap if provided
    sizeMap: config.sizeMap
      ? { ...defaultIconConfig.sizeMap, ...config.sizeMap }
      : { ...defaultIconConfig.sizeMap },
  };
}

export function resetIconConfig(): void {
  currentIconConfig = createDefaultConfig();
}
