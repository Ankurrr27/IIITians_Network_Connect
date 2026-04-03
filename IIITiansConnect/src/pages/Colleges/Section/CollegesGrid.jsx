import CollegeCard from "./CollegeCard";

export default function CollegesGrid({ colleges, teamMembers = [], discussClubs = [] }) {
  const getUniqueCollegeTeamCount = (collegeName) => {
    const uniqueMembers = new Set();

    teamMembers.forEach((member) => {
      const sameCollege =
        (member.iiit || "").trim().toLowerCase() ===
        (collegeName || "").trim().toLowerCase();

      if (!sameCollege) return;

      const uniqueKey =
        (member.email || "").trim().toLowerCase() ||
        `${(member.name || "").trim().toLowerCase()}::${(member.iiit || "")
          .trim()
          .toLowerCase()}`;

      if (uniqueKey) {
        uniqueMembers.add(uniqueKey);
      }
    });

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
          teamCount={getUniqueCollegeTeamCount(college.name)}
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
