"use client";

import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import InventoryTable from "../components/InventoryTable";
import AddInventoryForm from "../components/AddInventoryForm";

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleInventoryAdded = () => {
    fetchInventory();
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Inventory Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            View current inventory and add new items.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-[2fr,1fr] items-start">
          <InventoryTable items={items} loading={loading} error={error} />
          <AddInventoryForm onAdded={handleInventoryAdded} />
        </div>
      </div>
    </main>
  );
}
