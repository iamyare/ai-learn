// Definición de ImportantEventType
interface ImportantEventType {
  title: string;
  description: string;
  date: string;
  priority: string;
}

// Interfaz base para todos los tipos de mensajes
interface BaseMessageType {
  isUser: boolean;
  timestamp: string;
}

// Tipo para mensajes regulares
interface MessageType extends BaseMessageType {
  content: string;
}

// Tipo para mensajes de eventos
interface EventMessageType extends BaseMessageType {
  events: ImportantEventType[];
}

// Tipo para mensajes de mapas mentales
interface MindMapMessageType extends BaseMessageType {
  mindMap: string;
}

// Definición de ChartData
interface ChartData {
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
interface ChartMessageType extends BaseMessageType {
  chartData: ChartData;
}

// Tipo para mensajes de notas
interface NoteMessageType extends BaseMessageType {
  noteText: string;
}

// Tipo para mensajes de explicación
interface ExplanationMessageType extends BaseMessageType {
  explanation: {
    context: string;
    explanation: string;
  };
}

// Tipo para mensajes de traducción
interface TranslationMessageType extends BaseMessageType {
  translation: {
    original: string;
    translated: string;
  };
}

// Tipo unión para usar en componentes que manejan todos los tipos de mensajes
type ChatMessageType = MessageType | EventMessageType | MindMapMessageType | ChartMessageType | NoteMessageType | ExplanationMessageType | TranslationMessageType;