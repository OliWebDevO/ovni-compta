/**
 * HTML Sanitization Utilities
 * Security: Prevents XSS attacks by sanitizing user-generated HTML content
 */

import DOMPurify, { type Config } from 'dompurify';

// Configuration for DOMPurify
const SANITIZE_CONFIG: Config = {
  ALLOWED_TAGS: ['strong', 'em', 'u', 'b', 'i', 'br', 'span'],
  ALLOWED_ATTR: ['class'],
  KEEP_CONTENT: true,
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Only allows safe formatting tags (strong, em, u, b, i, br, span)
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: strip all HTML tags as a fallback
    // DOMPurify requires a DOM environment
    return html.replace(/<[^>]*>/g, '');
  }

  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}

/**
 * Formats text with markdown-like bold syntax (**text**) and sanitizes the output
 * Safe to use with dangerouslySetInnerHTML
 */
export function formatTextSafe(text: string): string {
  // First, escape any existing HTML to prevent injection
  const escaped = escapeHtml(text);

  // Then apply formatting
  const formatted = escaped.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-semibold text-gray-900">$1</strong>'
  );

  // Sanitize the final output
  if (typeof window === 'undefined') {
    return formatted;
  }

  return DOMPurify.sanitize(formatted, SANITIZE_CONFIG);
}

/**
 * Escapes HTML special characters to prevent injection
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * Validates and sanitizes a URL
 * Returns null if the URL is invalid or potentially dangerous
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Strips all HTML tags from a string
 * Useful for plain text extraction
 */
export function stripHtml(html: string): string {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>/g, '');
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}
