import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserLoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberme: false,
        role: 'user',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        toast.success('Mock login successful! Redirecting...', { autoClose: 2000 });

        setTimeout(() => {
            const redirectPath = formData.role === 'admin' || formData.role === 'staff'
                ? '/admin'
                : '/user-profile';
            navigate(redirectPath);
        }, 2000);
    };

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4'>
            <div className="w-full max-w-5xl">
                <div className="flex items-center justify-center my-6">
                    <img src="/logo.png" alt='BookStore Logo' width={130} height={70} />
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        <div className="hidden md:flex items-center justify-center bg-blue-50 p-6">
                            <img
                                src="/login.png"
                                alt="Welcome"
                                width={450}
                                height={350}
                                className="object-contain max-h-[400px] w-auto"
                            />
                        </div>

                        <div className="p-6 sm:p-8 md:p-10">
                            <h2 className="text-2xl sm:text-3xl text-center font-bold mb-8 text-gray-700">Welcome Back</h2>

                            <ToastContainer position="top-center" />
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="pl-10 pr-3 py-2.5 w-full border rounded-md"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="pl-10 pr-3 py-2.5 w-full border rounded-md"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Login as</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full py-2.5 px-3 border rounded-md"
                                    >
                                        <option value="user">User</option>
                                        <option value="staff">Staff</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex justify-between items-center">
                                    <label className="flex items-center text-sm text-gray-600">
                                        <input
                                            type="checkbox"
                                            name="rememberme"
                                            checked={formData.rememberme}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        Remember me
                                    </label>
                                    <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                        Forgot Password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center items-center py-2.5 px-4 rounded-md text-white font-medium ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                            Signing in...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <LogIn className="h-5 w-5 mr-2" />
                                            Sign In
                                        </span>
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-600">
                                    New to BookStore?
                                    <a href="/signup/user" className="ml-1 text-blue-600 hover:underline font-medium">
                                        Create an account
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

export default UserLoginPage;
