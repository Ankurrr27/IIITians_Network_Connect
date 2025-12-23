import ExecCard from "./Cards/ExecCard";
import LeadCard from "./Cards/LeadCard";
import MemberCard from "./Cards/MemberCard";

export default function TeamGrid({ members = [] }) {
  const execs = members
    .filter((m) => m.roleType === "EXEC")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const leads = members
    .filter((m) => m.roleType === "LEAD")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const team = members
    .filter((m) => m.roleType === "MEMBER")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (!members.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        No team members found.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* EXEC */}
      {execs.length > 0 && (
        <section>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {execs.map((m) => (
              <ExecCard key={m._id} member={m} />
            ))}
          </div>
        </section>
      )}

      {/* LEADS */}
      {leads.length > 0 && (
        <section>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {leads.map((m) => (
              <LeadCard key={m._id} member={m} />
            ))}
          </div>
        </section>
      )}

      {/* MEMBERS */}
      {team.length > 0 && (
        <section>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 max-w-7xl mx-auto">
            {team.map((m) => (
              <MemberCard key={m._id} member={m} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
