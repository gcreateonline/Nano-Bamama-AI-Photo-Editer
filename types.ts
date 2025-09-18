
export interface EditResult {
  imageUrl: string | null;
  text: string | null;
}

export interface HistoryItem {
  id: string;
  originalImagePreview: string;
  prompt: string;
  editedImageUrl: string;
  editedImageText: string | null;
}
