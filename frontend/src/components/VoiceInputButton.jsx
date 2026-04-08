import { useState, useEffect } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { useNlpStore } from '../store/nlpStore';
import { nlpAPI } from '../services/api';

export function VoiceInputButton({ onResult }) {
  const { isListening, setIsListening, isProcessing, setIsProcessing } = useNlpStore();
  const [recognition, setRecognition] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = 'ta-IN';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };

      rec.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setIsProcessing(true);
        try {
          // Call Backend
          const res = await nlpAPI.parseText({ text: transcript });
          onResult(res.data);
        } catch (error) {
          console.error(error);
          setErrorMsg('மீண்டும் முயற்சிக்கவும்');
        } finally {
          setIsProcessing(false);
        }
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setErrorMsg('பிழை ஏற்பட்டது. மீண்டும் பேசவும்.');
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    } else {
      setErrorMsg('உங்கள் உலாவி குரல் தேடலை ஆதரிக்கவில்லை.');
    }
  }, [setIsListening, setIsProcessing, onResult]);

  const handleToggle = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isProcessing}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
          isListening 
            ? 'bg-brand-orange animate-pulse shadow-lg scale-110' 
            : isProcessing 
              ? 'bg-gray-400' 
              : 'bg-brand-orange hover:bg-orange-600 shadow-md hover:shadow-lg'
        } text-white`}
      >
        {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Mic size={28} />}
      </button>
      {errorMsg && <p className="text-brand-red text-sm mt-2 font-medium">{errorMsg}</p>}
      {isListening && <p className="text-brand-orange text-sm mt-2 font-medium animate-pulse">பேசவும்...</p>}
    </div>
  );
}
