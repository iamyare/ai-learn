import React from 'react'
// import { Button } from '../ui/button'
// import { CloudDownloadIcon } from 'lucide-react'
// import { useDownloadChatPDF } from './hooks/useDownloadChatPDF'

interface ChatHeaderProps {
  className?: string
  chat: ChatMessageType[]
}


const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  //Descargar el chat
  // const downloadChat = () => {
  //   const chatData = JSON.stringify(chat)
  //   const blob = new Blob([chatData], { type: 'text/plain' })
  //   const url = URL.createObjectURL(blob)
  //   const a = document.createElement('a')
  //   a.href = url
  //   a.download = 'chat.json'
  //   a.click()
  //   URL.revokeObjectURL
  // }

  // const { downloadChatPDF } = useDownloadChatPDF()
  // const handleDownloadPDF = () => {
  //   downloadChatPDF('chat-messages', `chat.pdf`)
  // }

  return (
    <header className='flex w-full py-2 px-4 justify-between items-center absolute top-0 left-0 z-10 bg-background/70 backdrop-blur-sm'>
      <h2 className='text-lg font-semibold'>Chat</h2>

      {/* <div className='flex items-center gap-4'>
        <Button onClick={downloadChat} size='icon' variant='ghost' className='p-1'>
          <CloudDownloadIcon className='size-4' />
        </Button>

        <Button onClick={handleDownloadPDF} size='icon' variant='ghost' className='p-1'>
          <CloudDownloadIcon className='size-4' />
        </Button>
      </div> */}
    </header>
  )
}

export default ChatHeader
