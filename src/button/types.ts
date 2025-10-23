/**
 * Button component types
 */

/**
 * Button component configuration interface
 */
export interface ButtonProps {
  // Basic properties
  text?: string;
  classes?: string[];

  // Element type control
  element?: "button" | "a";

  // HTML attributes
  htmlType?: "button" | "submit" | "reset";
  href?: string;
  target?: string;
  rel?: string; // rel attribute for anchor elements
  disabled?: boolean;
  autoSecurity?: boolean; // auto-add rel="noopener noreferrer" for target="_blank" (default: true)

  // Extensible properties (progressive enhancement)
  // Note: These accept string to support custom config-based values
  type?: string; // "primary" | "dashed" | "text" | "link" | "danger" | custom
  size?: string; // "SM" | "MD" | "LG" | custom
  shape?: string; // "default" | "circle" | "round" | custom
  block?: boolean;

  // Icon integration
  icon?: string;
  iconPosition?: "start" | "end";
  iconSize?: number;
  iconMode?: "img" | "inline" | "mask";
}
