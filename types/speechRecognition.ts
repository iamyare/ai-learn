
export interface DialogEntry {
    timestamp: string
    text: string,
    page?: number
  }
  

  export interface SpeechRecognitionContextType {
    isListening: boolean;
    transcript: string;
    history: DialogEntry[];
    startListening: () => void;
    stopListening: () => void;
    updateOptions: (newOptions: Partial<SpeechRecognitionOptions>) => void;
    error: string | null;
  }
  
  export interface SpeechRecognitionOptions {
    groupingInterval?: number;
    language?: string;
    history?: DialogEntry[]; // Add this line
    transcript?: string; // Add this line
  }