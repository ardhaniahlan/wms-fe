import api from "@/lib/axios";
import { CreateMutationsPayload } from "@/types/mutation.types";

export const getMutations = async () => {
  try {
    const response = await api.get('/mutations');
    return response.data.data;
  } catch {
    throw new Error('Gagal mengambil riwayat mutasi');
  }
};

export const createMutation = async (data: CreateMutationsPayload) => {
  try {
    const response = await api.post('/mutations', data);
    return response.data;
  } catch {
    throw new Error('Gagal mencatat mutasi barang');
  }
};