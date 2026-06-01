import { useState, useEffect } from 'react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'About', href: '#about' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar() {
  const { scrollPosition, scrollDirection } = useScrollPosition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const isScrolled = scrollPosition > 50;
  const isHidden = scrollPosition > 200 && scrollDirection === 'down';

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled && 'glass shadow-lg',
        isHidden && '-translate-y-full',
        !isScrolled && 'bg-transparent'
      )}
      style={{
        transitionTimingFunction: 'var(--ease-surgical)',
      }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className={cn(
              'flex items-center gap-2 transition-all duration-500',
              isLoaded ? 'opacity-100 rotate-y-0' : 'opacity-0 -rotate-y-90'
            )}
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-dental-blue to-dental-cyan rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-dental-blue">
              Bright Smile
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  'relative text-sm font-medium transition-all duration-300 hover:text-dental-cyan',
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
                )}
                style={{
                  transitionDelay: `${100 + index * 80}ms`,
                  color: isScrolled ? 'hsl(var(--foreground))' : 'white',
                }}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-dental-cyan transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              asChild
              className={cn(
                'bg-gradient-to-r from-dental-blue to-dental-cyan text-white font-medium px-6 transition-all duration-500 hover:shadow-glow',
                isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-80'
              )}
              style={{
                transitionDelay: '500ms',
                animation: isLoaded ? 'pulse-glow 3s ease-in-out infinite' : 'none',
              }}
            >
              <a href="#booking" onClick={(e) => handleNavClick(e, '#booking')}>
                Book Appointment
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ color: isScrolled ? 'hsl(var(--foreground))' : 'white' }}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-500',
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
          style={{ transitionTimingFunction: 'var(--ease-surgical)' }}
        >
          <div className="py-4 space-y-2 bg-white/95 backdrop-blur-lg rounded-xl mb-4 shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-4 py-3 text-foreground hover:bg-dental-blue/10 hover:text-dental-blue transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="px-4 pt-2">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-dental-blue to-dental-cyan text-white"
              >
                <a href="#booking" onClick={(e) => handleNavClick(e, '#booking')}>
                  Book Appointment
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
