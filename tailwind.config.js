/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            spacing: Object.fromEntries([...Array(2000)].map((_, i) => [i, `${i / 4}rem`])),
            minWidth: Object.fromEntries([...Array(2000)].map((_, i) => [i, `${i / 4}rem`])),
            maxWidth: Object.fromEntries([...Array(2000)].map((_, i) => [i, `${i / 4}rem`])),
            minHeight: Object.fromEntries([...Array(2000)].map((_, i) => [i, `${i / 4}rem`])),
            maxHeight: Object.fromEntries([...Array(2000)].map((_, i) => [i, `${i / 4}rem`])),
            fontSize: Object.fromEntries([...Array(200)].map((_, i) => [i, `${i / 16}rem`])),
            lineHeight: Object.fromEntries([...Array(200)].map((_, i) => [i, `${i / 16}rem`])),
            borderRadius: Object.fromEntries([...Array(40)].map((_, i) => [i, `${i / 16}rem`])),
            borderWidth: Object.fromEntries([...Array(40)].map((_, i) => [i, `${i / 16}rem`])),
            letterSpacing: Object.fromEntries([...Array(10)].map((_, i) => [i, `${i / 16}rem`])),
            screens: {
                pc: '1400px',
            },
            backgroundImage: {
                'auth-bg':
                    "url('https://birchtree.me/content/images/size/w2000/2020/08/DB0B3B0A-1888-41AB-B044-AB24A90229CE..jpeg')",
            },
        },
    },
    variants: {
        extend: {},
    },
    corePlugins: {
        preflight: false,
    },
    plugins: [],

    important: true,
};
