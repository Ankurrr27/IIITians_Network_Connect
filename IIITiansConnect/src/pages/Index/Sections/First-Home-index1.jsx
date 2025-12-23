import BlobWithLogo from "../../../ui/BlobWithLogo";
import TopWaves from "../../../ui/TopWaves";
import { useNavigate } from "react-router-dom";
import TopWavesMobile from "../../../ui/TopWavesMobile";

const Index1 = () => {
  const navigate = useNavigate();

  return (
    <section
      className="
    relative min-h-screen
    bg-gradient-to-b from-indigo-100 via-indigo-50 to-white
    flex items-center justify-center
    overflow-hidden
    pt-24 sm:pt-36
  "
    >
      {/* WAVES */}
      <div className="block md:hidden">
        <TopWavesMobile />
      </div>

      <div className="hidden md:block">
        <TopWaves />
      </div>

      <div
        className="
      relative z-10
      max-w-6xl w-full
      px-4 sm:px-6
      grid grid-cols-1 md:grid-cols-2
      gap-0 md:gap-20
      items-center
    "
      >
        {/* LEFT */}
        <div className="flex justify-center md:justify-start md:-ml-15">
          <div className="animate-float scale-90 sm:scale-100">
            <BlobWithLogo />
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-center md:text-left">
          <h2
            className="
      text-2xl sm:text-3xl md:text-5xl
      font-extrabold
      leading-tight
      tracking-tight text-left 
      text-slate-900
    "
          >
            Empowering{" "}
            <span
              className="
        bg-gradient-to-r from-indigo-600 to-indigo-400
        bg-clip-text text-transparent
      "
            >
              Connections
            </span>
            <br />
            <span className=" text-left  block text-indigo-600">
              Across IIITs
            </span>
          </h2>

          <p
            className="
    mt-2 sm:mt-6
    text-sm sm:text-lg
    md:text-xl
    text-slate-600
    leading-relaxed
    max-w-lg
    px-1 sm:px-0
    text-left sm:text-center md:text-left
    mx-0 sm:mx-auto md:mx-0
  "
          >
            IIITians Network is an autonomous student-led community connecting
            all IIITs across India. We aim to exchange information, boost
            outreach, and connect students with alumni while promoting the brand
            <span className="font-semibold"> “IIITians”</span>.
          </p>

          <div
            className="
              mt-3 sm:mt-8
              flex justify-start md:justify-start
              gap-4 sm:gap-5 
            "
          >
            {/* EXPLORE */}
            <button
              onClick={() => navigate("/events")}
              className="
                px-5 py-2
                sm:px-6 sm:py-3
                rounded-lg
                bg-indigo-600 text-white
                text-sm sm:text-lg
                font-semibold 
                hover:bg-indigo-700 transition
              "
            >
              Explore
            </button>

            {/* COLLEGES */}
            <button
              onClick={() => navigate("/colleges")}
              className="
                px-5 py-2
                sm:px-6 sm:py-3
                rounded-lg
                border border-indigo-600
                text-indigo-600
                text-base sm:text-lg
                font-semibold
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
