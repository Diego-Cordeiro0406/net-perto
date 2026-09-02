import { Building2, LayoutDashboard, LogOut, Settings, Shield } from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "./ui/badge";

export function AppSidebar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { state } = useSidebar();

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
      <SidebarHeader className="h-16 border-b">
        {state === "collapsed" ? (
          <NavLink to="/admin" className="flex items-center gap-2 px-1 py-3">
            <div className="flex">
              <span className="text-xl font-extralight">N</span>

              <span className="text-xl font-extrabold">P</span>
            </div>
          </NavLink>
        ) : (
          <NavLink to="/admin" className="flex items-center gap-2 px-2 py-3">
            <div className="flex">
              <span className="text-2xl font-extralight">Net</span>

              <span className="text-2xl font-extrabold">Perto</span>
            </div>
          </NavLink>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>

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
              <SidebarMenuButton
                render={
                  <NavLink
                    to="/admin/coverage"
                    className={({ isActive }) =>
                      isActive ? "bg-accent text-accent-foreground" : ""
                    }
                  />
                }
              >
                <Settings />
                <span>Configurações</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Badge>
              <Shield />
              <span className="text-xs text-muted-white">Admin</span>
            </Badge>
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
