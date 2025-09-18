import React from 'react';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  disabled: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, onPromptChange, disabled }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
        2. Describe the Animation
      </label>
      <textarea
        id="prompt"
        name="prompt"
        rows={4}
        className="block w-full bg-gray-900 border-gray-600 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-gray-200 placeholder-gray-500 transition-colors duration-300"
        placeholder="e.g., A cinematic shot of a car driving on a rainy night, neon lights reflecting on the wet road."
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
};

export default PromptInput;
