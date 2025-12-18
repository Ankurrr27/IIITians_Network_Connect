import React from "react";
import { useNavigate } from "react-router-dom";
import BigTeamCard from "../ui/BigTeamCard";
import SmallTeamCard from "../ui/SmallTeamCard";

const Index3 = ({ showViewMore = false }) => {
  const navigate = useNavigate();

  return (
    <section className="pt-10 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* TITLE */}
        

        {/* PRESIDENT + VP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
          <BigTeamCard
            name="Srishti Singh"
            role="President"
            college="IIIT-Kota"
            image="/Srishti_image.png"
            desc="Leads the IIITians Network by driving strategy, partnerships, and coordination across all IIITs while ensuring long-term sustainability of initiatives."
            links={{
              linkedin: "https://linkedin.com/in/username",
              instagram: "https://instagram.com/username",
              // twitter: "https://twitter.com/username",
              // website: "https://iiitians.network",
              // github: "https://github.com/lokesh",
            }}
          />

          <BigTeamCard
            name="Lokesh"
            role="Vice President"
            college="IIIT-Kalyani"
            image="/lokesh.png"
            desc="Oversees internal operations and coordination across IIITs, ensuring smooth execution of initiatives and effective communication between teams."
            links={{
              linkedin: "https://linkedin.com/in/lokesh",
              instagram: "https://instagram.com/lokesh",
              // twitter: "https://twitter.com/lokesh",
              // github: "https://github.com/lokesh",
            }}
          />
        </div>

        {/* LEADS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SmallTeamCard
            name="Ankur Singh"
            role="Social Media Lead"
            college="IIIT-Kota"
            image="/team/ankur.jpg"
            desc="Manages social media strategy, content planning, and outreach."
            links={{
              linkedin: "https://linkedin.com/in/ankur",
              instagram: "https://instagram.com/ankur",
              // twitter: "https://twitter.com/ankur",
              // github: "https://github.com/rahul",
            }}
          />

          <SmallTeamCard
            name="Mahak Gupta"
            role="Content Team Lead"
            college="IIIT-Kota"
            image="/team/mahak.jpeg"
            desc="Researches topics, prepares articles, and ensures content quality."
            links={{
              linkedin: "https://linkedin.com/in/ankur",
              instagram: "https://instagram.com/ankur",
              // twitter: "https://twitter.com/ankur",
              // github: "https://github.com/rahul",
            }}
          />

          <SmallTeamCard
            name="Sankalp Joshi"
            role="Design Team Lead"
            college="IIIT-Allahabad"
            image="/team/sankalp.png"
            desc="Handles branding, visual identity, and UI consistency."
            links={{
              linkedin: "https://linkedin.com/in/ankur",
              instagram: "https://instagram.com/ankur",
              // twitter: "https://twitter.com/ankur",
              // github: "https://github.com/rahul",
            }}
          />
        </div>

        {/* VIEW MORE (HOME ONLY) */}
        {showViewMore && (
          <div className="flex justify-end mt-8">
            <button
              onClick={() => navigate("/team")}
              className="
                text-indigo-600 text-sm font-semibold
                hover:underline underline-offset-4
              "
            >
              See more →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Index3;
