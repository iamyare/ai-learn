import React from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Copy } from 'lucide-react'



const Translation: React.FC<TranslationProps> = ({ translation }) => (
  <div className='flex flex-col gap-4'>
    <h3 className='text-lg font-semibold'>
      Traducción de <span className=' capitalize text-primary '>{translation.sourceLanguage}</span> a <span className=' capitalize text-primary'>{translation.targetLanguage}</span>
    </h3>
    <div className='flex flex-col space-y-2 relative'>
      <Label className=' capitalize'>{translation.sourceLanguage}</Label>
      <p className=' bg-muted rounded-lg p-4'>
        {translation.original}
      </p>
      <Button variant='outline' size='icon' className='absolute size-fit p-2 top-0 right-2'>
        <Copy className='size-3' />
      </Button>
    </div>
    <div className='flex flex-col space-y-2'>
      <Label className='capitalize'>{translation.targetLanguage}</Label>
      <p className='text-foreground bg-muted rounded-lg p-4'>
        {translation.translated}
      </p>
    </div>
  </div>
)

export default Translation