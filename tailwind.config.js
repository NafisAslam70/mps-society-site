// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx}",
//     "./components/**/*.{js,ts,jsx,tsx}",
//     "./app/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       screens: {
//         mobile: "480px",
//       },
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
export const content = [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Include all files in app/
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Include components
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Include pages (if using Pages Router)
];
export const theme = {
    extend: {
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
            arabic: ['Amiri', 'serif'],
            handwriting: ['HandwritingFont', 'cursive'],
        },
    },
};
export const plugins = [];