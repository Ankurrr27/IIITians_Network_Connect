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
  const normalizedRole = role.toLowerCase().trim().replace(/\s+/g, " ");

  const matchedItem = [...priorityList]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => b.item.length - a.item.length)
    .find(({ item }) => {
      const normalizedItem = item.toLowerCase().trim();
      const escapedItem = normalizedItem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${escapedItem}\\b`, "i").test(normalizedRole);
    });

  if (!matchedItem) {
    return priorityList.length;
  }

  const index = priorityList.findIndex((item) => {
    const normalizedItem = item.toLowerCase().trim();
    const escapedItem = normalizedItem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return (
      new RegExp(`\\b${escapedItem}\\b`, "i").test(normalizedRole) &&
      normalizedItem === matchedItem.item.toLowerCase().trim()
    );
  });

  return index === -1 ? priorityList.length : index;
}

function compareMembers(a, b, priorityList = [], options = {}) {
  const { priorityFirst = false } = options;
  const orderA = Number.isFinite(Number(a.order)) ? Number(a.order) : null;
  const orderB = Number.isFinite(Number(b.order)) ? Number(b.order) : null;
  const priorityA = getPriorityIndex(a.role, priorityList);
  const priorityB = getPriorityIndex(b.role, priorityList);

  if (priorityFirst && priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  if (orderA !== null && orderB !== null && orderA !== orderB) {
    return orderA - orderB;
  }

  if (orderA !== null && orderB === null) return -1;
  if (orderA === null && orderB !== null) return 1;

  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  return (a.name || "").localeCompare(b.name || "");
}

export default function TeamGrid({ members = [] }) {
  const execs = members
    .filter((member) => member.roleType === "EXEC")
    .sort((a, b) => compareMembers(a, b, execPriority, { priorityFirst: true }));

  const leads = members
    .filter((member) => member.roleType === "LEAD")
    .sort((a, b) => compareMembers(a, b, leadPriority));

  const team = members
    .filter((member) => member.roleType === "MEMBER")
    .sort((a, b) => compareMembers(a, b));

  const leadGridClass =
    leads.length === 3
      ? "mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 xl:grid-cols-3"
      : "mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 xl:grid-cols-4";

  if (!members.length) {
    return (
      <div className="py-20 text-center text-slate-500">No team members found.</div>
    );
  }

  return (
    <div className="space-y-12 sm:space-y-14">
      {execs.length > 0 && (
        <section>
          <div className="mb-5 text-center sm:mb-6">
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Executive Team
            </h2>
          </div>
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
            {execs.map((member) => (
              <ExecCard key={member._id} member={member} />
            ))}
          </div>
        </section>
      )}

      {leads.length > 0 && (
        <section>
          <div className="mb-5 text-center sm:mb-6">
           
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Lead Team
            </h2>
          </div>
          <div className={leadGridClass}>
            {leads.map((member) => (
              <LeadCard key={member._id} member={member} />
            ))}
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section>
          <div className="mb-5 text-center sm:mb-6">
       
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Members
            </h2>
          </div>
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
            {team.map((member) => (
              <MemberCard key={member._id} member={member} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
