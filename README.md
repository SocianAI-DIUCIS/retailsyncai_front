## RetailSyncAI Frontend (Next.js + TypeScript + TailwindCSS)

RetailSyncAI Frontend is a modern, high-performance React application built with Next.js (App Router), TypeScript, and TailwindCSS.
This guide explains how to set up the frontend environment, run the development server, enable TypeScript, integrate TailwindCSS, and create production builds.

### Features

- Next.js App Router (latest architecture)
- TypeScript-first setup
- TailwindCSS for fast UI development
- Hot reloading development server
- Production-ready build pipeline
- Fully compatible with RetailSyncAI Django backend


### 1. Install Node.js

Download and install the latest Node.js LTS:
https://nodejs.org/
#### Recommended is v24.11.1

Verify installation:

```bash
node -v
npm -v
```

### 2. Clone / Download the GitHub Repository (Recommended) or Create a New Next.js App

#### Clone the Project from GitHub or Download:
```bash
git clone https://github.com/SocianAI-DIUCIS/retailsyncai_front.git
```

Use the official create-next-app CLI:

```bash
npx create-next-app@latest retailsyncai_front
cd retailsyncai_front
```

You will be asked:
- Use TypeScript? → Yes
- Use TailwindCSS? → Yes
- Use App Router? → Yes
- Use ESLint? → Optional
- Import alias? → Default (@/)

This scaffolds a complete, modern Next.js project.

### 3. Run the Development Server

Install dependencies (if needed):

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Visit: http://localhost:3000

Next.js will automatically hot-reload when you edit files.

### 4. Enable TypeScript (If Not Selected During Setup)

If you skipped TypeScript during scaffolding, enable it manually:

```bash
npm install --save-dev typescript @types/react @types/node
```

Next.js will create:
- tsconfig.json
- next-env.d.ts

### 5. Add Tailwind CSS (If Not Included During Setup)

If you didn’t select Tailwind during create-next-app:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update tailwind.config.js:

```bash
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
```

Add Tailwind to globals.css:

```bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 6. Build for Production

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Common scripts:

```bash
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

### 7. Viewing the App

Visit:

http://localhost:3000

Start editing the home page:

#### app/page.tsx


Live reload applies changes instantly.

### Recommended Project Structure
```bash
retailsyncai_front/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── (route folders)
│
├── components/
│
├── styles/
│   └── globals.css
│
├── public/
│
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

### Backend Integration (Optional)

If using the RetailSyncAI Django backend, create a .env.local file:

NEXT_PUBLIC_API_BASE=http://localhost:8000/api

### You're Ready!

You now have a complete, modern, scalable Next.js frontend with:
- TypeScript
- TailwindCSS
- Production build support
- Hot reload dev environment
