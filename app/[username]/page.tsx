import Link from "next/link"


const FOLDERS_LINKS = [
  { name: 'All', icon: 'Folder', href: '/all' },
  { name: 'Starred', icon: 'Star', href: '/232-2321' },
  { name: 'Shared', icon: 'Users', href: '/232-2322' },
  { name: 'Trash', icon: 'Trash', href: '/232-2323' },
]

export default function Dashboard({params}: {params: {username: string}}) {
  return (
    <div>
      <div className='flex flex-col w-64 h-screen bg-gray-100'>
        <div className='flex items-center justify-between h-14 px-4 border-b'>
          <span className='text-xl font-bold'>Folders: {params.username}</span>
          <button className='p-1 text-gray-500 rounded-full hover:bg-gray-200'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-5 h-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 12a2 2 0 100-4 2 2 0 000 4zM2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 16h12a4 4 0 004-4V6a4 4 0 00-4-4H4a4 4 0 00-4 4v10a4 4 0 004 4z'
              />
            </svg>
          </button>
        </div>
        <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
          {FOLDERS_LINKS.map((folder) => (
            <Link
              key={folder.name}
              href={`/${params.username}/${folder.href}`}
              className='flex items-center p-2 space-x-2 rounded-md hover:bg-gray-200'
            >
              {folder.name}
            </Link>
          ))}
        </nav>

        <div className='h-14 px-4 border-t'>
          <button className='w-full h-full text-gray-500 hover:bg-gray-200'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-5 h-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 12a2 2 0 100-4 2 2 0 000 4zM2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 16h12a
                4 4 0 004-4V6a4 4 0 00-4-4H4a4 4 0 00-4 4v10a4 4 0 004 4z'
              />
            </svg>
          </button>

          <button className='w-full h-full text-gray-500 hover:bg-gray-200'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-5 h-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 12a2 2 0 100-4 2 2 0 000 4zM2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 16h12a
                4 4 0 004-4V6a4 4 0 00-4-4H4a4 4 0 00-4 4v10a4 4 0 004 4z'
              />
            </svg>
          </button>

          <button className='w-full h-full text-gray-500 hover:bg-gray-200'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-5 h-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 12a2 2 0 100-4 2 2 0 000 4zM2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 16h12a
                4 4 0 004-4V6a4 4 0 00-4-4H4a4 4 0 00-4 4v10a4 4 0 004 4z'
              />
            </svg>
          </button>
          </div>
          </div>
    </div>
  )
}
