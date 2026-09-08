"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Meta } from "@/types/meta.types";
import SearchInput from "@/components/layout/Search";
import Pagination from "@/components/layout/Pagination";
import { CatalogItem } from "@/types/catalog.types";
import { getCatalogData } from "@/services/catalog.service";

export default function PublicCatalogPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const response = await getCatalogData(page, search);
        setItems(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, [page, search]);

  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
            W
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">
            WMS<span className="text-blue-600">Portal</span>
          </span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-slate-600 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Login Admin
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Cek Ketersediaan Barang
          </h1>
          <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto">
            Cari dan pantau status ketersediaan barang di seluruh jaringan
            gudang kami secara real-time.
          </p>

          <div className="max-w-xl mx-auto bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            <SearchInput
              placeholder="Cari nama barang atau kategori..."
              onSearch={handleSearch}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-slate-500 font-medium animate-pulse">
            Memuat data inventaris...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-200">
            Barang tidak ditemukan. Coba cek SKU atau nama lain.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">
                    {item.sku}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      item.totalStock > 10
                        ? "bg-green-100 text-green-700"
                        : item.totalStock > 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    Total: {item.totalStock}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">
                  {item.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4">{item.category}</p>
                <div className="grow"></div>
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                    Rincian Lokasi:
                  </h4>

                  {item.locations.length === 0 ? (
                    <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded text-center">
                      Stok Kosong di Semua Gudang
                    </p>
                  ) : (
                    <ul className="space-y-2 max-h-32 overflow-y-auto pr-1">
                      {item.locations.map((loc, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded border border-slate-100"
                        >
                          <div>
                            <span className="font-medium text-slate-700 block">
                              {loc.warehouse}
                            </span>
                            <span className="text-xs text-slate-500">
                              Rak: {loc.rack}
                            </span>
                          </div>
                          <span className="font-bold text-slate-800 bg-white px-2 py-1 rounded shadow-sm border border-slate-200">
                            {loc.qty}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12">
          {meta && (
            <Pagination
              currentPage={meta.currentPage}
              totalPages={meta.totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
