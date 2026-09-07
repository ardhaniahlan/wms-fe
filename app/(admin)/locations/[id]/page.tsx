"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { getRackById, updateRack } from "@/services/location.service";
import RackForm, { RackFormData } from "@/components/features/locations/RackForm";

export default function EditRackPage() {
  const router = useRouter();
  const params = useParams();
  const rackId = params.id as string;

  const [isFetching, setIsFetching] = useState(true);
  const [initialData, setInitialData] = useState<RackFormData | null>(null);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchRack = async () => {
      try {
        const rackData = await getRackById(rackId);
        setInitialData({
          code: rackData.code || "",
          warehouseId: rackData.warehouseId || "",
        });
      } catch {
        setFetchError("Gagal memuat data rak.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchRack();
  }, [rackId]);

  const handleSubmit = async (data: RackFormData) => {
    const result = await updateRack(rackId, { id: rackId, ...data });
    toast.success(result?.message);
    router.push("/locations");
  };

  if (isFetching) return <div className="p-8">Memuat data...</div>;
  if (fetchError) return <div className="p-8 text-red-500">{fetchError}</div>;

  return (
    <RackForm
      mode="edit"
      initialData={initialData!}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/locations")}
    />
  );
}