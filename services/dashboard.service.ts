import api from "@/lib/axios";
import { DashboardMetrics } from "@/types/dashboard.types";

export const getDashboardData = async (): Promise<DashboardMetrics> => {
  try {
    const response = await api.get('/dashboard');
    return response.data.data;
  } catch {
    throw new Error('Gagal mengambil data dashboard');
  }
};