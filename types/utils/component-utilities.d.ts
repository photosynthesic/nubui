/**
 * Common component utilities for HTML element creation and manipulation
 * @fileoverview Shared utilities for component creation and styling
 */
/**
 * Create HTML element from template string with variable substitution
 * @param {string} htmlTemplate - HTML template string
 * @param {Record<string, any>} props - Properties for template variable substitution
 * @returns {Document} Document fragment containing the parsed HTML
 *
 * @example
 * ```typescript
 * const template = '<button class="btn">{{text}}</button>';
 * const html = createHtml(template, { text: 'Click me' });
 * const button = html.querySelector('button');
 * ```
 */
export declare function createHtml(htmlTemplate: string, props?: Record<string, any>): Document;
/**
 * Add CSS classes to an element
 * @param {Element} element - Target element
 * @param {string[]} classes - Array of CSS classes to add
 *
 * @example
 * ```typescript
 * const button = document.createElement('button');
 * addClasses(button, ['btn', 'btn-primary', 'btn-lg']);
 * ```
 */
export declare function addClasses(element: Element, classes: string[]): void;
/**
 * Remove CSS classes from an element
 * @param {Element} element - Target element
 * @param {string[]} classes - Array of CSS classes to remove
 */
export declare function removeClasses(element: Element, classes: string[]): void;
/**
 * Toggle CSS classes on an element
 * @param {Element} element - Target element
 * @param {string[]} classes - Array of CSS classes to toggle
 */
export declare function toggleClasses(element: Element, classes: string[]): void;
/**
 * Set attributes on an element
 * @param {Element} element - Target element
 * @param {Record<string, string>} attributes - Key-value pairs of attributes
 */
export declare function setAttributes(element: Element, attributes: Record<string, string>): void;
/**
 * Set styles on an element
 * @param {HTMLElement} element - Target element
 * @param {Record<string, string>} styles - Key-value pairs of CSS styles
 */
export declare function setStyles(element: HTMLElement, styles: Record<string, string>): void;
