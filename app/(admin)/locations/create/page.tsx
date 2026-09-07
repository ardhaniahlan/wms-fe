"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createRack } from "@/services/location.service";
import RackForm, { RackFormData } from "@/components/features/locations/RackForm";

export default function CreateRackPage() {
  const router = useRouter();

  const handleSubmit = async (data: RackFormData) => {
    const result = await createRack(data);
    toast.success(result?.message);
    router.push("/locations");
  };

  return (
    <RackForm mode="create" onSubmit={handleSubmit} onCancel={() => router.push("/locations")} />
  );
}