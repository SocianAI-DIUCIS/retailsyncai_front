// const config = {
//   plugins: {
//     "@tailwindcss/postcss": {},
//   },
// };

// export default config;

/* @type {import('postcss').Config} */
// const config = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// };

// export default config;

/** @type {import('postcss').Config} */
const config = {
  plugins: {
    // Use the Tailwind PostCSS adapter required by Turbopack/Next
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};

export default config;

