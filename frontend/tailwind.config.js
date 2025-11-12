/** @type {import('tailwindcss').Config} */
export default {
  // --- ASEGÚRATE DE QUE ESTA SECCIÓN 'content' ESTÉ CORRECTA ---
  content: [
    "./index.html",
    // Esta línea es la más importante. Vigila todos
    // los archivos .tsx y .jsx dentro de la carpeta 'src'.
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  // ----------------------------------------------------
  theme: {
    extend: {},
  },
  plugins: [],
}