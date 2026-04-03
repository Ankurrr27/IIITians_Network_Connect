import Alumni from "../models/alumni.model.js";
import TeamMember from "../models/teamMember.model.js";

function normalizeYearValue(value = "") {
  return String(value).trim().replace(/\s+/g, " ");
}

function compareTenureYears(a = "", b = "") {
  return normalizeYearValue(b).localeCompare(normalizeYearValue(a), undefined, {
    numeric: true,
  });
}

function buildRoleHistory(members = []) {
  const uniqueEntries = new Map();

  [...members]
    .sort((a, b) => compareTenureYears(a.year, b.year))
    .forEach((member) => {
      const entry = {
        role: member.role || "",
        team: member.team || "",
        year: normalizeYearValue(member.year),
      };

      const key = `${entry.year}::${entry.team}::${entry.role}`;
      if (!uniqueEntries.has(key)) {
        uniqueEntries.set(key, entry);
      }
    });

  return Array.from(uniqueEntries.values());
}

function getLatestTeamMember(members = []) {
  return [...members].sort((a, b) => {
    const yearDiff = compareTenureYears(a.year, b.year);
    if (yearDiff !== 0) {
      return yearDiff;
    }

    const orderA = Number.isFinite(Number(a.order))
      ? Number(a.order)
      : Number.MAX_SAFE_INTEGER;
    const orderB = Number.isFinite(Number(b.order))
      ? Number(b.order)
      : Number.MAX_SAFE_INTEGER;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return (a.name || "").localeCompare(b.name || "");
  })[0];
}

function getYearNumber(value = "") {
  const match = String(value).match(/\d{4}/);
  return match ? Number(match[0]) : new Date().getFullYear();
}

async function syncLegacyByEmail(email) {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) return null;

  const teamMembers = await TeamMember.find({ email: normalizedEmail });
  if (!teamMembers.length) return null;

  const latestMember = getLatestTeamMember(teamMembers);
  const roleHistory = buildRoleHistory(teamMembers);

  const payload = {
    name: latestMember.name,
    email: normalizedEmail,
    iiit: latestMember.iiit,
    graduationYear: getYearNumber(latestMember.year),
    generation: normalizeYearValue(latestMember.year),
    branch: latestMember.team || "IIITians Network",
    networkPost: latestMember.role || "",
    currentRole: latestMember.role || "",
    currentCompany: "",
    location: latestMember.iiit || "",
    linkedin: latestMember.linkedin || "",
    instagram: latestMember.instagram || "",
    twitter: latestMember.twitter || "",
    bio: `${latestMember.name} is part of the IIITians Network team and has contributed across leadership roles in the network.`,
    status: "approved",
    reviewedAt: new Date(),
    legacyType: "team_member",
    sourceTeamMemberId: latestMember._id,
    roleHistory,
  };

  const existing = await Alumni.findOne({
    $or: [
      { email: normalizedEmail },
      { sourceTeamMemberId: latestMember._id },
    ],
  });

  if (!existing) {
    return Alumni.create(payload);
  }

  Object.assign(existing, payload);
  await existing.save();
  return existing;
}

export async function syncTeamMemberToLegacy(member) {
  if (!member?.email) return null;
  return syncLegacyByEmail(member.email);
}

export async function syncAllTeamMembersToLegacy() {
  const emails = await TeamMember.distinct("email", { email: { $exists: true, $ne: "" } });
  for (const email of emails) {
    await syncLegacyByEmail(email);
  }
}
