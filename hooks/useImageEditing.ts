
import { useState, useCallback, useEffect } from 'react';
import { editImage } from '../services/geminiService';
import type { EditResult, HistoryItem } from '../types';

const HISTORY_KEY = 'ai-photo-editor-history';
const MAX_HISTORY_ITEMS = 12;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = (reader.result as string)?.split(',')[1];
      if (result) {
        resolve(result);
      } else {
        reject(new Error("Could not read image data."));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const useImageEditing = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [editResult, setEditResult] = useState<EditResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
      localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory(prevHistory => {
      const newHistory = [item, ...prevHistory]
        .filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i) // remove duplicates
        .slice(0, MAX_HISTORY_ITEMS);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      } catch (e) {
        console.error("Failed to save history to localStorage", e);
      }
      return newHistory;
    });
  }, []);

  const handleImageChange = useCallback((file: File | null) => {
    if (file) {
      setOriginalImage(file);
      setEditResult(null); 
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setOriginalImage(null);
      setOriginalImagePreview(null);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!originalImage || !prompt) {
      setError("Please upload an image and provide a prompt.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditResult(null);

    try {
      const base64Data = await fileToBase64(originalImage);
      const result = await editImage(base64Data, originalImage.type, prompt);
      setEditResult(result);

      if (result.imageUrl && originalImagePreview) {
        addToHistory({
          id: new Date().toISOString() + prompt,
          originalImagePreview: originalImagePreview,
          prompt: prompt,
          editedImageUrl: result.imageUrl,
          editedImageText: result.text,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error("Image editing failed:", errorMessage);
      setError(`Failed to edit image. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt, originalImagePreview, addToHistory]);
  
  const loadFromHistory = useCallback((item: HistoryItem) => {
    setOriginalImage(null); // Can't restore File object, so disable generate button
    setOriginalImagePreview(item.originalImagePreview);
    setPrompt(item.prompt);
    setEditResult({ imageUrl: item.editedImageUrl, text: item.editedImageText });
    setError(null);
    setIsLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error("Failed to clear history from localStorage", e);
    }
  }, []);

  return {
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
  };
};
