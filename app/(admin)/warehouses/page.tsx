"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getWarehouses,
  deleteWarehouse,
} from "../../../services/warehouse.service";
import { Warehouse } from "@/types/warehouse.types";
import { toast } from "sonner";

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await getWarehouses();
        setWarehouses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus gudang ${name}?`)) {
      try {
        const result = await deleteWarehouse(id);
        setWarehouses(warehouses.filter((w) => w.id !== id));
        toast.success(result?.message);
      } catch {
        toast.error("Gagal menghapus gudang");
      }
    }
  };

  if (isLoading)
    return <div className="p-8 text-slate-500">Memuat data gudang...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Data Gudang</h1>
        <Link
          href="/warehouses/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          + Tambah Gudang
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <th className="p-4 font-semibold">Kode Gudang</th>
              <th className="p-4 font-semibold">Nama Gudang</th>
              <th className="p-4 font-semibold">Alamat</th>
              <th className="p-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  Belum ada data gudang.
                </td>
              </tr>
            ) : (
              warehouses.map((warehouse) => (
                <tr
                  key={warehouse.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="p-4 font-medium text-slate-800">
                    {warehouse.code}
                  </td>
                  <td className="p-4 text-slate-600">{warehouse.name}</td>
                  <td className="p-4 text-slate-600 truncate max-w-xs">
                    {warehouse.address}
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      href={`/warehouses/${warehouse.id}`}
                      className="text-sm text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(warehouse.id, warehouse.name)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
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
