'use client';
import React from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import useAutoTextContrast from "../../hooks/useAutoTextContrast";
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
      color: "from-cyan-400 to-blue-500",
    },
    competitor: {
      value: "1x",
      description: "Traditional CPU/GPU training",
      color: "from-gray-400 to-gray-600",
    },
  },
  {
    category: "Safety",
    auraone: {
      value: "100%",
      description: "Formal verification built-in",
      color: "from-green-400 to-emerald-500",
    },
    competitor: {
      value: "~30%",
      description: "Manual testing only",
      color: "from-red-400 to-red-600",
    },
  },
  {
    category: "Time to Deploy",
    auraone: {
      value: "1 Hour",
      description: "One-click production deploy",
      color: "from-purple-400 to-pink-500",
    },
    competitor: {
      value: "6 Months",
      description: "Complex integration required",
      color: "from-yellow-600 to-orange-600",
    },
  },
  {
    category: "Compliance",
    auraone: {
      value: "ISO 26262, DO-178C, FDA",
      description: "Automatic certification",
      color: "from-indigo-400 to-purple-500",
    },
    competitor: {
      value: "None",
      description: "Manual compliance process",
      color: "from-gray-500 to-gray-700",
    },
  },
];

export function GlassPrismComparison({
  className,
  'data-testid': dataTestId,
  ...props
}: React.HTMLAttributes<HTMLElement> = {}) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentComparison, setCurrentComparison] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [prismPosition, setPrismPosition] = useState(50); // Center position

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Use default values to ensure motion values are always valid
  const rotateX = useTransform(y, [-300, 300], [30, -30], { clamp: true });
  const rotateY = useTransform(x, [-300, 300], [-30, 30], { clamp: true });

  // Ensure motion values are always numbers (fallback for test environments)
  const safeRotateX = prefersReducedMotion ? 0 : (rotateX.get() ?? 0);
  const safeRotateY = prefersReducedMotion ? 0 : (rotateY.get() ?? 0);

  useAutoTextContrast(containerRef, { threshold: 0.55, observe: true });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentComparison(
        (prev) => (prev + 1) % (COMPARISON_DATA?.length || 0)
      );
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
    <section 
      className={cn('relative glass-py-32 overflow-hidden glass-gradient-primary glass-gradient-primary via-gray-900 glass-gradient-primary cv-auto', className)}
      data-testid={dataTestId}
      {...props}
    >
      <div className='container-responsive'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 1 }}
          className='glass-text-center glass-mb-20'
        >
          <h2 className='glass-text-5xl glass-md-text-7xl glass-font-black glass-mb-8'>
            <motion.span
              className='glass-inline-glass-block glass-relative'
              ref={(el) => {
                if (!el) return;
                el.style.background =
                  "linear-gradient(45deg, #00f5ff, #ff00f5, #f5ff00, #00f5ff)";
                el.style.backgroundSize = "400% 400%";
                (el.style as any).webkitBackgroundClip = "text";
                el.style.backgroundClip = "text";
                (el.style as any).webkitTextFillColor = "transparent";
                el.style.color = "transparent";
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }
              }
            >
              THE IMPOSSIBLE
              {/* Backup text for better visibility */}
              <span className='glass-absolute glass-inset-0 glass-gradient-primary glass-gradient-primary glass-via-purple-400 glass-gradient-primary glass-bg-clip-text glass-text-transparent glass-opacity-90'>
                THE IMPOSSIBLE
              </span>
            </motion.span>
            <br />
            <span className='glass-text-primary'>DIFFERENCE</span>
          </h2>

          <motion.p
            className='glass-text-2xl glass-text-primary-opacity-70 glass-max-w-3xl glass-mx-auto glass-leading-relaxed'
            animate={prefersReducedMotion ? {} : { opacity: [0.7, 1, 0.7] }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 3, repeat: Infinity }
            }
          >
            Move the prism to reveal how{" "}
            <span className='glass-text-primary glass-font-bold'>AuraOne transcends</span>{" "}
            traditional limitations
          </motion.p>
        </motion.div>

        {/* Interactive Prism Comparison */}
        <motion.div
          ref={containerRef}
          className='glass-relative glass-max-w-7xl glass-mx-auto glass-h-96 glass-foundation-complete glass-backdrop-blur-md2xl glass-radius-3xl glass-border glass-border-white/20 glass-overflow-hidden glass-cursor-none glass-contrast-guard'
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{
            perspective: 1000,
            background: "transparent",
          }}
        >
          {/* Background Pattern */}
          <div className='glass-absolute glass-inset-0 glass-opacity-10'>
            <div
              className="glass-absolute glass-inset-0"
              ref={(el) => {
                if (!el) return;
                el.style.backgroundImage =
                  "linear-gradient(rgba(0,245,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,245,0.1) 1px, transparent 1px)";
                el.style.backgroundSize = "30px 30px";
              }}
            />
          </div>

          {/* Competitor Side (Left) */}
          <motion.div
            className='glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center'
            style={{
              clipPath: `polygon(0% 0%, ${prismPosition || 50}% 0%, ${prismPosition || 50}% 100%, 0% 100%)`,
            }}
          >
            <div className='glass-text-center glass-p-8'>
              <div className='glass-mb-6'>
                <motion.div
                  className='glass-text-6xl glass-md-text-8xl glass-font-black glass-mb-4'
                  animate={
                    prefersReducedMotion ? {} : { opacity: [0.6, 0.8, 0.6] }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 2, repeat: Infinity }
                  }
                >
                  <span
                    className={`bg-gradient-to-r ${currentData.competitor.color} bg-clip-text text-transparent`}
                  >
                    {currentData.competitor.value}
                  </span>
                </motion.div>
                <p className='glass-text-primary-glass-opacity-60 glass-text-xl glass-mb-2'>
                  Competitors
                </p>
                <p className='glass-text-primary-glass-opacity-40 glass-text-sm'>
                  {currentData.competitor.description}
                </p>
              </div>

              <div className='glass-flex glass-items-center glass-justify-center glass-gap-4 glass-text-primary-glass-opacity-30'>
                <Target className='glass-w-6 glass-h-6' />
                <span className="glass-text-lg">Limited Capabilities</span>
              </div>
            </div>
          </motion.div>

          {/* AuraOne Side (Right) */}
          <motion.div
            className='glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center'
            style={{
              clipPath: `polygon(${prismPosition || 50}% 0%, 100% 0%, 100% 100%, ${prismPosition || 50}% 100%)`,
            }}
          >
            <div className='glass-text-center glass-p-8'>
              <div className='glass-mb-6'>
                <motion.div
                  className='glass-text-6xl glass-md-text-8xl glass-font-black glass-mb-4 glass-relative'
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: [1, 1.05, 1],
                          textShadow: [
                            "0 0 20px currentColor",
                            "0 0 40px currentColor",
                            "0 0 20px currentColor",
                          ],
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 2, repeat: Infinity }
                  }
                >
                  <span
                    className={`bg-gradient-to-r ${currentData.auraone.color} bg-clip-text text-transparent`}
                  >
                    {currentData.auraone.value}
                  </span>

                  {/* Sparkle effects */}
                  <motion.div
                    className='glass-absolute glass--top-4 glass--right-4'
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            rotate: 360,
                            scale: [0, 1, 0],
                          }
                    }
                    transition={{
                      rotate: {
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "linear",
                      },
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                        repeatDelay: 1,
                      },
                    }}
                  >
                    <Sparkles className='glass-w-8 glass-h-8 glass-text-primary' />
                  </motion.div>
                </motion.div>
                <p className='glass-text-primary glass-text-xl glass-mb-2 glass-font-bold'>
                  AuraOne
                </p>
                <p className='glass-text-primary-glass-opacity-80 glass-text-sm'>
                  {currentData.auraone.description}
                </p>
              </div>

              <motion.div
                className='glass-flex glass-items-center glass-justify-center glass-gap-4 glass-text-primary'
                animate={prefersReducedMotion ? {} : { opacity: [0.8, 1, 0.8] }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 1.5, repeat: Infinity }
                }
              >
                <Zap className='glass-w-6 glass-h-6' />
                <span className='glass-text-lg glass-font-bold'>Beyond Possible</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Glass Prism */}
          <motion.div
            className='glass-absolute glass-top-0 glass-bottom-0 glass-w-1 glass-pointer-events-none'
            style={{
              left: `${prismPosition}%`,
              transform: "translateX(-50%)",
              ...(prefersReducedMotion 
                ? { rotateX: 0, rotateY: 0 }
                : {
                    rotateX: typeof rotateX === 'number' ? rotateX : (rotateX?.get?.() ?? 0),
                    rotateY: typeof rotateY === 'number' ? rotateY : (rotateY?.get?.() ?? 0),
                  }
              ),
            } as React.CSSProperties}
          >
            {/* Prism body */}
            <div className='glass-relative glass-w-full glass-h-full'>
              <motion.div
                className='glass-absolute glass-inset-0 glass-gradient-primary glass-gradient-primary glass-via-white-glass-opacity-40 glass-gradient-primary glass-backdrop-blur-md glass-border-l glass-border-r glass-border-white/60 glass-contrast-guard'
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        background: [
                          "linear-gradient(90deg, transparent, rgba(0,245,255,0.4), transparent)",
                          "linear-gradient(90deg, transparent, rgba(255,0,245,0.4), transparent)",
                          "linear-gradient(90deg, transparent, rgba(245,255,0,0.4), transparent)",
                          "linear-gradient(90deg, transparent, rgba(0,245,255,0.4), transparent)",
                        ],
                      }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 3, repeat: Infinity }
                }
              />

              {/* Prism refraction effects */}
              {Array.from({ length: 5 }).map((_: any, i: any) => (
                <motion.div
                  key={i}
                  className='glass-absolute glass-w-20 glass-h-0-5 glass-gradient-primary glass-gradient-primary glass-via-white-glass-opacity-60 glass-gradient-primary'
                  style={{
                    top: `${20 + i * 15}%`,
                    left: `-${40 + i * 5}px`,
                    transform: `rotate(${-30 + i * 15}deg)`,
                  }}
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          opacity: [0, 0.8, 0],
                          scaleX: [0, 1, 0],
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: i * 0.3,
                        }
                  }
                />
              ))}

              {/* Rainbow spectrum effect */}
              <motion.div
                className='glass-absolute glass-top-1/2 glass--right-20 glass-w-32 glass-h-1 glass-gradient-primary glass-gradient-primary glass-via-yellow-400 glass-via-green-400 glass-via-blue-400 glass-gradient-primary'
                style={{
                  transform: "translateY(-50%) rotate(-15deg)",
                }}
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        opacity: isHovering ? 0.8 : 0.4,
                        scaleX: isHovering ? 1.2 : 1,
                      }
                }
                transition={
                  prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
                }
              />
            </div>
          </motion.div>

          {/* Custom cursor */}
          <motion.div
            className='glass-absolute glass-pointer-events-none glass-z-50'
            style={{
              x: mouseX,
              y: mouseY,
              left: "50%",
              top: "50%",
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scale: isHovering ? 1.5 : 0,
                    rotate: 360,
                  }
            }
            transition={{
              scale: { duration: 0.2 },
              rotate: {
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              },
            }}
          >
            <div className='glass-w-8 glass-h-8 glass-radius-full glass-surface-subtle/30 glass-backdrop-blur-md glass-border glass-border-white/50 glass-flex glass-items-center glass-justify-center glass-contrast-guard'>
              <ArrowRight className='glass-w-4 glass-h-4 glass-text-primary' />
            </div>
          </motion.div>
        </motion.div>

        {/* Category Indicators */}
        <motion.div
          className="glass-flex glass-justify-center glass-gap-6 glass-mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.8, delay: 0.5 }
          }
        >
          {COMPARISON_DATA.map((data, index) => (
            <motion.button
              key={index}
              onClick={(e) => setCurrentComparison(index)}
              className={`glass-px-6 glass-py-3 glass-radius-full border-2 transition-all duration-300 ${
                currentComparison === index
                  ? "glass-border glass-surface-primary/20 glass-text-primary"
                  : "border-white/30 glass-text-primary/60 hover:border-white/50 hover:glass-text-primary/80"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className='glass-font-medium'>{data?.category}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Instruction Text */}
        <motion.div
          className='glass-text-center glass-mt-12'
          animate={prefersReducedMotion ? {} : { opacity: [0.5, 1, 0.5] }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 2, repeat: Infinity }
          }
        >
          <p className='glass-text-primary-glass-opacity-50 glass-text-lg'>
            <motion.span
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      color: [
                        "var(--glass-white)",
                        "#00f5ff",
                        "var(--glass-white)",
                      ],
                    }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 2, repeat: Infinity }
              }
            >
              Move your mouse
            </motion.span>{" "}
            to control the prism and see the impossible difference
          </p>
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className='glass-absolute glass-inset-0 glass-pointer-events-none glass-overflow-hidden'>
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_: any, i: any) => (
          <motion.div
            key={i}
            className='glass-absolute glass-w-2 glass-h-2 glass-surface-primary/30 glass-radius-full'
            style={{
              left: `${seededRandom(i * 19000) * 100}%`,
              top: `${seededRandom(i * 20000) * 100}%`,
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [0, -30, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.5, 1],
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: Math.max(3 + seededRandom(i * 21000) * 2, 0.5),
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: Math.max(seededRandom(i * 22000) * 2, 0),
                  }
            }
          />
        ))}
      </div>
    </section>
  );
}