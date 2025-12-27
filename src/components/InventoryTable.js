import React, { useState } from "react";
import { API_BASE_URL } from "../config";

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

export default function InventoryTable({
  items,
  loading,
  error,
  onRefresh,
}) {
  // 🔹 Store input values per item
  const [quantityInputs, setQuantityInputs] = useState({});

  const handleInputChange = (id, value) => {
    setQuantityInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const updateQuantity = async (id, delta) => {
    if (!delta || isNaN(delta)) return;

    try {
      await fetch(`${API_BASE_URL}/api/inventory/${id}/quantity`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ delta }),
      });

      // Clear input for this row
      setQuantityInputs((prev) => ({
        ...prev,
        [id]: "",
      }));

      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  return (
    <section className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">
          Inventory
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Name
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Category
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Quantity
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Update Stock
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-gray-500">
                  Loading inventory...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-red-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-gray-500">
                  No inventory items found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              items.map((item) => {
                const status = getStatus(
                  item.quantity,
                  item.minThreshold
                );

                return (
                  <tr key={item._id}>
                    <td className="px-4 py-3 text-gray-900">
                      {item.name}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {item.category}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {item.quantity}
                    </td>

                    {/* 🔥 Variable quantity update */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={quantityInputs[item._id] || ""}
                          onChange={(e) =>
                            handleInputChange(
                              item._id,
                              Number(e.target.value)
                            )
                          }
                          className="w-20 border rounded px-2 py-1 text-sm"
                        />

                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              Number(quantityInputs[item._id])
                            )
                          }
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Add
                        </button>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              -Number(quantityInputs[item._id])
                            )
                          }
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={status.className}>
                        {status.label}
                      </span>
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
