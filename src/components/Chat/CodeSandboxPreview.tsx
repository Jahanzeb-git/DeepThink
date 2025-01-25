import React, { useEffect, useState } from 'react';
import { X, Loader } from 'lucide-react';

interface CodeSandboxPreviewProps {
  code: string;
  language: string;
  onClose: () => void;
}

export function CodeSandboxPreview({ code, language, onClose }: CodeSandboxPreviewProps) {
  const [sandboxId, setSandboxId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createSandbox = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Create appropriate files based on language
        const files: Record<string, { content: string }> = {};
        
        if (language === 'react') {
          files['App.js'] = { content: code };
          files['index.js'] = {
            content: `
              import React from 'react';
              import ReactDOM from 'react-dom';
              import App from './App';
              
              ReactDOM.render(
                <React.StrictMode>
                  <App />
                </React.StrictMode>,
                document.getElementById('root')
              );
            `
          };
        } else if (language === 'html') {
          files['index.html'] = { content: code };
        }

        // Create sandbox using CodeSandbox API
        const response = await fetch('https://codesandbox.io/api/v1/sandboxes/define', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `csb_v1_6BmExF3TLe-Dw-UubTjFJEO77xG90rlT1UK-Hr-yJiM` // Note: This should be in environment variables
          },
          body: JSON.stringify({
            files,
            template: language === 'react' ? 'create-react-app' : 'static'
          })
        });

        const { sandbox_id } = await response.json();
        setSandboxId(sandbox_id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create preview');
      } finally {
        setIsLoading(false);
      }
    };

    createSandbox();
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
              Creating preview...
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            {error}
          </div>
        ) : sandboxId ? (
          <iframe
            src={`https://codesandbox.io/embed/${sandboxId}?fontsize=14&hidenavigation=1&theme=dark`}
            className="w-full h-full border-0"
            title="Code Preview"
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
        ) : null}
      </div>
    </div>
  );
}
