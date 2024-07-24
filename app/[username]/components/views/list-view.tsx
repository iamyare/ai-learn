import Item from "../item";

const ListView: React.FC<ViewProps> = ({ items, onItemClick }) => (
    <div className="space-y-2">
      {items.map((item) => (
        <Item key={item.item_id} item={item} onClick={() => onItemClick(item)} />
      ))}
    </div>
  );

  export default ListView;