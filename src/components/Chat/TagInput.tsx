import React from 'react';
import { ImagePlus, Brain, Eye, FileText } from 'lucide-react';

interface TagInputProps {
  onAddTag: (tag: string) => void; // Explicitly define the type
}

const TagInput: React.FC<TagInputProps> = ({ onAddTag }) => {
  return (
    <div className="flex gap-2 p-2 rounded-full">
      <button 
        onClick={() => onAddTag('Create Image')} 
        className="flex items-center gap-2 px-3 py-2 
          rounded-full border border-gray-600 hover:border-gray-400 
          transition-colors">
        <ImagePlus className="text-emerald-500" size={16} />
        <span className="text-xs sm:text-sm text-gray-300">Create image</span>
      </button>
      
      <button 
        onClick={() => onAddTag('Brainstorm')} 
        className="flex items-center gap-2 px-3 py-2 
          rounded-full border border-gray-600 hover:border-gray-400 
          transition-colors">
        <Brain className="text-amber-500" size={16} />
        <span className="text-xs sm:text-sm text-gray-300">Brainstorm</span>
      </button>
      
      <button 
        onClick={() => onAddTag('Analyze images')} 
        className="flex items-center gap-2 px-3 py-2 
          rounded-full border border-gray-600 hover:border-gray-400 
          transition-colors">
        <Eye className="text-blue-500" size={16} />
        <span className="text-xs sm:text-sm text-gray-300">Analyze images</span>
      </button>
      
      <button 
        onClick={() => onAddTag('Summarize text')} 
        className="flex items-center gap-2 px-3 py-2 
          rounded-full border border-gray-600 hover:border-gray-400 
          transition-colors">
        <FileText className="text-orange-500" size={16} />
        <span className="text-xs sm:text-sm text-gray-300">Summarize text</span>
      </button>
    </div>
  );
};

export default TagInput;
