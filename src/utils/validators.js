const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9 ()-]{7,20}$/;

export const BIO_LIMIT = 200;
export const PASSWORD_MIN_LENGTH = 8;

export const isEmail = (value) => EMAIL_PATTERN.test(value.trim());

function validateEmail(value) {
  if (!value.trim()) return 'Enter your email address.';
  if (!isEmail(value)) return 'Enter an email address in the format name@example.com.';
  return null;
}

// Each validator returns an object with one message per invalid field.
export function validateLogin(values) {
  const errors = {};

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  if (!values.password) {
    errors.password = 'Enter your password.';
  } else if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Your password needs at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  return errors;
}

export function validateProfile(values) {
  const errors = {};
  const name = values.name.trim();

  if (!name) {
    errors.name = 'Enter your full name.';
  } else if (name.length < 2) {
    errors.name = 'Your name needs at least 2 characters.';
  }

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  if (values.jobTitle.trim().length > 60) {
    errors.jobTitle = 'Keep your job title to 60 characters or fewer.';
  }

  if (values.phone.trim() && !PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = 'Enter a phone number using digits, spaces and an optional leading +.';
  }

  if (values.bio.length > BIO_LIMIT) {
    errors.bio = `Keep your bio to ${BIO_LIMIT} characters or fewer.`;
  }

  return errors;
}

export function validateCustomRange(from, to, today) {
  if (!from || !to) return 'Choose both a start date and an end date.';
  if (from > to) return 'The start date must be on or before the end date.';
  if (to > today) return 'The end date cannot be in the future.';
  return null;
}
