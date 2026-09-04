import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSideBar";

export function MainLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const content = (
    <section className="flex min-h-screen w-full">
      {user && <AppSidebar />}

      <section className="flex w-full flex-1 flex-col">
        <header
          className={`flex ${!user && "justify-between"} h-16 items-center gap-4 border-b border-border bg-card px-4`}
        >
          {user && <SidebarTrigger />}

          <NavLink to="/" className="flex items-center gap-2">
            <img
              src="/images/logo-horizontal.png"
              alt="NetPerto"
              className="h-9 w-auto object-contain"
            />
          </NavLink>
          {!user && (
            <NavLink className="text-white" to="admin/login">
              aqui
            </NavLink>
          )}
        </header>

        <main className="flex-1 bg-background p-6">
          <Outlet />
        </main>
      </section>
    </section>
  );

  return user ? <SidebarProvider>{content}</SidebarProvider> : content;
}
