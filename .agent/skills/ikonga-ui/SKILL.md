---
name: ikonga-ui
description: Guidelines for maintaining IKONGA's premium "Glass-Luxury" design system.
---

# IKONGA UI Skill

This skill provides instructions for maintaining and extending the IKONGA visual identity, characterized by "Glass-Luxury" aesthetics, vibrant gradients, and smooth micro-animations.

## Core Design Principles

1.  **Glassmorphism**: Use `backdrop-blur-xl` and `bg-white/40` or `bg-slate-900/40` for main cards.
2.  **Vibrant Gradients**: The primary brand gradient is `bg-ikonga-gradient` (Pink to Orange). Use it for CTAs and highlights.
3.  **Soft Shadows**: Use large, colored shadows like `shadow-2xl shadow-pink-200/50`.
4.  **Transitions**: Every interactive element should have `hover:scale-[1.02]` and `active:scale-95` with `transition-all`.
5.  **Typography**: Use `font-serif` for headers (Luxury/Elegant) and `font-black` for high-impact labels.

## Tailwind Patterns

| Element | Tailwind Classes |
| :--- | :--- |
| **Main Card** | `rounded-[3rem] bg-white/40 backdrop-blur-xl border border-white shadow-2xl` |
| **Primary CTA** | `h-16 rounded-3xl bg-ikonga-gradient text-white font-black uppercase tracking-widest` |
| **Glass Input** | `h-14 rounded-2xl bg-slate-50 border-none px-6 focus-visible:ring-ikonga-pink/20` |

## Micro-animations (Framer Motion)

Wrap components in `AnimatePresence` for view transitions.

```tsx
<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
>
    {children}
</motion.div>
```

## Icons
Use `lucide-react`. Always give them a specific color or a gradient wrapper to avoid "plain black/white" looks.
