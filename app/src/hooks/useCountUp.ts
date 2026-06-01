import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
}

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  suffix = '',
  prefix = '',
}: UseCountUpOptions) {
  const [count, setCount] = useState(start);
  const [isComplete, setIsComplete] = useState(false);
  const countRef = useRef(start);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const difference = end - start;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentCount = Math.floor(start + difference * easeOut);
        
        if (currentCount !== countRef.current) {
          countRef.current = currentCount;
          setCount(currentCount);
        }

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setCount(end);
          setIsComplete(true);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [start, end, duration, delay]);

  const formattedValue = `${prefix}${count}${suffix}`;

  return { count, formattedValue, isComplete };
}
