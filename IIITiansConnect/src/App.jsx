import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import TeamPage from "./pages/Team/TeamPage";
import TeamJoinPage from "./pages/Team/TeamJoinPage";

import AdminLayout from "./components/AdminLayout";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

import Index from "./pages/Index/index.jsx";
import Colleges from "./pages/Colleges/Colleges.jsx";
import CollegesAdmin from "./pages/Colleges/CollegesAdmin.jsx";

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
import DiscussPage from "./pages/Discuss/DiscussPage.jsx";
import DiscussAdminPage from "./pages/Discuss/DiscussAdminPage.jsx";
import GuidePage from "./pages/Guide/GuidePage.jsx";

import AdminGuide from "./pages/Guide/AdminGuide.jsx";

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
  const location = useLocation();
  const isAdminPage =
    location.pathname === "/admin" || location.pathname.includes("/admin");

  useEffect(() => {
    const handleContextMenu = (e) => {
      if (!isAdminPage && e.target.tagName === "IMG") {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e) => {
      if (!isAdminPage) {
        if (
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) ||
          (e.ctrlKey && (e.key === "U" || e.key === "u"))
        ) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAdminPage]);

  return (
    <>
      {!isAdminPage && <Navigation />}
      <ScrollToTop />

      <AnimatePresence mode="wait">
        <Routes location={location} key={isAdminPage ? "admin-routes" : location.pathname}>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Index />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/events" element={<PublicEvents />} />
          <Route path="/placement" element={<Placement />} />
          <Route path="/legacy" element={<LegacyPage />} />
          <Route path="/alumni" element={<Navigate to="/legacy" replace />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/team/join" element={<TeamJoinPage />} />
          <Route path="/discuss" element={<DiscussPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* ADMIN LOGIN (public) */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* 🔐 ADMIN PROTECTED ROUTES */}
          <Route element={<RequireAdmin />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/guide" element={<AdminGuide />} />
              <Route path="/legacy/admin" element={<LegacyAdminPage />} />
              <Route path="/legacy/admin/:status" element={<LegacyAdminPage />} />
              <Route path="/alumni/admin" element={<LegacyAdminRedirect />} />
              <Route path="/alumni/admin/:status" element={<LegacyAdminRedirect />} />
              <Route path="/colleges/admin" element={<CollegesAdmin />} />
              <Route path="/team/admin" element={<TeamAdmin />} />
              <Route path="/placement/admin" element={<PlacementPage />} />
              <Route path="/events/admin" element={<Events />} />
              <Route path="/discuss/admin" element={<DiscussAdminPage />} />
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
