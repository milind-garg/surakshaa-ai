/**
 * Security Utility Module — Input Sanitization, Validation & XSS Prevention
 */

/**
 * Basic XSS Sanitization: Replaces dangerous HTML characters with safe HTML entities
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
  // Note: forward slash (/) is NOT encoded — it is not dangerous in HTML context
  // and encoding it breaks display of values like "IT/Software". Apply DOMPurify
  // at render time if you need to sanitize user-generated HTML content.
}

/**
 * Strict Email Sanitization and Formatting
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== "string") return "";
  return email.trim().toLowerCase().slice(0, 254);
}

/**
 * RFC 5321 Compliant Email Validation Regex
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Password Validation Constraints
 */
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (!password) {
    return { valid: false, message: "Password is required." };
  }
  // NIST SP 800-63B: minimum 8 characters
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long." };
  }
  if (password.length > 128) {
    return { valid: false, message: "Password cannot exceed 128 characters." };
  }
  return { valid: true };
}
