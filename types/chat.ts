// Definición de ImportantEventType
export interface ImportantEventType {
  title: string;
  description: string;
  date: string;
  priority: 'Alta' | 'Media' | 'Baja';
}

// Interfaz base para todos los tipos de mensajes
export interface BaseMessageType {
  isUser: boolean;
  timestamp: string;
}

// Tipo para mensajes regulares
export interface MessageType extends BaseMessageType {
  content: string;
}

// Tipo para mensajes de eventos
export interface EventMessageType extends BaseMessageType {
  events: ImportantEventType[];
}

// Tipo para mensajes de mapas mentales
export interface MindMapMessageType extends BaseMessageType {
  mindMap: string;
}

// Definición de ChartData
export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area';
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

// Tipo para mensajes de gráficos
export interface ChartMessageType extends BaseMessageType {
  chartData: ChartData;
}

// Tipo para mensajes de notas
export interface NoteMessageType extends BaseMessageType {
  noteText: string;
}

// Tipo para mensajes de explicación
export interface ExplanationMessageType extends BaseMessageType {
  explanation: {
    context: string;
    explanation: string;
  };
}

export interface TranslationProps {
  translation: {
    original: string;
    translated: string;
    sourceLanguage: string;
    targetLanguage: string;
  };
}

// Tipo para mensajes de traducción
export interface TranslationMessageType extends BaseMessageType, TranslationProps {}

// Tipo unión para usar en componentes que manejan todos los tipos de mensajes
export type ChatMessageType = MessageType | EventMessageType | MindMapMessageType | ChartMessageType | NoteMessageType | ExplanationMessageType | TranslationMessageType;