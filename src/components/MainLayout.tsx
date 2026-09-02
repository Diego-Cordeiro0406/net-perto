import { NavLink } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";

export function MainLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <section className="flex min-h-screen w-full">
        {sidebar}

        <section className="flex w-full flex-1 flex-col">
          <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-4">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="flex">
                <h1 className="text-4xl font-extralight">Net</h1>

                <h1 className="text-4xl font-extrabold">Perto</h1>
              </div>
            </NavLink>
          </header>

          <main className="flex-1 bg-background p-6">{children}</main>
        </section>
      </section>
    </SidebarProvider>
  );
}
