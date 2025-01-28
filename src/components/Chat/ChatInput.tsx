import React, { useRef, useEffect, useState } from 'react';
import { Brain, ArrowUp, Mic, ImageIcon, Upload, Square } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, isDeepThinkEnabled: boolean, isImageMode: boolean) => Promise<void>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isDeepThinkEnabled: boolean;
  onToggleDeepThink: () => void;
  onModeChange: (mode: 'text' | 'image') => void;
  mode: 'text' | 'image';
  isBotTyping?: boolean; // New prop to track bot typing status
}

export default function ChatInput({
  onSendMessage,
  value,
  onChange,
  className = '',
  isDeepThinkEnabled,
  onToggleDeepThink,
  onModeChange,
  mode,
  isBotTyping = false
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [value]);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      // Handle interim results
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        if (finalTranscript) {
          onChange(value + finalTranscript + ' ');
        }
        setInterimTranscript(currentInterim);
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setInterimTranscript('');
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
        setInterimTranscript('');
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech Recognition is not supported in this browser.');
    }
  }, [onChange, value]);

  const handleVoiceInput = () => {
    if (!recognition || isBotTyping) return;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      setInterimTranscript('');
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isBotTyping) {
      if (isRecording) {
        recognition?.stop();
        setIsRecording(false);
        setInterimTranscript('');
      }
      await onSendMessage(value, isDeepThinkEnabled, mode === 'image');
      onChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isBotTyping) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleModeChange = () => {
    if (isRecording) {
      recognition?.stop();
      setIsRecording(false);
      setInterimTranscript('');
    }
    const newMode = mode === 'text' ? 'image' : 'text';
    onModeChange(newMode);
    onChange('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative bg-gray-700 dark:bg-gray-300 rounded-3xl border border-gray-700 dark:border-gray-300 p-4 ${
        isBotTyping ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value + (interimTranscript ? ` ${interimTranscript}` : '')}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isRecording
              ? 'Listening...'
              : mode === 'text'
              ? `Message DeepThink${isDeepThinkEnabled ? ' with advanced reasoning...' : '...'}`
              : "Describe the image you want to generate..."
          }
          disabled={isBotTyping}
          className={`w-full max-h-[350px] overflow-y-auto p-4 mb-12 rounded-xl resize-none 
            bg-gray-700 dark:bg-gray-300
            text-gray-100 dark:text-gray-800
            border-none
            focus:outline-none focus:ring-0
            whitespace-pre-wrap
            scrollbar-thin scrollbar-thumb-gray-600 dark:scrollbar-thumb-gray-400
            ${isBotTyping ? 'cursor-not-allowed' : ''}`}
        />
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-2 bg-gray-700 dark:bg-gray-300 rounded-b-xl">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleDeepThink}
              className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-2
                ${isDeepThinkEnabled 
                  ? 'bg-blue-500/20 text-blue-500' 
                  : 'hover:bg-gray-600 dark:hover:bg-gray-400 text-gray-100 dark:text-gray-800'}
                ${isBotTyping ? 'cursor-not-allowed opacity-50' : ''}`}
              title="Toggle DeepThink mode"
              disabled={mode === 'image' || isBotTyping}
            >
              <Brain className="w-5 h-5" />
              {isDeepThinkEnabled && <span className="text-sm">R1</span>}
            </button>
            <button
              type="button"
              onClick={handleModeChange}
              disabled={isBotTyping}
              className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-2
                ${mode === 'image'
                  ? 'bg-purple-500/20 text-purple-500' 
                  : 'hover:bg-gray-600 dark:hover:bg-gray-400 text-gray-100 dark:text-gray-800'}
                ${isBotTyping ? 'cursor-not-allowed opacity-50' : ''}`}
              title="Toggle image generation mode"
            >
              <ImageIcon className="w-5 h-5" />
              {mode === 'image' && <span className="text-sm">Gen</span>}
            </button>
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isBotTyping}
              className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-2
                ${isRecording 
                  ? 'bg-red-500/20 text-red-500' 
                  : 'hover:bg-gray-600 dark:hover:bg-gray-400 text-gray-100 dark:text-gray-800'}
                ${isBotTyping ? 'cursor-not-allowed opacity-50' : ''}`}
              title={isRecording ? 'Stop recording' : 'Voice input'}
            >
              {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isRecording && <span className="text-sm">Recording</span>}
            </button>
          </div>
          <button
            type="submit"
            disabled={isBotTyping || (!value.trim() && !isRecording)}
            className={`p-2 rounded-full bg-blue-500 hover:bg-blue-600 
                   text-white transition-colors
                   ${(isBotTyping || (!value.trim() && !isRecording)) ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Send message"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
}
