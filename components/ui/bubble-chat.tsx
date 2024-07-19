import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from './markdown-reader';
import { Button } from './button';
import { Check, Copy } from 'lucide-react';


const MessageContent: React.FC<{ content: string }> = React.memo(({ content }) => {
  const [renderedContent, setRenderedContent] = useState<React.ReactNode>('');
  const [isCopied, setIsCopied] = useState(false); // Estado para controlar el ícono

  useEffect(() => {
    const renderContent = async () => {
      // Simula un renderizado asíncrono del markdown
      const rendered = await new Promise<React.ReactNode>(resolve => 
        setTimeout(() => resolve(<MarkdownRenderer content={content} />), 10)
      );
      setRenderedContent(rendered);
    };
    renderContent();
  }, [content]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
    setIsCopied(true); // Cambia al ícono de verificación
    setTimeout(() => setIsCopied(false), 2000); // Vuelve al estado inicial después de 2 segundos
  }, [content]);

  return (
    <>
      {renderedContent}
      <Button
        size="icon"
        variant="outline"
        className="absolute bottom-0 translate-y-1/2 right-5 py-1 px-2 transition-transform active:scale-95"
        onClick={handleCopy}
      >
        {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </Button>
    </>
  );
});

MessageContent.displayName = 'MessageContent';

const EventList: React.FC<{ events: ImportantEventType[] }> = React.memo(({ events }) => (
  <div className="flex flex-col gap-2">
    <h2 className="text-xl font-semibold">Eventos importantes</h2>
    <ul className="space-y-2">
      {events.map((event, index) => (
        <li
          key={index}
          className="bg-background p-2 rounded-md transform-gpu transition-[box-shadow,transform] duration-300 hover:scale-105 hover:shadow-md"
        >
          <h4 className="font-medium">{event.title}</h4>
          <p className="text-xs text-muted-foreground">{event.description}</p>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Fecha: {event.date}</span>
            <span>Prioridad: {event.priority}</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
));

EventList.displayName = 'EventList';

const BubbleChat: React.FC<{ message: ChatMessageType }> = ({ message }) => {
  const messageClass = useMemo(() => 
    cn(
      'flex flex-col',
      message.isUser ? 'items-end' : 'items-start'
    ), [message.isUser]);

  const bubbleClass = useMemo(() => 
    `p-3 relative rounded-2xl ${
      message.isUser
        ? 'bg-primary rounded-br-[4px] text-primary-foreground ml-auto'
        : 'bg-muted rounded-bl-[4px]'
    }`, [message.isUser]);

  const renderMessageContent = useCallback(() => {
    if ('content' in message) {
      return message.isUser ? (
        <p>{message.content}</p>
      ) : (
        <MessageContent content={message.content} />
      );
    } else {
      return <EventList events={message.events} />;
    }
  }, [message]);

  return (
    <div className={messageClass}>
      <div className={bubbleClass}>
        <div className="text-sm">
          {renderMessageContent()}
        </div>
      </div>
      <span className="text-xs mx-2 mt-1 text-muted-foreground">
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
};

export default BubbleChat;