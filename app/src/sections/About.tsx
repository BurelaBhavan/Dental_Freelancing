import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/lib/utils';
import { Users, Cpu, Heart, UserCheck, Play, Award, Clock, Star } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const features = [
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Board-certified dentists with years of experience in all dental specialties.',
  },
  {
    icon: Cpu,
    title: 'Advanced Technology',
    description: 'State-of-the-art equipment for precise diagnosis and treatment.',
  },
  {
    icon: Heart,
    title: 'Comfortable Care',
    description: 'Relaxing environment with sedation options for anxious patients.',
  },
  {
    icon: UserCheck,
    title: 'Personalized Approach',
    description: 'Treatment plans tailored to your unique needs and goals.',
  },
];

const stats = [
  { icon: Clock, value: 15, suffix: '+', label: 'Years Experience' },
  { icon: Users, value: 10000, suffix: '+', label: 'Happy Patients' },
  { icon: Award, value: 50, suffix: '+', label: 'Dental Awards' },
  { icon: Star, value: 99, suffix: '%', label: 'Satisfaction Rate' },
];

function StatCard({
  stat,
  isInView,
  delay,
}: {
  stat: (typeof stats)[0];
  isInView: boolean;
  delay: number;
}) {
  const Icon = stat.icon;
  const { formattedValue } = useCountUp({
    end: stat.value,
    duration: 2000,
    delay: isInView ? delay : 0,
    suffix: stat.suffix,
  });

  return (
    <div
      className={cn(
        'text-center p-4 bg-white rounded-xl shadow-card transition-all duration-500',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Icon className="w-6 h-6 text-dental-cyan mx-auto mb-2" />
      <div className="text-2xl md:text-3xl font-bold text-dental-blue">
        {isInView ? formattedValue : `0${stat.suffix}`}
      </div>
      <div className="text-sm text-muted-foreground">{stat.label}</div>
    </div>
  );
}

export function About() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section
      id="about"
      ref={ref}
      className="section-padding bg-white overflow-hidden"
    >
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image */}
          <div
            className={cn(
              'relative transition-all duration-800',
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24'
            )}
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/dentist-portrait.jpg"
                  alt="Dr. Sarah Mitchell - Lead Dentist"
                  className="w-full h-auto object-cover"
                />
                {/* Play Button Overlay */}
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="absolute inset-0 flex items-center justify-center bg-dental-blue/20 hover:bg-dental-blue/30 transition-colors group"
                >
                  <div className="relative">
                    {/* Ripple Effect */}
                    <div className="absolute inset-0 bg-white rounded-full animate-ripple" />
                    <div
                      className="absolute inset-0 bg-white rounded-full animate-ripple"
                      style={{ animationDelay: '1s' }}
                    />
                    {/* Play Button */}
                    <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-dental-blue ml-1" fill="currentColor" />
                    </div>
                  </div>
                </button>
              </div>

              {/* Floating Badge */}
              <div
                className={cn(
                  'absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-card transition-all duration-700',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ transitionDelay: '600ms', animation: 'float 6s ease-in-out infinite' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-dental-cyan/20 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-dental-cyan" />
                  </div>
                  <div>
                    <div className="font-bold text-dental-blue">Certified</div>
                    <div className="text-sm text-muted-foreground">Expert Dentist</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <span
                className={cn(
                  'inline-block text-dental-cyan font-semibold text-sm uppercase tracking-wider mb-4 transition-all duration-600',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                )}
                style={{ transitionDelay: '200ms' }}
              >
                Why Choose Us
              </span>
              <h2
                className={cn(
                  'font-display text-3xl md:text-4xl font-bold text-foreground mb-6 transition-all duration-700',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ transitionDelay: '300ms' }}
              >
                Experience the Bright Smile Difference
              </h2>
              <p
                className={cn(
                  'text-muted-foreground text-lg leading-relaxed transition-all duration-700',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ transitionDelay: '400ms' }}
              >
                At Bright Smile Dental, we believe everyone deserves exceptional dental
                care in a comfortable, welcoming environment. Our commitment to excellence
                sets us apart from the rest.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={cn(
                      'group p-4 rounded-xl bg-slate-50 hover:bg-white hover:shadow-card transition-all duration-500',
                      isInView ? 'opacity-100' : 'opacity-0'
                    )}
                    style={{
                      transitionDelay: `${500 + index * 100}ms`,
                      animation: isInView
                        ? `flipInY 0.5s var(--ease-surgical) ${500 + index * 100}ms forwards`
                        : 'none',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-dental-blue/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-dental-blue group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5 text-dental-blue group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-4">
              {stats.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  stat={stat}
                  isInView={isInView}
                  delay={900 + index * 100}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Dialog */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
          <DialogTitle className="sr-only">Clinic Tour Video</DialogTitle>
          <div className="aspect-video flex items-center justify-center bg-dental-blue">
            <div className="text-center text-white">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg opacity-70">Video coming soon</p>
              <p className="text-sm opacity-50">Experience our state-of-the-art facility</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
