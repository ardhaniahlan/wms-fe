"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardMetrics } from "@/types/dashboard.types";
import { getDashboardData } from "@/services/dashboard.service";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardData();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (isLoading) return <div className="p-8 text-slate-500">Memuat Dashboard...</div>;
  if (!metrics) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard WMS</h1>
        <p className="text-slate-500">Ringkasan aktivitas dan status gudang hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <h3 className="text-slate-500 text-sm font-medium">Total Master Barang</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{metrics.totalItems}</p>
          <Link href="/items" className="text-blue-600 text-sm mt-4 hover:underline">Lihat Detail &rarr;</Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <h3 className="text-slate-500 text-sm font-medium">Lokasi Gudang Aktif</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{metrics.totalWarehouses}</p>
          <Link href="/warehouses" className="text-blue-600 text-sm mt-4 hover:underline">Kelola Gudang &rarr;</Link>
        </div>

        <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100 flex flex-col justify-between">
          <h3 className="text-red-600 text-sm font-medium">Peringatan Stok Menipis</h3>
          <p className="text-3xl font-bold text-red-700 mt-2">{metrics.lowStockCount}</p>
          <Link href="/inventories" className="text-red-600 text-sm mt-4 hover:underline">Cek Inventory &rarr;</Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Aktivitas Mutasi Terakhir</h2>
          <Link href="/mutations" className="text-blue-600 text-sm hover:underline">Lihat Semua</Link>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <th className="p-4 font-semibold">Tipe</th>
              <th className="p-4 font-semibold">Barang</th>
              <th className="p-4 font-semibold">Qty</th>
              <th className="p-4 font-semibold">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {metrics.recentMutations.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-400">Belum ada aktivitas mutasi.</td></tr>
            ) : (
              metrics.recentMutations.map((mut) => (
                <tr key={mut.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      mut.type === 'IN' ? 'bg-green-100 text-green-700' : 
                      mut.type === 'OUT' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {mut.type}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-800">
                    {mut.item?.name} <span className="text-xs text-slate-400 block">{mut.item?.sku}</span>
                  </td>
                  <td className="p-4 font-bold text-slate-700">{mut.quantity}</td>
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(mut.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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