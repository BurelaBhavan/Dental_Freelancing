import { useState, useEffect } from 'react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  CreditCard,
  Shield,
  Smartphone,
  Loader2,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { getAvailability, bookAppointment, type TimeSlot } from '@/lib/api';

const services = [
  'General Checkup',
  'Teeth Cleaning',
  'Teeth Whitening',
  'Dental Filling',
  'Root Canal',
  'Dental Crown',
  'Orthodontics Consultation',
  'Emergency Care',
];

const benefits = [
  { icon: Smartphone, text: 'Easy online booking system' },
  { icon: Clock, text: 'Same-day appointments available' },
  { icon: Shield, text: 'Most insurance plans accepted' },
  { icon: CreditCard, text: 'Flexible payment options' },
];

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  service: '',
  reason: '',
};

export function Booking() {
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingResult, setBookingResult] = useState<{
    id: string; name: string; service: string; date: string; time: string;
  } | null>(null);

  const [formData, setFormData] = useState(initialFormData);

  // Fetch available slots whenever the date changes
  useEffect(() => {
    if (!date) {
      setSlots([]);
      setSelectedTime('');
      return;
    }

    const dateStr = format(date, 'yyyy-MM-dd');
    setSlotsLoading(true);
    setSlotsError('');
    setSelectedTime('');
    setSlots([]);

    getAvailability(dateStr)
      .then((res) => {
        if (res.closed) {
          setSlotsError(res.reason || 'Clinic is closed on this date.');
          setSlots([]);
        } else {
          setSlots(res.slots || []);
        }
      })
      .catch(() => {
        setSlotsError('Failed to load available slots. Please try again.');
      })
      .finally(() => setSlotsLoading(false));
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedTime) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await bookAppointment({
        ...formData,
        date: format(date, 'yyyy-MM-dd'),
        time: selectedTime,
      });

      setBookingResult(result.appointment);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : 'Booking failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setBookingResult(null);
    setSubmitError('');
    setFormData(initialFormData);
    setDate(undefined);
    setSelectedTime('');
    setSlots([]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const canSubmit = !isSubmitting && !!date && !!selectedTime && !!formData.service;

  return (
    <section
      id="booking"
      ref={ref}
      className="section-padding relative overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dental-blue via-dental-blue to-dental-cyan">
        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Info */}
          <div className="text-white">
            <span
              className={cn(
                'inline-block text-dental-cyan font-semibold text-sm uppercase tracking-wider mb-4 transition-all duration-600',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              )}
            >
              Book Your Appointment
            </span>
            <h2
              className={cn(
                'font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: '100ms' }}
            >
              Ready to Transform Your Smile?
            </h2>
            <p
              className={cn(
                'text-white/80 text-lg leading-relaxed mb-8 transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: '200ms' }}
            >
              Schedule your visit today and take the first step towards a healthier,
              more beautiful smile. Our team is ready to welcome you.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.text}
                    className={cn(
                      'flex items-center gap-4 transition-all duration-500',
                      isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                    )}
                    style={{ transitionDelay: `${300 + index * 100}ms` }}
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-dental-cyan" />
                    </div>
                    <span className="text-white/90">{benefit.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right - Form */}
          <div
            className={cn(
              'bg-white rounded-3xl p-8 shadow-2xl transition-all duration-700',
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            {/* ── Success State ── */}
            {bookingResult ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-dental-success/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in-bounce">
                  <CheckCircle className="w-10 h-10 text-dental-success" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  Appointment Requested!
                </h3>
                <p className="text-muted-foreground mb-6">
                  We'll contact you shortly to confirm your booking.
                </p>

                {/* Booking summary */}
                <div className="bg-slate-50 rounded-2xl p-5 text-left space-y-2.5 mb-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Booking Summary</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Name</span>
                    <span className="font-medium text-slate-800">{bookingResult.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Service</span>
                    <span className="font-medium text-slate-800">{bookingResult.service}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Date</span>
                    <span className="font-medium text-slate-800">
                      {format(new Date(bookingResult.date + 'T12:00:00'), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Time</span>
                    <span className="font-medium text-slate-800">{bookingResult.time}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Booking ID</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(bookingResult.id)}
                        className="flex items-center gap-1 font-mono text-slate-500 hover:text-slate-700 transition-colors"
                        title="Copy booking ID"
                      >
                        {bookingResult.id.slice(0, 8)}…
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                >
                  Book Another Appointment
                </Button>
              </div>
            ) : (
              /* ── Booking Form ── */
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="h-12 border-slate-200 focus:border-dental-cyan focus:ring-dental-cyan/20"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-12 border-slate-200 focus:border-dental-cyan focus:ring-dental-cyan/20"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="h-12 border-slate-200 focus:border-dental-cyan focus:ring-dental-cyan/20"
                    />
                  </div>

                  {/* Service */}
                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-foreground font-medium">
                      Select Service *
                    </Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, service: value }))
                      }
                      required
                    >
                      <SelectTrigger className="h-12 border-slate-200 focus:border-dental-cyan focus:ring-dental-cyan/20">
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Reason for Visit */}
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-foreground font-medium">
                    Reason for Visit *
                  </Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    placeholder="Briefly describe your concern, pain, or the purpose of your visit…"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    className="border-slate-200 focus:border-dental-cyan focus:ring-dental-cyan/20 resize-none"
                  />
                </div>

                {/* Date Picker */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Preferred Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full h-12 justify-start text-left font-normal border-slate-200',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(d) =>
                          d < new Date(new Date().setHours(0, 0, 0, 0)) ||
                          d.getDay() === 0 ||
                          d.getDay() === 6
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Slot Picker */}
                {date && (
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">
                      Select Time *{' '}
                      {selectedTime && (
                        <span className="text-dental-cyan font-semibold">— {selectedTime}</span>
                      )}
                    </Label>

                    {slotsLoading ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Checking availability…
                      </div>
                    ) : slotsError ? (
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {slotsError}
                      </div>
                    ) : slots.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-2">
                        No slots available for this date.
                      </p>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                            className={cn(
                              'py-2 rounded-lg text-xs font-medium border transition-all duration-150',
                              !slot.available
                                ? 'bg-slate-100 border-slate-200 text-slate-400 line-through cursor-not-allowed'
                                : selectedTime === slot.time
                                ? 'bg-dental-blue border-dental-blue text-white shadow-md scale-[1.05]'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-dental-cyan hover:text-dental-cyan hover:shadow-sm'
                            )}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )}

                    {slots.length > 0 && (
                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-sm bg-white border border-slate-200 inline-block" />
                          Available
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-sm bg-dental-blue inline-block" />
                          Selected
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200 inline-block" />
                          Booked
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* API Error */}
                {submitError && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    {submitError}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full h-14 bg-gradient-to-r from-dental-blue to-dental-cyan text-white font-semibold text-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Booking…
                    </>
                  ) : (
                    'Book Appointment'
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  By booking, you agree to our{' '}
                  <a href="#" className="text-dental-blue hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-dental-blue hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
