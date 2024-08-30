import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/ui/markdown-reader';
import { Button } from '@/components/ui/button';
import { Check, Copy, Download, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { toPng } from 'html-to-image';

// Inicializa mermaid con un tema personalizado
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  themeVariables: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    primaryTextColor: 'hsla(var(--foreground)/1)',
    lineColor: 'hsla(var(--muted-foreground)/1)',
    mainBkg: 'hsla(var(--muted)/1)',
    nodeBorder: 'hsla(var(--muted-foreground)/1)',
    nodeTextColor: 'hsla(var(--foreground)/1)',
    clusterBkg: 'none',
    clusterBorder: 'none',
    titleColor: 'hsla(var(--primary)/1)',
  }
});

const MessageContent: React.FC<{ content: string }> = React.memo(({ content }) => {
  const [renderedContent, setRenderedContent] = useState<React.ReactNode>('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const renderContent = async () => {
      const rendered = await new Promise<React.ReactNode>(resolve => 
        setTimeout(() => resolve(<MarkdownRenderer content={content} />), 10)
      );
      setRenderedContent(rendered);
    };
    renderContent();
  }, [content]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [content]);

  return (
    <>
      {renderedContent}
      <Button
        size="icon"
        variant="outline"
        className="absolute bottom-0 translate-y-1/2 right-5 size-fit p-2.5 transition-transform active:scale-95"
        onClick={handleCopy}
      >
        {isCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
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

const MindMap: React.FC<{ mindMap: string }> = React.memo(({ mindMap }) => {
  const [svg, setSvg] = useState<string>('');
  const mindMapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMindMap = async () => {
      try {
        const { svg } = await mermaid.render('mindmap', mindMap);
        setSvg(svg);
      } catch (error) {
        console.error('Error rendering mind map:', error);
        setSvg('<svg><text>Error rendering mind map</text></svg>');
      }
    };

    renderMindMap();
  }, [mindMap]);

  const handleDownload = useCallback(() => {
    if (mindMapRef.current) {
      const svgElement = mindMapRef.current.querySelector('svg');
      if (svgElement) {
        const svgWidth = svgElement.width.baseVal.value;
        const svgHeight = svgElement.height.baseVal.value;
        const aspectRatio = svgWidth / svgHeight;

        let width, height;
        if (aspectRatio > 1) {
          // El mapa es más ancho que alto
          width = 1080;
          height = 1080 / aspectRatio;
        } else {
          // El mapa es más alto que ancho o cuadrado
          height = 1080;
          width = 1080 * aspectRatio;
        }

        toPng(mindMapRef.current, {
          width: width,
          height: height ,
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
            width: `${svgWidth}px`,
            height: `${svgHeight}px`,
          },
          quality: 1,
          pixelRatio: 2,
        })
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = 'mindmap.png';
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            console.error('Error converting element to image:', err);
          });
      }
    }
  }, []);

  return (
    <div className="mind-map-container w-full rounded-md overflow-hidden border relative">
      <TransformWrapper
        initialScale={2}
        initialPositionX={0}
        initialPositionY={0}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <Button variant={'outline'} className='p-2 size-fit border-none bg-muted/80 text-muted-foreground' size="icon" onClick={() => zoomIn()}>
                <ZoomIn className="size-4" />
              </Button>
              <Button variant={'outline'} className='p-2 size-fit border-none bg-muted/80 text-muted-foreground' size="icon" onClick={() => zoomOut()}>
                <ZoomOut className="size-4" />
              </Button>
              <Button variant={'outline'} className='p-2 size-fit border-none bg-muted/80 text-muted-foreground' size="icon" onClick={() => resetTransform()}>
                <Maximize className="size-4" />
              </Button>
              <Button variant={'outline'} className='p-2 size-fit border-none bg-muted/80 text-muted-foreground' size="icon" onClick={handleDownload}>
                <Download className="size-4" />
              </Button>
            </div>
            <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full">
              <div ref={mindMapRef} className="w-full h-[200px]" dangerouslySetInnerHTML={{ __html: svg }} />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
});

MindMap.displayName = 'MindMap';

const BubbleChat: React.FC<{ message: ChatMessageType }> = ({ message }) => {
  const messageClass = useMemo(() => 
    cn(
      'flex flex-col',
      message.isUser ? 'items-end' : 'items-start'
    ), [message.isUser]);

  const bubbleClass = useMemo(() => 
    `p-3 relative w-full rounded-2xl ${
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
    } else if ('events' in message) {
      return <EventList events={message.events} />;
    } else if ('mindMap' in message) {
      return <MindMap mindMap={message.mindMap} />;
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