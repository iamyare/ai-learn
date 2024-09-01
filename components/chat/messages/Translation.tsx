import React from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-react'

interface TranslationProps {
  translation: {
    original: string
    translated: string
  }
}

const Translation: React.FC<TranslationProps> = ({ translation }) => (
  <div className='flex flex-col gap-2'>
    <h3 className='text-lg font-semibold mb-2'>
      Traducción de Inglés a Español
    </h3>
    <div className='flex flex-col space-y-1 relative'>
      <Label>Inglés</Label>
      <p className='text-muted-foreground bg-white rounded-lg p-4'>
        {translation.original}
      </p>
      <Button variant='outline' size='icon' className='absolute size-fit p-2 top-0 right-2'>
        <Copy className='size-3' />
      </Button>
    </div>
    <div className='flex flex-col space-y-1'>
      <Label>Español</Label>
      <p className='text-foreground bg-white rounded-lg p-4'>
        {translation.translated}
      </p>
    </div>
  </div>
)

export default Translation