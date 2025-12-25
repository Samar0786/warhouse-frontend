import React, { useState } from "react";
import { API_BASE_URL } from "../config";

export default function AddInventoryForm({ onAdded }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    minThreshold: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const name = form.name.trim();
    const category = form.category.trim();
    const quantity = Number(form.quantity);
    const minThreshold = Number(form.minThreshold);

    if (!name || !category) {
      setError("Name and category are required.");
      return;
    }

    if (Number.isNaN(quantity) || Number.isNaN(minThreshold)) {
      setError("Quantity and minimum threshold must be numbers.");
      return;
    }

    if (quantity < 0 || minThreshold < 0) {
      setError("Values cannot be negative.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          quantity,
          minThreshold,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add inventory item.");
      }

      await res.json().catch(() => null);

      setForm({ name: "", category: "", quantity: "", minThreshold: "" });
      setSuccess("Item added successfully.");

      if (typeof onAdded === "function") {
        onAdded();
      }
    } catch (err) {
      setError(err.message || "Error adding inventory item.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Add Inventory</h2>
      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div>
          <label className="block text-gray-700 mb-1" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Item name"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1" htmlFor="category">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Category"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="quantity">
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1" htmlFor="minThreshold">
              Min Threshold
            </label>
            <input
              id="minThreshold"
              name="minThreshold"
              type="number"
              min="0"
              value={form.minThreshold}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
        {success && <p className="text-xs text-green-600">{success}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Adding..." : "Add Item"}
        </button>
      </form>
    </section>
  );
}
