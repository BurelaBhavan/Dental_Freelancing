import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

export function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2000,
  delay = 0,
  className,
}: AnimatedCounterProps) {
  const [ref, isInView] = useInView<HTMLSpanElement>({ threshold: 0.5 });
  const { formattedValue } = useCountUp({
    end,
    duration,
    delay: isInView ? delay : 0,
    suffix,
    prefix,
  });

  return (
    <span ref={ref} className={cn(className)}>
      {isInView ? formattedValue : `${prefix}0${suffix}`}
    </span>
  );
}
