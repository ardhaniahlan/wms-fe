"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { deleteRack, getRacks } from "@/services/location.service";
import { Rack } from "@/types/rack.types";
import { toast } from "sonner";
import { Meta } from "@/types/meta.types";
import SearchInput from "@/components/layout/Search";
import Pagination from "@/components/layout/Pagination";

export default function RacksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [racks, setRacks] = useState<Rack[]>([]);
  const [meta, setMeta] = useState<Meta>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRacks = async () => {
      setIsLoading(true);
      try {
        const response = await getRacks(page, search);
        setRacks(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRacks();
  }, [page, search]);

  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`Yakin ingin menghapus rak ${code}?`)) {
      try {
        const result = await deleteRack(id);
        setRacks(racks.filter((r) => r.id !== id));
        toast.success(result?.message);
      } catch {
        toast.error("Gagal menghapus rak");
      }
    }
  };

  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Data Rak (Locations)
        </h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-64">
            <SearchInput
              placeholder="Cari kode rak atau gudang..."
              onSearch={handleSearch}
            />
          </div>
          <Link
            href="/racks/create"
            className="bg-blue-600 whitespace-nowrap text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + Tambah Rak
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <th className="p-4 font-semibold">Kode Rak</th>
              <th className="p-4 font-semibold">Lokasi Gudang</th>
              <th className="p-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-500">
                  Memuat data rak...
                </td>
              </tr>
            ) : racks.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-400">
                  Belum ada data rak.
                </td>
              </tr>
            ) : (
              racks.map((rack) => (
                <tr
                  key={rack.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="p-4 font-medium text-slate-800">
                    {rack.code}
                  </td>
                  <td className="p-4 text-slate-600">
                    {rack.warehouse?.name || "Tidak diketahui"}
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      href={`/locations/${rack.id}`}
                      className="text-sm text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(rack.id, rack.code)}
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
