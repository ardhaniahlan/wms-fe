"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getItemById, updateItem } from "../../../../services/item.service";
import ItemForm, { AttributeRow, ItemFormData } from "@/components/features/ItemForm";

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;

  const [isFetching, setIsFetching] = useState(true);
  const [initialData, setInitialData] = useState<ItemFormData | null>(null);
  const [initialAttributes, setInitialAttributes] = useState<AttributeRow[]>([]);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getItemById(itemId);
        setInitialData({
          sku: data.sku || "",
          name: data.name || "",
          category: data.category || "",
          baseUnit: data.baseUnit || "",
        });
        if (data.attributes && typeof data.attributes === "object") {
          setInitialAttributes(
            Object.entries(data.attributes).map(([key, value]) => ({
              key,
              value: String(value),
            }))
          );
        }
      } catch {
        setFetchError("Gagal memuat data barang.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchItem();
  }, [itemId]);

  const handleSubmit = async (data: ItemFormData, attributes: AttributeRow[]) => {
    const formattedAttributes = attributes.reduce((acc, row) => {
      if (row.key.trim() !== "") acc[row.key.trim()] = row.value;
      return acc;
    }, {} as Record<string, string>);

    await updateItem(itemId, { id: itemId, ...data, attributes: formattedAttributes });
    router.push("/items");
  };

  if (isFetching) return <div className="p-8">Memuat data...</div>;
  if (fetchError) return <div className="p-8 text-red-500">{fetchError}</div>;

  return (
    <ItemForm
      mode="edit"
      initialData={initialData!}
      initialAttributes={initialAttributes}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/items")}
    />
  );
}