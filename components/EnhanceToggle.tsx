
import React from 'react';
import { SparklesIcon } from './icons';

interface EnhanceToggleProps {
  isEnhanced: boolean;
  onToggle: (isEnhanced: boolean) => void;
}

const EnhanceToggle: React.FC<EnhanceToggleProps> = ({ isEnhanced, onToggle }) => {
  const handleToggle = () => {
    onToggle(!isEnhanced);
  };

  return (
    <div className="flex items-center justify-center pt-2">
        <label htmlFor="enhance-toggle" className="flex items-center cursor-pointer">
            <SparklesIcon className="w-5 h-5 mr-3 text-cyan-400" />
            <span className="mr-3 text-gray-300 font-medium">Enhance Image</span>
            <div className="relative">
                <input
                type="checkbox"
                id="enhance-toggle"
                className="sr-only"
                checked={isEnhanced}
                onChange={handleToggle}
                />
                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div
                className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
                    isEnhanced ? 'transform translate-x-6 bg-cyan-300' : ''
                }`}
                ></div>
            </div>
        </label>
    </div>
  );
};

export default EnhanceToggle;
