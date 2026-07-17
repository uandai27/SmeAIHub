import {
  BarChart3,
  Bot,
  CalendarCheck,
  Database,
  Megaphone,
  Users,
} from "lucide-react";

export const platformCapabilities = [
  {
    title: "AI Reception",
    description:
      "Respond to customer questions instantly across every channel.",
    icon: Bot,
  },
  {
    title: "Smart Booking",
    description:
      "Manage reservations and appointments without manual back-and-forth.",
    icon: CalendarCheck,
  },
  {
    title: "Customer CRM",
    description:
      "Build richer customer profiles from every interaction.",
    icon: Users,
  },
  {
    title: "Marketing Automation",
    description:
      "Launch timely campaigns based on real customer behavior.",
    icon: Megaphone,
  },
  {
    title: "Business Analytics",
    description:
      "Turn daily activity into clear and actionable business insights.",
    icon: BarChart3,
  },
  {
    title: "Knowledge Base",
    description:
      "Train your AI with your services, policies, and business knowledge.",
    icon: Database,
  },
] as const;