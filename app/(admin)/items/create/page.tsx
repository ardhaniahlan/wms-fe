"use client";

import { useRouter } from "next/navigation";
import { createItem } from "../../../../services/item.service";
import ItemForm, {
  AttributeRow,
  ItemFormData,
} from "@/components/features/items/ItemForm";
import { toast } from "sonner";

export default function CreateItemPage() {
  const router = useRouter();

  const handleSubmit = async (
    data: ItemFormData,
    attributes: AttributeRow[],
  ) => {
    const formattedAttributes = attributes.reduce(
      (acc, row) => {
        if (row.key.trim() !== "") acc[row.key.trim()] = row.value;
        return acc;
      },
      {} as Record<string, string>,
    );

    const result = await createItem({
      ...data,
      attributes: formattedAttributes,
    });
    toast.success(result?.message);
    router.replace("/items");
  };

  return (
    <ItemForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
