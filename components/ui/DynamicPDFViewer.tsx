import dynamic from 'next/dynamic'

const DynamicPDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse">Cargando visor PDF...</div>
    </div>
  )
})

export default DynamicPDFViewer
