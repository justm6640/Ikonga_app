import type { Config } from "tailwindcss";

import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				// IKONGA Charter Fonts
				sans: ['Poppins', 'var(--font-sans)', 'sans-serif'],  // Body, buttons, forms
				serif: ['DM Serif Display', 'var(--font-serif)', 'serif'], // Headings H1-H6
				hand: ['var(--font-hand)', 'cursive']
			},
			fontWeight: {
				// IKONGA Charter Weights
				normal: '400',   // Body text
				medium: '500',   // Buttons, labels, links
				semibold: '600', // Titles, blog elements
				bold: '700',     // Strong emphasis
			},
			backgroundImage: {
				// Update gradient to use charter colors
				'ikonga-gradient': 'linear-gradient(90deg, #fa8662 0%, #ff559c 100%)'
			},
			fontSize: {
				// IKONGA Charter Typography Scale
				'h1': ['2.25rem', { lineHeight: '1.4' }],      // 36px desktop
				'h1-mobile': ['1.875rem', { lineHeight: '1.4' }], // 30px mobile
				'h2': ['1.875rem', { lineHeight: '1.3' }],     // 30px desktop
				'h2-mobile': ['1.5625rem', { lineHeight: '1.3' }], // 25px mobile
				'h3': ['1.5rem', { lineHeight: '1.3' }],       // 24px desktop
				'h3-mobile': ['1.25rem', { lineHeight: '1.3' }],  // 20px mobile
				'h4': ['1.25rem', { lineHeight: '1.2' }],      // 20px
				'h5': ['1.125rem', { lineHeight: '1.2' }],     // 18px
				'h6': ['1rem', { lineHeight: '1.25' }],        // 16px
				'body': ['1rem', { lineHeight: '1.65' }],      // 16px
				'label': ['0.875rem', { lineHeight: '1.43' }], // 14px
				'small': ['0.625rem', { lineHeight: '1' }],    // 10px (copyright)
			},
			boxShadow: {
				// IKONGA Charter Shadows
				'form': '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
				'badge': '1px 1px 3px 0px rgba(0, 0, 0, 0.3)',
			},
			colors: {
				// IKONGA Charter Colors (Website)
				'ikonga-coral': '#fa8662',        // Primary brand color
				'ikonga-pink-accent': '#ff559c',  // Hover/active states

				// Slate Scale (Charter)
				'slate-dark': '#1e293b',          // Headings, important text
				'slate-medium': '#334155',        // Body text
				'slate-light': '#F0F5FA',         // Secondary backgrounds
				'slate-border': '#D1D5DB',        // Borders, separators
				'focus-blue': '#046BD2',          // Focus states
				'footer-dark': '#222222',         // Footer background

				// Deprecated (backwards compatibility)
				'ikonga-orange': '#F79A32',       // @deprecated Use ikonga-coral
				'ikonga-pink': '#E5488A',         // @deprecated Use ikonga-pink-accent

				// Pillar Colors (Keep existing)
				'pillar-nutrition': {
					DEFAULT: '#E8F5E9',
					foreground: '#2E7D32'
				},
				'pillar-fitness': {
					DEFAULT: '#FFF3E0',
					foreground: '#EF6C00'
				},
				'pillar-wellness': {
					DEFAULT: '#F3E5F5',
					foreground: '#7B1FA2'
				},
				'pillar-beauty': {
					DEFAULT: '#FCE4EC',
					foreground: '#C2185B'
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				// IKONGA Charter Radius
				'button': '4px',           // Standard buttons
				'form': '4px',             // Form elements (inputs, selects, etc.)
				'card': '6px',             // Cards, articles
				'pill': '9999px',          // Outline buttons (fully rounded)
				'badge': '99px',           // Badges, counters
				'avatar': '100%',          // Avatars (circle)
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				shimmer: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				glow: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				shimmer: 'shimmer 2s infinite',
				float: 'float 3s ease-in-out infinite',
				glow: 'glow 2s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.5s ease-out'
			}
		}
	},
	plugins: [tailwindAnimate],
};
export default config;
