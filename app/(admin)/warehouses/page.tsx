"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getWarehouses,
  deleteWarehouse,
} from "../../../services/warehouse.service";
import { Warehouse } from "@/types/warehouse.types";
import { toast } from "sonner";
import { Meta } from "@/types/meta.types";
import Pagination from "@/components/layout/Pagination";
import SearchInput from "@/components/layout/Search";

export default function WarehousesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [meta, setMeta] = useState<Meta>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWarehouses = async () => {
      setIsLoading(true);
      try {
        const response = await getWarehouses(page, search);
        setWarehouses(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWarehouses();
  }, [page, search]);

  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1);
  };

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Data Gudang</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-64">
            <SearchInput
              placeholder="Cari nama atau kode gudang..."
              onSearch={handleSearch}
            />
          </div>
          <Link
            href="/warehouses/create"
            className="bg-blue-600 whitespace-nowrap text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + Tambah Gudang
          </Link>
        </div>
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
            {isLoading ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-500">
                  Memuat data gudang...
                </td>
              </tr>
            ) : warehouses.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-400">
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

      {meta && (
        <Pagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
}
