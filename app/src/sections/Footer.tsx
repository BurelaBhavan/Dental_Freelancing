import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Facebook, Linkedin, Instagram, Twitter, ArrowUp, Heart } from 'lucide-react';
import { useState } from 'react';

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' },
  { name: 'Book Appointment', href: '#booking' },
];

const services = [
  'General Dentistry',
  'Cosmetic Dentistry',
  'Orthodontics',
  'Pediatric Dentistry',
];

export function Footer() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={ref} className="relative bg-slate-900 text-white overflow-hidden">
      {/* Wave SVG */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="white"
            opacity="1"
          />
        </svg>
      </div>

      <div className="container-custom pt-32 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div
            className={cn(
              'lg:col-span-1 transition-all duration-700',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-dental-blue to-dental-cyan rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl">Bright Smile</span>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your smile is our passion. Experience exceptional dental care with a gentle
              touch. We&apos;re committed to giving you the healthy, beautiful smile you deserve.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Twitter, label: 'Twitter' },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-dental-cyan transition-all duration-300 hover:scale-110"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div
            className={cn(
              'transition-all duration-700',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '300ms' }}
          >
            <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-slate-400 hover:text-dental-cyan transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-dental-cyan mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div
            className={cn(
              'transition-all duration-700',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '400ms' }}
          >
            <h3 className="font-semibold text-lg mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    onClick={(e) => handleNavClick(e, '#services')}
                    className="text-slate-400 hover:text-dental-cyan transition-colors text-sm inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-dental-cyan mr-0 group-hover:mr-2 transition-all duration-300" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div
            className={cn(
              'transition-all duration-700',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '500ms' }}
          >
            <h3 className="font-semibold text-lg mb-6">Stay Updated</h3>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe for dental tips, news, and special offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-dental-cyan focus:ring-dental-cyan/20"
                required
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-dental-blue to-dental-cyan text-white hover:shadow-glow transition-all duration-300"
              >
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Bright Smile Dental. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-500 hover:text-dental-cyan text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-500 hover:text-dental-cyan text-sm transition-colors">
                Terms of Service
              </a>
            </div>
            <p className="text-slate-500 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for healthy smiles
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          'fixed bottom-8 right-8 w-12 h-12 bg-dental-blue text-white rounded-full shadow-lg flex items-center justify-center',
          'hover:bg-dental-cyan transition-all duration-300 hover:scale-110 z-50',
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
        style={{ transitionDelay: '800ms' }}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
