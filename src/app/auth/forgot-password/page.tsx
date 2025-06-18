'use client';

import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Mail,
    ArrowLeft,
    Plane,
    AlertCircle,
    Loader2,
    CheckCircle,
    Send
} from 'lucide-react';
import Link from 'next/link';
import JetVein from '@/components/animations/jetvein';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    // if user is already signed in and tries to access forgot-password page, redirect to callback url or / :)
    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession(); // if SESSION found then redirect 
            if (session) {
                router.push(callbackUrl);
            }
        };
        checkSession();
    }, [router, callbackUrl]);

    // Animation variants, same as other auth pages for consistency
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

    // jusr another simple regex for validation
    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // this will handle sending reset emails
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // todo: yet to make this endpoint 
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.toLowerCase().trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send reset email');
            }


            setEmailSent(true);
            setSuccess(true);

        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success && emailSent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 text-center max-w-md w-full"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </motion.div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Check Your Email 📧
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        We&apos;ve sent a password reset link to <strong>{email}</strong>.
                        Please check your inbox and follow the instructions to reset your password.
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/auth/signin"
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign In
                        </Link>

                        <button
                            onClick={() => {
                                setSuccess(false);
                                setEmailSent(false);
                                setEmail('');
                            }}
                            className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            Try with a different email
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Main forgot password form
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
            {/* Background Pattern - same style as other auth pages */}
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
                {/* Back Button - consistent with other auth pages */}
                <motion.div variants={itemVariants} className="mb-8">
                    <Link
                        href="/auth/signin"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                    </Link>
                </motion.div>

                {/* Main Card - same design as signin/signup */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8"
                >
                    {/* Header with JetVein branding */}
                    <div className="text-center mb-8">
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-3 mb-4"
                        >
                            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                                <Plane className="w-6 h-6 text-white" />
                            </div>
                            <JetVein text="JetVein" animation="gradient" className="text-2xl font-bold" />
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                        >
                            Forgot Password?
                        </motion.h1>
                        <motion.p
                            variants={itemVariants}
                            className="text-gray-600 dark:text-gray-400"
                        >
                            No worries! Enter your email and we&apos;ll send you a reset link
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

                    <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                    placeholder="Enter your email address"
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending Reset Link...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Send Reset Link
                                </>
                            )}
                        </motion.button>
                    </motion.form>

                    <motion.div variants={itemVariants} className="mt-8 text-center space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Remember your password?{' '}
                            <Link
                                href="/auth/signin"
                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                                Sign in instead
                            </Link>
                        </p>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/auth/signup"
                                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                            >
                                Create one here
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}