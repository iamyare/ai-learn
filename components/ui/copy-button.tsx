import { useCallback, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { ConfettiButton } from './confetti-button'
import { ButtonProps } from './button'

interface CopyButtonProps extends ButtonProps {
  content: string
}

export default function CopyButton({ content, ...props }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = useCallback(() => {
    setIsCopied(false) // Restablecer el estado antes de copiar
    navigator.clipboard.writeText(content)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }, [content])

  return (
    <ConfettiButton
      variant={'outline'}
      size={'icon'}
      className='absolute bottom-0 translate-y-1/2 right-5 size-fit p-2.5 transition-transform active:scale-95 '
      options={{
        spread: 360, // Reducir el ángulo de dispersión
        particleCount: 20, // Reducir el número de partículas
        startVelocity: 10, // Reducir la velocidad inicial
        decay: 0.7, // Aumentar la velocidad de desaparición
        gravity: 0.2, // Aumentar la gravedad
        ticks: 50, // Aumentar el tiempo de vida de las partículas
        scalar: 0.6 // Aumentar el tamaño de las partículas
      }}
      {...props}
    >
      <button onClick={handleCopy} >
        {isCopied ? <Check className='size-3' /> : <Copy className='size-3 ' />}
      </button>
    </ConfettiButton>
  )
}