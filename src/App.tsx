import "./App.css";

import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MainLayout } from "./components/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PageLoading } from "./components/PageLoading";

// Public pages
const Index = lazy(() => import("./pages/Index"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Auth
const Login = lazy(() => import("./pages/Login"));

// Admin pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Providers = lazy(() => import("./pages/Providers"));
const ProviderForm = lazy(() => import("./pages/ProviderForm"));
const ProviderCoverage = lazy(() => import("./pages/ProviderCoverage"));
const AdminPlans = lazy(() => import("./pages/AdminPlans"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Public */}
            <Route path="/" element={<Index />} />

            <Route path="/internet/:city/:neighborhoodSlug" element={<SearchResults />} />

            {/* Admin */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<Dashboard />} />

              <Route path="/admin/providers" element={<Providers />} />

              <Route path="/admin/providers/new" element={<ProviderForm />} />

              <Route path="/admin/providers/:id/edit" element={<ProviderForm />} />

              <Route path="/admin/providers/:id/coverage" element={<ProviderCoverage />} />

              <Route path="/admin/providers/:providerId/plans" element={<AdminPlans />} />
            </Route>
          </Route>

          {/* Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
