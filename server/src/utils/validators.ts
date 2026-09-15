/**
 * Validates whether a phone number matches standard Indian mobile formats:
 * - 10 digits starting with 6, 7, 8, 9
 * - Optional prefix: +91, 91, or 0
 * - Optional hyphens or spaces separating prefix or digit groups
 */
export const INDIAN_PHONE_REGEX = /^(?:\+91|91|0)?[6-9]\d{9}$/;

export function isValidIndianPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  // Remove whitespace, hyphens, and parentheses to isolate prefix and digits
  const cleaned = phone.trim().replace(/[\s\-()]/g, '');
  return INDIAN_PHONE_REGEX.test(cleaned);
}

/**
 * Normalizes phone numbers to standard format:
 * Extracts the last 10 digits and formats as +91XXXXXXXXXX
 */
export function normalizePhone(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  const last10 = digitsOnly.slice(-10);
  return `+91${last10}`;
}

/**
 * Normalizes email addresses:
 * Trims leading/trailing whitespace and converts to lowercase.
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}
