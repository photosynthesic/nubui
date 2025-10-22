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
export function createHtml(
  htmlTemplate: string,
  props: Record<string, any> = {}
): Document {
  // Simple template variable substitution
  let processedHtml = htmlTemplate;

  // Replace template variables like {{variable}} with prop values
  Object.entries(props).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    processedHtml = processedHtml.replace(regex, String(value));
  });

  // Remove any remaining unsubstituted variables
  processedHtml = processedHtml.replace(/{{[^}]*}}/g, "");

  // Create a new document fragment and parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(processedHtml, "text/html");

  return doc;
}

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
export function addClasses(element: Element, classes: string[]): void {
  if (!element || !classes || !Array.isArray(classes)) {
    return;
  }

  // Filter out empty strings and add valid classes
  const validClasses = classes.filter(
    (cls) => cls && typeof cls === "string" && cls.trim()
  );
  element.classList.add(...validClasses);
}

/**
 * Remove CSS classes from an element
 * @param {Element} element - Target element
 * @param {string[]} classes - Array of CSS classes to remove
 */
export function removeClasses(element: Element, classes: string[]): void {
  if (!element || !classes || !Array.isArray(classes)) {
    return;
  }

  const validClasses = classes.filter(
    (cls) => cls && typeof cls === "string" && cls.trim()
  );
  element.classList.remove(...validClasses);
}

/**
 * Toggle CSS classes on an element
 * @param {Element} element - Target element
 * @param {string[]} classes - Array of CSS classes to toggle
 */
export function toggleClasses(element: Element, classes: string[]): void {
  if (!element || !classes || !Array.isArray(classes)) {
    return;
  }

  const validClasses = classes.filter(
    (cls) => cls && typeof cls === "string" && cls.trim()
  );
  validClasses.forEach((cls) => element.classList.toggle(cls));
}

/**
 * Set attributes on an element
 * @param {Element} element - Target element
 * @param {Record<string, string>} attributes - Key-value pairs of attributes
 */
export function setAttributes(
  element: Element,
  attributes: Record<string, string>
): void {
  if (!element || !attributes) {
    return;
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (key && typeof key === "string" && value !== undefined) {
      element.setAttribute(key, String(value));
    }
  });
}

/**
 * Set styles on an element
 * @param {HTMLElement} element - Target element
 * @param {Record<string, string>} styles - Key-value pairs of CSS styles
 */
export function setStyles(
  element: HTMLElement,
  styles: Record<string, string>
): void {
  if (!element || !styles) {
    return;
  }

  Object.entries(styles).forEach(([property, value]) => {
    if (property && typeof property === "string" && value !== undefined) {
      element.style.setProperty(property, String(value));
    }
  });
}
