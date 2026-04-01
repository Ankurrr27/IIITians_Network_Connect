import ExecCard from "./Cards/ExecCard";
import LeadCard from "./Cards/LeadCard";
import MemberCard from "./Cards/MemberCard";

export default function TeamGrid({ members = [] }) {
  const execs = members
    .filter((member) => member.roleType === "EXEC")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const leads = members
    .filter((member) => member.roleType === "LEAD")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const team = members
    .filter((member) => member.roleType === "MEMBER")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (!members.length) {
    return <div className="py-20 text-center text-slate-500">No team members found.</div>;
  }

  return (
    <div className="space-y-14">
      {execs.length > 0 && (
        <section>
          <div className="mb-5 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
              Leadership
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Executive Team
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
            {execs.map((member) => (
              <ExecCard key={member._id} member={member} />
            ))}
          </div>
        </section>
      )}

      {leads.length > 0 && (
        <section>
          <div className="mb-5 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
              Coordination
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Team Leads
            </h2>
          </div>
          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 md:grid-cols-3">
            {leads.map((member) => (
              <LeadCard key={member._id} member={member} />
            ))}
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section>
          <div className="mb-5 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
              Core Team
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Members
            </h2>
          </div>
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {team.map((member) => (
              <MemberCard key={member._id} member={member} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
