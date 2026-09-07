"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { getWarehouseById, updateWarehouse } from "../../../../services/warehouse.service";
import WarehouseForm, { WarehouseFormData } from "@/components/features/warehouses/WarehouseForm";

export default function EditWarehousePage() {
  const router = useRouter();
  const params = useParams();
  const warehouseId = params.id as string;

  const [isFetching, setIsFetching] = useState(true);
  const [initialData, setInitialData] = useState<WarehouseFormData | null>(null);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const data = await getWarehouseById(warehouseId);
        setInitialData({
          code: data.code || "",
          name: data.name || "",
          address: data.address || "",
        });
      } catch {
        setFetchError("Gagal memuat data gudang.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchWarehouse();
  }, [warehouseId]);

  const handleSubmit = async (data: WarehouseFormData) => {
    const result = await updateWarehouse(warehouseId, { id: warehouseId, ...data });
    toast.success(result?.message);
    router.replace("/warehouses");
  };

  if (isFetching) return <div className="p-8 text-slate-500">Memuat data...</div>;
  if (fetchError) return <div className="p-8 text-red-500">{fetchError}</div>;

  return (
    <WarehouseForm
      mode="edit"
      initialData={initialData!}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/warehouses")}
    />
  );
}