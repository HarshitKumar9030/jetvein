'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Plane,
    ArrowLeft,
    AlertCircle,
    Loader2,
    User,
    CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import JetVein from '@/components/animations/jetvein';

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    // Check if user is already signed in and redirect to callback URL
    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession();
            if (session) {
                router.push(callbackUrl);
            }
        };
        checkSession();
    }, [router, callbackUrl]);

    // Calculating password strength here, I thought this is pretty necessary here in this app
    // Here is how it works:
    // - 1 point for length >= 8,
    // - 1 point for lowercase letter
    // - 1 point for uppercase letter
    // - 1 point for number
    // - 1 point for special character

    // This gives a maximum score of 5, which is then used to determine the strength level, with 0-2 being weak, 3-4 being medium, and 5 being strong.

    useEffect(() => {
        const password = formData.password;
        let strength = 0;

        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        setPasswordStrength(strength);
    }, [formData.password]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error when user types
    };


    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }

        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        // just a simple regex for email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            // using our signup API endpoint to create a new user
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create account');
            }

            setSuccess(true);

            // Auto sign in after successful registration
            setTimeout(async () => {
                const result = await signIn('credentials', {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                });

                if (result?.ok) {
                    router.push(callbackUrl);
                } else {
                    router.push('/auth/signin?message=Account created successfully. Please sign in.');
                }
            }, 2000);

        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Google sign up
    const handleGoogleSignUp = async () => {
        setIsGoogleLoading(true);
        setError('');

        try {
            // using the google sign-in method from auth.ts
            await signIn('google', { callbackUrl });
        } catch {
            setError('Failed to sign up with Google');
            setIsGoogleLoading(false);
        }
    };

    // this function assigns a color and text based on the password strength
    const getPasswordStrengthInfo = () => {
        switch (passwordStrength) {
            case 0:
            case 1:
                return { color: 'bg-red-500', text: 'Weak', textColor: 'text-red-600' };
            case 2:
                return { color: 'bg-orange-500', text: 'Fair', textColor: 'text-orange-600' };
            case 3:
                return { color: 'bg-yellow-500', text: 'Good', textColor: 'text-yellow-600' };
            case 4:
            case 5:
                return { color: 'bg-green-500', text: 'Strong', textColor: 'text-green-600' };
            default:
                return { color: 'bg-gray-300', text: '', textColor: 'text-gray-500' };
        }
    };

    // motion variants
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Success state
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 text-center max-w-md w-full"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </motion.div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Welcome to JetVein! 🎉
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Your account has been created successfully. You&apos;ll be signed in automatically...
                    </p>

                    <div className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        <span className="ml-2 text-sm text-gray-500">Signing you in...</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">      {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative w-full max-w-md"
            >
                {/* Back Button */}
                <motion.div variants={itemVariants} className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-3 mb-4"
                        >
                            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                                <Plane className="w-6 h-6 text-white" />
                            </div>
                            <JetVein text="JetVein" animation="gradient" className="text-2xl font-bold" />
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                        >
                            Create Account
                        </motion.h1>
                        <motion.p
                            variants={itemVariants}
                            className="text-gray-600 dark:text-gray-400"
                        >
                            Join JetVein to start tracking aircraft
                        </motion.p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                        </motion.div>
                    )}

                    {/* Google */}
                    <motion.div variants={itemVariants} className="mb-6">
                        <button
                            onClick={handleGoogleSignUp}
                            disabled={isGoogleLoading || loading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGoogleLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                {isGoogleLoading ? 'Creating account...' : 'Continue with Google'}
                            </span>
                        </button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                Or create with email
                            </span>
                        </div>
                    </motion.div>

                    <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                    placeholder="John Doe"
                                    disabled={loading || isGoogleLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                    placeholder="you@example.com"
                                    disabled={loading || isGoogleLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                    placeholder="Create a strong password"
                                    disabled={loading || isGoogleLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    disabled={loading || isGoogleLoading}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthInfo().color}`}
                                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                            />
                                        </div>
                                        { /* Displaying the strength text next to the bar */}
                                        <span className={`text-xs font-medium ${getPasswordStrengthInfo().textColor}`}>
                                            {getPasswordStrengthInfo().text}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Use 8+ characters with a mix of letters, numbers & symbols
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                    placeholder="Confirm your password"
                                    disabled={loading || isGoogleLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    disabled={loading || isGoogleLoading}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="w-full rounded border-t  border-gray-300 dark:border-gray-600" />


                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading || isGoogleLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </motion.button>
                    </motion.form>



                    <motion.div variants={itemVariants} className="mt-8 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link
                                href="/auth/signin"
                                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
