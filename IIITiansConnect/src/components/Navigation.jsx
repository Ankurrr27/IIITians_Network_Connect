import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoBlue from "/IIITians-Network-Logo-Blue.png";
import logoLight from "/IIITians-Network-Logo-Light.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Colleges", href: "/colleges" },
    { name: "JEE Counselling", href: "/jeecounselling" },
    { name: "IIIT Placements", href: "/placement" },
    { name: "Our Team", href: "/team" },
    { name: "Contact", href: "/contact" },
  ];

  /* 🔒 Close menu on route change */
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  /* 🧠 Disable scroll when sidebar open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  /* Scroll logic */
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("hero");
      if (!hero) return setIsScrolled(window.scrollY > 10);
      setIsScrolled(hero.getBoundingClientRect().bottom <= 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);

    if (href.startsWith("#")) {
      if (location.pathname !== "/") {
        navigate("/");
        return;
      }
      const el = document.getElementById(href.slice(1));
      if (el) {
        window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md border-b shadow py-2"
            : "bg-indigo-600 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="/" className="flex items-center gap-3">
            <img
              src={isScrolled ? logoBlue : logoLight}
              className="w-14 h-auto"
            />
            <span
              className={`hidden sm:inline font-semibold ${
                isScrolled ? "text-indigo-600" : "text-white"
              }`}
            >
              IIITians Network
            </span>
          </a>

          {/* Desktop */}
          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-sm font-medium ${
                  isScrolled ? "text-indigo-600" : "text-white"
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden"
          >
            <Menu
              className={`w-6 h-6 ${
                isScrolled ? "text-indigo-600" : "text-white"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-42 bg-white z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <span className="font-semibold text-indigo-600">Menu</span>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col p-4 gap-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="px-4 py-3 rounded-lg text-indigo-600 font-medium hover:bg-indigo-50"
            >
              {item.name}
            </a>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Navigation;
