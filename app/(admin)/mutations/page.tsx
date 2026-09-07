"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMutations,  } from '../../../services/mutation.service';
import { Mutation } from '@/types/mutation.types';

export default function MutationsPage() {
  const [mutations, setMutations] = useState<Mutation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMutations = async () => {
      try {
        const data = await getMutations();
        setMutations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMutations();
  }, []);

  if (isLoading) return <div className="p-8 text-slate-500">Memuat riwayat mutasi...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Mutasi Stok (Pergerakan Barang)</h1>
        <Link href="/mutations/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
          + Catat Mutasi
        </Link>
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
            {mutations.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-400">Belum ada riwayat mutasi.</td></tr>
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
    </div>
  );
}