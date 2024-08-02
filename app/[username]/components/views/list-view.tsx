import Item from "../item";

const ListView: React.FC<ViewProps> = ({ items, onItemClick }) => (
    <div className="grid gap-4">
      {items.map((item) => (
        <Item key={item.item_id} item={item} onClick={() => onItemClick(item)} />
      ))}
    </div>
  );

  export default ListView;