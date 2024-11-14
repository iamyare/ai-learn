import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState
} from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Icons } from './icons'

type TreeViewElement = {
  id: string
  name: string
  icon: string
  isSelectable?: boolean
  children?: TreeViewElement[]
  type: 'folder' | 'file'
  path?: string
}

type TreeContextProps = {
  selectedId: string | undefined
  expandedItems: string[] | undefined
  indicator: boolean
  handleExpand: (id: string) => void
  selectItem: (id: string) => void
  setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>
  openIcon?: React.ReactNode
  closeIcon?: React.ReactNode
  direction: 'rtl' | 'ltr'
  onFolderExpand: (id: string) => Promise<TreeViewElement[]>
  loadedFolders: Record<string, TreeViewElement[]>
  setLoadedFolders: React.Dispatch<
    React.SetStateAction<Record<string, TreeViewElement[]>>
  >
}

const TreeContext = createContext<TreeContextProps | null>(null)

const useTree = () => {
  const context = useContext(TreeContext)
  if (!context) {
    throw new Error('useTree must be used within a TreeProvider')
  }
  return context
}

type TreeViewProps = {
  initialSelectedId?: string
  indicator?: boolean
  elements?: TreeViewElement[]
  initialExpandedItems?: string[]
  openIcon?: React.ReactNode
  closeIcon?: React.ReactNode
  onFolderExpand: (id: string) => Promise<TreeViewElement[]>
} & React.HTMLAttributes<HTMLDivElement>

//skeleton loading items
const SkeletonItem = () => {
  return (
    <div className='flex flex-col gap-1'>
      <Skeleton className='h-5 w-1/2 bg-muted-foreground/10' />
      <Skeleton className='h-5 w-3/4 bg-muted-foreground/10' />
      <Skeleton className='h-5 w-1/2 bg-muted-foreground/10' />
      <Skeleton className='h-5 w-3/4 bg-muted-foreground/10' />
    </div>
  )
}

const Tree = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      className,
      elements,
      initialSelectedId,
      initialExpandedItems,
      children,
      indicator = true,
      openIcon,
      closeIcon,
      dir,
      onFolderExpand,
      ...props
    },
    ref
  ) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(
      initialSelectedId
    )
    const [expandedItems, setExpandedItems] = useState<string[]>(
      initialExpandedItems || []
    )
    const [loadedFolders, setLoadedFolders] = useState<
      Record<string, TreeViewElement[]>
    >({})

    const selectItem = useCallback((id: string) => {
      setSelectedId(id)
    }, [])

    const handleExpand = useCallback((id: string) => {
      setExpandedItems((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id)
        }
        return [...prev, id]
      })
    }, [])

    const direction = dir === 'rtl' ? 'rtl' : 'ltr'

    return (
      <TreeContext.Provider
        value={{
          selectedId,
          expandedItems,
          handleExpand,
          selectItem,
          indicator,
          openIcon,
          closeIcon,
          direction,
          onFolderExpand,
          loadedFolders,
          setLoadedFolders
        }}
      >
        <div className={cn('size-full', className)}>
          <ScrollArea
            ref={ref}
            className='h-full relative px-2'
            dir={dir as 'rtl' | 'ltr' | undefined}
          >
            <AccordionPrimitive.Root
              {...props}
              type='multiple'
              value={expandedItems}
              onValueChange={setExpandedItems}
              className='flex flex-col gap-1'
              defaultValue={initialExpandedItems}
            >
              {children}
            </AccordionPrimitive.Root>
          </ScrollArea>
        </div>
      </TreeContext.Provider>
    )
  }
)

Tree.displayName = 'Tree'

const TreeIndicator = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { direction } = useTree()

  return (
    <div
      dir={direction}
      ref={ref}
      className={cn(
        'h-full w-px bg-muted absolute left-2 mt-2 rtl:right-2 py-3 rounded-md hover:bg-slate-300 duration-300 ease-in-out',
        className
      )}
      {...props}
    />
  )
})

TreeIndicator.displayName = 'TreeIndicator'

type FolderProps = {
  element: string
  value: string
  isSelectable?: boolean
  isSelect?: boolean
  icon: string
} & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>

const Folder = forwardRef<HTMLDivElement, FolderProps>(
  (
    {
      className,
      element,
      value,
      icon,
      isSelectable = true,
      isSelect,
      children,
      ...props
    },
    ref
  ) => {
    const {
      direction,
      handleExpand,
      expandedItems,
      indicator,
      openIcon,
      closeIcon,
      onFolderExpand,
      loadedFolders,
      setLoadedFolders
    } = useTree()

    const [isLoading, setIsLoading] = useState(false)

    const handleFolderExpand = useCallback(
      async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!expandedItems?.includes(value)) {
          handleExpand(value)
          if (!loadedFolders[value]) {
            setIsLoading(true)
            const newChildren = await onFolderExpand(value)
            setLoadedFolders((prev) => ({ ...prev, [value]: newChildren }))
            setIsLoading(false)
          }
        } else {
          handleExpand(value)
        }
      },
      [
        value,
        expandedItems,
        handleExpand,
        loadedFolders,
        onFolderExpand,
        setLoadedFolders
      ]
    )

    const folderChildren = loadedFolders[value] || []

    return (
      <AccordionPrimitive.Item
        {...props}
        value={value}
        className='relative overflow-hidden py-1.5 px-1 hover:bg-muted rounded-sm group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0'
      >
        <AccordionPrimitive.Trigger
          className={cn(
            `flex  items-center gap-1 text-sm rounded-md h-full`,
            className,
            {
              // 'bg-muted rounded-md': isSelect && isSelectable,
              'cursor-pointer': isSelectable,
              'cursor-not-allowed opacity-50': !isSelectable
            }
          )}
          disabled={!isSelectable}
          onClick={handleFolderExpand}
        >
          <span className=' ml-2 mr-2'>{icon}</span>
          <span className=' text-nowrap group-data-[collapsible=icon]:hidden'>
            {element}
          </span>
        </AccordionPrimitive.Trigger>
        <AccordionPrimitive.Content className='text-sm overflow-hidden pl-6'>
          {element && indicator && <TreeIndicator aria-hidden='true' />}
          {isLoading ? (
            <SkeletonItem />
          ) : folderChildren.length > 0 ? (
            <div className='flex flex-col gap-1 py-1'>
              {folderChildren.map((child) =>
                child.type === 'folder' ? (
                  <Folder
                    key={child.id}
                    element={child.name}
                    value={child.id}
                    isSelectable={child.isSelectable}
                    icon={child.icon}
                  />
                ) : (
                  <File
                    key={child.id}
                    value={child.id}
                    isSelectable={child.isSelectable}
                    path={child.path}
                  >
                    {child.name}
                  </File>
                )
              )}
            </div>
          ) : (
            <div className='text-sm text-muted-foreground py-2'>
              No hay contenido
            </div>
          )}
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    )
  }
)

Folder.displayName = 'Folder'

type FileProps = {
  value: string
  isSelectable?: boolean
  isSelect?: boolean
  fileIcon?: React.ReactNode
  path?: string
} & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>

const File = forwardRef<HTMLButtonElement, FileProps>(
  (
    {
      value,
      className,
      isSelectable = true,
      isSelect,
      fileIcon,
      children,
      path,
      ...props
    },
    ref
  ) => {
    const { direction, selectedId, selectItem } = useTree()
    const isSelected = isSelect ?? selectedId === value

    const fileContent = (
      <>
        {fileIcon ?? <Icons.notebookIcon className='size-4 text-foreground' />}
        <span className=' text-nowrap group-data-[collapsible=icon]:hidden '>
          {children}
        </span>
      </>
    )

    return (
      <AccordionPrimitive.Item value={value} className='relative'>
        <Link href={path || ''} passHref>
          <AccordionPrimitive.Trigger
            ref={ref}
            {...props}
            dir={direction}
            disabled={!isSelectable}
            aria-label='File'
            className={cn(
              'flex w-full items-center py-1.5 px-1 group-data-[collapsible=icon]:p-2 rounded-sm gap-1 cursor-pointer hover:bg-muted text-sm pr-1 rtl:pl-1 rtl:pr-0 transition-colors  duration-200 ease-in-out',
              {
                'bg-muted': isSelected && isSelectable
              },
              isSelectable ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed',
              className
            )}
            onClick={() => selectItem(value)}
          >
            {fileContent}
          </AccordionPrimitive.Trigger>
        </Link>
      </AccordionPrimitive.Item>
    )
  }
)

File.displayName = 'File'

export { File, Folder, Tree, type TreeViewElement }
