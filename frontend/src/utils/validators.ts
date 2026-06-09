export function validatePassword(password: string): string | null {
  const minLength = 12;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (password.length < minLength) {
    return "Password must be at least 12 characters long.";
  }
  if (!hasLower) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!hasUpper) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!hasNumber) {
    return "Password must contain at least one number.";
  }

  return null;
}
