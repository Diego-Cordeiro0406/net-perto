import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Providers from "./pages/Providers";
import ProviderForm from "./pages/ProviderForm";
import ProviderCoverage from "./pages/ProviderCoverage";
import AdminPlans from "./pages/AdminPlans";
import SearchResults from "./pages/SearchResults";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<SearchResults />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/providers" element={<Providers />} />
            <Route path="/admin/providers/new" element={<ProviderForm />} />
            <Route path="/admin/providers/:id/edit" element={<ProviderForm />} />
            <Route path="/admin/providers/:id/coverage" element={<ProviderCoverage />} />
            <Route path="/admin/providers/:providerId/plans" element={<AdminPlans />} />
          </Route>
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
