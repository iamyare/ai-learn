import React from 'react'
import { Label } from '@/components/ui/label'
import CopyButton from '@/components/ui/copy-button'



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
      <CopyButton content={translation.original} className='absolute size-fit p-2 top-0 right-2'/>
    </div>
    <div className='flex flex-col space-y-2 relative'>
      <Label className='capitalize'>{translation.targetLanguage}</Label>
      <p className='text-foreground bg-muted rounded-lg p-4'>
        {translation.translated}
      </p>
      <CopyButton content={translation.translated} className='absolute size-fit p-2 top-0 right-2'/>
    </div>
  </div>
)

export default Translation