export default function LowStockList({ items }) {
  const lowStockItems = items.filter(
    (item) => item.quantity <= item.minThreshold
  );

  if (lowStockItems.length === 0) {
    return null; // Don’t show section if nothing needs attention
  }

  return (
    <div className="mb-8">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-yellow-800 mb-3">
          ⚠️ Items Requiring Attention
        </h2>

        <ul className="space-y-2">
          {lowStockItems.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center bg-white border rounded p-3"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {item.name}
                </p>
                <p className="text-sm text-gray-500">
                  Category: {item.category}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-red-600 font-semibold">
                  Qty: {item.quantity}
                </p>
                <p className="text-xs text-gray-500">
                  Min: {item.minThreshold}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
