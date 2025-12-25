import React from "react";

function getStatus(quantity, minThreshold) {
  const qty = Number(quantity) || 0;
  const min = Number(minThreshold) || 0;
  if (qty <= min) {
    return {
      label: "LOW STOCK",
      className: "text-red-600 font-semibold",
    };
  }
  return {
    label: "OK",
    className: "text-green-600 font-semibold",
  };
}

export default function InventoryTable({ items, loading, error }) {
  return (
    <section className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Inventory</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Category</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Quantity</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading && (
              <tr>
                <td className="px-4 py-3 text-sm text-gray-500" colSpan={4}>
                  Loading inventory...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td className="px-4 py-3 text-sm text-red-600" colSpan={4}>
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && items && items.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-sm text-gray-500" colSpan={4}>
                  No inventory items found.
                </td>
              </tr>
            )}

            {!loading && !error && items && items.length > 0 &&
              items.map((item) => {
                const status = getStatus(item.quantity, item.minThreshold);
                return (
                  <tr key={item.id || item._id || `${item.name}-${item.category}`}>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={status.className}>{status.label}</span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
