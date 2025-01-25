import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';

interface CodeExecutorProps {
  code: string;
  language: string;
  onClose: () => void;
}

interface ExecutionResult {
  stdout: string;
  stderr: string;
  statusCode: number;
  memory: string;
  time: string;
}

const JUDGE0_LANGUAGES: Record<string, number> = {
  'python': 71,
  'javascript': 63,
  'c': 50,
  'cpp': 54,
  'java': 62
};

export function CodeExecutor({ code, language, onClose }: CodeExecutorProps) {
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const executeCode = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const languageId = JUDGE0_LANGUAGES[language.toLowerCase()];
        if (!languageId) {
          throw new Error(`Unsupported language: ${language}`);
        }

        // Using Judge0 API
        const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': '3ea571ddbamsh7b55a807891f363p171b1bjsn035efc33568f' // Note: This should be in environment variables
          },
          body: JSON.stringify({
            source_code: code,
            language_id: languageId,
            stdin: ''
          })
        });

        const { token } = await response.json();

        // Poll for results
        let executionResult;
        do {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
            headers: {
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
              'X-RapidAPI-Key': '3ea571ddbamsh7b55a807891f363p171b1bjsn035efc33568f'
            }
          });
          executionResult = await resultResponse.json();
        } while (executionResult.status?.description === 'Processing');

        setResult({
          stdout: executionResult.stdout || '',
          stderr: executionResult.stderr || '',
          statusCode: executionResult.status?.id || 0,
          memory: executionResult.memory || '0',
          time: executionResult.time || '0'
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to execute code');
      } finally {
        setIsLoading(false);
      }
    };

    executeCode();
  }, [code, language]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 dark:bg-gray-100 transform transition-all duration-300 ease-out shadow-lg"
         style={{ height: '40%' }}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700 dark:border-gray-300">
        <h3 className="text-white dark:text-gray-900 font-medium">Execution Output</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 dark:hover:bg-gray-200 rounded-md text-gray-400 dark:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-4 h-full overflow-auto font-mono text-sm">
        {isLoading ? (
          <div className="flex items-center gap-2 text-emerald-500">
            <Loader className="animate-spin" size={16} />
            Executing code...
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : result ? (
          <div className="space-y-2">
            {result.stdout && (
              <div className="text-white dark:text-gray-900">
                <div className="text-gray-400 dark:text-gray-600 mb-1">Output:</div>
                <pre className="whitespace-pre-wrap">{result.stdout}</pre>
              </div>
            )}
            {result.stderr && (
              <div className="text-red-500">
                <div className="text-gray-400 dark:text-gray-600 mb-1">Error:</div>
                <pre className="whitespace-pre-wrap">{result.stderr}</pre>
              </div>
            )}
            <div className="text-gray-400 dark:text-gray-600 text-xs">
              Execution time: {result.time}s | Memory used: {result.memory}KB
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
