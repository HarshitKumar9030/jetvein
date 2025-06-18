'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plane, Clock, Calendar, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import JetVein from '@/components/animations/jetvein';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

interface AircraftData {
  aircraft: {
    registration: string;
    model: string;
    age: number;
    image: string | null;
  };
  airline: string;
  flightNumber: string;
  recentFlights: Array<{
    date: string;
    from: string;
    to: string;
    duration: string;
  }>;
}

export default function Home() {
  const [flightNumber, setFlightNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [aircraftData, setAircraftData] = useState<AircraftData | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightNumber.trim()) return;

    setLoading(true);
    setError('');
    setAircraftData(null);

    try {
      // TODO: Implement API call in next phase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data for demonstration
      setAircraftData({
        aircraft: {
          registration: 'VT-ANJ',
          model: 'Airbus A320neo',
          age: 3.5,
          image: null
        },
        airline: 'Air India',
        flightNumber: flightNumber.toUpperCase(),
        recentFlights: [
          { date: '2025-06-13', from: 'DEL', to: 'BOM', duration: '2h 15m' },
          { date: '2025-06-12', from: 'BOM', to: 'BLR', duration: '1h 30m' },
          { date: '2025-06-11', from: 'BLR', to: 'DEL', duration: '2h 45m' }
        ]
      });
    } catch {
      setError('Failed to fetch flight data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30">
 
      
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              rotate: [360, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Hero Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              className="mb-8"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
              >
                <Zap className="w-4 h-4" />
                With Real-Time Tracking 
              </motion.div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                Track Any{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  <JetVein text="AirCraft" animation="gradient" />
                </span>
                <br />
                Instantly
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Enter a flight number to discover detailed aircraft information, specifications, 
                and comprehensive flight history with <JetVein text='JetVein' animation='glitch'/>.
              </p>
            </motion.div>

            {/* Search Section */}
            <motion.div
              variants={fadeInUp}
              className="max-w-2xl mx-auto mb-16"
            >
              <form onSubmit={handleSearch} className="relative">
                <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                      placeholder="Enter flight number (e.g., AI202, BA123)"
                      className="w-full pl-12 pr-4 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-lg"
                      disabled={loading}
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={loading || !flightNumber.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:shadow-none"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Searching...
                      </>
                    ) : (
                      <>
                        Search
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-xl"
              >
                <p className="text-red-700 dark:text-red-300 text-center">{error}</p>
              </motion.div>
            )}

            {/* Results Display */}
            {aircraftData && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700"
              >
                {/* Aircraft Info Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Flight {aircraftData.flightNumber}
                    </h3>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-4 py-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full text-sm font-semibold"
                    >
                      ● Active
                    </motion.span>
                  </div>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {[
                      { label: 'Aircraft', value: aircraftData.aircraft.model, icon: Plane },
                      { label: 'Registration', value: aircraftData.aircraft.registration, icon: Shield },
                      { label: 'Age', value: `${aircraftData.aircraft.age} years`, icon: Clock },
                      { label: 'Airline', value: aircraftData.airline, icon: Globe }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        variants={scaleIn}
                        whileHover={{ y: -4 }}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Recent Flights */}
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    Recent Flight History
                  </h4>
                  <div className="space-y-4">
                    {aircraftData.recentFlights.map((flight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium text-gray-600 dark:text-gray-300">{flight.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">{flight.from}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <span className="text-lg font-bold text-gray-900 dark:text-white">{flight.to}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full">
                          {flight.duration}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Features Preview */}
            {!aircraftData && !loading && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              >
                {[
                  {
                    icon: Plane,
                    title: 'Aircraft Details',
                    description: 'Get comprehensive aircraft information including model, age, and registration details',
                    color: 'from-blue-500 to-cyan-500'
                  },
                  {
                    icon: Clock,
                    title: 'Flight History',
                    description: 'Access detailed flight records and historical route information',
                    color: 'from-green-500 to-emerald-500'
                  },
                  {
                    icon: Globe,
                    title: 'Real-time Tracking',
                    description: 'Monitor live aircraft positions and real-time flight status updates',
                    color: 'from-purple-500 to-pink-500'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={scaleIn}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
