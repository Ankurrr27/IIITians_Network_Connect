import CollegeCard from "./CollegeCard";

export default function CollegesGrid({ colleges, teamMembers = [], legacyMembers = [], discussClubs = [] }) {
  const getUniqueCollegeMemberCount = (collegeName) => {
    const uniqueMembers = new Set();

    const normalize = (name) => {
      let n = (name || "").trim().toLowerCase();
      // Group synonyms for Sri City / Chittoor
      if (n.includes("sricity") || n.includes("sri city") || n === "chittoor" || (n.includes("iiit") && n.includes("chittoor"))) {
        return "iiit sricity_chittoor_canonical";
      }
      return n;
    };

    const targetCollege = normalize(collegeName);

    const addMemberToSet = (member) => {
      const memberCollege = normalize(member.iiit);
      if (memberCollege !== targetCollege) return;

      const uniqueKey = (member.email || "").trim().toLowerCase() ||
                        `${(member.name || "").trim().toLowerCase()}::${memberCollege}`;
      if (uniqueKey) uniqueMembers.add(uniqueKey);
    };

    teamMembers.forEach(addMemberToSet);
    legacyMembers.forEach(addMemberToSet);

    return uniqueMembers.size;
  };

  if (colleges.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No colleges found.
      </p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {colleges.map((college) => (
        <CollegeCard
          key={college._id}
          college={college}
          teamCount={getUniqueCollegeMemberCount(college.name)}
          discussClubs={discussClubs.filter(
            (club) =>
              (club.collegeName || "").trim().toLowerCase() ===
              (college.name || "").trim().toLowerCase()
          )}
        />
      ))}
    </div>
  );
}
