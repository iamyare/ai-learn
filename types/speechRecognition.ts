export interface DialogEntry {
  timestamp: string
  text: string,
  page?: number
}

export interface SpeechRecognitionContextType {
  isListening: boolean;
  transcript: string;
  history: DialogEntry[];
  currentPage: number;
  startListening: () => void;
  stopListening: () => void;
  updateOptions: (newOptions: Partial<SpeechRecognitionOptions>) => void;
  changePage: (newPage: number) => void;
}

export interface SpeechRecognitionOptions {
  groupingInterval?: number;
  language?: string;
  history?: DialogEntry[];
  transcript?: string;
}