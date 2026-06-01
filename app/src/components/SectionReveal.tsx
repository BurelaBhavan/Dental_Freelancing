import type { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-in-up' | 'fade-in-down' | 'slide-in-left' | 'slide-in-right' | 'scale-in';
  delay?: number;
  threshold?: number;
}

export function SectionReveal({
  children,
  className,
  animation = 'fade-in-up',
  delay = 0,
  threshold = 0.1,
}: SectionRevealProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold });

  const animationClass = {
    'fade-in-up': 'animate-fade-in-up',
    'fade-in-down': 'animate-fade-in-down',
    'slide-in-left': 'animate-slide-in-left',
    'slide-in-right': 'animate-slide-in-right',
    'scale-in': 'animate-scale-in',
  }[animation];

  return (
    <div
      ref={ref}
      className={cn(
        'opacity-0',
        isInView && animationClass,
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {children}
    </div>
  );
}
