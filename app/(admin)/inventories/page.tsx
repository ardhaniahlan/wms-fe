"use client";

import { getInventories } from "@/services/inventory.service";
import { Inventory } from "@/types/inventory.types";
import { useState, useEffect } from "react";

export default function InventoriesPage() {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const data = await getInventories();
        setInventories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventories();
  }, []);

  const filteredInventories = inventories.filter(
    (inv) =>
      inv.item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.location.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.location.warehouse.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  if (isLoading)
    return <div className="p-8 text-slate-500">Memuat data stok...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Stok Gudang (Inventory)
        </h1>

        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Cari barang, SKU, atau Gudang..."
            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <th className="p-4 font-semibold">SKU</th>
              <th className="p-4 font-semibold">Nama Barang</th>
              <th className="p-4 font-semibold">Gudang & Rak</th>
              <th className="p-4 font-semibold text-right">Kuantitas (Stok)</th>
              <th className="p-4 font-semibold text-right">Terakhir Update</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventories.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Tidak ada stok yang ditemukan.
                </td>
              </tr>
            ) : (
              filteredInventories.map((inv) => (
                <tr
                  key={`${inv.itemId}-${inv.locationId}`}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="p-4 text-sm font-medium text-slate-600">
                    {inv.item.sku}
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-800">
                    {inv.item.name}{" "}
                    <span className="block font-normal text-xs text-slate-400">
                      {inv.item.category || "-"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-medium">
                    {inv.location.warehouse.name}
                    <span className="block text-xs text-blue-600 font-normal">
                      Rak: {inv.location.code}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span
                      className={`text-base font-bold ${inv.quantity <= 5 ? "text-red-600" : "text-slate-800"}`}
                    >
                      {inv.quantity}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">
                      {inv.item.baseUnit}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-right text-slate-500">
                    {new Date(inv.updatedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
