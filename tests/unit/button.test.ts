import { describe, it, expect, afterEach } from "vitest";
import { createButton } from "../../src/button/button";
import { configureButton, resetButtonConfig } from "../../src/button/config";
import { loadNubuiConfig } from "../../src/config";
import { resetIconConfig } from "../../src/icon/config";

describe("Button System - createButton (SSR/HTML string)", () => {
  afterEach(() => {
    // Ensure config is reset between tests
    resetButtonConfig();
  });

  it("should return anchor element by default", () => {
    const html = createButton({ text: "Click me" });
    expect(html).toContain("<a");
    expect(html).toContain("Click me");
    expect(html).toContain("</a>");
  });

  it("should return anchor element with href", () => {
    const html = createButton({ text: "Go", href: "/page" });
    expect(html).toContain('<a href="/page"');
    expect(html).toContain("Go");
    expect(html).toContain("</a>");
  });

  it("should return button element when explicitly set", () => {
    const html = createButton({ text: "Submit", element: "button" });
    expect(html).toContain("<button");
    expect(html).toContain("Submit");
    expect(html).toContain("</button>");
  });

  it("should apply block style", () => {
    const html = createButton({ text: "Block", block: true });
    expect(html).toContain("w-full");
  });

  it("should handle disabled button", () => {
    const html = createButton({ text: "Disabled", disabled: true });
    expect(html).toContain("disabled");
    expect(html).toContain("opacity-50");
    expect(html).toContain("cursor-not-allowed");
  });

  it("should handle disabled anchor element", () => {
    const html = createButton({
      text: "Disabled Link",
      href: "/page",
      disabled: true,
    });
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('tabindex="-1"');
    expect(html).toContain('role="button"');
  });

  it("should set htmlType for button element", () => {
    const html = createButton({
      text: "Submit",
      htmlType: "submit",
    });
    expect(html).toContain("<button");
    expect(html).toContain('type="submit"');
  });

  it("should set target for anchor element", () => {
    const html = createButton({
      text: "External",
      href: "/page",
      target: "_blank",
    });
    expect(html).toContain('target="_blank"');
  });

  it("should auto-add rel for target='_blank'", () => {
    const html = createButton({
      text: "External",
      href: "/page",
      target: "_blank",
    });
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("should allow overriding rel attribute", () => {
    const html = createButton({
      text: "External",
      href: "/page",
      target: "_blank",
      rel: "noopener",
    });
    expect(html).toContain('rel="noopener"');
    expect(html).not.toContain("noreferrer");
  });

  it("should disable auto-security with autoSecurity=false", () => {
    const html = createButton({
      text: "External",
      href: "/page",
      target: "_blank",
      autoSecurity: false,
    });
    expect(html).not.toContain("rel=");
  });

  it("should escape HTML in text", () => {
    const html = createButton({ text: "<script>alert('xss')</script>" });
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("should integrate icon at start position", () => {
    const html = createButton({
      text: "With Icon",
      icon: "heart",
      iconPosition: "start",
    });
    expect(html).toContain("inline-flex");
    expect(html).toContain("gap-2");
    expect(html).toContain("flex");
    expect(html).toContain("items-center");
  });

  it("should integrate icon at end position", () => {
    const html = createButton({
      text: "With Icon",
      icon: "heart",
      iconPosition: "end",
    });
    expect(html).toContain("inline-flex");
    // Verify icon comes after text in the HTML
    const withIconMatch = html.match(/With Icon.*mask-icon-heart/);
    expect(withIconMatch).toBeTruthy();
  });

  it("should apply custom classes", () => {
    const html = createButton({
      text: "Custom",
      classes: ["custom-class", "another-class"],
    });
    expect(html).toContain("custom-class");
    expect(html).toContain("another-class");
  });

  it("should apply icon with custom size", () => {
    const html = createButton({
      text: "Icon",
      icon: "star",
      iconSize: 24,
    });
    expect(html).toContain("mask-icon-star");
  });

  it("should apply icon with custom mode", () => {
    const html = createButton({
      text: "Icon",
      icon: "star",
      iconMode: "inline",
    });
    // inline mode returns SVG directly, not mask classes
    expect(html).toContain("<svg");
  });
});

describe("Button System - Configuration", () => {
  afterEach(() => {
    // Reset to defaults after each test
    resetButtonConfig();
  });

  it("should use default configuration", () => {
    const html = createButton({ text: "Primary", type: "primary" });
    expect(html).toContain("bg-blue-600");
    expect(html).toContain("text-white");
  });

  it("should apply custom button type configuration", () => {
    configureButton({
      primary:
        "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700",
    });

    const html = createButton({ text: "Primary", type: "primary" });
    expect(html).toContain("bg-green-600");
    expect(html).toContain("text-white");
  });

  it("should apply custom size configuration", () => {
    configureButton({
      sizes: {
        SM: "px-1 py-0.5 text-xs",
        LG: "px-8 py-4 text-xl",
      },
    });

    const smallHtml = createButton({ text: "Small", size: "SM" });
    expect(smallHtml).toContain("text-xs");

    const largeHtml = createButton({ text: "Large", size: "LG" });
    expect(largeHtml).toContain("text-xl");
  });

  it("should apply custom shape configuration", () => {
    configureButton({
      shapes: {
        square: "rounded-none",
        pill: "rounded-full px-8",
      },
    });

    const squareHtml = createButton({ text: "Square", shape: "square" });
    expect(squareHtml).toContain("rounded-none");

    const pillHtml = createButton({ text: "Pill", shape: "pill" });
    expect(pillHtml).toContain("rounded-full");
    expect(pillHtml).toContain("px-8");
  });

  it("should apply custom disabled state configuration", () => {
    configureButton({
      disabled: "opacity-25 cursor-not-allowed pointer-events-none",
    });

    const html = createButton({ text: "Disabled", disabled: true });
    expect(html).toContain("opacity-25");
    expect(html).toContain("cursor-not-allowed");
    expect(html).toContain("pointer-events-none");
  });

  it("should merge custom config with defaults", () => {
    configureButton({
      primary: "bg-purple-600",
    });

    // Custom primary config
    const primaryHtml = createButton({ text: "Primary", type: "primary" });
    expect(primaryHtml).toContain("bg-purple-600");

    // Danger should still use default
    const dangerHtml = createButton({ text: "Danger", type: "danger" });
    expect(dangerHtml).toContain("bg-red-600");
  });

  it("should reset to default configuration", () => {
    configureButton({
      primary: "bg-custom-color",
    });

    resetButtonConfig();

    const html = createButton({ text: "Primary", type: "primary" });
    expect(html).toContain("bg-blue-600");
    expect(html).not.toContain("bg-custom-color");
  });
});

describe("Button System - Validation", () => {
  afterEach(() => {
    resetButtonConfig();
  });

  it("should throw error when href is used with element='button'", () => {
    expect(() => {
      createButton({
        text: "Invalid",
        element: "button",
        href: "/page",
      });
    }).toThrow("ValidationError: 'href' cannot be used with element='button'");
  });

  it("should throw error when htmlType is used with element='a'", () => {
    expect(() => {
      createButton({
        text: "Invalid",
        element: "a",
        htmlType: "submit",
      });
    }).toThrow("ValidationError: 'htmlType' cannot be used with element='a'");
  });

  it("should auto-convert to button element when htmlType is specified", () => {
    const html = createButton({
      text: "Submit",
      htmlType: "submit",
    });
    expect(html).toContain("<button");
    expect(html).toContain('type="submit"');
  });

  it("should allow anchor with href", () => {
    const html = createButton({
      text: "Link",
      href: "/page",
    });
    expect(html).toContain('href="/page"');
  });

  it("should allow anchor without explicit href (defaults to #)", () => {
    const html = createButton({
      text: "Link",
    });
    expect(html).toContain("<a");
    expect(html).toContain('href="#"');
  });
});

describe("Button System - Unified Config (loadNubuiConfig)", () => {
  afterEach(() => {
    resetButtonConfig();
    resetIconConfig();
  });

  it("should apply button configuration via loadNubuiConfig", () => {
    loadNubuiConfig({
      button: {
        primary: "bg-purple-600 text-white",
      },
    });

    const html = createButton({ text: "Primary", type: "primary" });
    expect(html).toContain("bg-purple-600");
    expect(html).toContain("text-white");
  });

  it("should merge loadNubuiConfig with default config", () => {
    loadNubuiConfig({
      button: {
        primary: "bg-green-600",
      },
    });

    // Custom config applied
    const html = createButton({ text: "Primary", type: "primary" });
    expect(html).toContain("bg-green-600");

    // Other types still use defaults
    const dangerHtml = createButton({ text: "Danger", type: "danger" });
    expect(dangerHtml).toContain("bg-red-600");
  });
});
