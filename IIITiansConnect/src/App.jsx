import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import TeamPage from "./pages/Team/TeamPage";

import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

import Index from "./pages/Index/index.jsx";
import Colleges from "./pages/Colleges/Colleges.jsx";
import Users from "./pages/Users";
import Events from "./pages/Events/Events.jsx";

import Placement from "./pages/Placement/Placement.jsx";
import NotFound from "./pages/NotFound.jsx";
import TeamAdmin from "./pages/Team/Admin/TeamAdmin.jsx";
import PlacementPage from "./pages/Placement/PlacementPage.jsx";

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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
      <Navigation />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/users" element={<Users />} />
          <Route path="/events" element={<Events />} />
          
          <Route path="/placement" element={<Placement />} />
          <Route path="/placement/admin" element={<PlacementPage />} />

          <Route path="*" element={<NotFound />} />
          <Route path="/team/admin" element={<TeamAdmin />} />

          <Route path="/team" element={<TeamPage />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default App;
