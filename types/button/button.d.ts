/**
 * Button Component - Simple button with progressive enhancement capabilities
 * @fileoverview NPM package version without HTML template dependencies
 */
import type { ButtonProps } from "./types";
/**
 * Create a button element
 * @param {ButtonProps} props - Button configuration
 * @returns {HTMLElement} Configured button element
 */
export declare function createButton(props: ButtonProps): HTMLElement;
export declare const buttonPresets: {
    basic: {
        text: string;
        classes: string[];
        href: string;
    };
    primary: {
        text: string;
        type: "primary";
        classes: string[];
        href: string;
    };
    dashed: {
        text: string;
        type: "dashed";
        classes: string[];
        href: string;
    };
    text: {
        text: string;
        type: "text";
        classes: string[];
        href: string;
    };
    link: {
        text: string;
        type: "link";
        classes: string[];
        href: string;
    };
    danger: {
        text: string;
        type: "danger";
        classes: string[];
        href: string;
    };
    sm: {
        text: string;
        size: "SM";
        classes: string[];
        href: string;
    };
    md: {
        text: string;
        size: "MD";
        classes: string[];
        href: string;
    };
    lg: {
        text: string;
        size: "LG";
        classes: string[];
        href: string;
    };
    circle: {
        text: string;
        shape: "circle";
        classes: string[];
        href: string;
    };
    round: {
        text: string;
        shape: "round";
        classes: string[];
        href: string;
    };
    block: {
        text: string;
        block: boolean;
        classes: string[];
        href: string;
    };
    iconStart: {
        text: string;
        icon: string;
        iconPosition: "start";
        classes: string[];
        href: string;
    };
    iconEnd: {
        text: string;
        icon: string;
        iconPosition: "end";
        classes: string[];
        href: string;
    };
    htmlButton: {
        text: string;
        element: "button";
        classes: string[];
    };
    submitButton: {
        text: string;
        element: "button";
        htmlType: "submit";
        classes: string[];
    };
    resetButton: {
        text: string;
        element: "button";
        htmlType: "reset";
        classes: string[];
    };
};
