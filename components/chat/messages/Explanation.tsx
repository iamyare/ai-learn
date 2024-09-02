import React from 'react'
import { Separator } from '@/components/ui/separator'

interface ExplanationProps {
  explanation: {
    context: string
    explanation: string
  }
}

const Explanation: React.FC<ExplanationProps> = ({ explanation }) => (
  <div className='full flex flex-col'>
    <h3 className='text-lg font-semibold mb-2'>Explicación</h3>
    <div className='full flex flex-col gap-2'>
      <p className='text-xs text-muted-foreground w-full max-h-12 overflow-hidden text-ellipsis line-clamp-3'>
        <strong>Contexto:</strong> {explanation.context}
      </p>
      <Separator />
      <p className='text-pretty'>{explanation.explanation}</p>
    </div>
  </div>
)

export default Explanation