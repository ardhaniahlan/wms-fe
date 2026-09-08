"use client";

import { useState, useEffect } from 'react';
import { Inventory } from '@/types/inventory.types';
import { Meta } from '@/types/meta.types';
import { getInventories } from '@/services/inventory.service';
import SearchInput from '@/components/layout/Search';
import Pagination from '@/components/layout/Pagination';

export default function InventoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInventories = async () => {
      setIsLoading(true);
      try {
        const response = await getInventories(page, search);
        setInventories(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventories();
  }, [page, search]); 

  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Stok Gudang (Inventory)</h1>
        
        <div className="w-full md:w-72">
          <SearchInput placeholder="Cari barang atau gudang..." onSearch={handleSearch} />
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
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-400">Memuat data...</td></tr>
            ) : inventories.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-400">Tidak ada stok yang ditemukan.</td></tr>
            ) : (
              inventories.map((inv) => (
                <tr key={`${inv.itemId}-${inv.locationId}`} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-sm font-medium text-slate-600">{inv.item.sku}</td>
                  <td className="p-4 text-sm font-bold text-slate-800">
                    {inv.item.name} <span className="block font-normal text-xs text-slate-400">{inv.item.category || '-'}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-medium">
                    {inv.location.warehouse.name}
                    <span className="block text-xs text-blue-600 font-normal">Rak: {inv.location.code}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`text-base font-bold ${inv.quantity <= 5 ? 'text-red-600' : 'text-slate-800'}`}>
                      {inv.quantity}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">{inv.item.baseUnit}</span>
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