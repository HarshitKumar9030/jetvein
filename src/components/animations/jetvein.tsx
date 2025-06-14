'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface JetVeinProps { 
    text: string;
    animation?: 'typewriter' | 'fadeInUp' | 'glitch' | 'wave' | 'gradient' | 'bounce';
    className?: string;
}

const JetVein = ({ text, animation = 'fadeInUp', className = '' }: JetVeinProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Splittign text for character based animations
  const characters = text.split('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };
  const characterVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.5 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200
      }
    }
  };

  const waveVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const glitchVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    },
    glitch: {
      x: [0, -2, 2, -2, 2, 0],
      y: [0, 1, -1, 1, -1, 0],
      transition: {
        duration: 0.2,
        repeat: 2,
        repeatType: "reverse" as const
      }
    }
  };

  // Render different animations based on type
  const renderAnimation = () => {
    switch (animation) {      case 'typewriter':
        return (
          <motion.div
            className={`font-mono font-bold ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {characters.map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: { delay: i * 0.1 }
                  }
                }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-blue-500"
            >
              |
            </motion.span>
          </motion.div>
        );      case 'wave':
        return (
          <motion.div
            className={`font-bold cursor-pointer select-none ${className}`}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {characters.map((char, i) => (
              <motion.span
                key={i}
                variants={waveVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  y: -10,
                  scale: 1.2,
                  color: "#3b82f6",
                  transition: { duration: 0.3 }
                }}
                className="inline-block hover:text-blue-500 transition-colors"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.div>
        );      case 'glitch':
        return (
          <motion.div
            className={`font-bold relative ${className}`}
            variants={glitchVariants}
            initial="hidden"
            animate="visible"
            whileHover="glitch"
            style={{
              textShadow: isHovered 
                ? '2px 0 #ff0000, -2px 0 #00ffff, 0 2px #ffff00' 
                : 'none'
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {text}
            {isHovered && (
              <>
                <motion.div
                  className="absolute top-0 left-0 text-red-500 opacity-70"
                  animate={{ x: [0, 2, -2, 0] }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                >
                  {text}
                </motion.div>
                <motion.div
                  className="absolute top-0 left-0 text-cyan-500 opacity-70"
                  animate={{ x: [0, -2, 2, 0] }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                >
                  {text}
                </motion.div>
              </>
            )}
          </motion.div>
        );      case 'gradient':
        return (
          <motion.div
            className={`font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${className}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ 
              scale: 1.05,
              backgroundPosition: "200% center",
              transition: { duration: 0.3 }
            }}
            style={{
              backgroundSize: "200% 200%",
              animation: "gradient 3s ease infinite"
            }}
          >
            {text}
          </motion.div>
        );      case 'bounce':
        return (
          <motion.div
            className={`font-bold ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {characters.map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { y: -100, opacity: 0 },
                  visible: { 
                    y: 0, 
                    opacity: 1,
                    transition: {
                      type: "spring",
                      damping: 8,
                      stiffness: 100,
                      delay: i * 0.1
                    }
                  }
                }}
                whileHover={{
                  y: -20,
                  scale: 1.3,
                  color: "#3b82f6",
                  transition: { duration: 0.2 }
                }}
                className="inline-block cursor-pointer"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.div>
        );      default: 
        return (
          <motion.div
            className={`font-bold ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {characters.map((char, i) => (
              <motion.span
                key={i}
                variants={characterVariants}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.div>
        );
    }
  };
  return (
    <span className="inline-block">
      {renderAnimation()}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </span>
  );
};

export default JetVein;