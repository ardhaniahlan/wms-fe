import api from "@/lib/axios";
import { CreateWarehousePayload, Warehouse } from "@/types/warehouse.types";

export const getWarehouses = async (page: number = 1, search: string = "") => {
  const response = await api.get("/warehouses", {
    params: { page, search, limit: 10 },
  });
  return { data: response.data.data, meta: response.data.meta };
};

export const getWarehouseById = async (id: string) => {
  try {
    const response = await api.get(`/warehouses/${id}`);
    return response.data.data;
  } catch {
    throw new Error("Gagal mengambil detail gudang");
  }
};

export const createWarehouse = async (data: CreateWarehousePayload) => {
  try {
    const response = await api.post("/warehouses", data);
    return response.data;
  } catch {
    throw new Error("Gagal menambahkan gudang baru");
  }
};

export const updateWarehouse = async (id: string, data: Warehouse) => {
  try {
    const response = await api.patch(`/warehouses/${id}`, data);
    return response.data;
  } catch {
    throw new Error("Gagal memperbarui data gudang");
  }
};

export const deleteWarehouse = async (id: string) => {
  try {
    const response = await api.delete(`/warehouses/${id}`);
    return response.data;
  } catch {
    throw new Error("Gagal menghapus gudang");
  }
};
