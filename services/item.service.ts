import { CreateItemPayload, Item } from '@/types/item.types';
import api from '../lib/axios';
import { Meta } from '@/types/meta.types';

export const getItems = async (page: number = 1, search: string = '') => {
  try {
    const response = await api.get('/items', {
      params: { page, search, limit: 10 }
    });
    return {
      data: response.data.data,
      meta: response.data.meta as Meta,
    };
  } catch {
    throw new Error('Gagal mengambil data barang');
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

