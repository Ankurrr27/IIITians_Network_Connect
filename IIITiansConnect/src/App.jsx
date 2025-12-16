import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Colleges from "./pages/Colleges";
import Users from "./pages/Users";
import Clubs from "./pages/Clubs";
import Events from "./pages/Events";
import Navigation from "./components/Navigation";
import Index from "./pages";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // intro duration (1.2s feels right)

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading ? (
        <Loader key="loader" />
      ) : (
        <div key="app">
          <Navigation />
          <Index />
          <Footer />
        </div>
      )}
    </AnimatePresence>
  );
}

export default App;
