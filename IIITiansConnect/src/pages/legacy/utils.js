import { Building2, GraduationCap, ShieldCheck, Users } from "lucide-react";

export const normalizeText = (value = "") => value.trim().toLowerCase();

export const normalizeCollegeName = (name) => {
  let normalized = (name || "").trim().toLowerCase();
  if (
    normalized.includes("sricity") ||
    normalized.includes("sri city") ||
    normalized === "chittoor" ||
    (normalized.includes("iiit") && normalized.includes("chittoor"))
  ) {
    return "iiit sricity_chittoor_canonical";
  }
  return normalized;
};

export const getEntryCompanyValue = (entry) =>
  entry.currentCompany || entry.company || entry.organisation || "";

export const getEntryLocationValue = (entry) =>
  entry.location || entry.currentLocation || entry.city || "";

const dedupeRoleHistory = (roleHistory = []) =>
  roleHistory.filter((item, index, list) => {
    const signature = `${normalizeText(item.year || "")}|${normalizeText(
      item.team || ""
    )}|${normalizeText(item.role || "")}`;

    return (
      index ===
      list.findIndex((candidate) => {
        const candidateSignature = `${normalizeText(
          candidate.year || ""
        )}|${normalizeText(candidate.team || "")}|${normalizeText(
          candidate.role || ""
        )}`;
        return candidateSignature === signature;
      })
    );
  });

export const getLegacyStats = (statsData) => [
  { label: "Legacy profiles", value: statsData.totalProfiles || 0, icon: Users },
  {
    label: "Network posts",
    value: statsData.networkPosts || 0,
    icon: ShieldCheck,
  },
  {
    label: "Companies listed",
    value: statsData.companies || 0,
    icon: Building2,
  },
  {
    label: "Batches visible",
    value: statsData.batches || 0,
    icon: GraduationCap,
  },
];

export const getLegacyEntryViewModel = (entry) => {
  const companyValue = getEntryCompanyValue(entry);
  const locationValue = getEntryLocationValue(entry);
  const normalizedNetworkPost = normalizeText(entry.networkPost);
  const normalizedCurrentRole = normalizeText(entry.currentRole);
  const normalizedCurrentCompany = normalizeText(companyValue);
  const normalizedIiit = normalizeText(entry.iiit);
  const normalizedLocation = normalizeText(locationValue);

  return {
    companyValue,
    locationValue,
    showRoleChip:
      !!entry.currentRole && normalizedCurrentRole !== normalizedNetworkPost,
    showCompanyChip:
      !!companyValue && normalizedCurrentCompany !== normalizedIiit,
    showLocationChip:
      !!locationValue &&
      normalizedLocation !== normalizedIiit &&
      normalizedLocation !== normalizedCurrentCompany,
    dedupedRoleHistory: dedupeRoleHistory(entry.roleHistory || []),
    totalTerms: (entry.roleHistory || []).filter((h, i, a) => 
      a.findIndex(x => x.year === h.year && x.team === h.team && x.role === h.role) === i
    ).length,
  };
};
