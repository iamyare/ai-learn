import Item from "../item";

const SquareGridView: React.FC<ViewProps> = ({ items, onItemClick }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <div key={item.item_id} className="aspect-square">
          <Item item={item} onClick={() => onItemClick(item)} />
        </div>
      ))}
    </div>
  );
export default SquareGridView;