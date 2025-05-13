import React, { useState } from 'react';
import { Eye, EyeOff, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Input } from '../../../ui/input';
import { Progress } from '../../../ui/progress';
import { Button } from '../../../ui/button';
import { Alert, AlertDescription, AlertTitle, } from '../../../ui/alert';
import { AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
 } from '../../../ui/alert-dialog';

interface Props {
  onPasswordChange: () => void;
}

const PasswordForm: React.FC<Props> = ({ onPasswordChange }) => {
  const [formValues, setFormValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    root: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '', root: '' }));
  };

  const validate = () => {
    const errors: typeof formErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      root: '',
    };

    const { currentPassword, newPassword, confirmPassword } = formValues;

    if (!currentPassword) errors.currentPassword = "Current password is required";
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else {
      if (newPassword.length < 8) errors.newPassword = "Password must be at least 8 characters";
      else if (!/[A-Z]/.test(newPassword)) errors.newPassword = "Must include uppercase letter";
      else if (!/[a-z]/.test(newPassword)) errors.newPassword = "Must include lowercase letter";
      else if (!/[0-9]/.test(newPassword)) errors.newPassword = "Must include number";
      else if (!/[^A-Za-z0-9]/.test(newPassword)) errors.newPassword = "Must include special character";
    }
    if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match";

    setFormErrors(errors);
    return Object.values(errors).every((v) => v === '');
  };

  const mockVerifyCurrentPassword = async (password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(password === "password123"), 500);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const isValid = await mockVerifyCurrentPassword(formValues.currentPassword);
    if (!isValid) {
      setFormErrors((prev) => ({
        ...prev,
        currentPassword: "Current password is incorrect",
      }));
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsSuccessDialogOpen(true);
    onPasswordChange();
    setFormValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    return Math.min(strength, 100);
  };

  const passwordStrength = calculatePasswordStrength(formValues.newPassword);

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Good";
    return "Strong";
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Change Password</h2>

      {formErrors.root && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formErrors.root}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block font-medium mb-1">Current Password</label>
          <div className="relative">
            <Input
              name="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={formValues.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter current password"
              className="pl-10 pr-10"
            />
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
            >
              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {formErrors.currentPassword && <p className="text-red-500 text-sm mt-1">{formErrors.currentPassword}</p>}
        </div>

        {/* New Password */}
        <div>
          <label className="block font-medium mb-1">New Password</label>
          <div className="relative">
            <Input
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={formValues.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
              className="pl-10 pr-10"
            />
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {formValues.newPassword && (
            <>
              <div className="mt-2">
                <div className="flex justify-between mb-1 text-sm">
                  <span>Password strength:</span>
                  <span className={passwordStrength > 60 ? "text-green-600" : passwordStrength > 30 ? "text-yellow-600" : "text-red-600"}>
                    {getStrengthText()}
                  </span>
                </div>
                <Progress value={passwordStrength} className={`h-2 ${getStrengthColor()}`} />
              </div>
              <ul className="text-xs mt-2 space-y-1 pl-4 list-disc">
                <li className={formValues.newPassword.length >= 8 ? "text-green-600" : "text-red-600"}>At least 8 characters</li>
                <li className={/[A-Z]/.test(formValues.newPassword) ? "text-green-600" : "text-red-600"}>Uppercase letter</li>
                <li className={/[a-z]/.test(formValues.newPassword) ? "text-green-600" : "text-red-600"}>Lowercase letter</li>
                <li className={/[0-9]/.test(formValues.newPassword) ? "text-green-600" : "text-red-600"}>Number</li>
                <li className={/[^A-Za-z0-9]/.test(formValues.newPassword) ? "text-green-600" : "text-red-600"}>Special character</li>
              </ul>
            </>
          )}
          {formErrors.newPassword && <p className="text-red-500 text-sm mt-1">{formErrors.newPassword}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block font-medium mb-1">Confirm Password</label>
          <div className="relative">
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formValues.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
              className="pl-10 pr-10"
            />
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {formErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>}
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="px-6" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>

      <AlertDialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
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

export default PasswordForm;
