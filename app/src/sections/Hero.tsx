import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const titleWords = ['Your', 'Smile', 'Is', 'Our', 'Passion'];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image with Ken Burns Effect */}
      <div className="absolute inset-0 z-0">
        <div
          className={cn(
            'absolute inset-0 transition-transform duration-[8000ms]',
            isLoaded ? 'scale-100' : 'scale-110'
          )}
        >
          <img
            src="/images/hero-dentist.jpg"
            alt="Dental clinic"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-dental-blue/95 via-dental-blue/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dental-blue/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            {/* Subtitle */}
            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full transition-all duration-700',
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              )}
              style={{ transitionDelay: '300ms' }}
            >
              <span className="w-2 h-2 bg-dental-cyan rounded-full animate-pulse" />
              <span className="text-sm font-medium tracking-wide uppercase">
                Welcome to Bright Smile Dental
              </span>
            </div>

            {/* Title with Word Animation */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {titleWords.map((word, index) => (
                <span
                  key={index}
                  className={cn(
                    'inline-block mr-3 transition-all duration-600',
                    isLoaded
                      ? 'opacity-100 rotate-x-0'
                      : 'opacity-0 -rotate-x-90'
                  )}
                  style={{
                    transitionDelay: `${600 + index * 120}ms`,
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Description */}
            <p
              className={cn(
                'text-lg md:text-xl text-white/90 max-w-xl leading-relaxed transition-all duration-700',
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: '1100ms' }}
            >
              Experience exceptional dental care with our team of expert dentists.
              We combine advanced technology with compassionate service to give you
              the healthy, beautiful smile you deserve.
            </p>

            {/* CTA Buttons */}
            <div
              className={cn(
                'flex flex-wrap gap-4 transition-all duration-500',
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: '1400ms' }}
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-dental-blue hover:bg-white/90 font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              >
                <a href="#booking" onClick={(e) => handleNavClick(e, '#booking')}>
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
              >
                <a href="#services" onClick={(e) => handleNavClick(e, '#services')}>
                  Our Services
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div
              className={cn(
                'flex flex-wrap gap-8 pt-8 transition-all duration-700',
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: '1700ms' }}
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-dental-cyan">15+</div>
                <div className="text-sm text-white/70">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-dental-cyan">10K+</div>
                <div className="text-sm text-white/70">Happy Patients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-dental-cyan">50+</div>
                <div className="text-sm text-white/70">Dental Awards</div>
              </div>
            </div>
          </div>

          {/* Right Side - Floating Card */}
          <div className="hidden lg:block relative">
            <div
              className={cn(
                'absolute -right-8 top-1/2 -translate-y-1/2 transition-all duration-800',
                isLoaded
                  ? 'opacity-100 translate-x-0 rotate-0'
                  : 'opacity-0 translate-x-24 rotate-12'
              )}
              style={{
                transitionDelay: '1700ms',
                animation: isLoaded ? 'float 6s ease-in-out infinite' : 'none',
              }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-dental-cyan/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-dental-cyan" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">Easy Booking</div>
                    <div className="text-white/70 text-sm">Schedule online 24/7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={cn(
          'absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        style={{ transitionDelay: '2000ms' }}
      >
        <a
          href="#services"
          onClick={(e) => handleNavClick(e, '#services')}
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
