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

/**
 * Binary Magic-Number MIME Validation
 * Validates that an uploaded file's actual binary signature matches an allowed type.
 * Prevents MIME-type spoofing (e.g. a .php file renamed to .pdf).
 */
export interface MagicCheckResult {
  valid: boolean;
  mimeType: string;
  error?: string;
}

const MAGIC_SIGNATURES: Array<{ bytes: number[]; mime: string }> = [
  { bytes: [0x25, 0x50, 0x44, 0x46], mime: "application/pdf" },   // %PDF
  { bytes: [0xff, 0xd8, 0xff],       mime: "image/jpeg" },         // JPEG
  { bytes: [0x89, 0x50, 0x4e, 0x47], mime: "image/png" },          // PNG
  { bytes: [0x52, 0x49, 0x46, 0x46], mime: "image/webp" },         // RIFF (WebP)
];

export function validateFileMagicNumber(buffer: ArrayBuffer): MagicCheckResult {
  const bytes = new Uint8Array(buffer);
  for (const sig of MAGIC_SIGNATURES) {
    if (sig.bytes.every((b, i) => bytes[i] === b)) {
      return { valid: true, mimeType: sig.mime };
    }
  }
  return {
    valid: false,
    mimeType: "application/octet-stream",
    error: "File type not allowed. Only PDF, JPEG, PNG, and WebP are accepted.",
  };
}

/**
 * Safe JSON Extraction from LLM Responses
 * Strips markdown fences and attempts to parse the first valid JSON object/array.
 * Returns a typed value or the provided fallback on failure.
 */
export function extractAndParseJson<T>(raw: string, fallback: T): T {
  if (!raw || typeof raw !== "string") return fallback;

  // Remove markdown code fences
  let cleaned = raw
    .replace(/```(?:json)?\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  // Try parsing the full cleaned string
  try {
    return JSON.parse(cleaned) as T;
  } catch { /* continue */ }

  // Try extracting the first {...} JSON object
  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try { return JSON.parse(objMatch[0]) as T; } catch { /* continue */ }
  }

  // Try extracting the first [...] JSON array
  const arrMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    try { return JSON.parse(arrMatch[0]) as T; } catch { /* continue */ }
  }

  return fallback;
}
