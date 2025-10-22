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
  disabled?: boolean;

  // Extensible properties (progressive enhancement)
  type?: "primary" | "dashed" | "text" | "link" | "danger";
  size?: "SM" | "MD" | "LG";
  shape?: "default" | "circle" | "round";
  block?: boolean;

  // Icon integration
  icon?: string;
  iconPosition?: "start" | "end";
  iconSize?: number;
  iconMode?: "img" | "inline" | "mask";
}
