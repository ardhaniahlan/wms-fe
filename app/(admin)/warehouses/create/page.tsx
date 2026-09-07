"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createWarehouse } from "../../../../services/warehouse.service";
import WarehouseForm, { WarehouseFormData } from "@/components/features/warehouses/WarehouseForm";

export default function CreateWarehousePage() {
  const router = useRouter();

  const handleSubmit = async (data: WarehouseFormData) => {
    const result = await createWarehouse(data);
    toast.success(result?.message);
    router.replace("/warehouses");
  };

  return (
    <WarehouseForm mode="create" onSubmit={handleSubmit} onCancel={() => router.back()} />
  );
}