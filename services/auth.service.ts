import api from "@/lib/axios";

export const login = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const logoutService = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error("Gagal menghubungi server saat logout", error);
  } finally {
    localStorage.removeItem("token");
  }
};