'use client'
import { useNavigation } from '@/hooks/useNavigation'
// ...existing imports...

export default function ItemList({ items, isLoading }: ItemListProps) {
  const { navigateToFolder } = useNavigation()
  
  // ...existing code...

  return (
    <div className="grid gap-4">
      {/* ...existing JSX... */}
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onNavigate={() => navigateToFolder(item.id, item.name)}
        />
      ))}
      {/* ...existing JSX... */}
    </div>
  )
}
