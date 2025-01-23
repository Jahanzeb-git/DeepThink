import React, { useState, useEffect } from 'react';

const LoadingPage = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const [scale, setScale] = useState('scale-95');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const darkColors = [
    'text-blue-300', 
    'text-indigo-300', 
    'text-purple-300', 
    'text-cyan-300', 
    'text-teal-300'
  ];

  const lightColors = [
    'text-blue-700', 
    'text-indigo-800', 
    'text-purple-800', 
    'text-cyan-700', 
    'text-teal-700'
  ];

  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(prefersDarkMode.matches);

    const colorTimer = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % darkColors.length);
    }, 500);

    const scaleTimer = setTimeout(() => {
      setScale('scale-100');
    }, 500);

    const redirectTimer = setTimeout(() => {
      window.location.href = '/main';
    }, 3000);

    return () => {
      clearInterval(colorTimer);
      clearTimeout(scaleTimer);
      clearTimeout(redirectTimer);
    };
  }, []);

  return (
    <div className={`
      flex 
      items-center 
      justify-center 
      h-screen 
      ${isDarkMode ? 'bg-black' : 'bg-white'}
    `}>
      <div className="flex items-center space-x-4">
        <h1 className={`
          ${isDarkMode ? darkColors[colorIndex] : lightColors[colorIndex]}
          text-4xl 
          font-bold 
          tracking-wide 
          transform 
          ${scale}
          transition-all 
          duration-1000 
          ease-in-out
        `}>
          DeepThinks
        </h1>
        <div className="animate-pulse opacity-70">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`
              h-10 w-10 
              ${isDarkMode ? 'text-white' : 'text-black'}
            `}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
