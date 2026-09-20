/**
 * Escapes user-supplied content before it's embedded in HTML emails or
 * JSON-LD structured data. Anything employers/seekers type must pass
 * through these before leaving the server as markup.
 */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Makes a string safe to embed inside a <script type="application/ld+json"> block.
 * JSON.stringify alone is NOT enough: "</script>" inside a string value terminates
 * the script tag in HTML parsing, enabling stored XSS. Escaping <, >, and U+2028/2029
 * closes that hole.
 */
export function escapeJsonLd(value: string): string {
  return value
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function escapeJsonLdObject(obj: unknown): string {
  return escapeJsonLd(JSON.stringify(obj));
}
