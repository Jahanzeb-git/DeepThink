import React, { useRef, useEffect } from 'react';
import { Brain, Search, Send, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ChatInput({
  onSendMessage,
  value,
  onChange,
  className = '',
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [value]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      await onSendMessage(value);
      onChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative bg-gray-700 dark:bg-gray-300 rounded-3xl border border-gray-700 dark:border-gray-300 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message DeepSeek..."
          className="w-full max-h-[350px] overflow-y-auto p-4 mb-12 rounded-xl resize-none 
            bg-gray-700 dark:bg-gray-300
            text-gray-100 dark:text-gray-800
            border-none
            focus:outline-none focus:ring-0
            whitespace-pre-wrap
            scrollbar-thin scrollbar-thumb-gray-600 dark:scrollbar-thumb-gray-400
            transition-all duration-200"
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-2 bg-gray-700 dark:bg-gray-300 rounded-b-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            {['brain', 'search', 'mic'].map((icon, index) => (
              <motion.button
                key={icon}
                type="button"
                className="p-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-400 
                       text-gray-100 dark:text-gray-800 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                {icon === 'brain' && <Brain className="w-5 h-5" />}
                {icon === 'search' && <Search className="w-5 h-5" />}
                {icon === 'mic' && <Mic className="w-5 h-5" />}
              </motion.button>
            ))}
          </div>
          <motion.button
            type="submit"
            className="p-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-400 
                     text-gray-100 dark:text-gray-800 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Send className="w-5 h-5 text-blue-500" />
          </motion.button>
        </motion.div>
      </div>
    </motion.form>
  );
}
