
import React, { useState } from 'react';
import { useImageEditing } from './hooks/useImageEditing';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import Loader from './components/Loader';
import { MagicWandIcon } from './components/icons';
import HistoryPanel from './components/HistoryPanel';
import EnhanceToggle from './components/EnhanceToggle';

const App: React.FC = () => {
  const {
    originalImage,
    originalImagePreview,
    prompt,
    setPrompt,
    editResult,
    isLoading,
    error,
    history,
    handleImageChange,
    handleSubmit,
    loadFromHistory,
    clearHistory,
  } = useImageEditing();
  
  const [isSharpened, setIsSharpened] = useState(false);

  const onImageSelected = (file: File | null) => {
    setIsSharpened(false);
    handleImageChange(file);
  }

  const onGenerateClick = () => {
    setIsSharpened(false);
    handleSubmit();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Column */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl flex flex-col space-y-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-cyan-400">1. Upload Your Image</h2>
            <ImageUpload onImageChange={onImageSelected} preview={originalImagePreview} />
            
            <h2 className="text-2xl font-bold text-cyan-400">2. Describe Your Edit</h2>
            <PromptInput prompt={prompt} setPrompt={setPrompt} disabled={!originalImage || isLoading} />
            
            <button
              onClick={onGenerateClick}
              disabled={!originalImage || !prompt || isLoading}
              className="w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
            >
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <MagicWandIcon className="w-5 h-5 mr-2" />
                  Generate Edit
                </>
              )}
            </button>
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">{error}</p>}
          </div>

          {/* Display Column */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl flex flex-col space-y-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
              <ImageDisplay label="Original" imageUrl={originalImagePreview} />
              <ImageDisplay 
                label="Edited" 
                imageUrl={editResult?.imageUrl} 
                isLoading={isLoading} 
                textOverlay={editResult?.text}
                isDownloadable={!!editResult?.imageUrl && !isLoading}
                isSharpened={isSharpened}
              />
            </div>
             {editResult?.imageUrl && !isLoading && (
              <EnhanceToggle 
                isEnhanced={isSharpened}
                onToggle={setIsSharpened}
              />
            )}
          </div>
        </div>
      </main>

      {history.length > 0 && (
        <HistoryPanel
            history={history}
            onLoadItem={loadFromHistory}
            onClear={clearHistory}
        />
      )}

      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Gemini Nano Banana. Built by a World-Class AI Engineer.</p>
      </footer>
    </div>
  );
};

export default App;
