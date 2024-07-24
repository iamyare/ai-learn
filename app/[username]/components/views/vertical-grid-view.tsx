import Item from "../item";

const VerticalGridView: React.FC<ViewProps> = ({ items, onItemClick }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.item_id} className="flex flex-col h-80">
          <Item item={item} onClick={() => onItemClick(item)} />
        </div>
      ))}
    </div>
  );

export default VerticalGridView;