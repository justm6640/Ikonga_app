import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-sans)", "sans-serif"],
				serif: ["var(--font-serif)", "serif"],
				hand: ["var(--font-hand)", "cursive"],
			},
			backgroundImage: {
				'ikonga-gradient': 'linear-gradient(90deg, #F79A32 0%, #E5488A 100%)',
			},
			colors: {
				// IKONGA Brand
				'ikonga-orange': '#F79A32',
				'ikonga-pink': '#E5488A',

				// Pillars
				'pillar-nutrition': { DEFAULT: '#E8F5E9', foreground: '#2E7D32' },
				'pillar-fitness': { DEFAULT: '#FFF3E0', foreground: '#EF6C00' },
				'pillar-wellness': { DEFAULT: '#F3E5F5', foreground: '#7B1FA2' },
				'pillar-beauty': { DEFAULT: '#FCE4EC', foreground: '#C2185B' },

				// Base Overrides
				background: '#FAFAFA', // Was hsl(var(--background)) - overriding as requested, or mapping var to this hex?
				// The user asked to add "background: '#FAFAFA'" in colors.
				// But Shadcn uses css variables.
				// If I set it here directly as hex, it overrides the css variable usage for 'bg-background'.
				// I will set the CSS variable to this hex in globals.css, and keep usage of css var here for dark mode support compatibility if needed.
				// Wait, the user explicitly said "Ajoute ces couleurs précises... background: '#FAFAFA'".
				// If I simply put the hex here, I lose dark mode switching capability via CSS vars for the background class.
				// However, the user also asked to modify globals.css variables.
				// Strategy: Update globals.css to use these hex values (converted to relevant format) and keep tailwind.config pointing to vars OR
				// follow instruction strictly to "Add these colors" in tailwind.config.ts.
				// If I put `background: '#FAFAFA'` here, `bg-background` will be that hex.
				// But Shadcn expects `background: 'hsl(var(--background))'`.
				// I will COMPLY with the user's request to "Update globals.css variables" for primary, but for background/foreground they listed them in the Tailwind section.
				// BUT they also listed "background: '#FAFAFA'" under "Surfaces & Textes".
				// Implementation: I will update the CSS variables in globals.css to match these values, and keep tailwind config pointing to variables for consistency, 
				// OR I will define specific `ikonga-background` if I want to be safe.
				// The user said "Modifie la configuration... Ajoute ces couleurs... background: '#FAFAFA'".
				// If I do that, I might break Shadcn's dark mode if I don't handle it.
				// I will assume the user wants `bg-background` to be Fafa. I will do this via CSS variables as it is the Shadcn way and they asked to update globals.css.
				// So in tailwind.config, I will keep `background: 'hsl(var(--background))'` and update the CSS var.
				// Wait, the prompt says: "Ajoute ces couleurs précises ... background: '#FAFAFA'".
				// I'll add them as `mode-background`? No, `background` is a standard key.
				// The user prompt in section 2 says "Add these colors... background: '#FAFAFA'".
				// But in section 3 says "Update Shadcn variables...".
				// I'll put the *custom* colors (ikonga, pillar) here. 
				// For background/foreground, I will use the CSS variables mechanism to ensure Shadcn components work (they rely on `bg-background`).
				// I'll update the `app/globals.css` with the hex converted to HSL/appropriate values.
				// '#FAFAFA' is 0 0% 98%.
				// '#1A1A1A' is 0 0% 10%.

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
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
