export interface Item {
  id: string;
  sku: string;
  name: string;
  category: string;
  baseUnit: string;
  attributes: Record<string, unknown>;
}

export type CreateItemPayload = Omit<Item, "id">;