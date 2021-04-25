module.exports = {
    mode: "jit",
    purge: [
        './build/pug/**/*.pug'
    ],

    theme: {
        extend: {
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