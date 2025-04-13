/**
 * Checks if a password meets the strength requirements
 * @param password The password to check
 * @returns boolean indicating if the password is strong enough
 */
export const isStrongPassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

/**
 * Gets the password strength requirements message
 * @returns string with password requirements
 */
export const getPasswordRequirementsMessage = (): string => {
  return 'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.';
}; 