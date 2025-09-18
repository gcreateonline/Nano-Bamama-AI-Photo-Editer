
import React from 'react';
import type { HistoryItem } from '../types';
import { HistoryIcon, TrashIcon } from './icons';

interface HistoryPanelProps {
  history: HistoryItem[];
  onLoadItem: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoadItem, onClear }) => {
  if (history.length === 0) {
    return null;
  }
  
  return (
    <aside className="w-full container mx-auto px-4 md:px-8 pb-8">
      <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <HistoryIcon className="w-6 h-6 mr-3 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">History</h2>
          </div>
          <button
            onClick={onClear}
            className="flex items-center text-sm text-gray-400 hover:text-red-400 transition-colors duration-200"
            aria-label="Clear history"
          >
            <TrashIcon className="w-4 h-4 mr-1" />
            Clear All
          </button>
        </div>
        <div className="flex overflow-x-auto space-x-4 pb-2 -mx-2 px-2" role="list">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onLoadItem(item)}
              className="group relative flex-shrink-0 w-32 h-32 md:w-40 md:h-40 bg-gray-900 rounded-lg cursor-pointer overflow-hidden border-2 border-gray-700 hover:border-cyan-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              title={`Prompt: ${item.prompt}`}
              role="listitem"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onLoadItem(item)}
            >
              <img
                src={item.editedImageUrl}
                alt={`Edited with prompt: ${item.prompt}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                <p className="text-white text-xs text-center max-h-full overflow-hidden">
                  {item.prompt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default HistoryPanel;
