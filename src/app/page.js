"use client";

import LowStockList from "../components/LowStockList";
import InventoryStats from "../components/InventoryStats";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import InventoryTable from "../components/InventoryTable";
import AddInventoryForm from "../components/AddInventoryForm";

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/inventory`);
      if (!res.ok) {
        throw new Error("Failed to fetch inventory");
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.items || [];
      setItems(list);
    } catch (err) {
      setError(err.message || "Error fetching inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);
  const categories = Array.from(new Set(items.map((item) => item.category)));

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || item.category === selectedCategory;

    const matchesLowStock =
      !showLowStockOnly || item.quantity <= item.minThreshold;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const handleInventoryAdded = () => {
    fetchInventory();
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Inventory Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            View current inventory and add new items.
          </p>
        </header>
        <InventoryStats items={items} />
        {/* 🔍 SEARCH & FILTER CONTROLS */}
        <div className="bg-white border rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-2 w-full md:w-1/3"
          />

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded px-3 py-2 w-full md:w-1/3"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Low Stock Toggle */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
            />
            Show low stock only
          </label>
        </div>
        <LowStockList items={filteredItems} />
        <div className="grid gap-6 md:grid-cols-[2fr,1fr] items-start">
          <InventoryTable
            items={filteredItems}
            loading={loading}
            error={error}
            onRefresh={fetchInventory}
          />
          <AddInventoryForm onAdded={handleInventoryAdded} />
        </div>
      </div>
    </main>
  );
}
