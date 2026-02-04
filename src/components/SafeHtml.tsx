'use client';

import { useEffect, useState } from 'react';
import DOMPurify, { type Config } from 'dompurify';

// Configuration for DOMPurify
const SANITIZE_CONFIG: Config = {
  ALLOWED_TAGS: ['strong', 'em', 'u', 'b', 'i', 'br', 'span'],
  ALLOWED_ATTR: ['class'],
  KEEP_CONTENT: true,
};

/**
 * Escapes HTML special characters
 */
function escapeHtml(text: string): string {
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
 * Formats text with markdown-like bold syntax (**text**) and sanitizes the output
 */
function formatAndSanitize(text: string): string {
  // First, escape any existing HTML to prevent injection
  const escaped = escapeHtml(text);

  // Then apply formatting
  const formatted = escaped.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-semibold text-gray-900">$1</strong>'
  );

  // Sanitize the final output
  return DOMPurify.sanitize(formatted, SANITIZE_CONFIG);
}

interface SafeHtmlProps {
  html: string;
  className?: string;
  as?: 'span' | 'div' | 'p';
  format?: boolean;
}

/**
 * SafeHtml Component
 * Renders HTML content safely using DOMPurify sanitization
 * Prevents XSS attacks while allowing basic formatting
 */
export function SafeHtml({ html, className, as: Component = 'span', format = false }: SafeHtmlProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState<string>('');

  useEffect(() => {
    if (format) {
      setSanitizedHtml(formatAndSanitize(html));
    } else {
      setSanitizedHtml(DOMPurify.sanitize(html, SANITIZE_CONFIG));
    }
  }, [html, format]);

  // During SSR, show plain text
  if (typeof window === 'undefined') {
    return <Component className={className}>{html.replace(/<[^>]*>/g, '')}</Component>;
  }

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}

/**
 * Hook for safe HTML formatting
 * Returns a sanitized HTML string that can be used with dangerouslySetInnerHTML
 */
export function useSafeHtml(html: string, format: boolean = false): string {
  const [sanitizedHtml, setSanitizedHtml] = useState<string>('');

  useEffect(() => {
    if (format) {
      setSanitizedHtml(formatAndSanitize(html));
    } else {
      setSanitizedHtml(DOMPurify.sanitize(html, SANITIZE_CONFIG));
    }
  }, [html, format]);

  return sanitizedHtml;
}

/**
 * Synchronous sanitization function for client-side use
 * Only use this when you're certain the code runs on the client
 */
export function sanitizeHtmlClient(html: string): string {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>/g, '');
  }
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}

/**
 * Format text with **bold** syntax and sanitize
 */
export function formatTextSafeClient(text: string): string {
  if (typeof window === 'undefined') {
    return text.replace(/\*\*(.*?)\*\*/g, '$1');
  }
  return formatAndSanitize(text);
}
