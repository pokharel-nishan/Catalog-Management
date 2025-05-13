import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom"; // ✅ React Router for redirection
import apiClient from "../../../api/config.ts";
import { toast } from "react-toastify";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export default function UserRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  const isPasswordValid = (password: string) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[@]/.test(password)
    );
  };

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic client-side validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.address ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        password: formData.password,
      };

      const response = await apiClient.post("/User/register", payload);

      toast.success("Registration successful! Redirecting to login page...");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
      });

      // ✅ Redirect after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {

      if (error.response) {
        console.error("Registration failed:", error.response.data);
        toast.error(
          error.response.data.message ||
            "Registration failed. Please try again."
        );
      } else {
        console.error("Unexpected error:", error.message);
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-6">
            <h1 className="text-blue-600 text-2xl font-bold mb-2">BookStore</h1>
            <h2 className="text-3xl font-bold mb-4">Register Now</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full p-3 bg-gray-100 rounded-md"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full p-3 bg-gray-100 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-3 bg-gray-100 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full p-3 bg-gray-100 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full p-3 bg-gray-100 rounded-md pr-10"
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {isPasswordFocused && (
                <p
                  className={`text-xs mt-1 ${
                    isPasswordValid(formData.password)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Password must be at least 8 characters and include uppercase,
                  lowercase, number, and @
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full p-3 bg-gray-100 rounded-md pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start mt-4">
              <input
                type="checkbox"
                id="terms"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="h-4 w-4 mt-1 text-blue-600 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-gray-700 text-sm">
                I agree to the{" "}
                <a href="#terms" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={
                !formData.termsAccepted ||
                isSubmitting ||
                !isPasswordValid(formData.password)
              }
              className={`w-full py-3 mt-2 ${
                formData.termsAccepted &&
                !isSubmitting &&
                isPasswordValid(formData.password)
                  ? "bg-[#2BA1AA] hover:bg-teal-600"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white rounded-md transition duration-300`}
            >
              {isSubmitting ? "Submitting..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-700 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block w-1/2 bg-gray-50">
          <div className="h-full flex items-center justify-center p-8">
            <img
              src="/registerpageillustration.png"
              alt="shopping illustration"
              className="max-h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
