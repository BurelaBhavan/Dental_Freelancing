# Bright Smile Dental Clinic - Technical Specification

## Component Inventory

### shadcn/ui Components (Built-in)
| Component | Purpose | Installation |
|-----------|---------|--------------|
| Button | CTAs, form submit, navigation | `npx shadcn add button` |
| Card | Service cards, testimonial cards, contact cards | `npx shadcn add card` |
| Input | Form fields (name, email, phone) | `npx shadcn add input` |
| Textarea | Message field in booking form | `npx shadcn add textarea` |
| Select | Service dropdown in booking form | `npx shadcn add select` |
| Label | Form field labels | `npx shadcn add label` |
| Dialog | Video lightbox modal | `npx shadcn add dialog` |
| Calendar | Date picker for appointments | `npx shadcn add calendar` |
| Popover | Calendar popup container | `npx shadcn add popover` |
| Badge | Stats display, tags | `npx shadcn add badge` |
| Separator | Visual dividers | `npx shadcn add separator` |
| Sheet | Mobile navigation menu | `npx shadcn add sheet` |
| Accordion | FAQ section (optional) | `npx shadcn add accordion` |

### Third-Party Registry Components
None required - all effects achievable with CSS animations and GSAP.

### Custom Components
| Component | Purpose | Location |
|-----------|---------|----------|
| Navbar | Fixed navigation with glass morphism | `src/components/Navbar.tsx` |
| MobileNav | Sheet-based mobile navigation | `src/components/MobileNav.tsx` |
| ServiceCard | 3D hover effect service card | `src/components/ServiceCard.tsx` |
| TestimonialCarousel | 3D carousel with depth | `src/components/TestimonialCarousel.tsx` |
| BookingForm | Appointment booking form | `src/components/BookingForm.tsx` |
| ContactCard | Animated contact info card | `src/components/ContactCard.tsx` |
| SectionReveal | Scroll-triggered section wrapper | `src/components/SectionReveal.tsx` |
| FloatingElement | Ambient floating animation wrapper | `src/components/FloatingElement.tsx` |
| AnimatedCounter | Number count-up animation | `src/components/AnimatedCounter.tsx` |
| WaveSVG | Animated wave divider | `src/components/WaveSVG.tsx` |

---

## Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| **Navbar glass morphism on scroll** | CSS + React state | Scroll listener toggles class, CSS backdrop-filter | Low |
| **Nav links entrance (staggered slide)** | CSS animations | CSS keyframes with animation-delay stagger | Low |
| **Logo 3D flip entrance** | CSS 3D transforms | rotateY animation with perspective | Medium |
| **CTA button pulse** | CSS animation | @keyframes scale pulse, infinite loop | Low |
| **Hero Ken Burns zoom** | CSS animation | @keyframes scale + translate, 8s duration | Low |
| **Hero title 3D word reveal** | CSS 3D transforms | rotateX per word with stagger delay | Medium |
| **Hero subtitle typewriter** | CSS steps() | width animation with steps() timing | Medium |
| **Stats card floating** | CSS animation | @keyframes translateY oscillation | Low |
| **Hero scroll parallax** | GSAP ScrollTrigger | translateY tied to scroll progress | Medium |
| **Service cards 3D flip entrance** | CSS 3D transforms | rotateY(-90deg→0) with stagger | Medium |
| **Service card 3D hover tilt** | CSS transforms | :hover with rotateX/Y based on position | Medium |
| **Service icon stroke draw** | CSS stroke-dasharray | stroke-dashoffset animation on hover | Medium |
| **About image slide + reveal** | GSAP ScrollTrigger | translateX + clip-path animation | Medium |
| **Play button ripple** | CSS animation | @keyframes scale + opacity, infinite | Low |
| **Feature cards 3D flip** | CSS 3D transforms | rotateY entrance with stagger | Medium |
| **Stats counter animation** | Custom hook | useCountUp with requestAnimationFrame | Medium |
| **Booking form cascade reveal** | CSS animations | translateY + opacity with stagger | Low |
| **Input focus floating label** | CSS transitions | translateY + scale on :focus-within | Low |
| **Submit button success state** | CSS animations | Scale + color transition + checkmark | Medium |
| **Testimonial 3D carousel** | CSS 3D transforms | translateZ + rotateY transitions | High |
| **Carousel card transitions** | CSS transitions | 3D transform + opacity, 600ms | Medium |
| **Contact cards slide entrance** | CSS animations | translateX + opacity with stagger | Low |
| **Map marker bounce** | CSS animation | @keyframes translateY bounce | Low |
| **Social icons hover** | CSS transitions | scale + rotate + color fill | Low |
| **Footer wave SVG flow** | CSS animation | translateX oscillation, infinite | Low |
| **Back-to-top progress indicator** | SVG + scroll | stroke-dashoffset tied to scroll | Medium |
| **Section scroll reveal** | Intersection Observer | Toggle visible class, CSS animation | Low |

---

## Animation Library Choices

### Primary: CSS Animations & Transitions
**Rationale:**
- Best performance (GPU-accelerated)
- No JavaScript overhead for simple effects
- Native reduced-motion support
- Works offline

**Use for:**
- All hover effects
- Entrance animations
- Continuous ambient animations
- Micro-interactions

### Secondary: GSAP + ScrollTrigger
**Rationale:**
- Industry-standard scroll animations
- Precise scroll-linked effects
- Excellent performance
- Pinning capabilities

**Use for:**
- Hero parallax effects
- Section scroll reveals
- Complex scroll sequences
- Pinned sections (if needed)

### Tertiary: Intersection Observer API
**Rationale:**
- Native browser API
- Efficient scroll detection
- Triggers CSS animations

**Use for:**
- Section entrance triggers
- Lazy animation starts
- Visibility-based effects

---

## Project File Structure

```
/mnt/okcomputer/output/app/
├── public/
│   ├── images/
│   │   ├── hero-dentist.jpg
│   │   ├── dentist-portrait.jpg
│   │   ├── testimonial-1.jpg
│   │   ├── testimonial-2.jpg
│   │   ├── testimonial-3.jpg
│   │   ├── testimonial-4.jpg
│   │   └── testimonial-5.jpg
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── label.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── separator.tsx
│   │   │   └── sheet.tsx
│   │   ├── Navbar.tsx
│   │   ├── MobileNav.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── TestimonialCarousel.tsx
│   │   ├── BookingForm.tsx
│   │   ├── ContactCard.tsx
│   │   ├── SectionReveal.tsx
│   │   ├── FloatingElement.tsx
│   │   ├── AnimatedCounter.tsx
│   │   └── WaveSVG.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── About.tsx
│   │   ├── Booking.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── hooks/
│   │   ├── useScrollPosition.ts
│   │   ├── useInView.ts
│   │   └── useCountUp.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── styles/
│   │   └── animations.css
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Dependencies

### Core (Already Installed)
- react
- react-dom
- typescript
- vite
- tailwindcss
- @radix-ui/* (via shadcn)
- class-variance-authority
- clsx
- tailwind-merge
- lucide-react

### Additional Required
```bash
# Animation library
npm install gsap

# Date handling for calendar
npm install date-fns

# Class utilities (if not present)
npm install classnames
```

---

## CSS Animation Architecture

### Global Animation Variables
```css
:root {
  /* Timing */
  --duration-micro: 150ms;
  --duration-fast: 300ms;
  --duration-normal: 500ms;
  --duration-slow: 800ms;
  --duration-cinematic: 1200ms;
  
  /* Easing */
  --ease-surgical: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-dramatic: cubic-bezier(0.87, 0, 0.13, 1);
  --ease-breathe: cubic-bezier(0.37, 0, 0.63, 1);
}
```

### Animation Keyframes
```css
/* Entrance animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes flipInY {
  from { opacity: 0; transform: perspective(1000px) rotateY(-90deg); }
  to { opacity: 1; transform: perspective(1000px) rotateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

/* Continuous animations */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes ripple {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}
```

### Stagger Pattern Classes
```css
.stagger-1 { animation-delay: 100ms; }
.stagger-2 { animation-delay: 200ms; }
.stagger-3 { animation-delay: 300ms; }
.stagger-4 { animation-delay: 400ms; }
.stagger-5 { animation-delay: 500ms; }
```

---

## Responsive Animation Strategy

### Mobile (< 768px)
- Disable parallax effects
- Reduce 3D transforms to 2D
- Remove continuous ambient animations
- Keep essential entrance animations only
- Simplify carousel to single card view

### Tablet (768px - 1024px)
- Moderate parallax (50% intensity)
- Simplified 3D effects
- Reduced stagger delays
- Keep most animations

### Desktop (> 1024px)
- Full animation experience
- All 3D effects enabled
- Maximum parallax depth
- Complete visual impact

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance Optimization

### Critical Rules
1. **Use transform3d()** for GPU acceleration
2. **CSS-only hover effects** - no mousemove listeners
3. **Intersection Observer** for triggering animations
4. **will-change** applied strategically before animation
5. **Throttle scroll events** to 16ms (60fps)

### Avoided Patterns
- ❌ No blur filters during scroll
- ❌ No layout property animations
- ❌ No unthrottled mousemove
- ❌ No setState in animation loops
- ❌ No real-time gradient calculations

### Optimization Checklist
- [ ] All animations use transform/opacity only
- [ ] will-change added before, removed after
- [ ] Intersection Observer for lazy triggering
- [ ] CSS containment on animated sections
- [ ] Passive event listeners for scroll
- [ ] RAF for JS-based animations

---

## Implementation Phases

### Phase 1: Foundation
1. Install dependencies (GSAP, date-fns)
2. Set up global CSS variables and keyframes
3. Create utility hooks (useScrollPosition, useInView)
4. Build SectionReveal wrapper component

### Phase 2: Static Layout
1. Build all section components (static)
2. Implement responsive design
3. Add all content and images
4. Verify layout across breakpoints

### Phase 3: Animation Layer
1. Add entrance animations to all sections
2. Implement scroll-triggered reveals
3. Add hover effects and micro-interactions
4. Implement 3D transforms where specified

### Phase 4: Polish
1. Add continuous ambient animations
2. Fine-tune timing and easing
3. Test reduced motion support
4. Performance optimization pass

---

## Testing Checklist

### Functionality
- [ ] All navigation links work
- [ ] Booking form validates and submits
- [ ] Mobile menu opens/closes
- [ ] Carousel navigation works
- [ ] Smooth scroll to sections

### Animation Quality
- [ ] 60fps on desktop
- [ ] Smooth on mid-range mobile
- [ ] No jank during scroll
- [ ] Reduced motion works
- [ ] No layout shifts

### Cross-Browser
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### Accessibility
- [ ] Keyboard navigation
- [ ] Focus indicators visible
- [ ] Screen reader friendly
- [ ] Color contrast sufficient
