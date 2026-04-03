import {
  BriefcaseBusiness,
  CalendarDays,
  Handshake,
  Megaphone,
  Sparkles,
} from "lucide-react";

export const initialPostForm = {
  title: "",
  description: "",
  type: "announcement",
  actionLink: "",
  eventDate: "",
};

export const initialRegisterForm = {
  collegeName: "",
  clubName: "",
  contactName: "",
  contactPhone: "",
  handle: "",
  password: "",
};

export const initialLoginForm = {
  handle: "",
  password: "",
};

export const typeMeta = {
  announcement: { label: "Announcement", Icon: Megaphone },
  event: { label: "Push as event", Icon: CalendarDays },
  campaign: { label: "Campaign", Icon: Sparkles },
  collaboration: { label: "Collaboration", Icon: Handshake },
  opportunity: { label: "Opportunity", Icon: BriefcaseBusiness },
};
