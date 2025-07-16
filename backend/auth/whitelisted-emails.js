// Whitelist of approved underwriter emails
export const WHITELISTED_EMAILS = [
  'hunter@portolacorp.com',
  'underwriter1@company.com',
  'underwriter2@company.com',
  'admin@company.com',
  'supervisor@company.com',
  // Add more approved emails here
];

export const isEmailWhitelisted = (email) => {
  return WHITELISTED_EMAILS.includes(email.toLowerCase());
};