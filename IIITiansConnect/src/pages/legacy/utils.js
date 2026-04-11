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

export const getLegacyStats = (entries) => [
  { label: "Legacy profiles", value: entries.length, icon: Users },
  {
    label: "Network posts",
    value: new Set(entries.map((entry) => entry.networkPost).filter(Boolean)).size,
    icon: ShieldCheck,
  },
  {
    label: "Companies listed",
    value: new Set(entries.map(getEntryCompanyValue).filter(Boolean)).size,
    icon: Building2,
  },
  {
    label: "Batches visible",
    value: new Set(entries.map((entry) => entry.generation).filter(Boolean)).size,
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
  };
};
