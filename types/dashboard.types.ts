export interface DashboardMetrics {
  totalItems: number;
  totalWarehouses: number;
  lowStockCount: number;
  recentMutations: RecentMutation[];
}

export interface RecentMutation {
  id: string;
  type: string;
  quantity: number;
  timestamp: string; 
  item: {
    sku: string;
    name: string;
  };
}