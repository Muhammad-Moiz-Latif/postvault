/** @type {import('tailwindcss').Config} */
export default {
    theme: {
        extend: {
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
                    '50%': { transform: 'translateY(-20px) translateX(10px)' },
                },
                floatSlow: {
                    '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
                    '50%': { transform: 'translateY(-15px) translateX(-8px)' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                lineReveal: {
                    '0%': { transform: 'scaleX(0)' },
                    '100%': { transform: 'scaleX(1)' },
                },
            },
            animation: {
                float: 'float 6s ease-in-out infinite',
                floatSlow: 'floatSlow 8s ease-in-out infinite',
                fadeUp: 'fadeUp 0.8s ease-out forwards',
                lineReveal: 'lineReveal 1.2s ease-out forwards',
            },
        },
    },
}
