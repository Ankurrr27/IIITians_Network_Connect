import ExecCard from "./Cards/ExecCard";
import LeadCard from "./Cards/LeadCard";
import MemberCard from "./Cards/MemberCard";

const execPriority = [
  "president",
  "vice president",
  "general secretary",
  "secretary",
  "treasurer",
  "director",
];

const leadPriority = [
  "head",
  "lead",
  "co-lead",
  "coordinator",
  "manager",
];

function getPriorityIndex(role = "", priorityList = []) {
  const normalizedRole = role.toLowerCase();
  const index = priorityList.findIndex((item) => normalizedRole.includes(item));
  return index === -1 ? priorityList.length : index;
}

function compareMembers(a, b, priorityList = []) {
  const orderA = Number.isFinite(Number(a.order)) ? Number(a.order) : null;
  const orderB = Number.isFinite(Number(b.order)) ? Number(b.order) : null;

  if (orderA !== null && orderB !== null && orderA !== orderB) {
    return orderA - orderB;
  }

  if (orderA !== null && orderB === null) return -1;
  if (orderA === null && orderB !== null) return 1;

  const priorityA = getPriorityIndex(a.role, priorityList);
  const priorityB = getPriorityIndex(b.role, priorityList);

  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  return (a.name || "").localeCompare(b.name || "");
}

export default function TeamGrid({ members = [] }) {
  const execs = members
    .filter((member) => member.roleType === "EXEC")
    .sort((a, b) => compareMembers(a, b, execPriority));

  const leads = members
    .filter((member) => member.roleType === "LEAD")
    .sort((a, b) => compareMembers(a, b, leadPriority));

  const team = members
    .filter((member) => member.roleType === "MEMBER")
    .sort((a, b) => compareMembers(a, b));

  const featuredExecutive =
    execs.find((member) => member.role?.toLowerCase().includes("president")) ||
    execs[0] ||
    null;
  const remainingExecs = featuredExecutive
    ? execs.filter((member) => member._id !== featuredExecutive._id)
    : execs;

  if (!members.length) {
    return (
      <div className="py-20 text-center text-slate-500">No team members found.</div>
    );
  }

  return (
    <div className="space-y-14">
      {featuredExecutive && (
        <section>
          <div className="mb-5 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
              Leadership Hierarchy
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              President
            </h2>
          </div>

          <div className="mx-auto max-w-4xl">
            <ExecCard member={featuredExecutive} />
          </div>
        </section>
      )}

      {remainingExecs.length > 0 && (
        <section>
          <div className="mb-5 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
              Executive Order
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Executive Team
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
            {remainingExecs.map((member) => (
              <ExecCard key={member._id} member={member} />
            ))}
          </div>
        </section>
      )}

      {leads.length > 0 && (
        <section>
          <div className="mb-5 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
              Functional Hierarchy
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
