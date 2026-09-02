import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/AppSideBar";
import { MainLayout } from "@/components/MainLayout";

export function AdminLayout() {
  return (
    <MainLayout sidebar={<AppSidebar />}>
      <Outlet />
    </MainLayout>
  );
}
