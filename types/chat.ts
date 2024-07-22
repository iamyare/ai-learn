
// type MessageType = {
//     content: string
//     isUser: boolean
//     timestamp: string
//   }

//   type ImportantEventType = {
//     title: string
//     description: string
//     date: string
//     priority: string
//   }


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

// Tipo unión para usar en componentes que manejan ambos tipos de mensajes
 type ChatMessageType = MessageType | EventMessageType;