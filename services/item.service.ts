import { CreateItemPayload, Item } from '@/types/item.types';
import api from '../lib/axios';

export const getItems = async () => {
  try {
    const response = await api.get('/items');
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil data barang", error);
    return [];
  }
};

export const getItemById = async (id: string) => {
  try {
    const response = await api.get(`/items/${id}`);
    return response.data.data || response.data;
  } catch {
    throw new Error('Gagal mengambil data barang');
  }
};

export const updateItem = async (id: string, itemData: Item) => {
  try {
    const response = await api.patch(`/items/${id}`, itemData);
    return response.data;
  } catch {
    throw new Error('Gagal memperbarui barang');
  }
};

export const deleteItem = async (id: string) => {
  try {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  } catch {
    throw new Error('Gagal menghapus barang');
  }
};

export const createItem = async (itemData: CreateItemPayload) => {
  try {
    const response = await api.post('/items', itemData);
    return response.data;
  } catch (error) {
    console.error("Gagal menambah data barang", error);
  }
};

