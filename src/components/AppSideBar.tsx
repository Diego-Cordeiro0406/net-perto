import {
  Building2,
  LayoutDashboard,
  LogOut,
  Wifi,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();

      navigate("/admin/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <NavLink
          to="/admin"
          className="flex items-center gap-2 px-2 py-3"
        >
          <div className="flex">
            <span className="text-2xl font-extralight">
              Net
            </span>

            <span className="text-2xl font-extrabold">
              Perto
            </span>
          </div>

          <span className="text-xs text-muted-foreground">
            Admin
          </span>
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Administração
          </SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      isActive ? "bg-accent text-accent-foreground" : ""
                    }
                  />
                }
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                render={
                  <NavLink
                    to="/admin/providers"
                    className={({ isActive }) =>
                      isActive ? "bg-accent text-accent-foreground" : ""
                    }
                  />
                }
              >
                  <Building2 />
                  <span>Provedores</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton render={
                  <NavLink
                    to="/admin/coverage"
                    className={({ isActive }) =>
                      isActive ? "bg-accent text-accent-foreground" : ""
                    }
                  />
                }>
                  <Wifi />
                  <span>Cobertura</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}