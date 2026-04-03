import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import TeamPage from "./pages/Team/TeamPage";

import AdminLayout from "./components/AdminLayout";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

import Index from "./pages/Index/index.jsx";
import Colleges from "./pages/Colleges/Colleges.jsx";

import Events from "./pages/Events/EventsAdmin.jsx";

import Placement from "./pages/Placement/Placement.jsx";
import NotFound from "./pages/NotFound.jsx";
import TeamAdmin from "./pages/Team/Admin/TeamAdmin.jsx";
import PlacementPage from "./pages/Placement/PlacementPage.jsx";
import ContactPage from "./pages/Contact.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import RequireAdmin from "./components/RequireAdmin";
import PublicEvents from "./pages/Events/Events.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import LegacyAdminPage from "./pages/LegacyAdminPage.jsx";
import LegacyPage from "./pages/LegacyPage.jsx";

function LegacyAdminRedirect() {
  const { status } = useParams();

  return (
    <Navigate
      to={status ? `/legacy/admin/${status}` : "/legacy/admin"}
      replace
    />
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isAdminPage =
    location.pathname === "/admin" || location.pathname.includes("/admin");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {!isAdminPage && <Navigation />}
      <ScrollToTop />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Index />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/events" element={<PublicEvents />} />
          <Route path="/placement" element={<Placement />} />
          <Route path="/legacy" element={<LegacyPage />} />
          <Route path="/alumni" element={<Navigate to="/legacy" replace />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* ADMIN LOGIN (public) */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* 🔐 ADMIN PROTECTED ROUTES */}
          <Route element={<RequireAdmin />}>
            <Route element={<AdminLayout />}>
              <Route path="/legacy/admin" element={<LegacyAdminPage />} />
              <Route path="/legacy/admin/:status" element={<LegacyAdminPage />} />
              <Route path="/alumni/admin" element={<LegacyAdminRedirect />} />
              <Route path="/alumni/admin/:status" element={<LegacyAdminRedirect />} />
              <Route path="/team/admin" element={<TeamAdmin />} />
              <Route path="/placement/admin" element={<PlacementPage />} />
              <Route path="/events/admin" element={<Events />} />
            </Route>
          </Route>
          

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>

      {!isAdminPage && <Footer />}
    </>
  );
}

export default App;
