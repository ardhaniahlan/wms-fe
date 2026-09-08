"use client";

import { useState, useEffect } from "react";
import { Warehouse } from "@/types/warehouse.types";
import { getWarehouses } from "@/services/warehouse.service";

export type RackFormData = {
  code: string;
  warehouseId: string;
};

type RackFormProps = {
  mode: "create" | "edit";
  initialData?: RackFormData;
  onSubmit: (data: RackFormData) => Promise<void>;
  onCancel: () => void;
};

export default function RackForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: RackFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(true);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<RackFormData>(
    initialData ?? { code: "", warehouseId: "" }
  );

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const result = await getWarehouses();
        setWarehouses(result.data);
      } catch {
        console.error("Gagal memuat gudang");
      } finally {
        setIsLoadingWarehouses(false);
      }
    };
    fetchWarehouses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={onCancel}
          className="text-slate-500 hover:text-blue-600 mr-4 bg-transparent border-none cursor-pointer"
        >
          &larr; Kembali
        </button>
        <h1 className="text-2xl font-bold text-slate-800">
          {mode === "create" ? "Tambah Rak Baru" : "Edit Rak"}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Pilih Gudang Induk
            </label>
            <select
              required
              disabled={isLoadingWarehouses}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500 bg-white disabled:bg-slate-50"
              value={formData.warehouseId}
              onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
            >
              <option value="" disabled>
                {isLoadingWarehouses ? "Memuat gudang..." : "-- Pilih Gudang --"}
              </option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name} ({wh.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Kode Rak
            </label>
            <input
              type="text"
              required
              placeholder={mode === "create" ? "Contoh: A-01-01" : undefined}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? "Menyimpan..." : mode === "create" ? "Simpan Rak" : "Perbarui Rak"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}