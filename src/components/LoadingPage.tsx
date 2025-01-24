import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingPage: React.FC = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const [scale, setScale] = useState('scale-95');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

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
    // Detect dark mode preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(prefersDarkMode.matches);

    // Color cycling animation
    const colorTimer = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % darkColors.length);
    }, 300);

    // Scale animation
    const scaleTimer = setTimeout(() => {
      setScale('scale-100');
    }, 500);

    // Redirect to main app
    const redirectTimer = setTimeout(() => {
      navigate('/main');
    }, 2000);

    // Cleanup timers
    return () => {
      clearInterval(colorTimer);
      clearTimeout(scaleTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div 
      className={`
        flex 
        items-center 
        justify-center 
        h-screen 
        ${isDarkMode ? 'bg-black' : 'bg-white'}
      `}
    >
      <div className="flex items-center space-x-4">
        <h1 
          className={`
            ${isDarkMode ? darkColors[colorIndex] : lightColors[colorIndex]}
            text-4xl 
            font-bold 
            tracking-wide 
            transform 
            ${scale}
            transition-all 
            duration-1000 
            ease-in-out
          `}
        >
          DeepThinks
        </h1>
      </div>
    </div>
  );
};

export default LoadingPage;

