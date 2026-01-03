/**
 * Generates a unique Login ID based on the Dayflow format:
 * 2 letters company + 2 letters first name + 2 letters last name + 4 digit year + 4 digit serial
 * Example: DAJOHA20240001
 */
export const generateLoginId = (
  companyName: string,
  firstName: string,
  lastName: string,
  serialNumber: number = 1
): string => {
  const company = companyName.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
  const first = firstName.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
  const last = lastName.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
  const year = new Date().getFullYear().toString();
  const serial = serialNumber.toString().padStart(4, '0');

  return `${company}${first}${last}${year}${serial}`;
};

/**
 * Generates a secure random password
 * Format: 12 characters with uppercase, lowercase, numbers, and special characters
 */
export const generatePassword = (): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%&*';
  
  const allChars = uppercase + lowercase + numbers + special;
  
  // Ensure at least one of each type
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill remaining characters
  for (let i = 4; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number (10 digits)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/[^0-9]/g, ''));
};

/**
 * Password strength validation
 */
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain an uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain a lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain a number' };
  }
  return { isValid: true, message: 'Password is strong' };
};
