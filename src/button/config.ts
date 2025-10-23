/**
 * Button component configuration system
 * Manages global button styling configuration
 */

export interface ButtonStyleConfig {
  [key: string]: string;
}

export interface ButtonSizesConfig {
  [key: string]: string;
}

export interface ButtonShapesConfig {
  [key: string]: string;
}

export interface ButtonConfig {
  // Style presets (types)
  basic?: string;
  primary?: string;
  danger?: string;
  dashed?: string;
  text?: string;
  link?: string;
  [key: string]: string | ButtonSizesConfig | ButtonShapesConfig | undefined;

  // Size variations
  sizes?: ButtonSizesConfig;

  // Shape variations
  shapes?: ButtonShapesConfig;

  // State styles
  disabled?: string;
  loading?: string;
}

/**
 * Default button configuration
 * Can be overridden via configureButton()
 */
const defaultConfig: ButtonConfig = {
  // Type styles (presets)
  basic: "px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50",
  primary: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
  danger: "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
  dashed: "px-4 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400",
  text: "px-2 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded",
  link: "text-blue-600 hover:text-blue-700 underline hover:no-underline",

  // Size variations
  sizes: {
    SM: "px-2 py-1 text-sm",
    MD: "px-4 py-2 text-base",
    LG: "px-6 py-3 text-lg",
  },

  // Shape variations
  shapes: {
    default: "",
    circle: "w-10 h-10 rounded-full flex items-center justify-center",
    round: "rounded-full",
  },

  // State styles
  disabled: "opacity-50 cursor-not-allowed",
  loading: "opacity-75 cursor-wait",
};

/**
 * Current global button configuration
 */
let currentConfig: ButtonConfig = { ...defaultConfig };

/**
 * Get the current button configuration
 */
export function getButtonConfig(): ButtonConfig {
  return currentConfig;
}

/**
 * Get a specific style class by type
 */
export function getButtonStyle(type: string = "basic"): string {
  const config = currentConfig;
  const style = config[type] as string | undefined;
  return style || (config.basic as string);
}

/**
 * Get size classes
 */
export function getButtonSize(size?: string): string {
  if (!size) return "";
  const sizes = currentConfig.sizes as ButtonSizesConfig | undefined;
  return sizes?.[size] || "";
}

/**
 * Get shape classes
 */
export function getButtonShape(shape?: string): string {
  if (!shape || shape === "default") return "";
  const shapes = currentConfig.shapes as ButtonShapesConfig | undefined;
  return shapes?.[shape] || "";
}

/**
 * Get disabled state classes
 */
export function getDisabledStyle(): string {
  return (currentConfig.disabled as string) || "";
}

/**
 * Configure global button settings
 * Merges with defaults
 */
export function configureButton(config: Partial<ButtonConfig>): void {
  currentConfig = {
    ...defaultConfig,
    ...config,
    // Preserve sizes and shapes objects if provided
    sizes: {
      ...(defaultConfig.sizes as ButtonSizesConfig),
      ...(config.sizes || {}),
    },
    shapes: {
      ...(defaultConfig.shapes as ButtonShapesConfig),
      ...(config.shapes || {}),
    },
  };
}

/**
 * Reset to default configuration
 */
export function resetButtonConfig(): void {
  currentConfig = { ...defaultConfig };
}
