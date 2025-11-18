/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",      // สำหรับ App Router
    "./pages/**/*.{js,ts,jsx,tsx}",    // สำหรับ Pages Router
    "./components/**/*.{js,ts,jsx,tsx}" // สำหรับ components
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00bfa5",  // ตัวอย่างเพิ่มสีเอง
      },
      fontFamily: {
        sans: ["Geist", "sans-serif"], // ตัวอย่างเพิ่มฟอนต์
      },
      screens: {
      xs: "480px", // มือถือเล็ก
      sm: "640px",
      md: "768px",
      tablet: "820px", // เพิ่ม breakpoint ใหม่ระหว่างมือถือกับแท็บเล็ต
      lg: "1140px",
      xl: "1280px",
    },
    },
  },
  plugins: [],
};
