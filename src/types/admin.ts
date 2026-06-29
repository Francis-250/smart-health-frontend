export type TipCategory =
  | "Burns"
  | "Choking"
  | "CPR"
  | "Bleeding"
  | "Fractures"
  | "Neurological"
  | "Poisoning"
  | "Allergies"
  | "Other";

export type SeverityLevel = "Low" | "Medium" | "High" | "Critical";

export interface FirstAidTip {
  id: string;
  title: string;
  author: string;
  category: TipCategory;
  severity: SeverityLevel;
  description: string;
  symptoms: string;
  procedure: string;
  warnings: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Patient" | "Reviewer" | "Admin";
  status: "Active" | "Suspended";
  joinedAt: string;
}

export interface Reviewer {
  id: string;
  name: string;
  email: string;
  specialty: string;
  tipsReviewed: number;
  status: "Active" | "Pending";
}

export interface Hospital {
  address?: string;
  id: string;
  isEmergency?: boolean;
  latitude?: number;
  longitude?: number;
  name: string;
  location: string;
  contact: string;
  phoneNumber?: string;
  status: "Active" | "Inactive";
}
