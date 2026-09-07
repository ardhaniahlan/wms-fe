"use client";

import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    // Nanti kita tambahkan panggilan API ke backend untuk menghapus Cookie
    // Untuk sekarang, kita arahkan kembali ke halaman publik/login
    router.push('/');
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