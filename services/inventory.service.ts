import api from "@/lib/axios";
import { Inventory } from "@/types/inventory.types";
import { Meta } from "@/types/meta.types";

export const getInventories = async (page: number = 1, search: string = '') => {
  try {
    const response = await api.get('/inventories', {
      params: { page, search, limit: 10 }
    });
    
    return {
      data: response.data.data as Inventory[],
      meta: response.data.meta as Meta,
    };
  } catch {
    throw new Error('Gagal mengambil data stok gudang');
  }
};