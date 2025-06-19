'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, Plane, ArrowRight, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

interface SearchItem {
  id: string;
  query: string;
  type: 'registration' | 'flight' | 'airline';
  timestamp: Date;
  results: number;
}

// just more mock data
const mockSearches: SearchItem[] = [
  {
    id: '1',
    query: 'AI101',
    type: 'flight',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    results: 15
  },
  {
    id: '2', 
    query: 'VT-ALB',
    type: 'registration',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    results: 1
  },
  {
    id: '3',
    query: 'SpiceJet',
    type: 'airline',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    results: 127
  },
  {
    id: '4',
    query: 'UK995',
    type: 'flight',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    results: 8
  }
];

// Helper to format date and time and give them a color

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const getSearchIcon = (type: SearchItem['type']) => {
  switch (type) {
    case 'flight':
      return Plane;
    case 'registration':
      return Search;
    case 'airline':
      return Plane;
    default:
      return Search;
  }
};

const getTypeColor = (type: SearchItem['type']) => {
  switch (type) {
    case 'flight':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'registration':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'airline':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export default function RecentSearches() {
  const [searches] = useState<SearchItem[]>(mockSearches);

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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Searches
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your latest aircraft queries
            </p>
          </div>
        </div>
        <Link 
          href="/search"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          View All
        </Link>
      </div>

      {/* Search List */}
      {searches.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {searches.map((search) => {
            const IconComponent = getSearchIcon(search.type);
            return (
              <motion.div
                key={search.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        {search.query}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(search.type)}`}>
                        {search.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{formatTimeAgo(search.timestamp)}</span>
                      <span>•</span>
                      <span>{search.results} results</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No recent searches</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Your search history will appear here
          </p>
        </div>
      )}
    </div>
  );
}
