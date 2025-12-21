"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, type Easing } from 'framer-motion';

interface HeightAnimationProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  easing?: Easing;
}

/**
 * Height Animation Component
 * Smoothly animates height changes
 */
export function HeightAnimation({
  children,
  className,
  duration = 0.3,
  easing = 'easeInOut'
}: HeightAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState('auto');

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setHeight(`${entry.contentRect.height}px`);
        }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [children]);

  return (
    <motion.div
      className={className}
      style={{
        height,
        overflow: 'hidden'
      }}
      animate={{ height }}
      transition={{
        duration,
        ease: easing
      }}
    >
      <div ref={containerRef}>
        {children}
      </div>
    </motion.div>
  );
}

// Alternative implementation using AnimatePresence
export function AnimateChangeInHeight({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={JSON.stringify(children)}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Export both components
export default HeightAnimation;