"use client";

import { logoutService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutService();

      toast.success("Berhasil keluar dari panel admin");

      router.push('/');
      router.refresh(); 
    } catch {
      toast.error("Gagal melakukan logout");
    }
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
      <h2 className="text-xl font-semibold text-slate-800">Panel Kontrol</h2>
      
      <button
        onClick={handleLogout}
        className="text-sm font-medium bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
      >
        Keluar (Logout)
      </button>
    </header>
  );
}