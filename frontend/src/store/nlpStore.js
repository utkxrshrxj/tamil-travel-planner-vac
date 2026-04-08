import { create } from 'zustand';

export const useNlpStore = create((set) => ({
  rawInput: '',
  parsedResult: null,
  isListening: false,
  isProcessing: false,
  setRawInput: (rawInput) => set({ rawInput }),
  setParsedResult: (parsedResult) => set({ parsedResult }),
  setIsListening: (isListening) => set({ isListening }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  reset: () => set({ rawInput: '', parsedResult: null, isListening: false, isProcessing: false })
}));
