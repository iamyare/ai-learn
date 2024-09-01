import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, Maximize, Download } from 'lucide-react'
import { toPng } from 'html-to-image'
import mermaid from 'mermaid'

interface MindMapProps {
  mindMap: string
}

const MindMap: React.FC<MindMapProps> = React.memo(({ mindMap }) => {
    console.log(mindMap)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const mindMapRef = useRef<HTMLDivElement>(null)

  const renderMindMap = useCallback(async () => {
    if (!mindMap) return

    try {
      // Initialize mermaid
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
          titleColor: 'hsla(var(--primary)/1)'
        }
      })
      
      // Render the mind map
      const { svg } = await mermaid.render('mindmap-' + Date.now(), mindMap)
      setSvg(svg)
      setError(null)
    } catch (error) {
      console.error('Error rendering mind map:', error)
      setError(`Error rendering mind map: ${error instanceof Error ? error.message : String(error)}`)
      setSvg('<svg width="100%" height="100%"><text x="10" y="20" fill="red">Error rendering mind map</text></svg>')
    }
  }, [mindMap])

  useEffect(() => {
    renderMindMap()
  }, [renderMindMap])

  const handleDownload = useCallback(() => {
    if (mindMapRef.current) {
      const svgElement = mindMapRef.current.querySelector('svg')
      if (svgElement) {
        const svgWidth = svgElement.width.baseVal.value
        const svgHeight = svgElement.height.baseVal.value
        const aspectRatio = svgWidth / svgHeight

        let width, height
        if (aspectRatio > 1) {
          width = 1080
          height = Math.round(1080 / aspectRatio)
        } else {
          height = 1080
          width = Math.round(1080 * aspectRatio)
        }

        toPng(mindMapRef.current, {
          width,
          height,
          style: {
            transform: `scale(${width / svgWidth})`,
            transformOrigin: 'top left',
            width: `${svgWidth}px`,
            height: `${svgHeight}px`
          }
        })
          .then((dataUrl) => {
            const link = document.createElement('a')
            link.download = 'mindmap.png'
            link.href = dataUrl
            link.click()
          })
          .catch((err) => {
            console.error('Error converting mind map to image:', err)
            setError(`Error converting mind map to image: ${err instanceof Error ? err.message : String(err)}`)
          })
      }
    }
  }, [])

  const memoizedButtons = useMemo(() => (
    <div className='absolute top-2 right-2 z-[1] flex gap-2'>
      <Button
        variant='outline'
        className='p-2 size-fit border-none bg-muted/80 text-muted-foreground'
        size='icon'
        onClick={() => {}}
      >
        <ZoomIn className='size-4' />
      </Button>
      <Button
        variant='outline'
        className='p-2 size-fit border-none bg-muted/80 text-muted-foreground'
        size='icon'
        onClick={() => {}}
      >
        <ZoomOut className='size-4' />
      </Button>
      <Button
        variant='outline'
        className='p-2 size-fit border-none bg-muted/80 text-muted-foreground'
        size='icon'
        onClick={() => {}}
      >
        <Maximize className='size-4' />
      </Button>
      <Button
        variant='outline'
        className='p-2 size-fit border-none bg-muted/80 text-muted-foreground'
        size='icon'
        onClick={handleDownload}
      >
        <Download className='size-4' />
      </Button>
    </div>
  ), [handleDownload])

  return (
    <div className='mind-map-container w-full rounded-md overflow-hidden border relative max-w-fit'>
      <TransformWrapper initialScale={2} initialPositionX={0} initialPositionY={0}>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {memoizedButtons}
            <TransformComponent wrapperClass='w-full h-full' contentClass='w-full h-full'>
              <div
                ref={mindMapRef}
                className='w-full h-[200px]'
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
      {error && <div className="error-message text-red-500 mt-2">{error}</div>}
    </div>
  )
})

export default MindMap