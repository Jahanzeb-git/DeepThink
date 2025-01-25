import React, { useEffect, useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodePreviewProps {
  code: string;
  language?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CodePreview({ code, language = 'typescript', isOpen, onClose }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 lg:right-auto">
      <div 
        className={`fixed inset-0 bg-black/20 dark:bg-white/20 backdrop-blur-sm transition-all duration-300 ${
          isOpen && !isAnimating ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full lg:w-[600px] bg-gray-900 dark:bg-white shadow-xl 
          transform transition-all duration-300 ease-out
          ${isOpen && !isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-[10%] opacity-0'}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-700 dark:border-gray-200">
            <h3 className="text-white dark:text-gray-900 font-medium">Code Preview</h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-700 dark:hover:bg-gray-100 rounded-md text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors"
                title="Copy code"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 dark:hover:bg-gray-100 rounded-md text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900 transition-colors"
                title="Close preview"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <SyntaxHighlighter
              language={language}
              style={oneDark}
              showLineNumbers
              customStyle={{
                margin: 0,
                borderRadius: '0.375rem',
                fontSize: '14px',
                background: '#1a1a1a',
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
}
