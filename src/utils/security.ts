// Security utilities for handling tokens and CSRF protection

// Secure token storage using sessionStorage (more secure than localStorage)
export const secureTokenStorage = {
  setToken: (key: string, value: string) => {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to store token securely:', error);
    }
  },

  getToken: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },

  removeToken: (key: string) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  },

  clearAllTokens: () => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }
};

// CSRF token management
export const csrfProtection = {
  getCSRFToken: (): string | null => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;
  },

  addCSRFHeader: (headers: Record<string, string>): Record<string, string> => {
    const csrfToken = csrfProtection.getCSRFToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
    return headers;
  }
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
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
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting for login attempts
export class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) {
      return true;
    }

    // Reset if window has passed
    if (now - attempt.lastAttempt > this.windowMs) {
      this.attempts.delete(identifier);
      return true;
    }

    return attempt.count < this.maxAttempts;
  }

  recordAttempt(identifier: string): void {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (attempt) {
      attempt.count++;
      attempt.lastAttempt = now;
    } else {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
    }
  }

  getRemainingAttempts(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return this.maxAttempts;
    return Math.max(0, this.maxAttempts - attempt.count);
  }
}

// Export a default rate limiter instance
export const loginRateLimiter = new RateLimiter(); 