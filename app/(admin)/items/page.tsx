"use client";

import { useEffect, useState } from "react";
import { deleteItem, getItems } from "../../../services/item.service";
import Link from "next/link";
import { Item } from "@/types/item.types";
import { toast } from "sonner";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getItems();
      setItems(data);
      setIsLoading(false);
    };
    fetchItems();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    const isConfirm = window.confirm(
      `Apakah Anda yakin ingin menghapus barang ${name}?`,
    );
    if (isConfirm) {
      try {
        const result = await deleteItem(id);
        setItems(items.filter((item) => item.id !== id));
        toast.success(result?.message);
      } catch {
        toast.error("Gagal menghapus data.");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Master Data Barang
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Kelola semua jenis barang yang ada di gudang Anda.
          </p>
        </div>
        <Link
          href="/items/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-block"
        >
          + Tambah Barang
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-sm border-b border-slate-200">
              <th className="p-4 font-semibold">SKU</th>
              <th className="p-4 font-semibold">Nama Barang</th>
              <th className="p-4 font-semibold">Kategori</th>
              <th className="p-4 font-semibold">Satuan (Unit)</th>
              <th className="p-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Memuat data barang...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Belum ada data barang. Silakan tambah barang baru.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 text-sm font-medium text-slate-700">
                    {item.sku}
                  </td>
                  <td className="p-4 text-sm text-slate-800">{item.name}</td>
                  <td className="p-4 text-sm text-slate-600">
                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 uppercase">
                    {item.baseUnit}
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      href={`/items/${item.id}`}
                      className="text-sm text-blue-600 font-medium hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="text-sm text-red-600 font-medium hover:underline"
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
