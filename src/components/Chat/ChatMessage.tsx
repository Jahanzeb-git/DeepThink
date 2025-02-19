import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bot, User, Copy, Check, Info, Code, Brain, ImageIcon, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodePreview } from './CodePreview';
import ImageCarousel from './Slideshow';

interface ChatMessageProps {
  message: string | string[];
  isBot: boolean;
  isTyped: boolean;
  onTypingComplete: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  isDeepThinkEnabled: boolean;
  imageBase64?: string;
}

interface CodeBlock {
  id: string;
  code: string;
  language: string;
}

export function ChatMessage({ 
  message, 
  isBot, 
  isTyped, 
  onTypingComplete, 
  containerRef,
  isDeepThinkEnabled,
  imageBase64 
}: ChatMessageProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [showR1Info, setShowR1Info] = useState(false);
  const [isCodePreviewOpen, setIsCodePreviewOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('typescript');
  const [isTypingCode, setIsTypingCode] = useState(false);
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [currentProgressIndex, setCurrentProgressIndex] = useState(0);
  const progressUpdateRef = useRef<NodeJS.Timeout | null>(null);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const r1ButtonRef = useRef<HTMLButtonElement>(null);

  // Progress update messages
  const progressUpdates = [
    "...","..."
  ];

  // Handle progress updates for image generation
  useEffect(() => {
    if (isBot && Array.isArray(message) && message[0]?.includes("I'm generating your image")) {
      // Set initial message
      const initialMessage = message[0];
      setDisplayedText(initialMessage);

      // Clear any existing interval
      if (progressUpdateRef.current) {
        clearInterval(progressUpdateRef.current);
      }

      // Start progress updates after 500ms
      const timeoutId = setTimeout(() => {
        let currentIndex = 0;
        
        progressUpdateRef.current = setInterval(() => {
          setDisplayedText(prev => {
            const newMessage = `${initialMessage}\n\n${progressUpdates[currentIndex]}`;
            currentIndex = (currentIndex + 1) % progressUpdates.length;
            return newMessage;
          });
        }, 500);
      }, 500);

      return () => {
        clearTimeout(timeoutId);
        if (progressUpdateRef.current) {
          clearInterval(progressUpdateRef.current);
        }
      };
    }
  }, [isBot, message]);

  // Extract code blocks from message
  const extractCodeBlocks = (text: string): CodeBlock[] => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks: CodeBlock[] = [];
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      blocks.push({
        id: Math.random().toString(36).substring(7),
        language: match[1] || 'typescript',
        code: match[2].trim()
      });
    }

    return blocks;
  };

  // Replace code blocks with placeholder
  const replaceCodeBlocks = (text: string) => {
    return text.replace(/```(?:\w+)?\n[\s\S]*?```/g, '```code```');
  };

  // Handle click outside for R1 tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (r1ButtonRef.current && !r1ButtonRef.current.contains(event.target as Node)) {
        setShowR1Info(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Typing animation with code block detection
  const animateTyping = useCallback(() => {
    if (!isBot || isTyped) {
      const messageText = Array.isArray(message) ? message.join('\n') : message;
      setDisplayedText(replaceCodeBlocks(messageText));
      setCodeBlocks(extractCodeBlocks(messageText));
      return;
    }

    setIsTyping(true);
    const messageText = Array.isArray(message) ? message.join('\n') : message;
    let currentIndex = 0;
    const textLength = messageText.length;
    let inCodeBlock = false;
    let codeBlockStart = -1;
    let tempCodeBlocks: CodeBlock[] = [];

    const typeNextChar = () => {
      if (currentIndex < textLength) {
        // Check for code block markers
        if (messageText.slice(currentIndex).startsWith('```')) {
          if (!inCodeBlock) {
            // Starting a code block
            inCodeBlock = true;
            codeBlockStart = currentIndex;
            setIsTypingCode(true);
          } else {
            // Ending a code block
            inCodeBlock = false;
            setIsTypingCode(false);
            
            // Extract and add the code block
            const codeBlockText = messageText.slice(codeBlockStart, currentIndex + 3);
            const blocks = extractCodeBlocks(codeBlockText);
            if (blocks.length > 0) {
              tempCodeBlocks = [...tempCodeBlocks, blocks[0]];
              setCodeBlocks(tempCodeBlocks);
            }
          }
          currentIndex += 3; // Skip the ```
          
          // Update displayed text with placeholder
          setDisplayedText(replaceCodeBlocks(messageText.slice(0, currentIndex)));
        } else {
          currentIndex++;
          if (!inCodeBlock) {
            setDisplayedText(replaceCodeBlocks(messageText.slice(0, currentIndex)));
          }
        }
        
        // Natural typing speed variation
        const delay = inCodeBlock ? 5 : Math.random() * 20 + 10; // Faster typing for code
        typingRef.current = setTimeout(typeNextChar, delay);
      } else {
        setIsTyping(false);
        setIsTypingCode(false);
        onTypingComplete();
      }
    };

    typeNextChar();

    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, [message, isBot, isTyped, onTypingComplete]);

  useEffect(() => {
    animateTyping();
    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, [animateTyping]);

  // Copy message to clipboard with feedback
  const copyToClipboard = async () => {
    try {
      const textToCopy = Array.isArray(message) ? message.join('\n') : message;
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleCodePreview = (codeBlock: CodeBlock) => {
    setCurrentCode(codeBlock.code);
    setCurrentLanguage(codeBlock.language);
    setIsCodePreviewOpen(true);
  };

  // Custom renderer for code blocks
  const CodeBlockPlaceholder = ({ index }: { index: number }) => {
    const codeBlock = codeBlocks[index];
    if (!codeBlock) return null;

    return (
      <div className="my-4 p-4 bg-gray-800/50 dark:bg-gray-200/50 rounded-lg border border-gray-700 dark:border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code size={20} className={isTypingCode ? "animate-pulse text-emerald-500" : "text-gray-400"} />
            <span className="text-sm text-gray-400">
              {isTypingCode && index === codeBlocks.length - 1 ? "Generating code..." : `${codeBlock.language} code`}
            </span>
          </div>
          <button
            onClick={() => handleCodePreview(codeBlock)}
            className="text-sm text-blue-500 hover:text-blue-400 dark:text-blue-600 dark:hover:text-blue-500"
          >
            View code
          </button>
        </div>
      </div>
    );
  };

  // Special case for image generation welcome message
  if (message === "Hi, I'm DeepSeek, How can I help you today?" && isBot) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white dark:text-gray-900 mb-4 md:mb-8 text-center">
          {message}
        </h1>
        <div className="w-full h-64 md:h-96">
          <ImageCarousel />
        </div>
      </div>
    );
  }

  const messageText = Array.isArray(message) ? message.join('\n') : message;

  return (
    <div
      className={`flex gap-4 p-4 relative group ${!isBot && 'bg-gray-800 dark:bg-gray-200/50 rounded-lg'}`}
      ref={messageRef}
    >
      {!isBot && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-500/20 text-blue-500 dark:bg-gray-500/30 dark:text-blue-400">
            <User size={20} />
          </div>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <div className="font-medium text-sm text-gray-400 dark:text-gray-600 mb-1 flex items-center">
          {isBot ? 'DeepThink' : 'You'}
          {isDeepThinkEnabled && isBot && (
            <button
              ref={r1ButtonRef}
              onClick={() => setShowR1Info(!showR1Info)}
              className="ml-2 relative inline-flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-500 transition-colors"
            >
              <div className="flex items-center">
                <Brain size={16} className="mr-1" />
                <span className="text-xs">R1</span>
              </div>
              {showR1Info && (
                <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-black rounded-md whitespace-nowrap shadow-lg">
                  Generated with Advanced Reasoning model
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-2 h-2 bg-black rotate-45"></div>
                </div>
              )}
            </button>
          )}
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <div className="text-gray-200 dark:text-gray-800 leading-relaxed">
            {isBot && !isTyped ? (
              <>
                {displayedText.split('```code```').map((text, index, array) => (
                  <React.Fragment key={index}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {text}
                    </ReactMarkdown>
                    {index < array.length - 1 && <CodeBlockPlaceholder index={index} />}
                  </React.Fragment>
                ))}
                {isTyping && (
                  <span className="inline-flex ml-1">
                    <span className="w-1 h-4 bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  </span>
                )}
              </>
            ) : (
              <>
                {messageText.split(/```(?:\w+)?\n[\s\S]*?```/).map((text, index, array) => (
                  <React.Fragment key={index}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {text}
                    </ReactMarkdown>
                    {index < array.length - 1 && <CodeBlockPlaceholder index={index} />}
                  </React.Fragment>
                ))}
              </>
            )}
            
            {/* Display generated image if available */}
            {imageBase64 && (
              <div className="mt-4 relative">
                <div className="relative">
                  <img
                    src={`data:image/jpeg;base64,${imageBase64}`}
                    alt="Generated image"
                    className="w-full max-w-2xl rounded-lg shadow-lg"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm flex items-center">
                    <ImageIcon size={16} className="mr-1" />
                    Generated Image
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {isBot && (
          <div className="flex justify-end mt-2 items-center space-x-2">
            <button
              onClick={() => setShowModelInfo(prev => !prev)}
              className="p-1.5 rounded-md transition-colors duration-200 text-gray-400 hover:text-gray-300 dark:text-gray-500 dark:hover:text-gray-600"
              aria-label="Model Information"
            >
              <Info size={16} />
            </button>
            {imageBase64 && (
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = `data:image/jpeg;base64,${imageBase64}`;
                  link.download = `generated-image-${Date.now()}.jpg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="p-1.5 rounded-md transition-colors duration-200 text-gray-400 hover:text-gray-300 dark:text-gray-500 dark:hover:text-gray-600"
                aria-label="Download image"
              >
                <Download size={16} />
              </button>
            )}
            <button
              onClick={copyToClipboard}
              className={`p-1.5 rounded-md transition-colors duration-200 
                ${isCopied 
                  ? 'text-green-500 dark:text-green-400' 
                  : 'text-gray-400 hover:text-gray-300 dark:text-gray-500 dark:hover:text-gray-600'}`}
              aria-label={isCopied ? 'Copied!' : 'Copy to clipboard'}
            >
              {isCopied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}

        {showModelInfo && (
          <div className="absolute bottom-full right-0 mb-2 p-3 bg-gray-700 dark:bg-white rounded-lg shadow-lg text-sm text-gray-200 dark:text-gray-800 whitespace-nowrap">
            <p className="font-medium">Model: Qwen 2.5</p>
          </div>
        )}
      </div>

      <CodePreview
        code={currentCode}
        language={currentLanguage}
        isOpen={isCodePreviewOpen}
        onClose={() => setIsCodePreviewOpen(false)}
      />
    </div>
  );
}
