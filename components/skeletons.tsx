import { Skeleton } from "@/components/ui/skeleton"

export function ItemSkeleton() {
  return (
<Skeleton className="animate-pulse h-[200px] w-full flex flex-col items-center justify-center gap-2 p-4 rounded-lg">
  <Skeleton className="size-14 bg-muted-foreground/20  rounded-full"></Skeleton>
  <div className="flex flex-col gap-1 items-center">
    <Skeleton className="h-4 w-16 bg-muted-foreground/20 rounded"></Skeleton>
    <Skeleton className="h-3 w-10 bg-muted-foreground/20 rounded"></Skeleton>
  </div>
</Skeleton>
  )
}

export function ItemListSkeleton() {
  //numero random de items entre 1 y 6
  const items = Math.floor(Math.random() * 6) + 1
  return (
    <div className="grid grid-cols-3 gap-4">
      {[...Array(items)].map((_, index) => (
        <ItemSkeleton key={index} />
      ))}
    </div>
  )
}