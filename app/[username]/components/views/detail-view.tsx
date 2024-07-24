import Item from "../item";

const DetailView: React.FC<ViewProps> = ({ items, onItemClick }) => (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.item_id} className="bg-secondary p-4 rounded-lg">
          <Item item={item} onClick={() => onItemClick(item)} />
          <p className="mt-2 text-sm text-muted-foreground">
            Created: {new Date(item.created_at).toLocaleDateString()} | Last accessed: {new Date(item.updated_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );

export default DetailView;