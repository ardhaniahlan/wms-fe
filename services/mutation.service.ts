import api from "@/lib/axios";
import { CreateMutationsPayload } from "@/types/mutation.types";

export const getMutations = async (page: number = 1, search: string = '') => {
  const response = await api.get('/mutations', { params: { page, search, limit: 10 } });
  return { data: response.data.data, meta: response.data.meta };
};

export const createMutation = async (data: CreateMutationsPayload) => {
  try {
    const response = await api.post('/mutations', data);
    return response.data;
  } catch {
    throw new Error('Gagal mencatat mutasi barang');
  }
};