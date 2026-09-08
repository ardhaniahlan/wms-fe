"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getItems } from "../../../../services/item.service";
import { MutationType } from "@/types/mutation.types";
import { getRacks } from "@/services/location.service";
import { createMutation } from "@/services/mutation.service";
import { Item } from "@/types/item.types";
import { Rack } from "@/types/rack.types";

export default function CreateMutationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    type: "IN" as MutationType,
    itemId: "",
    qty: 1,
    sourceRackId: "",
    destinationRackId: "",
    notes: "",
  });

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [itemsRes, racksRes] = await Promise.all([getItems(), getRacks()]);
        
        setItems(itemsRes.data || itemsRes); 
        setRacks(racksRes.data || racksRes);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data barang atau rak.");
      }
    };
    fetchMasterData();
  }, []); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const payload = {
        type: formData.type,
        itemId: formData.itemId,
        qty: Number(formData.qty),
        notes: formData.notes,
        sourceRackId: formData.type === "IN" ? null : formData.sourceRackId,
        destinationRackId:
          formData.type === "OUT" ? null : formData.destinationRackId,
      };

      await createMutation(payload);
      router.push("/mutations");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Terjadi kesalahan saat menyimpan mutasi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link
          href="/mutations"
          className="text-slate-500 hover:text-blue-600 mr-4"
        >
          &larr; Kembali
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Catat Mutasi Stok</h1>
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
                Tipe Mutasi
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500 font-bold"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as MutationType,
                  })
                }
              >
                <option value="IN">Stok Masuk (IN)</option>
                <option value="OUT">Stok Keluar (OUT)</option>
                <option value="TRANSFER">Pindah Rak (TRANSFER)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kuantitas (Qty)
              </label>
              <input
                type="number"
                min="1"
                required
                className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
                value={formData.qty}
                onChange={(e) =>
                  setFormData({ ...formData, qty: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Pilih Barang
            </label>
            <select
              required
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
              value={formData.itemId}
              onChange={(e) =>
                setFormData({ ...formData, itemId: e.target.value })
              }
            >
              <option value="" disabled>
                -- Pilih Barang --
              </option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.sku})
                </option>
              ))}
            </select>
          </div>

          {(formData.type === "OUT" || formData.type === "TRANSFER") && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Dari Rak (Asal)
              </label>
              <select
                required
                className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
                value={formData.sourceRackId}
                onChange={(e) =>
                  setFormData({ ...formData, sourceRackId: e.target.value })
                }
              >
                <option value="" disabled>
                  -- Pilih Rak Asal --
                </option>
                {racks.map((rack) => (
                  <option key={rack.id} value={rack.id}>
                    {rack.code} ({rack.warehouse?.name})
                  </option>
                ))}
              </select>
            </div>
          )}

          {(formData.type === "IN" || formData.type === "TRANSFER") && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ke Rak (Tujuan)
              </label>
              <select
                required
                className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
                value={formData.destinationRackId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    destinationRackId: e.target.value,
                  })
                }
              >
                <option value="" disabled>
                  -- Pilih Rak Tujuan --
                </option>
                {racks.map((rack) => (
                  <option key={rack.id} value={rack.id}>
                    {rack.code} ({rack.warehouse?.name})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Catatan Tambahan (Opsional)
            </label>
            <input
              type="text"
              placeholder="No. Surat Jalan / Alasan Mutasi"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-500"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? "Menyimpan..." : "Catat Transaksi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}