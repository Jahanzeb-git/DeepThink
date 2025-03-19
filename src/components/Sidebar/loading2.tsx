import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingModal = ({ isOpen, onClose, message = "Logging Out..." }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsVisible(false);
              onClose();
            }, 600);
            return 100;
          }
          return prev + 2.5; // Completes in ~4 seconds (smoother)
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isOpen, onClose]);
  
  if (!isOpen && !isVisible) return null;
  
  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-md transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => e.target === e.currentTarget && progress === 100 && onClose()}
    >
      <div 
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 relative overflow-hidden ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
        }`}
      >
        {/* Gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <div className="flex flex-col items-center space-y-8">
          {/* Spinner with progress */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Outer ring */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <circle 
                className="text-gray-200 dark:text-gray-700 stroke-current" 
                strokeWidth="5"
                fill="transparent"
                r="44" 
                cx="50" 
                cy="50"
              />
              <circle 
                className="text-blue-500 stroke-current" 
                strokeWidth="5"
                strokeLinecap="round"
                fill="transparent"
                r="44" 
                cx="50" 
                cy="50"
                strokeDasharray="276.5"
                strokeDashoffset={276.5 - (progress / 100) * 276.5}
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              />
            </svg>
            
            {/* Inner content */}
            <div className="z-10 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          
          {/* Progress bar (alternative visual) */}
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Message */}
          <div className="text-center space-y-2">
            <p className="text-gray-800 dark:text-gray-200 font-medium text-lg">
              {message}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Please wait while we process your request
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
