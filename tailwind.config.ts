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
				sans: [
					'var(--font-sans)',
					'sans-serif'
				],
				serif: [
					'var(--font-serif)',
					'serif'
				],
				hand: [
					'var(--font-hand)',
					'cursive'
				]
			},
			backgroundImage: {
				'ikonga-gradient': 'linear-gradient(90deg, #F79A32 0%, #E5488A 100%)'
			},
			colors: {
				'ikonga-orange': '#F79A32',
				'ikonga-pink': '#E5488A',
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
				sm: 'calc(var(--radius) - 4px)'
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
