import BlobWithLogo from "../../../ui/BlobWithLogo";
import TopWaves from "../../../ui/TopWaves";
import { useNavigate } from "react-router-dom";
import TopWavesMobile from "../../../ui/TopWavesMobile";

const Index1 = () => {
  const navigate = useNavigate();

  return (
    <section
      className="
        relative flex min-h-screen items-center justify-center overflow-hidden
        bg-gradient-to-b from-indigo-100 via-indigo-50 to-white
        pt-24 sm:pt-36
      "
    >
      <div className="block md:hidden">
        <TopWavesMobile />
      </div>

      <div className="hidden md:block">
        <TopWaves />
      </div>

      <div
        className="
          relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-8
          px-4 sm:px-6 md:grid-cols-2 md:gap-20
        "
      >
        <div className="flex justify-center md:justify-start md:-ml-15">
          <div className="animate-float scale-90 sm:scale-100">
            <BlobWithLogo />
          </div>
        </div>

        <div className="text-left">
          <h2
            className="
              text-3xl font-extrabold leading-tight tracking-tight text-slate-900
              sm:text-4xl md:text-5xl
            "
          >
            Empowering{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              Connections
            </span>
            <br />
            <span className="block text-indigo-600">Across IIITs</span>
          </h2>

          <p
            className="
              mt-3 max-w-lg text-sm leading-relaxed text-slate-600
              sm:mt-6 sm:text-lg md:text-xl
            "
          >
            IIITians Network is an autonomous student-led community connecting
            all IIITs across India. We aim to exchange information, boost
            outreach, and connect students with alumni while promoting the brand
            <span className="font-semibold"> "IIITians"</span>.
          </p>

          <div className="mt-4 flex flex-wrap gap-3 sm:mt-8 sm:gap-5">
            <button
              onClick={() => navigate("/events")}
              className="
                rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white
                transition hover:bg-indigo-700 sm:px-6 sm:py-3 sm:text-lg
              "
            >
              Explore
            </button>

            <button
              onClick={() => navigate("/colleges")}
              className="
                rounded-xl border border-indigo-600 px-5 py-2.5 text-sm font-semibold text-indigo-600
                transition hover:bg-indigo-50 sm:px-6 sm:py-3 sm:text-lg
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
