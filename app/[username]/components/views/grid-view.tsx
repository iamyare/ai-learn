import Item from "../item";


const GridView: React.FC<ViewProps> = ({ items, onItemClick }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {items.map((item) => (
      <Item key={item.item_id} item={item} onClick={() => onItemClick(item)} />
    ))}
  </div>
);

export default GridView;