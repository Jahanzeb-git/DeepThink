import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Play, Eye, Edit2, Save } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeExecutor } from './CodeExecutor';
import { CodeSandboxPreview } from './CodeSandboxPreview';

interface CodePreviewProps {
  code: string;
  language?: string;
  isOpen: boolean;
  onClose: () => void;
}

const BACKEND_LANGUAGES = ['python', 'c', 'cpp', 'java', 'javascript'];
const FRONTEND_LANGUAGES = ['react', 'html', 'css'];

export function CodePreview({ code: initialCode, language = 'typescript', isOpen, onClose }: CodePreviewProps) {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showExecutor, setShowExecutor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(initialCode);

  const isBackendLanguage = BACKEND_LANGUAGES.includes(language.toLowerCase());
  const isFrontendLanguage = FRONTEND_LANGUAGES.includes(language.toLowerCase());

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(true);
      setShowExecutor(false);
      setShowPreview(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    setCode(initialCode);
    setEditedCode(initialCode);
  }, [initialCode]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = () => {
    setShowExecutor(true);
    setShowPreview(false);
  };

  const handleViewPreview = () => {
    setShowPreview(true);
    setShowExecutor(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setCode(editedCode);
    setIsEditing(false);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedCode(e.target.value);
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
          ${showPreview ? 'lg:w-full' : ''}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-700 dark:border-gray-200">
            <h3 className="text-white dark:text-gray-900 font-medium">Code Preview</h3>
            <div className="flex gap-2">
              {isBackendLanguage && (
                <button
                  onClick={handleRunCode}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-md transition-colors"
                  title="Run code"
                >
                  <Play size={16} />
                  Run Code
                </button>
              )}
              {isFrontendLanguage && (
                <button
                  onClick={handleViewPreview}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-md transition-colors"
                  title="View preview"
                >
                  <Eye size={16} />
                  View Preview
                </button>
              )}
              <button
                onClick={isEditing ? handleSave : handleEdit}
                className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-md transition-colors"
                title={isEditing ? "Save changes" : "Edit code"}
              >
                {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
                {isEditing ? 'Save' : 'Edit'}
              </button>
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
          <div className="flex-1 overflow-auto p-4 relative">
            {isEditing ? (
              <textarea
                value={editedCode}
                onChange={handleCodeChange}
                className="w-full h-full p-4 bg-[#1a1a1a] text-gray-200 font-mono text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                style={{
                  resize: 'none',
                  lineHeight: '1.5',
                  tabSize: 2,
                }}
                spellCheck="false"
              />
            ) : (
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
            )}

            {/* Code Executor Terminal */}
            {showExecutor && (
              <CodeExecutor
                code={code}
                language={language}
                onClose={() => setShowExecutor(false)}
              />
            )}
          </div>

          {/* Frontend Preview */}
          {showPreview && (
            <CodeSandboxPreview
              code={code}
              language={language}
              onClose={() => setShowPreview(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
