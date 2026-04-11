export const initialForm = {
  name: "",
  email: "",
  iiit: "",
  graduationYear: "",
  generation: "",
  branch: "",
  networkPost: "",
  currentRole: "",
  currentCompany: "",
  location: "",
  linkedin: "",
  instagram: "",
  bio: "",
};

export const cardShell = {
  light:
    "border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]",
  dark:
    "border-slate-800 bg-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.26)]",
};

export const legacyFormFields = [
  ["name", "Full name", "e.g. Ankur Singh", "text", true, ""],
  ["email", "Email address", "e.g. ankur@email.com", "email", true, ""],
  ["generation", "Team term or batch", "e.g. 2024-28 or 2021-25", "text", true, ""],
  ["graduationYear", "Graduation year", "e.g. 2028", "number", true, ""],
  ["branch", "Branch", "e.g. CSE", "text", true, ""],
  ["networkPost", "Latest network post", "e.g. Vice President", "text", false, ""],
  ["currentRole", "Current role / designation", "e.g. Product Designer Intern", "text", false, ""],
  ["currentCompany", "Current company / organization", "e.g. Adobe / Freelance", "text", false, ""],
  ["location", "Current location", "e.g. Bengaluru, India", "text", false, ""],
  ["linkedin", "LinkedIn profile URL", "e.g. https://linkedin.com/in/ankur-singh", "text", false, "sm:col-span-2"],
  ["instagram", "Instagram profile URL", "e.g. https://instagram.com/ankurwrites", "text", false, "sm:col-span-2"],
];
