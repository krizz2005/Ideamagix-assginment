/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crm: {
          bg: '#090d16',        
          card: '#131c2e',      
          border: '#1e293b',   
          brand: '#6366f1',     
          brandHover: '#4f46e5',
          textMain: '#f8fafc',  
          textMuted: '#64748b', 

          statusNew: '#3b82f6',
          statusContacted: '#a855f7',
          statusQualified: '#10b981',
          statusLost: '#ef4444',
          statusWon: '#f59e0b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
//srry I have added last projects styling tailwind config