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
      setError(
        `Error rendering mind map: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
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
        }
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    if (mindMapRef.current) {
      resizeObserver.observe(mindMapRef.current)
    }

    return () => {
      if (mindMapRef.current) {
        resizeObserver.unobserve(mindMapRef.current)
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
            link.download = 'mindmap.png'
            link.href = dataUrl
            link.click()
          })
          .catch((err) => {
            console.error('Error converting mind map to image:', err)
            setError(
              `Error converting mind map to image: ${
                err instanceof Error ? err.message : String(err)
              }`
            )
          })
      }
    }
  }, [])

  return (
    <div className='mind-map-container flex flex-col gap-2 w-full '>
      <h2 className='text-xl font-semibold'>Eventos importantes</h2>
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
                  className='w-full h-64'
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
