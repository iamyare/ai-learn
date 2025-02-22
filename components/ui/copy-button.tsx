import { useCallback, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { ConfettiButton } from './confetti-button'
import { ButtonProps } from './button'
import { cn } from '@/lib/utils'

interface CopyButtonProps extends ButtonProps {
  value: string
  onCopy?: () => void
  className?: string
}

export default function CopyButton({ value, onCopy, className, ...props }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setIsCopied(true)
      onCopy?.()
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }, [value, onCopy])

  return (
    <ConfettiButton
      variant="outline"
      size="icon"
      className={cn(
        'size-fit p-2 transition-all hover:bg-muted/80',
        'focus:ring-2 focus:ring-primary/50',
        className
      )}
      options={{
        spread: 360,
        particleCount: 20,
        startVelocity: 10,
        decay: 0.7,
        gravity: 0.2,
        ticks: 50,
        scalar: 0.6
      }}
      {...props}
    >
      <button 
        onClick={handleCopy}
        className="focus:outline-none"
        aria-label={isCopied ? "Copiado" : "Copiar al portapapeles"}
      >
        {isCopied ? (
          <Check className="size-3 text-green-500" />
        ) : (
          <Copy className="size-3" />
        )}
      </button>
    </ConfettiButton>
  )
}