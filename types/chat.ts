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

// Tipo unión para usar en componentes que manejan todos los tipos de mensajes
type ChatMessageType = MessageType | EventMessageType | MindMapMessageType;