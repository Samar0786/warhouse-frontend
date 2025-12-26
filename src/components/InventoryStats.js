export default function InventoryStats({ items }) {
  const totalItems = items.length;

  const lowStockItems = items.filter(
    (item) => item.quantity <= item.minThreshold
  ).length;

  const categoriesCount = new Set(
    items.map((item) => item.category)
  ).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="text-sm text-gray-500">Total Items</h3>
        <p className="text-2xl font-bold">{totalItems}</p>
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="text-sm text-gray-500">Low Stock Items</h3>
        <p className="text-2xl font-bold text-red-600">
          {lowStockItems}
        </p>
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="text-sm text-gray-500">Categories</h3>
        <p className="text-2xl font-bold">{categoriesCount}</p>
      </div>
    </div>
  );
}
