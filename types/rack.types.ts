export interface Rack {
  id: string;
  code: string;
  warehouseId: string; 
  warehouse?: {
    name: string;
  };
}

export type CreateRackPayload = Omit<Rack, "id" | "warehouse">;