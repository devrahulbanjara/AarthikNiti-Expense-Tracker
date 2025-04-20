import React, { useState, useEffect, useRef } from 'react';

/**
 * An enhanced component that animates counting up to a target value with ultra-smooth transitions
 * @param {Object} props - Component props
 * @param {number} props.value - The target value to count to
 * @param {string} props.prefix - Prefix for the value (e.g., "$")
 * @param {string} props.suffix - Suffix for the value (e.g., "%")
 * @param {number} props.duration - Duration of animation in ms
 * @param {number} props.decimals - Number of decimal places
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.easingFn - The easing function to use ('easeOutExpo', 'easeOutQuart', 'spring')
 */
const AnimatedCounter = ({
  value = 0,
  prefix = '',
  suffix = '',
  duration = 1500,
  decimals = 0,
  className = '',
  isLarge = false,
  easingFn = 'spring', // Use spring physics for even smoother counting
  delay = 0
}) => {
  const [count, setCount] = useState(0);
  const prevValueRef = useRef(0);
  const animationRef = useRef(null);
  
  // Easing functions library
  const easingFunctions = {
    // Standard easing functions
    easeOutExpo: (t) => (t === 1) ? 1 : 1 - Math.pow(2, -10 * t),
    easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
    
    // Spring physics simulation (very smooth)
    spring: (t) => {
      // Parameters for spring physics
      const damping = 1.2;
      const stiffness = 0.3;
      
      // Damped harmonic oscillator equation
      const oscillation = Math.exp(-damping * t) * Math.cos(stiffness * t);
      return 1 - oscillation * (t < 0.5 ? 1 : 0.5);
    }
  };
  
  useEffect(() => {
    // Store the previous value for smoother transitions between changes
    const startValue = prevValueRef.current;
    prevValueRef.current = value;
    
    // If value is invalid or zero, just set it directly
    if (!value || isNaN(value)) {
      setCount(0);
      return;
    }
    
    let startTime;
    const endValue = Number(value);
    const valueChange = endValue - startValue;
    
    // Don't animate if the change is very small
    if (Math.abs(valueChange) < 0.1) {
      setCount(endValue);
      return;
    }
    
    // Function to choose the appropriate easing
    const getEasing = (progress) => {
      const fn = easingFunctions[easingFn] || easingFunctions.spring;
      return fn(progress);
    };
    
    // Delayed animation start if needed
    const startAnimation = () => {
      // Animation function
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        
        // Calculate progress (0 to 1)
        const timePassed = timestamp - startTime;
        const progress = Math.min(timePassed / duration, 1);
        
        // Apply the easing function
        const easedProgress = getEasing(progress);
        
        // Calculate current value
        const currentValue = startValue + valueChange * easedProgress;
        setCount(currentValue);
        
        // Continue the animation if not complete
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation after delay
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        startAnimation();
      }, delay);
      return () => {
        clearTimeout(delayTimer);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      startAnimation();
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [value, duration, easingFn, delay]);
  
  // Format the value with proper decimals
  const formattedValue = count.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return (
    <span className={className}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
};

export default AnimatedCounter; 