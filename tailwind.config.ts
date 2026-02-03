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
				'ikonga-gradient': 'linear-gradient(90deg, #F79A32 0%, #E5488A 100%)'
			},
			fontSize: {
				// IKONGA Charter Typography Scale
				'h1': ['2.25rem', { lineHeight: '1.4', letterSpacing: '0.5px' }],
				'h1-mobile': ['1.75rem', { lineHeight: '1.4', letterSpacing: '0.5px' }],
				'h2': ['1.875rem', { lineHeight: '1.3', letterSpacing: '0.5px' }],
				'h3': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0.5px' }],
				'body': ['1rem', { lineHeight: '1.65' }],
				'label': ['0.875rem', { lineHeight: '1.43' }],
				'small': ['0.625rem', { lineHeight: '1' }],
			},
			boxShadow: {
				'form': '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
				'badge': '1px 1px 3px 0px rgba(0, 0, 0, 0.3)',
				'premium': '0 4px 15px rgba(247, 154, 50, 0.3)',
				'premium-hover': '0 10px 20px rgba(229, 72, 138, 0.4)',
			},
			colors: {
				// IKONGA Lifestyle 2.0 Colors
				'ikonga-orange': '#FA8662',
				'ikonga-coral': '#FA8662',
				'ikonga-dark': '#2D2D2D',
				'ikonga-light': '#FFF9F5',
				'ikonga-lilac': '#ECE6FF',
				'ikonga-mint': '#E7F6ED',

				// Slate Scale (Legacy preservation)
				'slate-dark': '#2D2D2D',
				'slate-medium': '#334155',
				'slate-light': '#F0F5FA',
				'slate-border': '#E2E8F0',

				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',

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
				'button': '50px',           // Style Pilule Lifestyle
				'form': '4px',             // Form elements (inputs, selects, etc.)
				'card': '12px',            // Plus arrondi pour Lifestyle
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
