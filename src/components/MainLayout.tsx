import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSideBar";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "next-themes";

export function MainLayout() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return null;
  }

  const content = (
    <section className="flex min-h-screen w-full">
      {user && <AppSidebar />}

      <section className="flex w-full flex-1 flex-col">
        <header
          className={`flex justify-between h-16 items-center gap-4 border-b border-border bg-card px-4`}
        >
          <div className="flex items-center">
            {user && <SidebarTrigger />}

            <NavLink to="/" className="flex items-center gap-2 ml-2">
              <img
                src="/images/logo-horizontal.png"
                alt="NetPerto"
                className="h-11 w-auto object-contain"
              />
            </NavLink>
          </div>

          {!user && (
            <NavLink
              className={`${theme === "light" ? "text-white" : "text-[#141B24]"}`}
              to="admin/login"
            >
              aqui
            </NavLink>
          )}
          <ThemeToggle />
        </header>

        <main className="flex-1 bg-background p-6">
          <Outlet />
        </main>
      </section>
    </section>
  );

  return user ? <SidebarProvider>{content}</SidebarProvider> : content;
}
