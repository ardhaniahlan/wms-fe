export interface CatalogLocation {
  warehouse: string;
  rack: string;
  qty: number;
}

export interface CatalogItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  totalStock: number;
  locations: CatalogLocation[];
}