import { useNavigate } from "react-router-dom";
import Index1 from "./Sections/First-Home-index1";
import Index2 from "./Sections/About-Links-index2.0";
import Index2_2 from "./Sections/Events-index3";
import Index3 from "./Sections/Presi-VP-Leads-index4";
import Index4 from "./Sections/Jossa-Csab-index5";

const Index = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO */}
      <Index1 />

      {/* CONTENT SECTIONS */}
      <Index2 />
      <Index2_2 />

      {/* TEAM PREVIEW */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex items-center justify-between ">
            <h1 className="pl-8 text-3xl md:text-4xl font-extrabold">
              Our Team
            </h1>

            <button
              onClick={() => navigate("/team")}
              className="
                text-indigo-600 text-sm font-semibold
                hover:underline underline-offset-4 pr-8
              "
            >
              Full team →
            </button>
          </div>

          {/* reuse Index3 cleanly */}
          <Index3 showViewMore={false} />
        </div>
      </section>

      {/* FOOTER / FINAL SECTION */}
      <Index4 />
    </>
  );
};

export default Index;
