"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMutations,  } from '../../../services/mutation.service';
import { Mutation } from '@/types/mutation.types';
import { Meta } from '@/types/meta.types';
import SearchInput from '@/components/layout/Search';
import Pagination from '@/components/layout/Pagination';

export default function MutationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [mutations, setMutations] = useState<Mutation[]>([]);
  const [meta, setMeta] = useState<Meta>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMutations = async () => {
      setIsLoading(true);
      try {
        const response = await getMutations(page, search);
        setMutations(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMutations();
  }, [page, search]);

  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1);
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Mutasi Stok (Pergerakan Barang)</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-64">
            <SearchInput placeholder="Cari barang atau dokumen..." onSearch={handleSearch} />
          </div>
          <Link href="/mutations/create" className="bg-blue-600 whitespace-nowrap text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            + Catat Mutasi
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <th className="p-4 font-semibold">Tanggal</th>
              <th className="p-4 font-semibold">Tipe</th>
              <th className="p-4 font-semibold">Barang</th>
              <th className="p-4 font-semibold">Qty</th>
              <th className="p-4 font-semibold">Dari Rak</th>
              <th className="p-4 font-semibold">Ke Rak</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-500">
                  Memuat data mutasi...
                </td>
              </tr>
            ) : mutations.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-400">
                  Belum ada riwayat mutasi.
                </td>
              </tr>
            ) : (
              mutations.map((mut) => (
                <tr key={mut.id} className="border-b border-slate-100 hover:bg-slate-50 text-sm">
                  <td className="p-4 text-slate-600">
                    {new Date(mut.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      mut.type === 'IN' ? 'bg-green-100 text-green-700' : 
                      mut.type === 'OUT' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {mut.type}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-800">{mut.item?.name} <span className="text-xs text-slate-400 block">{mut.item?.sku}</span></td>
                  <td className="p-4 font-bold">{mut.qty}</td>
                  <td className="p-4 text-slate-600">{mut.sourceRack ? `${mut.sourceRack.code} (${mut.sourceRack.warehouse.name})` : '-'}</td>
                  <td className="p-4 text-slate-600">{mut.destinationRack ? `${mut.destinationRack.code} (${mut.destinationRack.warehouse.name})` : '-'}</td>
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