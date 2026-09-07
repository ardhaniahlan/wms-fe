"use client";

import { useState } from "react";

export type ItemFormData = {
  sku: string;
  name: string;
  category: string;
  baseUnit: string;
};

export type AttributeRow = { key: string; value: string };

type ItemFormProps = {
  mode: "create" | "edit";
  initialData?: ItemFormData;
  initialAttributes?: AttributeRow[];
  showAttributes?: boolean;
  onSubmit: (data: ItemFormData, attributes: AttributeRow[]) => Promise<void>;
  onCancel: () => void;
};

const CATEGORIES = ["Elektronik", "Aksesoris", "Pakaian", "Makanan"];
const UNITS = [
  { value: "pcs", label: "Pcs (Pieces)" },
  { value: "box", label: "Box" },
  { value: "kg", label: "Kg (Kilogram)" },
  { value: "lusin", label: "Lusin" },
];

export default function ItemForm({
  mode,
  initialData,
  initialAttributes = [],
  showAttributes = true,
  onSubmit,
  onCancel,
}: ItemFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<ItemFormData>(
    initialData ?? { sku: "", name: "", category: "", baseUnit: "pcs" }
  );

  const [attributeRows, setAttributeRows] = useState<AttributeRow[]>(
    initialAttributes
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await onSubmit(formData, attributeRows);
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
          {mode === "create" ? "Tambah Barang Baru" : "Edit Barang"}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                SKU (Stock Keeping Unit)
              </label>
              <input
                type="text"
                required
                placeholder={mode === "create" ? "Contoh: LAP-ASUS-001" : undefined}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Barang
              </label>
              <input
                type="text"
                required
                placeholder={mode === "create" ? "Contoh: Asus ROG Strix G15" : undefined}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kategori
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {mode === "create" && <option value="">-- Pilih Kategori --</option>}
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Satuan (Base Unit)
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
                  value={formData.baseUnit}
                  onChange={(e) => setFormData({ ...formData, baseUnit: e.target.value })}
                >
                  {UNITS.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {showAttributes && (
            <div className="border-t border-slate-100 pt-6">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-semibold text-slate-800">
                  Spesifikasi / Atribut Tambahan
                </label>
                <button
                  type="button"
                  onClick={() => setAttributeRows([...attributeRows, { key: "", value: "" }])}
                  className="text-xs bg-blue-50 text-blue-600 font-medium px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
                >
                  + Tambah Atribut
                </button>
              </div>

              {attributeRows.length === 0 ? (
                <p className="text-sm text-slate-400 italic mb-2">
                  Belum ada atribut tambahan. Klik tombol di atas untuk menambahkan.
                </p>
              ) : (
                <div className="space-y-3 mb-4">
                  {attributeRows.map((row, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        type="text"
                        placeholder="Nama Atribut (Contoh: RAM)"
                        className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500 lowercase"
                        value={row.key}
                        onChange={(e) => {
                          const newRows = [...attributeRows];
                          newRows[index].key = e.target.value;
                          setAttributeRows(newRows);
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Nilai (Contoh: 16GB)"
                        className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
                        value={row.value}
                        onChange={(e) => {
                          const newRows = [...attributeRows];
                          newRows[index].value = e.target.value;
                          setAttributeRows(newRows);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setAttributeRows(attributeRows.filter((_, i) => i !== index))}
                        className="text-slate-400 hover:text-red-600 p-2 transition-colors"
                        title="Hapus baris"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? "Menyimpan..." : mode === "create" ? "Simpan Barang" : "Update Barang"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}