'use client'

export default function CoursorText() {
  return (
    <div className="relative inline-block h-4 w-2">
        <span className="absolute h-4 w-[1.5px] bg-background animate-pulse z-[1]"></span>
        <div className="absolute size-2 top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 blur-sm bg-white/50 animate-pulse "></div>
        <div className="absolute size-4 top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 blur-md bg-white/50 animate-pulse "></div>
    </div>
  )
}
