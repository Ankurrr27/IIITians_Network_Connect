import { useNavigate } from "react-router-dom";
import Index1 from "./Sections/First-Home-index1";
import Index2 from "./Sections/About-Links-index2.0";
import Index2_2 from "./Sections/Events-index3";
import Index3 from "./Sections/Founder";
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

      {/* FOUNDER PREVIEW */}

      {/* reuse Index3 cleanly */}
      <Index3 showViewMore={false} />

      {/* FOOTER / FINAL SECTION */}
      <Index4 />
    </>
  );
};

export default Index;
