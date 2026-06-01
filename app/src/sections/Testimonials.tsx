import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Happy Patient',
    image: '/images/testimonial-1.jpg',
    rating: 5,
    text: 'Amazing service! The team made me feel so comfortable during my procedure. I actually look forward to my dental visits now! The staff is incredibly friendly and professional.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Long-time Patient',
    image: '/images/testimonial-2.jpg',
    rating: 5,
    text: 'The best dental experience I\'ve ever had. Professional, caring, and the results exceeded my expectations. Dr. Mitchell and her team are truly exceptional.',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Mother of Two',
    image: '/images/testimonial-3.jpg',
    rating: 5,
    text: 'My kids love coming here! The pediatric team is so patient and gentle. They make dental visits fun for children. Highly recommend for families!',
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'New Patient',
    image: '/images/testimonial-4.jpg',
    rating: 5,
    text: 'After years of dental anxiety, I finally found a practice that understands. The sedation options and caring approach made all the difference. Thank you, Bright Smile!',
  },
  {
    id: 5,
    name: 'Lisa Wang',
    role: 'Regular Patient',
    image: '/images/testimonial-5.jpg',
    rating: 5,
    text: 'State-of-the-art technology and a team that truly cares about your dental health. My smile has never looked better! The whitening treatment was fantastic.',
  },
];

export function Testimonials() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + testimonials.length) % testimonials.length);
    
    // Handle wrapping for visual positioning
    let visualIndex = normalizedDiff;
    if (normalizedDiff > testimonials.length / 2) {
      visualIndex = normalizedDiff - testimonials.length;
    }

    if (visualIndex === 0) {
      // Active card
      return {
        transform: 'translateX(0) translateZ(0) rotateY(0deg) scale(1)',
        opacity: 1,
        zIndex: 10,
      };
    } else if (Math.abs(visualIndex) === 1) {
      // Adjacent cards
      const direction = visualIndex > 0 ? 1 : -1;
      return {
        transform: `translateX(${direction * 60}%) translateZ(-100px) rotateY(${-direction * 25}deg) scale(0.85)`,
        opacity: 0.5,
        zIndex: 5,
      };
    } else {
      // Hidden cards
      const direction = visualIndex > 0 ? 1 : -1;
      return {
        transform: `translateX(${direction * 100}%) translateZ(-200px) rotateY(${-direction * 45}deg) scale(0.7)`,
        opacity: 0,
        zIndex: 0,
      };
    }
  };

  return (
    <section
      id="testimonials"
      ref={ref}
      className="section-padding bg-gradient-to-b from-slate-50 to-white overflow-hidden"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            className={cn(
              'inline-block text-dental-cyan font-semibold text-sm uppercase tracking-wider mb-4 transition-all duration-600',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            )}
          >
            Testimonials
          </span>
          <h2
            className={cn(
              'font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 transition-all duration-700',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '100ms' }}
          >
            What Our Patients Say
          </h2>
          <p
            className={cn(
              'text-muted-foreground text-lg leading-relaxed transition-all duration-700',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            Don&apos;t just take our word for it. Here&apos;s what our patients have to say
            about their experience at Bright Smile Dental.
          </p>
        </div>

        {/* 3D Carousel */}
        <div
          className={cn(
            'relative max-w-4xl mx-auto transition-all duration-700',
            isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}
          style={{ 
            transitionDelay: '300ms',
            perspective: '1200px',
          }}
        >
          {/* Cards Container */}
          <div className="relative h-[400px] md:h-[350px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="absolute inset-0 flex items-center justify-center transition-all duration-600"
                style={{
                  ...getCardStyle(index),
                  transitionTimingFunction: 'var(--ease-surgical)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="w-full max-w-2xl bg-white rounded-3xl p-8 md:p-10 shadow-card">
                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-dental-cyan/30 mb-4" />

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-dental-gold fill-dental-gold"
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-foreground text-lg leading-relaxed mb-6">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-dental-cyan/20"
                    />
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border-2 hover:bg-dental-blue hover:text-white hover:border-dental-blue transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all duration-300',
                    index === activeIndex
                      ? 'bg-dental-blue w-8'
                      : 'bg-slate-300 hover:bg-slate-400'
                  )}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border-2 hover:bg-dental-blue hover:text-white hover:border-dental-blue transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
