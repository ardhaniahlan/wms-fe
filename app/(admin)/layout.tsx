import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        <Header />
        
        <main className="p-8 text-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
}