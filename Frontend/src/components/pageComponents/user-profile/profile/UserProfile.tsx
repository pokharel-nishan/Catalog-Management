import { useState } from 'react';
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from '../../../ui/alert-dialog';
import { toast } from 'react-toastify';

const UserProfilePage = () => {
  const [originalPersonalInfo, setOriginalPersonalInfo] = useState({
    firstName: 'James',
    lastName: 'Shrestha',
    email: 'James@Gmail.Com',
    dateOfBirth: '2002/02/02',
    phoneNumber: '977 9812345678'
  });

  const [originalAddressInfo, setOriginalAddressInfo] = useState({
    country: 'Nepal',
    addressLine1: 'Kathmandu',
    addressLine2: 'Balkumari',
    stateProvinceRegion: 'Bagmati',
    streetAddress: 'Central Road',
    postalCode: '44600'
  });

  const [personalInfo, setPersonalInfo] = useState({...originalPersonalInfo});
  const [addressInfo, setAddressInfo] = useState({...originalAddressInfo});

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  const isPersonalInfoChanged = () => {
    return JSON.stringify(personalInfo) !== JSON.stringify(originalPersonalInfo);
  };

  const isAddressInfoChanged = () => {
    return JSON.stringify(addressInfo) !== JSON.stringify(originalAddressInfo);
  };

  const handlePersonalInfoSubmit = () => {
    if (!isPersonalInfoChanged()) {
      toast.info("No changes made to personal information. Please update fields and save changes.");
      return;
    }
    
    // Simulating API update
    setOriginalPersonalInfo({...personalInfo});
    toast.success("Personal information updated successfully!");
  };

  const handleAddressSubmit = () => {
    if (!isAddressInfoChanged()) {
      toast.info("No changes made to address. Please update fields and save changes.");
      return;
    }
    
    // Simulating API update
    setOriginalAddressInfo({...addressInfo});
    toast.success("Address information updated successfully!");
  };

  const handlePasswordSubmit = () => {
    // Password validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    // Success case
    setIsSuccessDialogOpen(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    // Toast will be shown when dialog is closed
  };

  // Profile image component with cartoon image similar to the screenshot
  const ProfileImage = () => (
    <div className="w-16 h-16 rounded-full overflow-hidden bg-purple-200">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="25" fill="#F87171" />
        <path d="M25 90 Q 50 60 75 90" stroke="#F87171" strokeWidth="5" fill="none" />
        <rect x="35" y="28" width="8" height="12" fill="black" />
        <rect x="57" y="28" width="8" height="12" fill="black" />
        <path d="M40 55 Q 50 65 60 55" stroke="black" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My details</h1>
      
      {/* Personal Information Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Personal information</h2>
        <div className="mb-6 bg-white p-6 rounded-md shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Left Column - Lorem ipsum text */}
            <div className="w-full md:w-1/3 text-sm text-gray-500">
            Update your personal details including your name, date of birth, and contact number. 
            Keeping this information current helps us serve you better.
            </div>
            
            {/* Right Column - Profile and Form */}
            <div className="w-full md:w-2/3">
              {/* Profile Image and Name */}
              <div className="flex items-center mb-6">
                <div className="relative mr-4">
                  <ProfileImage />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{personalInfo.firstName} {personalInfo.lastName}</h3>
                  <p className="text-gray-500">{personalInfo.email}</p>
                </div>
              </div>
              
              {/* Personal Info Form */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">First name</label>
                    <Input
                      name="firstName"
                      value={personalInfo.firstName}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Second name</label>
                    <Input 
                      name="lastName"
                      value={personalInfo.lastName}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date of birth</label>
                    <Input 
                      name="dateOfBirth"
                      value={personalInfo.dateOfBirth}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone number</label>
                    <Input 
                      name="phoneNumber"
                      value={personalInfo.phoneNumber}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                </div>
                <Button
                  onClick={handlePersonalInfoSubmit} 
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Address Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Address</h2>
        <div className="mb-6 bg-white p-6 rounded-md shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Lorem ipsum text */}
            <div className="w-full md:w-1/3 text-sm text-gray-500">
            Provide or update your current address to ensure accurate delivery and location-based services. 
            Make sure all fields are correctly filled out.
            </div>
            
            {/* Right Column - Address Form */}
            <div className="w-full md:w-2/3">
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <Input 
                      name="country"
                      value={addressInfo.country}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address line 1</label>
                    <Input 
                      name="addressLine1"
                      value={addressInfo.addressLine1}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address line 2</label>
                    <Input 
                      name="addressLine2"
                      value={addressInfo.addressLine2}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State/Province/Region</label>
                    <Input 
                      name="stateProvinceRegion"
                      value={addressInfo.stateProvinceRegion}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Street address</label>
                    <Input 
                      name="streetAddress"
                      value={addressInfo.streetAddress}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal code</label>
                    <Input 
                      name="postalCode"
                      value={addressInfo.postalCode}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAddressSubmit} 
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Password Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Password</h2>
        <div className="mb-6 bg-white p-6 rounded-md shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Lorem ipsum text */}
            <div className="w-full md:w-1/3 text-sm text-gray-500">
            Change your account password here. For security, choose a strong password and avoid reusing old ones. 
            Remember to save your changes once you're done.
            </div>
            
            {/* Right Column - Password Form */}
            <div className="w-full md:w-2/3">
              <div className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium mb-1">Current password</label>
                  <div className="relative">
                    <Input
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="pl-10 pr-10"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowCurrentPassword(prev => !prev)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <div className="relative">
                    <Input
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="pl-10 pr-10"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowNewPassword(prev => !prev)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password</label>
                  <div className="relative">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="pl-10 pr-10"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button 
                  onClick={handlePasswordSubmit} 
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Success Dialog */}
      <AlertDialog 
        open={isSuccessDialogOpen} 
        onOpenChange={(open) => {
          setIsSuccessDialogOpen(open);
          if (!open) {
            toast.success("Password changed successfully!");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-green-100 rounded-full">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">Password Changed Successfully</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Your password has been updated. Use your new password the next time you log in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center">
            <AlertDialogAction className="bg-green-600 hover:bg-green-700">
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserProfilePage;