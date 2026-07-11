/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#121218',
        backgroundElevated: '#181820',
        surface: '#1C1C25',
        surfaceHighlight: '#23232E',
        border: '#2A2A36',

        primary: '#4F7CFF',
        primaryMuted: '#3A5BC7',
        primarySoft: 'rgba(79, 124, 255, 0.16)',

        success: '#3DDC84',
        successSoft: 'rgba(61, 220, 132, 0.16)',

        danger: '#FF6B6B',
        dangerSoft: 'rgba(255, 107, 107, 0.16)',

        warning: '#FFC24B',

        textPrimary: '#FFFFFF',
        textSecondary: '#9A9AA8',
        textTertiary: '#6B6B78',
      },
      borderRadius: {
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '28px',
      },
    },
  },
  plugins: [],
};
