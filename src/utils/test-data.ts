export interface UserRegistrationData {
  title: 'Mr' | 'Mrs';
  name: string;
  email: string;
  password: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  newsletter?: boolean;
  specialOffers?: boolean;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface ContactUsData {
  name: string;
  email: string;
  subject: string;
  message: string;
  filePath?: string;
}

/**
 * Generates unique user registration data with dynamic timestamp to avoid collisions
 */
export function generateRandomUser(
  overrides: Partial<UserRegistrationData> = {},
): UserRegistrationData {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  return {
    title: 'Mr',
    name: `TestUser_${timestamp}`,
    email: `auto_user_${timestamp}_${randomSuffix}@example.com`,
    password: 'Password123!',
    birthDay: '15',
    birthMonth: '7',
    birthYear: '1995',
    newsletter: true,
    specialOffers: true,
    firstName: 'Pritesh',
    lastName: 'Tester',
    company: 'QA Automation Inc',
    address1: '742 Evergreen Terrace',
    address2: 'Apt 4B',
    country: 'United States',
    state: 'California',
    city: 'Springfield',
    zipcode: '90210',
    mobileNumber: '+14155552671',
    ...overrides,
  };
}

/**
 * Standard test payment details for simulation
 */
export const defaultPaymentData: PaymentData = {
  nameOnCard: 'Pritesh Tester',
  cardNumber: '4111111111111111',
  cvc: '314',
  expiryMonth: '12',
  expiryYear: '2028',
};

/**
 * Standard test contact us message data
 */
export function generateContactUsData(overrides: Partial<ContactUsData> = {}): ContactUsData {
  const timestamp = Date.now();
  return {
    name: `User Support ${timestamp}`,
    email: `support_user_${timestamp}@example.com`,
    subject: `Automated Test Inquiry ${timestamp}`,
    message: 'This is an automated test feedback submission verifying the contact form workflow.',
    ...overrides,
  };
}
