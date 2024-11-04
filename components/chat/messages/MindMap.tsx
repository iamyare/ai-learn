import React, { useState, useEffect, useCallback, useRef } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, Maximize, Download } from 'lucide-react'
import { toPng } from 'html-to-image'
import mermaid from 'mermaid'

interface MindMapProps {
  mindMap: string
}

const MindMap: React.FC<MindMapProps> = ({ mindMap }) => {
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const mindMapRef = useRef<HTMLDivElement>(null)

  const renderMindMap = useCallback(async () => {
    if (!mindMap) return

    try {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'base'
      })

      const { svg } = await mermaid.render('mindmap-' + Date.now(), mindMap)
      setSvg(svg)
      setError(null)
    } catch (error: any) {
      console.error('Error rendering mind map:', error)
      if (error.message.includes('Syntax error')) {
        setError('Error de sintaxis en el texto del mapa mental')
      } else {
        setError('Error rendering mind map')
      }
      setSvg(
        '<svg width="100%" height="100%"><text x="10" y="20" fill="red">Error rendering mind map</text></svg>'
      )
    }
  }, [mindMap])

  useEffect(() => {
    renderMindMap()
  }, [renderMindMap])

  useEffect(() => {
    const handleResize = () => {
      if (mindMapRef.current) {
        const svgElement = mindMapRef.current.querySelector('svg')
        if (svgElement) {
          svgElement.setAttribute('width', '100%')
          svgElement.setAttribute('height', '100%')
          svgElement.style.minHeight = '300px'
        }
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    const currentRef = mindMapRef.current
    if (currentRef) {
      resizeObserver.observe(currentRef)
      handleResize() // Llamada inicial para establecer dimensiones
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef)
      }
    }
  }, [])

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
            link.download = `Mindmap-${new Date().toLocaleDateString()}-${new Date()
              .toLocaleTimeString()
              .replace(/:/g, '-')}.png`
            link.href = dataUrl
            link.click()
          })
          .catch((err) => {
            console.error('Error converting mind map to image:', err)
            setError('Error converting mind map to image')
          })
      }
    }
  }, [])

  return (
    <div className='mind-map-container flex flex-col gap-2 w-full '>
      <h2 className='text-xl font-semibold'>Mapa Mental</h2>
      <div className=' flex flex-col gap-2 w-full overflow-hidden relative'>
        <TransformWrapper
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className='absolute top-2 right-2 z-[1] flex gap-2'>
                <Button
                  variant='outline'
                  className='p-2 size-fit border-none bg-muted/80 text-muted-foreground'
                  size='icon'
                  onClick={() => zoomIn()}
                >
                  <ZoomIn className='size-4' />
                </Button>
                <Button
                  variant='outline'
                  className='p-2 size-fit border-none bg-muted/80 text-muted-foreground'
                  size='icon'
                  onClick={() => zoomOut()}
                >
                  <ZoomOut className='size-4' />
                </Button>
                <Button
                  variant='outline'
                  className='p-2 size-fit border-none bg-muted/80 text-muted-foreground'
                  size='icon'
                  onClick={() => resetTransform()}
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
              <TransformComponent
                wrapperClass='w-full h-full'
                contentClass='w-full h-full'
              >
                <div
                  ref={mindMapRef}
                  className='w-full h-full min-h-[300px]'
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
        {error && (
          <div className='error-message text-red-500 mt-2'>{error}</div>
        )}
      </div>
    </div>
  )
}

export default MindMap
