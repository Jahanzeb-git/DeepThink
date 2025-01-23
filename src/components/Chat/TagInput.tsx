import React from 'react';
import { ImagePlus, Brain, Eye, FileText } from 'lucide-react';

interface TagInputProps {
  onAddTag: (tag: string) => void;
}

const TagInput: React.FC<TagInputProps> = ({ onAddTag }) => {
  return (
    <div className="flex gap-3 py-2 overflow-x-auto hide-scrollbar">
      <button 
        onClick={() => onAddTag('Create Image')} 
        className="flex items-center gap-2 px-4 py-2.5 
          rounded-xl border border-gray-700/50 dark:border-gray-300/50
          hover:bg-gray-800/50 dark:hover:bg-gray-200/50
          transition-all duration-200 whitespace-nowrap">
        <ImagePlus className="text-emerald-500" size={18} />
        <span className="text-sm text-gray-300 dark:text-gray-600">Create image</span>
      </button>
      
      <button 
        onClick={() => onAddTag('Brainstorm')} 
        className="flex items-center gap-2 px-4 py-2.5 
          rounded-xl border border-gray-700/50 dark:border-gray-300/50
          hover:bg-gray-800/50 dark:hover:bg-gray-200/50
          transition-all duration-200 whitespace-nowrap">
        <Brain className="text-amber-500" size={18} />
        <span className="text-sm text-gray-300 dark:text-gray-600">Brainstorm</span>
      </button>
      
      <button 
        onClick={() => onAddTag('Analyze images')} 
        className="flex items-center gap-2 px-4 py-2.5 
          rounded-xl border border-gray-700/50 dark:border-gray-300/50
          hover:bg-gray-800/50 dark:hover:bg-gray-200/50
          transition-all duration-200 whitespace-nowrap">
        <Eye className="text-blue-500" size={18} />
        <span className="text-sm text-gray-300 dark:text-gray-600">Analyze images</span>
      </button>
      
      <button 
        onClick={() => onAddTag('Summarize text')} 
        className="flex items-center gap-2 px-4 py-2.5 
          rounded-xl border border-gray-700/50 dark:border-gray-300/50
          hover:bg-gray-800/50 dark:hover:bg-gray-200/50
          transition-all duration-200 whitespace-nowrap">
        <FileText className="text-orange-500" size={18} />
        <span className="text-sm text-gray-300 dark:text-gray-600">Summarize text</span>
      </button>
    </div>
  );
};

export default TagInput;
