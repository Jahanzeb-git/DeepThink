import React, { useEffect, useState } from 'react';
import { X, Loader } from 'lucide-react';

interface CodeSandboxPreviewProps {
  code: string;
  language: string;
  onClose: () => void;
}

export function CodeSandboxPreview({ code, language, onClose }: CodeSandboxPreviewProps) {
  const [Component, setComponent] = useState<React.FC | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderCode = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (language === 'react') {
          // Dynamically evaluate the React code
          const exportedComponent = eval(`
            (function() {
              ${code}
              return App;
            })()
          `);
          setComponent(() => exportedComponent);
        } else if (language === 'html') {
          // Render HTML/CSS directly in an iframe
          const blob = new Blob([code], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          setComponent(() => () => (
            <iframe
              src={url}
              className="w-full h-full border-0"
              title="HTML Preview"
              sandbox="allow-scripts"
            />
          ));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render code');
      } finally {
        setIsLoading(false);
      }
    };

    renderCode();
  }, [code, language]);

  return (
    <div className="absolute inset-0 bg-gray-900 dark:bg-white transform transition-all duration-300">
      <div className="flex items-center justify-between p-4 border-b border-gray-700 dark:border-gray-200">
        <h3 className="text-white dark:text-gray-900 font-medium">Live Preview</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 dark:hover:bg-gray-200 rounded-md text-gray-400 dark:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>
      <div className="h-[calc(100%-4rem)]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-2 text-emerald-500">
              <Loader className="animate-spin" size={20} />
              Rendering preview...
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            {error}
          </div>
        ) : Component ? (
          <Component />
        ) : null}
      </div>
    </div>
  );
}
