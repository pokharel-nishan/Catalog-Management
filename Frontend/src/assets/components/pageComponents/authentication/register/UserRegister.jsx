'use client';
import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, Check } from 'lucide-react';

const UserSignUpPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        termsConditions: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));

        // Check password strength
        if (name === 'password') {
            const strength = calculatePasswordStrength(value);
            setPasswordStrength(strength);
        }

        // Check password match
        if (name === 'confirmPassword' || (name === 'password' && formData.confirmPassword)) {
            const doesMatch = name === 'confirmPassword'
                ? value === formData.password
                : formData.confirmPassword === value;
            setPasswordMatch(doesMatch);
        }
    };

    const calculatePasswordStrength = (password) => {
        if (!password) return 0;

        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        return strength;
    };

    const getStrengthLabel = () => {
        switch (passwordStrength) {
            case 0: return "Weak";
            case 1: return "Weak";
            case 2: return "Medium";
            case 3: return "Strong";
            case 4: return "Very Strong";
            default: return "Weak";
        }
    };

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case 0: return "bg-red-500";
            case 1: return "bg-red-500";
            case 2: return "bg-yellow-500";
            case 3: return "bg-green-500";
            case 4: return "bg-green-600";
            default: return "bg-red-500";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Reset status messages
        setError('');
        setSuccess('');
    
        if (formData.password !== formData.confirmPassword) {
            setPasswordMatch(false);
            setError('Passwords do not match');
            return;
        }
    
        setLoading(true);
    
        try {
            setTimeout(() => {
                alert('Account created successfully! Redirecting...');
    
                setTimeout(() => {
                    window.location.href = '/login/user';
                }, 3000);
            }, 2000);
    
        } catch (error) {
            const errorMessage = 'An error occurred during registration';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 md:px-8 lg:px-16'>
            <div className="w-full max-w-5xl">
                {/* Logo Section */}
                <div className="flex items-center justify-center my-4 md:my-6">
                    <img src="/logo.png" alt='Medway Logo' width={180} height={90} className="h-auto" />
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                        <div className="hidden md:flex items-center justify-center bg-blue-50 p-6">
                            <img
                                src='/register.png'
                                alt="Sign Up Image"
                                width={450}
                                height={350}
                                className="object-contain max-h-[400px] w-auto"
                            />
                        </div>

                        {/* Form Section */}
                        <div className="p-6 sm:p-8 md:p-10">
                            <h2 className="text-2xl sm:text-3xl text-center font-bold mb-8 text-gray-700">Create Your Account</h2>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-start">
                                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-md flex items-start">
                                    <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                                    <p>{success}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Full Name Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder='John Smith'
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder='your@email.com'
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone Number Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="phoneNumber">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="phoneNumber"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder='9876543210'
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder='••••••••'
                                            required
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ?
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> :
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            }
                                        </div>
                                    </div>
                                    {formData.password && (
                                        <div className="mt-1">
                                            <div className="flex items-center justify-between">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className={`h-2.5 rounded-full ${getStrengthColor()}`}
                                                        style={{ width: `${passwordStrength * 25}%` }}
                                                    ></div>
                                                </div>
                                                <span className="ml-2 text-xs text-gray-500">{getStrengthLabel()}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Use 8+ characters with a mix of letters, numbers & symbols
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`block w-full pl-10 pr-10 py-2.5 border ${!passwordMatch && formData.confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm focus:ring-2`}
                                            placeholder='••••••••'
                                            required
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ?
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> :
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            }
                                        </div>
                                    </div>
                                    {!passwordMatch && formData.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            Passwords do not match
                                        </p>
                                    )}
                                </div>

                                {/* Terms and Conditions */}
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            id="termsConditions"
                                            name="termsConditions"
                                            checked={formData.termsConditions}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="termsConditions" className="font-medium text-gray-700">
                                            I accept all the <a href="/terms" className="text-blue-600 hover:text-blue-800 hover:underline">Terms and Conditions</a>
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !passwordMatch}
                                    className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading || !passwordMatch ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors`}
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <UserPlus className="h-5 w-5 mr-2" />
                                            Sign Up
                                        </span>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="my-6 border-b border-gray-200"></div>

                            {/* Sign In Link */}
                            <div className="text-center">
                                <p className='text-gray-600 text-sm'>
                                    Already have an account?
                                    <a
                                        href='/login/user'
                                        className='ml-1 text-blue-600 font-medium hover:text-blue-800 hover:underline'
                                    >
                                        Sign In
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSignUpPage;
