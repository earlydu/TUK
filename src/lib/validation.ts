// utils/validation.ts

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone: string) => {
  const regex = /^\d+$/;
  return regex.test(phone);
};

export const validateRequired = (value: string) => {
  return value.trim() !== "";
};

export const validatePincode = (pincode: string) => {
  const regex = /^[1-9][0-9]{5}$/;
  return regex.test(pincode);
};