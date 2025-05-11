// types.ts
export interface UserProfile {
    personalInfo: {
      firstName: string;
      lastName: string;
      email: string;
      dateOfBirth: string;
      phoneNumber: string;
      profileImage: string;
    };
    address: {
      country: string;
      addressLine1: string;
      addressLine2: string;
      stateProvinceRegion: string;
      streetAddress: string;
      postalCode: string;
    };
    password: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    };
  }