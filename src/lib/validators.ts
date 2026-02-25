// =====================================================
// Centralized Form Validation Utilities
// =====================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate phone number (Indian + international)
 */
export function isValidPhone(phone: string): boolean {
  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-()]/g, '');
  // Indian: 10 digits or +91 followed by 10 digits
  // International: + followed by 7-15 digits
  const phoneRegex = /^(\+?\d{7,15}|\d{10})$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validate coupon code format
 */
export function isValidCouponCode(code: string): boolean {
  // Alphanumeric, uppercase, 3-20 chars
  const couponRegex = /^[A-Z0-9_]{3,20}$/;
  return couponRegex.test(code.toUpperCase().trim());
}

/**
 * Validate that a name has at least 2 characters and no numbers
 */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2 && !/\d/.test(name);
}

/**
 * Validate age for 8-16 age group
 */
export function isValidKidsAge(age: number): boolean {
  return Number.isInteger(age) && age >= 8 && age <= 16;
}

/**
 * Validate password strength
 * At least 8 chars, one uppercase, one lowercase, one number
 */
export function isStrongPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate admin username format
 */
export function isValidUsername(username: string): boolean {
  // 3-50 chars, alphanumeric + underscore + dot
  const usernameRegex = /^[a-zA-Z0-9_.]{3,50}$/;
  return usernameRegex.test(username);
}

/**
 * Validate a positive amount (for prices, discounts)
 */
export function isPositiveAmount(amount: number): boolean {
  return typeof amount === 'number' && amount > 0 && isFinite(amount);
}

/**
 * Validate percentage (0-100)
 */
export function isValidPercentage(value: number): boolean {
  return typeof value === 'number' && value >= 0 && value <= 100;
}

/**
 * Validate date string (ISO format)
 */
export function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Check if a date is in the future
 */
export function isFutureDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date > new Date();
}

/**
 * Sanitize text input (remove HTML tags)
 */
export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

/**
 * Validate group booking seats (min 2)
 */
export function isValidGroupSeats(seats: number): boolean {
  return Number.isInteger(seats) && seats >= 2;
}

/**
 * Validate a list of email addresses (for group booking members)
 */
export function validateEmailList(emails: string[]): {
  valid: string[];
  invalid: string[];
} {
  const valid: string[] = [];
  const invalid: string[] = [];

  emails.forEach((email) => {
    const trimmed = email.trim();
    if (trimmed && isValidEmail(trimmed)) {
      valid.push(trimmed.toLowerCase());
    } else if (trimmed) {
      invalid.push(trimmed);
    }
  });

  return { valid, invalid };
}
