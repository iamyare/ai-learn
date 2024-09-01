import React from 'react'

interface NoteProps {
  noteText: string
}

const Note: React.FC<NoteProps> = ({ noteText }) => (
  <div className='bg-muted p-4 rounded-md'>
    <h3 className='text-lg font-semibold mb-2'>Nota</h3>
    <p>{noteText}</p>
  </div>
)

export default Note