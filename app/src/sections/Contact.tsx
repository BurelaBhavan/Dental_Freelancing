import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, Clock, Facebook, Linkedin, Instagram, Twitter } from 'lucide-react';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    content: '123 Dental Street, Smile City, SC 12345',
    href: 'https://maps.google.com',
  },
  {
    icon: Phone,
    title: 'Call Us',
    content: '(555) 123-4567',
    href: 'tel:+15551234567',
  },
  {
    icon: Mail,
    title: 'Email Us',
    content: 'info@brightsmiledental.com',
    href: 'mailto:info@brightsmiledental.com',
  },
  {
    icon: Clock,
    title: 'Office Hours',
    content: 'Mon-Fri: 8AM-6PM, Sat: 9AM-2PM',
    href: null,
  },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
];

export function Contact() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      id="contact"
      ref={ref}
      className="section-padding bg-white"
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
            Get In Touch
          </span>
          <h2
            className={cn(
              'font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 transition-all duration-700',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '100ms' }}
          >
            Contact Us
          </h2>
          <p
            className={cn(
              'text-muted-foreground text-lg leading-relaxed transition-all duration-700',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            Have questions? We&apos;d love to hear from you. Reach out through any of
            the channels below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Contact Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              const content = (
                <div
                  className={cn(
                    'group p-6 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-card transition-all duration-500 h-full',
                    isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  )}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-dental-blue/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-dental-blue transition-colors duration-300">
                    <Icon className="w-6 h-6 text-dental-blue group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                  <p className="text-muted-foreground text-sm">{info.content}</p>
                </div>
              );

              return info.href ? (
                <a
                  key={info.title}
                  href={info.href}
                  target={info.href.startsWith('http') ? '_blank' : undefined}
                  rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block"
                >
                  {content}
                </a>
              ) : (
                <div key={info.title}>{content}</div>
              );
            })}

            {/* Social Links */}
            <div
              className={cn(
                'sm:col-span-2 p-6 bg-gradient-to-br from-dental-blue to-dental-cyan rounded-2xl text-white transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: '600ms' }}
            >
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <p className="text-white/80 text-sm mb-4">
                Stay connected for dental tips, news, and special offers.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white hover:text-dental-blue transition-all duration-300 hover:scale-110"
                      style={{ transitionDelay: `${700 + index * 50}ms` }}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Map */}
          <div
            className={cn(
              'relative rounded-3xl overflow-hidden shadow-card transition-all duration-700',
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            )}
            style={{ transitionDelay: '300ms' }}
          >
            {/* Static Map Representation */}
            <div className="absolute inset-0 bg-slate-100">
              <div className="absolute inset-0 opacity-30">
                {/* Grid Pattern */}
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Roads */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 400"
                preserveAspectRatio="xMidYMid slice"
              >
                <path
                  d="M0 200 Q100 180 200 200 T400 200"
                  stroke="#94a3b8"
                  strokeWidth="8"
                  fill="none"
                />
                <path
                  d="M200 0 Q180 100 200 200 T200 400"
                  stroke="#94a3b8"
                  strokeWidth="8"
                  fill="none"
                />
                <path
                  d="M0 100 Q200 120 400 100"
                  stroke="#cbd5e1"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  d="M100 0 Q120 200 100 400"
                  stroke="#cbd5e1"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  d="M300 0 Q280 200 300 400"
                  stroke="#cbd5e1"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  d="M0 300 Q200 280 400 300"
                  stroke="#cbd5e1"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>

              {/* Location Marker */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full"
                style={{ animation: 'bounce 2s ease-in-out infinite' }}
              >
                <div className="relative">
                  {/* Pulse Ring */}
                  <div className="absolute inset-0 bg-dental-blue/30 rounded-full animate-ping" />
                  {/* Marker */}
                  <div className="relative w-12 h-12 bg-dental-blue rounded-full flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  {/* Pin Point */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-dental-blue" />
                </div>
              </div>

              {/* Location Label */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-6 bg-white rounded-lg px-4 py-2 shadow-lg">
                <div className="font-semibold text-dental-blue text-sm">Bright Smile Dental</div>
                <div className="text-xs text-muted-foreground">123 Dental Street</div>
              </div>
            </div>

            {/* Map Overlay CTA */}
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">Get Directions</div>
                  <div className="text-sm text-muted-foreground">Open in Google Maps</div>
                </div>
                <div className="w-10 h-10 bg-dental-blue rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
