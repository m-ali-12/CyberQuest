/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          green: '#00ff88',
          blue: '#00d4ff',
          red: '#ff0055',
          purple: '#7c3aed',
          yellow: '#fbbf24',
          dark: '#0a0e1a',
          card: '#0f1629',
          border: '#1e2d4a',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)",
        'glow-green': 'radial-gradient(ellipse at center, rgba(0,255,136,0.15) 0%, transparent 70%)',
        'glow-blue': 'radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'flicker': 'flicker 0.15s infinite',
        'matrix': 'matrix 20s linear infinite',
        'typing': 'typing 3s steps(30) infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0,255,136,0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0,255,136,0.8), 0 0 40px rgba(0,255,136,0.3)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        matrix: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        typing: {
          '0%': { width: '0' },
          '50%': { width: '100%' },
          '100%': { width: '0' },
        },
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0,255,136,0.3)',
        'cyber-blue': '0 0 20px rgba(0,212,255,0.3)',
        'cyber-red': '0 0 20px rgba(255,0,85,0.3)',
        'inner-cyber': 'inset 0 0 20px rgba(0,255,136,0.1)',
      },
    },
  },
  plugins: [],
};
