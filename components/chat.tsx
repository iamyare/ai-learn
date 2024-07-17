'use client'

import { Input } from "@/components/ui/input"

export default function Chat() {
  return (
    <section className="w-full h-full bg-slate-400 relative px-4">
        <header className=" w-full py-2 px-4">
            <h1>Chat</h1>
        </header>
        <aside className="flex flex-col h-full gap-10 overflow-y-auto">
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
            <p>Chat</p>
        </aside>

        <footer className="absolute w-[90%] px-2 py-1 rounded-full bg-background/50 backdrop-blur-sm bottom-4 left-1/2 -translate-x-1/2 ">
            <div className=" relative">
            <Input placeholder="Escribe un mensaje" className=" bg-transparent border-none" />
            </div>
        </footer>

    </section>
  )
}
