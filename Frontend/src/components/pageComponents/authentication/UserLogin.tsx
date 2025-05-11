import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FormEvent } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    loginAs: "User",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    const isCheckbox = type === "checkbox";

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 p-8">
        <div className="mb-6">
          <h1 className="text-blue-600 text-2xl font-bold mb-2">BookStore</h1>
          <h2 className="text-3xl font-bold mb-2">Login now</h2>
          <p className="text-gray-700">Hi, Welcome back 👋</p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email id"
                className="w-full p-3 bg-gray-100 rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
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
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                Login as
              </label>
              <div className="relative">
                <select
                  name="loginAs"
                  value={formData.loginAs}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 rounded-md appearance-none pr-10"
                >
                  <option>User</option>
                  <option>Staff</option>
                  <option>Admin</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                  <FaChevronDown />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-gray-700 text-sm"
                >
                  Remember Me
                </label>
              </div>
              <a
                href="#forgot"
                className="text-blue-600 text-sm hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#2BA1AA] text-white rounded-md hover:bg-teal-600 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-gray-700 text-sm">
          Not registered yet?{" "}
          <a href="#register" className="text-blue-600 hover:underline">
            Create an account
          </a>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block w-1/2 bg-gray-50">
        <div className="h-full flex items-center justify-center p-8">
          <img
            src="/loginpageillustration.png"
            alt="Login Illustration"
            className="max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
