import { parsePhoneNumberFromString } from "libphonenumber-js";

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  try {
    const phone = parsePhoneNumberFromString(phoneNumber, "BR");
    if (!phone) {
      return false;
    }
    return phone.isValid();
  } catch (error) {
    return false;
  }
};
