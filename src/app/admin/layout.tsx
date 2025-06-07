// app/dashboard/layout.tsx

import Sidebar from "@/components/Sidebar";
// import Header from "@/components/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* <Header /> */}
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
