import type { UserProfile } from "../types/user";

export const initialUserData: UserProfile = {
  personalInfo: {
    firstName: 'James',
    lastName: 'Maharjan',
    email: 'James@Gmail.Com',
    dateOfBirth: '2002/02/02',
    phoneNumber: '977 9812345678',
    profileImage: '/profile-image.png',
  },
  address: {
    country: 'James',
    addressLine1: 'Maharjan',
    addressLine2: '2002/02/02',
    stateProvinceRegion: '977 9812345678',
    streetAddress: '2002/02/02',
    postalCode: '977 9812345678',
  },
  password: {
    currentPassword: 'susan',
    newPassword: '',
    confirmPassword: '',
  },
};