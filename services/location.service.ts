import api from "@/lib/axios";
import { CreateRackPayload, Rack } from "@/types/rack.types";

export const getRacks = async (page: number = 1, search: string = '') => {
  const response = await api.get('/locations', { params: { page, search, limit: 10 } });
  return { data: response.data.data, meta: response.data.meta };
};

export const getRackById = async (id: string) => {
  try {
    const response = await api.get(`/locations/${id}`);
    return response.data.data;
  } catch {
    throw new Error('Gagal mengambil detail rak');
  }
};

export const createRack = async (data: CreateRackPayload) => {
  try {
    const response = await api.post('/locations', data);
    return response.data;
  } catch {
    throw new Error('Gagal menambahkan rak baru');
  }
};

export const updateRack = async (id: string, data: Rack) => {
  try {
    const response = await api.patch(`/locations/${id}`, data);
    return response.data;
  } catch {
    throw new Error('Gagal memperbarui data rak');
  }
};

export const deleteRack = async (id: string) => {
  try {
    const response = await api.delete(`/locations/${id}`);
    return response.data;
  } catch {
    throw new Error('Gagal menghapus rak');
  }
};