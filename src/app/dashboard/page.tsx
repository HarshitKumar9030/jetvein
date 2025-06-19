'use client';

import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import RecentSearches from '@/components/dashboard/RecentSearches';
import MyFlights from '@/components/dashboard/MyFlights';
import RecentReviews from '@/components/dashboard/RecentReviews';

export default function Dashboard() {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      // instead of a loading spinner, we use a skeleton screen
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* This covers like all the basic things you will need to know*/}
          <DashboardOverview />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <RecentSearches />
              <RecentReviews />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <MyFlights />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}