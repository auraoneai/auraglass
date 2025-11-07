import React from 'react';
import { cn } from '@/lib/utils';
"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import useAutoTextContrast from '../../hooks/useAutoTextContrast';
import { ArrowRight, Zap, Target, Sparkles } from "lucide-react";

// Deterministic seed-based random generator for consistent server/client rendering
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface ComparisonData {
  category: string;
  auraone: {
    value: string;
    description: string;
    color: string;
  };
  competitor: {
    value: string;
    description: string;
    color: string;
  };
}

const COMPARISON_DATA: ComparisonData[] = [
  {
    category: "Performance",
    auraone: {
      value: "10,000x",
      description: "Quantum-accelerated training",
      color: "from-cyan-400 to-blue-500"
    },
    competitor: {
      value: "1x",
      description: "Traditional CPU/GPU training",
      color: "from-gray-400 to-gray-600"
    }
  },
  {
    category: "Safety",
    auraone: {
      value: "100%",
      description: "Formal verification built-in",
      color: "from-green-400 to-emerald-500"
    },
    competitor: {
      value: "~30%",
      description: "Manual testing only",
      color: "from-red-400 to-red-600"
    }
  },
  {
    category: "Time to Deploy",
    auraone: {
      value: "1 Hour",
      description: "One-click production deploy",
      color: "from-purple-400 to-pink-500"
    },
    competitor: {
      value: "6 Months",
      description: "Complex integration required",
      color: "from-yellow-600 to-orange-600"
    }
  },
  {
    category: "Compliance",
    auraone: {
      value: "ISO 26262, DO-178C, FDA",
      description: "Automatic certification",
      color: "from-indigo-400 to-purple-500"
    },
    competitor: {
      value: "None",
      description: "Manual compliance process",
      color: "from-gray-500 to-gray-700"
    }
  }
];

export function GlassPrismComparison() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentComparison, setCurrentComparison] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [prismPosition, setPrismPosition] = useState(50); // Center position
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  const rotateX = useTransform(y, [-300, 300], [30, -30]);
  const rotateY = useTransform(x, [-300, 300], [-30, 30]);
  
  useAutoTextContrast(containerRef, { threshold: 0.55, observe: true });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentComparison((prev) => (prev + 1) % (COMPARISON_DATA?.length || 0));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      mouseX.set(e.clientX - rect.left - centerX);
      mouseY.set(e.clientY - rect.top - centerY);
      
      // Update prism position based on mouse
      const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
      setPrismPosition(Math.max(10, Math.min(90, newPosition)));
    }
  };
  
  const currentData = COMPARISON_DATA[currentComparison];

  return (
    <section className="relative py-32 overflow-hidden glass-gradient-primary glass-gradient-primary via-gray-900 glass-gradient-primary cv-auto">
      <div className="container-responsive">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center glass-mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-8">
            <motion.span
              className="inline-block relative"
              ref={(el)=>{
                if(!el) return;
                el.style.background = 'linear-gradient(45deg, #00f5ff, #ff00f5, #f5ff00, #00f5ff)';
                el.style.backgroundSize = '400% 400%';
                (el.style as any).webkitBackgroundClip = 'text';
                el.style.backgroundClip = 'text';
                (el.style as any).webkitTextFillColor = 'transparent';
                el.style.color = 'transparent';
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
              repeatType: "loop", 
                ease: "easeInOut"
              }}
            >
              THE IMPOSSIBLE
              {/* Backup text for better visibility */}
              <span className="absolute inset-0 glass-gradient-primary glass-gradient-primary via-purple-400 glass-gradient-primary bg-clip-text text-transparent opacity-90">
                THE IMPOSSIBLE
              </span>
            </motion.span>
            <br />
            <span className="text-primary">DIFFERENCE</span>
          </h2>
          
          <motion.p
            className="text-2xl text-primary/70 max-w-3xl mx-auto leading-relaxed"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Move the prism to reveal how{" "}
            <span className="text-primary font-bold">AuraOne transcends</span>{" "}
            traditional limitations
          </motion.p>
        </motion.div>
        
        {/* Interactive Prism Comparison */}
        <motion.div
          ref={containerRef}
          className="relative max-w-7xl mx-auto h-96 glass-foundation-complete backdrop-blur-md2xl glass-radius-3xl border border-white/20 overflow-hidden cursor-none"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{
            perspective: 1000,
            background: "transparent",
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="glass-absolute glass-inset-0"
              ref={(el)=>{ if(!el) return; el.style.backgroundImage = 'linear-gradient(rgba(0,245,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,245,0.1) 1px, transparent 1px)'; el.style.backgroundSize='30px 30px'; }}
            />
          </div>
          
          {/* Competitor Side (Left) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              clipPath: `polygon(0% 0%, ${prismPosition}% 0%, ${prismPosition}% 100%, 0% 100%)`,
            }}
          >
            <div className="text-center p-8">
              <div className="mb-6">
                <motion.div
                  className="text-6xl md:text-8xl font-black mb-4"
                  animate={{ opacity: [0.6, 0.8, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className={`bg-gradient-to-r ${currentData.competitor.color} bg-clip-text text-transparent`}>
                    {currentData.competitor.value}
                  </span>
                </motion.div>
                <p className="text-primary/60 text-xl mb-2">Competitors</p>
                <p className="text-primary/40 text-sm">{currentData.competitor.description}</p>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-primary/30">
                <Target className="w-6 h-6" />
                <span className="text-lg">Limited Capabilities</span>
              </div>
            </div>
          </motion.div>
          
          {/* AuraOne Side (Right) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              clipPath: `polygon(${prismPosition}% 0%, 100% 0%, 100% 100%, ${prismPosition}% 100%)`,
            }}
          >
            <div className="text-center p-8">
              <div className="mb-6">
                <motion.div
                  className="text-6xl md:text-8xl font-black mb-4 relative"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    textShadow: [
                      "0 0 20px currentColor",
                      "0 0 40px currentColor",
                      "0 0 20px currentColor"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className={`bg-gradient-to-r ${currentData.auraone.color} bg-clip-text text-transparent`}>
                    {currentData.auraone.value}
                  </span>
                  
                  {/* Sparkle effects */}
                  <motion.div
                    className="absolute -top-4 -right-4"
                    animate={{
                      rotate: 360,
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      rotate: { duration: 3, repeat: Infinity,
              repeatType: "loop", ease: "linear" },
                      scale: { duration: 2, repeat: Infinity,
              repeatType: "loop", repeatDelay: 1 },
                    }}
                  >
                    <Sparkles className="w-8 h-8 text-primary" />
                  </motion.div>
                </motion.div>
                <p className="text-primary text-xl mb-2 font-bold">AuraOne</p>
                <p className="text-primary/80 text-sm">{currentData.auraone.description}</p>
              </div>
              
              <motion.div 
                className="flex items-center justify-center gap-4 text-primary"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Zap className="w-6 h-6" />
                <span className="text-lg font-bold">Beyond Possible</span>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Glass Prism */}
          <motion.div
            className="absolute top-0 bottom-0 w-1 pointer-events-none"
            style={{
              left: `${prismPosition}%`,
              transform: "translateX(-50%)",
              rotateX,
              rotateY,
            }}
          >
            {/* Prism body */}
            <div className="relative w-full h-full">
              <motion.div
                className="absolute inset-0 glass-gradient-primary glass-gradient-primary via-white/40 glass-gradient-primary backdrop-blur-md border-l border-r border-white/60"
                animate={{
                  background: [
                    "linear-gradient(90deg, transparent, rgba(0,245,255,0.4), transparent)",
                    "linear-gradient(90deg, transparent, rgba(255,0,245,0.4), transparent)",
                    "linear-gradient(90deg, transparent, rgba(245,255,0,0.4), transparent)",
                    "linear-gradient(90deg, transparent, rgba(0,245,255,0.4), transparent)",
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Prism refraction effects */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-20 h-0-5 glass-gradient-primary glass-gradient-primary via-white/60 glass-gradient-primary"
                  style={{
                    top: `${20 + i * 15}%`,
                    left: `-${40 + i * 5}px`,
                    transform: `rotate(${-30 + i * 15}deg)`,
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scaleX: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
              repeatType: "loop",
                    delay: i * 0.3,
                  }}
                />
              ))}
              
              {/* Rainbow spectrum effect */}
              <motion.div
                className="absolute glass--glass--glass--glass--glassglass--glass-top-1/2 -right-20 w-32 h-1 glass-gradient-primary glass-gradient-primary via-yellow-400 via-green-400 via-blue-400 glass-gradient-primary"
                style={{
                  transform: "translateY(-50%) rotate(-15deg)",
                }}
                animate={{
                  opacity: isHovering ? 0.8 : 0.4,
                  scaleX: isHovering ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
          
          {/* Custom cursor */}
          <motion.div
            className="absolute pointer-events-none z-50"
            style={{
              x: mouseX,
              y: mouseY,
              left: "50%",
              top: "50%",
            }}
            animate={{
              scale: isHovering ? 1.5 : 0,
              rotate: 360,
            }}
            transition={{
              scale: { duration: 0.2 },
              rotate: { duration: 2, repeat: Infinity,
              repeatType: "loop", ease: "linear" },
            }}
          >
            <div className="w-8 h-8 glass-radius-full glass-surface-subtle/30 backdrop-blur-md border border-white/50 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
          </motion.div>
        </motion.div>
        
        {/* Category Indicators */}
        <motion.div
          className="flex justify-center gap-6 glass-mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {COMPARISON_DATA.map((data, index) => (
            <motion.button
              key={index}
              onClick={(e) => setCurrentComparison(index)}
              className={`glass-px-6 glass-py-3 glass-radius-full border-2 transition-all duration-300 ${
                currentComparison === index
                  ? 'glass-border glass-surface-primary/20 glass-text-primary'
                  : 'border-white/30 glass-text-primary/60 hover:border-white/50 hover:glass-text-primary/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-medium">{data?.category}</span>
            </motion.button>
          ))}
        </motion.div>
        
        {/* Instruction Text */}
        <motion.div
          className="text-center glass-mt-12"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-primary/50 text-lg">
            <motion.span
              animate={{ color: ["#ffffff", "#00f5ff", "#ffffff"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Move your mouse
            </motion.span>
            {" "}to control the prism and see the impossible difference
          </p>
        </motion.div>
      </div>
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 glass-surface-primary/30 glass-radius-full"
            style={{
              left: `${seededRandom(i * 19000) * 100}%`,
              top: `${seededRandom(i * 20000) * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.max(3 + seededRandom(i * 21000) * 2, 0.5),
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.max(seededRandom(i * 22000) * 2, 0),
            }}
          />
        ))}
      </div>
    </section>
  );
}
