'use client';

import { motion } from 'framer-motion';
import { getSession } from 'next-auth/react';
import { TrendingUp, Plane, Clock, Star, Target, Users, MapPin, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Session } from 'next-auth';

// exporting might need it for the api 🫡
export interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    color: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}


// add some mock data here
const statsData = [
    {
        title: 'Total Flights',
        value: 47,
        subtitle: 'Flights tracked',
        icon: Plane,
        color: 'from-blue-500 to-cyan-500',
        trend: { value: 12, isPositive: true }
    },
    {
        title: 'Flight Hours',
        value: '156h',
        subtitle: 'Time in air',
        icon: Clock,
        color: 'from-green-500 to-emerald-500',
        trend: { value: 8, isPositive: true }
    },
    {
        title: 'Reviews Written',
        value: 23,
        subtitle: 'Helpful reviews',
        icon: Star,
        color: 'from-yellow-500 to-orange-500',
        trend: { value: 3, isPositive: true }
    },
    {
        title: 'Countries Visited',
        value: 8,
        subtitle: 'Destinations',
        icon: MapPin,
        color: 'from-purple-500 to-pink-500',
        trend: { value: 2, isPositive: true }
    }
];

const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }: StatCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                        <TrendingUp className={`w-4 h-4 ${trend.isPositive ? '' : 'rotate-180'}`} />
                        <span>{trend.value}%</span>
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {value}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {subtitle}
                </p>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {title}
                </p>
            </div>
        </motion.div>
    );
};

export default function DashboardOverview() {


    const [session, setSession] = useState<Session | null>(null);
    useEffect(() => {
        // This is just to ensure session is fetched on client side
        getSession().then(session => {
            if (session) {
                console.log('Session fetched:', session);
                setSession(session);
            }
        });
    }, []);


    // gets user's name from the session
    const getUserName = () => {
        if (session?.user?.name) {
            return session.user.name;
        }
        return 'Pilot';
    }


    // same variats to maintain consistency, maybe will change these
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-6">
            {/* Could make this in a seperate component, but for now it's fine here */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden"
            >
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {getUserName()}! ✈️</h1>
                    <p className="text-blue-100 mb-4">
                        Track your flights, manage your travel history, and discover new aircraft.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Last flight: 5 days ago</span>
                        </div>

                    </div>
                </div>

                {/* Background shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {statsData.map((stat, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <StatCard {...stat} />
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
            >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Quick Actions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all text-left group"
                    >
                        <Plane className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Search Aircraft</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Find flights and aircraft details</p>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 transition-all text-left group"
                    >
                        <Star className="w-5 h-5 text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Write Review</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Share your flight experience</p>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 transition-all text-left group"
                    >
                        <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Community</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Connect with other aviation enthusiasts</p>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
