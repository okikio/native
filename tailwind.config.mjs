export default {
    darkMode: 'media',
    mode: "jit",
    content: [
        './src/**/*.{md,astro,html,ts,tsx}',
        // './public/**/*.{html}'
    ],

    theme: {
        extend: {
            fontFamily: {
                "lexend": ["Lexend", "Manrope", "Century Gothic", "sans-serif"],
                "manrope": ["Manrope", "Lexend", "Century Gothic", "sans-serif"]
            },
            colors: {
                "elevated": "#1C1C1E",
                "elevated-2": "#262628",
                "label": "#ddd",
                "secondary": "#bbb",
                "tertiary": "#555",
                "quaternary": "#333",
            },
            screens: {
                'lt-2xl': { 'max': '1535px' },
                // => @media (max-width: 1535px) { ... }

                'lt-xl': { 'max': '1279px' },
                // => @media (max-width: 1279px) { ... }

                'lt-lg': { 'max': '1023px' },
                // => @media (max-width: 1023px) { ... }

                'lt-md': { 'max': '767px' },
                // => @media (max-width: 767px) { ... }

                'lt-sm': { 'max': '639px' },
                // => @media (max-width: 639px) { ... }
            },
            container: {
                center: 'true',
            }
        },
    },
    variants: {},
    plugins: [],
};
