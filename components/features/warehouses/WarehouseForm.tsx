"use client";

import { useState } from "react";

export type WarehouseFormData = {
  code: string;
  name: string;
  address: string;
};

type WarehouseFormProps = {
  mode: "create" | "edit";
  initialData?: WarehouseFormData;
  onSubmit: (data: WarehouseFormData) => Promise<void>;
  onCancel: () => void;
};

export default function WarehouseForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: WarehouseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<WarehouseFormData>(
    initialData ?? { code: "", name: "", address: "" }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={onCancel}
          className="text-slate-500 hover:text-blue-600 mr-4 bg-transparent border-none cursor-pointer"
        >
          &larr; Kembali
        </button>
        <h1 className="text-2xl font-bold text-slate-800">
          {mode === "create" ? "Tambah Gudang Baru" : "Edit Gudang"}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kode Gudang
              </label>
              <input
                type="text"
                required
                placeholder={mode === "create" ? "Contoh: WH-JKT-01" : undefined}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Gudang
              </label>
              <input
                type="text"
                required
                placeholder={mode === "create" ? "Contoh: Gudang Logistik Jakarta" : undefined}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Alamat Lengkap
            </label>
            <textarea
              rows={3}
              required
              placeholder={mode === "create" ? "Masukkan alamat lengkap gudang..." : undefined}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? "Menyimpan..." : mode === "create" ? "Simpan Gudang" : "Perbarui Gudang"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}