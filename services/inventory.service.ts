import api from "@/lib/axios";

export const getInventories = async () => {
  try {
    const response = await api.get('/inventories');
    return response.data.data;
  } catch {
    throw new Error('Gagal mengambil data stok');
  }
};