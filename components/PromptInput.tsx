
import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  disabled: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, disabled }) => {
  return (
    <textarea
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder="e.g., 'Add a birthday hat on the cat', 'Make the sky look like a sunset', 'Turn this into a Picasso painting'..."
      disabled={disabled}
      rows={4}
      className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300 disabled:opacity-50"
    />
  );
};

export default PromptInput;
