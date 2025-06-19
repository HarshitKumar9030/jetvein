'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp, MoreHorizontal, Plane, Calendar } from 'lucide-react';
import Link from 'next/link';

export interface ReviewData {
  id: string;
  flightNumber: string;
  airline: string;
  aircraft: {
    registration: string;
    model: string;
  };
  route: {
    from: string;
    to: string;
  };
  rating: number;
  title: string;
  content: string;
  date: Date;
  likes: number;
  helpful: boolean;
  categories: {
    comfort: number;
    service: number;
    entertainment: number;
    food: number;
  };
}

// add some mock data here based on the above interface
const mockReviews: ReviewData[] = [
  {
    id: '1',
    flightNumber: 'AI101',
    airline: 'Air India',
    aircraft: {
      registration: 'VT-ALB',
      model: 'Boeing 787-8'
    },
    route: {
      from: 'DEL',
      to: 'BOM'
    },
    rating: 4,
    title: 'Excellent service and comfortable seats',
    content: 'The flight was smooth and the crew was very professional. The entertainment system worked well and meals were decent. Would definitely fly again.',
    date: new Date('2024-12-15T20:30:00'),
    likes: 12,
    helpful: true,
    categories: {
      comfort: 4,
      service: 5,
      entertainment: 4,
      food: 3
    }
  },
  {
    id: '2',
    flightNumber: 'UK995',
    airline: 'Vistara',
    aircraft: {
      registration: 'VT-TVB',
      model: 'Airbus A320neo'
    },
    route: {
      from: 'BOM',
      to: 'BLR'
    },
    rating: 5,
    title: 'Outstanding experience with Vistara',
    content: 'Premium economy was worth every penny. Excellent food, attentive crew, and the aircraft was in perfect condition.',
    date: new Date('2024-12-10T15:20:00'),
    likes: 8,
    helpful: false,
    categories: {
      comfort: 5,
      service: 5,
      entertainment: 4,
      food: 5
    }
  },
  {
    id: '3',
    flightNumber: 'SG8157',
    airline: 'SpiceJet',
    aircraft: {
      registration: 'VT-SPN',
      model: 'Boeing 737-800'
    },
    route: {
      from: 'BLR',
      to: 'CCU'
    },
    rating: 3,
    title: 'Average experience, could be better',
    content: 'Flight was on time but the seats were quite cramped. Food options were limited and entertainment system was outdated.',
    date: new Date('2024-12-05T11:45:00'),
    likes: 3,
    helpful: true,
    categories: {
      comfort: 2,
      service: 3,
      entertainment: 2,
      food: 3
    }
  }
];

const formatDate = (date: Date) => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
  const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
    </div>
  );
};

export default function RecentReviews() {
  const [reviews] = useState<ReviewData[]>(mockReviews);

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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Reviews
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your latest flight reviews and ratings
            </p>
          </div>
        </div>
        <Link 
          href="/reviews"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          View All
        </Link>
      </div>
      {reviews.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group border border-gray-100 dark:border-gray-600"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <Plane className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {review.flightNumber}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {review.airline}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {review.route.from} → {review.route.to}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.likes}</span>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {review.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {review.content}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {Object.entries(review.categories).map(([category, rating]) => (
                  <div key={category} className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize mb-1">
                      {category}
                    </div>
                    <div className="flex justify-center">
                      {renderStars(rating, 'sm')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(review.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {review.aircraft.model}
                  </span>
                  {review.helpful && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs">
                      Helpful
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No reviews yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Share your flight experiences with other travelers
          </p>
          <Link 
            href="/flights"
            className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Write a Review
          </Link>
        </div>
      )}
    </div>
  );
}
