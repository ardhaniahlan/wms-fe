import api from "@/lib/axios";
import { CatalogItem } from "@/types/catalog.types";
import { Meta } from "@/types/meta.types";

export const getCatalogData = async (page: number = 1, search: string = '') => {
  try {
    const response = await api.get('/catalog', {
      params: { page, search, limit: 12 }
    });
    return {
      data: response.data.data as CatalogItem[],
      meta: response.data.meta as Meta,
    };
  } catch {
    throw new Error('Gagal mengambil data katalog');
  }
};