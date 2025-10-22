/**
 * Button component types
 */
/**
 * Button component configuration interface
 */
export interface ButtonProps {
    text?: string;
    classes?: string[];
    element?: "button" | "a";
    htmlType?: "button" | "submit" | "reset";
    href?: string;
    target?: string;
    disabled?: boolean;
    type?: "primary" | "dashed" | "text" | "link" | "danger";
    size?: "SM" | "MD" | "LG";
    shape?: "default" | "circle" | "round";
    block?: boolean;
    icon?: string;
    iconPosition?: "start" | "end";
    iconSize?: number;
    iconMode?: "img" | "inline" | "mask";
}
