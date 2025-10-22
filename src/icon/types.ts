/**
 * Icon rendering modes for different use cases
 */
export type IconOutputMode = "img" | "inline" | "mask";

/**
 * Configuration object for creating customizable icons
 */
export interface IconArgs {
  /**
   * Name of the icon file (without .svg extension)
   * @example "phone-line", "rocket-line", "gift-line"
   */
  iconName: string;

  /**
   * Output mode for the icon rendering
   * @default "mask"
   */
  mode?: IconOutputMode;

  /**
   * Size of the icon (applies to both width and height)
   * @default 24
   * @example 32, "2rem", "48px"
   */
  size?: string | number;

  /**
   * Color for the icon in various formats
   * @example "#3b82f6", "blue-500", "text-red-400"
   */
  color?: string;

  /**
   * Additional HTML attributes to apply to the icon element
   * @example { "aria-label": "Menu icon", "data-testid": "nav-icon" }
   */
  attributes?: Record<string, string>;

  /**
   * Additional CSS styles to apply to the icon element
   * @example { "cursor": "pointer", "margin": "0 8px" }
   */
  styles?: Record<string, string>;

  /**
   * Alt text for the icon for accessibility
   * @example "Rocket icon", "Phone icon"
   */
  alt?: string;
}
