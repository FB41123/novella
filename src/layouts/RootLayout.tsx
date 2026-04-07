import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";

export function RootLayout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
      <Header />
      <div className="flex flex-1 container mx-auto max-w-7xl">
        {user && <Sidebar />}
        <main className="flex-1 w-full p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
