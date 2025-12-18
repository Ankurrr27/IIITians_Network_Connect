import BlobWithLogo from "../ui/BlobWithLogo";
import TopWaves from "../ui/TopWaves";
import { useNavigate } from "react-router-dom";

const Index1 = () => {
  const navigate = useNavigate(); // ✅ MUST be inside component

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-indigo-100 via-indigo-50 to-white flex items-center justify-center overflow-hidden pt-36">
      <TopWaves />

      <div className="relative z-10 max-w-6xl w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        {/* LEFT */}
        <div className="flex justify-center md:justify-start md:-ml-15">
          <div className="animate-float">
            <BlobWithLogo />
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
            Empowering{" "}
            <span className="bg-clip-text">Connections</span>
            <br />
            <span className="text-indigo-600">Across IIITs</span>
          </h2>

          <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto md:mx-0">
            IIITians Network is an autonomous student-led community connecting
            all IIITs across India. We aim to exchange information, boost
            outreach, and connect students with alumni while promoting the brand
            <span className="font-semibold"> “IIITians”</span>.
          </p>

          <div className="mt-8 flex justify-center md:justify-start gap-5">
            {/* EXPLORE */}
            <button
              onClick={() => navigate("/events")}
              className="
                px-6 py-3 rounded-lg
                bg-indigo-600 text-white text-lg font-semibold
                hover:bg-indigo-700 transition
              "
            >
              Explore
            </button>

            {/* COLLEGES */}
            <button
              onClick={() => navigate("/colleges")}
              className="
                px-6 py-3 rounded-lg
                border border-indigo-600 text-indigo-600 text-lg font-semibold
                hover:bg-indigo-50 transition
              "
            >
              Colleges
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index1;
