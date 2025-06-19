'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Clock, Calendar, MoreHorizontal, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export interface FlightData {
  id: string;
  flightNumber: string;
  airline: string;
  aircraft: {
    registration: string;
    model: string;
  };
  route: {
    from: {
      code: string;
      city: string;
    };
    to: {
      code: string;
      city: string;
    };
  };
  date: Date;
  status: 'completed' | 'scheduled' | 'delayed' | 'cancelled';
  duration: string;
}

// just some more mock data
const mockFlights: FlightData[] = [
  {
    id: '1',
    flightNumber: 'AI101',
    airline: 'Air India',
    aircraft: {
      registration: 'VT-ALB',
      model: 'Boeing 787-8'
    },
    route: {
      from: { code: 'DEL', city: 'Delhi' },
      to: { code: 'BOM', city: 'Mumbai' }
    },
    date: new Date('2024-12-15T14:30:00'),
    status: 'completed',
    duration: '2h 15m'
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
      from: { code: 'BOM', city: 'Mumbai' },
      to: { code: 'BLR', city: 'Bangalore' }
    },
    date: new Date('2024-12-10T08:45:00'),
    status: 'completed',
    duration: '1h 30m'
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
      from: { code: 'BLR', city: 'Bangalore' },
      to: { code: 'CCU', city: 'Kolkata' }
    },
    date: new Date('2024-12-25T16:20:00'),
    status: 'scheduled',
    duration: '2h 45m'
  }
];
// Helper to format flight status colors and text
const getStatusColor = (status: FlightData['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'delayed':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getStatusText = (status: FlightData['status']) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'scheduled':
      return 'Scheduled';
    case 'delayed':
      return 'Delayed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

const formatDate = (date: Date) => {
  const now = new Date();
  const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays === -1) return 'Yesterday';
  if (diffInDays > 0) return `In ${diffInDays} days`;
  if (diffInDays < 0) return `${Math.abs(diffInDays)} days ago`;
  
  return date.toLocaleDateString();
};

export default function MyFlights() {
  const [flights] = useState<FlightData[]>(mockFlights);
  // same variants as usual to maintain consistency 
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
          <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              My Flights
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your recent and upcoming flights
            </p>
          </div>
        </div>
        <Link 
          href="/flights"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          View All
        </Link>
      </div>

      {flights.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {flights.map((flight) => (
            <motion.div
              key={flight.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group border border-gray-100 dark:border-gray-600"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {flight.flightNumber}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {flight.airline}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {flight.aircraft.model} • {flight.aircraft.registration}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(flight.status)}`}>
                    {getStatusText(flight.status)}
                  </span>
                  <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-900 dark:text-white">
                      {flight.route.from.code}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-16">
                      {flight.route.from.city}
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center relative">
                    <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
                    <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300">
                      {flight.duration}
                    </div>
                    <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
                    <ArrowRight className="w-4 h-4 text-gray-400 absolute right-0" />
                  </div>

                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-900 dark:text-white">
                      {flight.route.to.code}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-16">
                      {flight.route.to.city}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(flight.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{flight.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-8">
          <Plane className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No flights found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Your flight history will appear here
          </p>
        </div>
      )}
    </div>
  );
}
