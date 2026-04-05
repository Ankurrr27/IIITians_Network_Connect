import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import AdminLayout from "./components/AdminLayout";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import InAppNotifications from "./components/InAppNotifications";

import RequireAdmin from "./components/RequireAdmin";
import ScrollToTop from "./components/ScrollToTop.jsx";
const TeamPage = lazy(() => import("./pages/Team/TeamPage"));
const TeamJoinPage = lazy(() => import("./pages/Team/TeamJoinPage"));
const Index = lazy(() => import("./pages/Index/index.jsx"));
const Colleges = lazy(() => import("./pages/Colleges/Colleges.jsx"));
const CollegesAdmin = lazy(() => import("./pages/Colleges/CollegesAdmin.jsx"));
const Events = lazy(() => import("./pages/Events/EventsAdmin.jsx"));
const Placement = lazy(() => import("./pages/Placement/Placement.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const TeamAdmin = lazy(() => import("./pages/Team/Admin/TeamAdmin.jsx"));
const PlacementPage = lazy(() => import("./pages/Placement/PlacementPage.jsx"));
const ContactPage = lazy(() => import("./pages/Contact.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const PublicEvents = lazy(() => import("./pages/Events/Events.jsx"));
const LegacyAdminPage = lazy(() => import("./pages/LegacyAdminPage.jsx"));
const LegacyPage = lazy(() => import("./pages/LegacyPage.jsx"));
const DiscussPage = lazy(() => import("./pages/Discuss/DiscussPage.jsx"));
const DiscussAdminPage = lazy(() => import("./pages/Discuss/DiscussAdminPage.jsx"));
const GuidePage = lazy(() => import("./pages/Guide/GuidePage.jsx"));
const AdminGuide = lazy(() => import("./pages/Guide/AdminGuide.jsx"));

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
      {!isAdminPage && <InAppNotifications />}
      <ScrollToTop />

      <Suspense fallback={<Loader />}>
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
      </Suspense>

      {!isAdminPage && <Footer />}
    </>
  );
}

export default App;
