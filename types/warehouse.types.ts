export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string;
}

export type CreateWarehousePayload = Omit<Warehouse, "id">;