import * as React from 'react'
import { MonitorSmartphone, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isSystemDark, setIsSystemDark] = React.useState(false)

  React.useEffect(() => {
    if (theme === 'system') {
      setIsSystemDark(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [theme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <div
            className={`absolute transition-all duration-300 ${
              theme === 'system'
                ? isSystemDark
                  ? ' rotate-90 scale-0'
                  : ' rotate-0 scale-100'
                : theme === 'dark'
                ? ' rotate-90 scale-0'
                : ' rotate-0 scale-100'
            }`}
          >
            <Sun className="size-5" />
          </div>
          <div
            className={`absolute transition-all duration-300 ${
              theme === 'system'
                ? isSystemDark
                  ? ' rotate-0 scale-100'
                  : ' rotate-90 scale-0'
                : theme === 'dark'
                ? ' rotate-0 scale-100'
                : ' rotate-90 scale-0'
            }`}
          >
            <Moon className="size-5" />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
          <Sun className="size-4 mr-2" />
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
          <Moon className="size-4 mr-2" />
          Oscuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
          <MonitorSmartphone className="size-4 mr-2" />
          Igual que el sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}