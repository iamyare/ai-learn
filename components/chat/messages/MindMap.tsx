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
  const mindMapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderMindMap = async () => {
      try {
        const { svg } = await mermaid.render('mindmap', mindMap)
        setSvg(svg)
      } catch (error) {
        console.error('Error rendering mind map:', error)
        setSvg('<svg><text>Error rendering mind map</text></svg>')
      }
    }

    renderMindMap()
  }, [mindMap])

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
          })
      }
    }
  }, [])

  return (
    <div className='mind-map-container w-full rounded-md overflow-hidden border relative max-w-fit'>
      <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={0}>
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
    </div>
  )
}

export default MindMap