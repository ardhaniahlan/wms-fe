"use client";

import { useRouter } from "next/navigation";
import { createItem } from "../../../../services/item.service";
import ItemForm, {
  AttributeRow,
  ItemFormData,
} from "@/components/features/ItemForm";

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

    await createItem({...data, attributes: formattedAttributes });
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
