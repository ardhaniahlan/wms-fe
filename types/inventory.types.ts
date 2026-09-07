export interface Inventory {
  itemId: string;
  locationId: string;
  quantity: number;
  updatedAt: string;
  item: {
    sku: string;
    name: string;
    category: string | null;
    baseUnit: string;
  };
  location: {
    code: string;
    warehouse: {
      name: string;
    };
  };
}