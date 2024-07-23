'use client'
import Link from 'next/link'

interface FolderItemProps {
  folder: Folder
}

export default function FolderItem({ folder }: FolderItemProps) {
  return (
    <li>
      <Link
        className='flex flex-col items-center gap-2 p-4 rounded-lg justify-center text-lg text-center h-[200px] w-full transition-shadow duration-300 hover:ring-2 hover:ring-offset-2 hover:shadow-black/[0.05] hover:shadow-xl animated-gradient '
        style={{
          background: folder.folder_color
            ? `linear-gradient(45deg,${folder.folder_color}10 0%, ${folder.folder_color}60 100%)`
            : 'linear-gradient(45deg,hsla(var(--muted)/1) 0%, hsla(var(--muted-foreground)/0.5) 100%)',
            ['--tw-ring-color' as any]: folder.folder_color ? `${folder.folder_color}60` : 'hsla(var(--muted-foreground)/0.6)'
        }}
        href={`/${folder.folder_id}`}
      >
        <span
          className='text-4xl'
          style={{
            color: folder.folder_color ?? 'hsla(var(--primary)/1)'
          }}
        >
          {folder.folder_icon}
        </span>
        <div className='flex flex-col'>
          <p
            className='font-medium'
            style={{
              color: folder.folder_color ?? 'hsla(var(--primary)/1)'
            }}
          >
            {folder.folder_name}
          </p>
          <span className='text-sm'>4 elementos</span>
        </div>
      </Link>
    </li>
  )
}