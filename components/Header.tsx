
import React from 'react';
import { BananaIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <BananaIcon className="w-8 h-8 text-yellow-300 mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-cyan-400">
          Nano Banana AI Photo Editor
        </h1>
      </div>
    </header>
  );
};

export default Header;
