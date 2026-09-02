import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./components/AdminLayout";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Providers from "./pages/Providers";
import ProviderForm from "./pages/ProviderForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Index />
            </MainLayout>
          }
        />
        <Route path="/admin/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />

            <Route path="/admin/providers" element={<Providers />} />
            <Route path="/admin/providers/new" element={<ProviderForm />} />
            <Route path="/admin/providers/:id/edit" element={<ProviderForm />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
