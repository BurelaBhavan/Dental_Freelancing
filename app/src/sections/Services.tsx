import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import {
  Stethoscope,
  Sparkles,
  AlignCenter,
  Baby,
  Scissors,
  Siren,
  Shield,
  Smile,
} from 'lucide-react';

const services = [
  {
    icon: Stethoscope,
    title: 'General Dentistry',
    description: 'Regular checkups, cleanings, and fillings to maintain your oral health and prevent dental issues.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Sparkles,
    title: 'Cosmetic Dentistry',
    description: 'Teeth whitening, veneers, and smile makeovers to enhance your natural beauty.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: AlignCenter,
    title: 'Orthodontics',
    description: 'Braces and clear aligners for straighter teeth and a perfectly aligned smile.',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: Baby,
    title: 'Pediatric Dentistry',
    description: 'Gentle dental care specially designed for children in a friendly environment.',
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: Scissors,
    title: 'Dental Surgery',
    description: 'Extractions, implants, and advanced surgical procedures with minimal discomfort.',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Siren,
    title: 'Emergency Care',
    description: 'Urgent dental care when you need it most. Same-day appointments available.',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Shield,
    title: 'Preventive Care',
    description: 'Fluoride treatments, sealants, and oral cancer screenings for long-term health.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Smile,
    title: 'Restorative Dentistry',
    description: 'Crowns, bridges, and dentures to restore your smile and chewing function.',
    color: 'from-teal-500 to-teal-600',
  },
];

function ServiceCard({
  service,
  index,
  isInView,
}: {
  service: (typeof services)[0];
  index: number;
  isInView: boolean;
}) {
  const Icon = service.icon;

  return (
    <div
      className={cn(
        'group relative bg-white rounded-2xl p-6 shadow-card transition-all duration-500',
        'hover:shadow-card-hover hover:-translate-y-2',
        'perspective-1000 preserve-3d',
        isInView ? 'opacity-100' : 'opacity-0'
      )}
      style={{
        transitionDelay: `${300 + index * 100}ms`,
        animation: isInView
          ? `flipInY 0.6s var(--ease-surgical) ${300 + index * 100}ms forwards`
          : 'none',
      }}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4',
          'transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
          service.color
        )}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>

      {/* Content */}
      <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-dental-blue transition-colors">
        {service.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {service.description}
      </p>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-dental-cyan/30 transition-colors duration-300" />

      {/* Corner Accent */}
      <div
        className={cn(
          'absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br rounded-bl-xl rounded-tr-xl opacity-0',
          'group-hover:opacity-100 transition-opacity duration-300',
          service.color
        )}
      />
    </div>
  );
}

export function Services() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      id="services"
      ref={ref}
      className="section-padding bg-gradient-to-b from-white to-slate-50"
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
            What We Offer
          </span>
          <h2
            className={cn(
              'font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 transition-all duration-700',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '100ms' }}
          >
            Our Dental Services
          </h2>
          <p
            className={cn(
              'text-muted-foreground text-lg leading-relaxed transition-all duration-700',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            From routine checkups to advanced procedures, we provide comprehensive
            dental care for patients of all ages using the latest technology.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
