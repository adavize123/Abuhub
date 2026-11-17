# Quick Reference: Animation & Styling Features

## 🚀 How to Use New Features

### 1. Scroll-Triggered Animations
```javascript
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';

export function MyComponent() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      Content
    </motion.div>
  );
}
```

### 2. Parallax Effects
```javascript
import { ParallaxOrb, ParallaxFloat } from '@/components/Parallax';
import { useParallax } from '@/lib/hooks/useParallax';

// Option 1: Use pre-built components
<ParallaxOrb delay={0} color="purple" speed={0.5} />

// Option 2: Use hook manually
const [ref, offset] = useParallax(0.5);
<motion.div ref={ref} style={{ y: offset }}>
  Content
</motion.div>
```

### 3. Loading States
```javascript
import { BlogPostSkeleton, ServiceCardSkeleton, ContactFormSkeleton } from '@/components/LoadingSkeletons';

// Show while loading
{isLoading ? (
  <BlogPostSkeleton />
) : (
  <BlogPost data={post} />
)}
```

### 4. Page Transitions
Automatic! Just use the Layout component:
```javascript
import Layout from '@/components/Layout';

export default function Page() {
  return (
    <Layout>
      {/* Your content */}
    </Layout>
  );
}
```

### 5. Micro-Interactions
```javascript
// Button with ripple effect
<motion.button
  className="btn-primary"
  whileHover={{ scale: 1.08 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>

// Form input with glow
<input
  type="text"
  className="focus:ring-2 focus:ring-accent-cyan"
  {...register('name')}
/>

// Link with arrow animation
<motion.a
  href="/blog"
  whileHover={{ x: 5 }}
  className="text-accent-cyan hover:text-accent-purple"
>
  Read More →
</motion.a>
```

## 🎨 Available Tailwind Classes

### Animations
```css
/* Use in Tailwind classes */
animate-fadeIn
animate-slideUp
animate-slideIn
animate-pageTransitionIn
animate-pageTransitionOut
animate-shimmer
animate-pulse-ring
animate-float
animate-glow
animate-spin-slow
```

### Colors
```css
/* Primary accent colors */
text-accent-cyan
text-accent-cyan-dark
text-accent-purple
text-accent-purple-dark

/* Dark mode variants */
bg-dark-bg
bg-dark-surface
bg-dark-surface-light
border-dark-border
border-dark-border-light

/* Shadows */
shadow-glow
shadow-glow-purple
shadow-glow-lg
```

### Interactive Elements
```css
/* Button styles */
btn-primary       /* Gradient with ripple */
btn-secondary     /* Cyan border */
btn-secondary-purple  /* Purple border */

/* Form styles */
focus:ring-2 focus:ring-accent-cyan
focus:shadow-[0_0_20px_rgba(0,240,255,0.3)]
```

## 📊 Available Components

### LoadingSkeletons
- `<BlogPostSkeleton />` - Blog card placeholder
- `<ServiceCardSkeleton />` - Service card placeholder
- `<ContactFormSkeleton />` - Form skeleton

### Parallax
- `<ParallaxOrb />` - Animated background orb
- `<ParallaxFloat />` - Wrapper for parallax effect

### PageTransition
- `<PageTransition>` - Manual page transition wrapper (auto in Layout)

## 🪝 Custom Hooks

### useScrollAnimation
```javascript
const [ref, isVisible] = useScrollAnimation(options);
// options: { threshold: 0.1, rootMargin: '0px' }
// Returns: [ref, isVisible boolean]
```

### useParallax
```javascript
const [ref, offset] = useParallax(speed);
// speed: 0.5 (multiplier for scroll distance)
// Returns: [ref, pixelOffset number]
```

### useMouseMove
```javascript
const { mousePosition, isMouseMoving } = useMouseMove();
// Returns: { x, y, isMouseMoving boolean }
```

## ⚡ Performance Tips

1. **Use `once: true` in whileInView** - Prevents re-animation on scroll
2. **Lazy load images** - Use Next.js Image component
3. **Debounce scroll handlers** - Built-in with Intersection Observer
4. **Combine animations** - Use Framer Motion container variants
5. **Test on mobile** - Disable parallax on small screens

## 🔧 Customization

### Change animation speed
```javascript
// In tailwind.config.js
animation: {
  fadeIn: 'fadeIn 1s ease-in-out',  // Change duration here
}
```

### Add new animation
```javascript
// In globals.css
@keyframes myCustom {
  0% { /* start */ }
  100% { /* end */ }
}

// Then use in Tailwind
animation-myCustom
```

### Change color scheme
```javascript
// In tailwind.config.js
colors: {
  accent: {
    cyan: '#YOUR_COLOR',
    purple: '#YOUR_COLOR',
  }
}
```

## ✅ Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Animations | ✅ | ✅ | ✅ | ✅ |
| Grid/Flexbox | ✅ | ✅ | ✅ | ✅ |
| Intersection Observer | ✅ | ✅ | ✅ | ✅ |
| CSS Variables | ✅ | ✅ | ✅ | ✅ |
| Backdrop Filter | ✅ | ✅ | ✅ | ✅ |

## 🚨 Common Issues

**Q: Animations not working?**
A: Check if Framer Motion is installed: `npm install framer-motion`

**Q: Parallax too slow/fast?**
A: Adjust speed parameter: 0.3 (slow), 0.5 (medium), 0.8 (fast)

**Q: Form shimmer not visible?**
A: Add `loading-shimmer` class to placeholder elements

**Q: Page transitions janky?**
A: Ensure AnimatePresence wraps all route content in Layout

**Q: Custom cursor not showing?**
A: Check if SVG data URI is properly encoded in CSS

## 📚 Additional Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)

