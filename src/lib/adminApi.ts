import { api } from "./api";
import type { AdminUser, FirstAidTip, Hospital, Reviewer, SeverityLevel } from "../types/admin";

export type BackendUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  role: "PATIENT" | "REVIEWER" | "ADMIN";
  createdAt: string;
};

export type DashboardStats = {
  activeSos: number;
  assessments: number;
  conversations: number;
  emergencyAssessments: number;
  patients: number;
  reviewers: number;
  users: number;
};

export type BackendHospital = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber?: string | null;
  email?: string | null;
  isEmergency: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BackendFirstAidTip = {
  id: string;
  title: string;
  category: string;
  description: string;
  steps: string[];
  emergencyLevel: "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
  warnings: string[];
  imageUrl?: string | null;
  videoUrl?: string | null;
  isOfflineReady: boolean;
  createdAt: string;
  updatedAt: string;
};

export function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function userName(user: BackendUser) {
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
}

function mapRole(role: BackendUser["role"]): AdminUser["role"] {
  if (role === "ADMIN") return "Admin";
  if (role === "REVIEWER") return "Reviewer";
  return "Patient";
}

function mapSeverity(level: BackendFirstAidTip["emergencyLevel"]): SeverityLevel {
  if (level === "EMERGENCY") return "Critical";
  if (level === "HIGH") return "High";
  if (level === "MEDIUM") return "Medium";
  return "Low";
}

export function mapUser(user: BackendUser): AdminUser {
  return {
    id: user.id,
    email: user.email,
    joinedAt: formatDate(user.createdAt),
    name: userName(user),
    role: mapRole(user.role),
    status: "Active",
  };
}

export function mapReviewer(user: BackendUser): Reviewer {
  return {
    id: user.id,
    email: user.email,
    name: userName(user),
    specialty: "Clinical review",
    status: "Active",
    tipsReviewed: 0,
  };
}

export function mapHospital(hospital: BackendHospital): Hospital {
  return {
    id: hospital.id,
    contact: hospital.phoneNumber ?? hospital.email ?? "Not provided",
    location: hospital.address,
    name: hospital.name,
    status: hospital.isEmergency ? "Active" : "Inactive",
  };
}

export function mapFirstAidTip(tip: BackendFirstAidTip): FirstAidTip {
  return {
    id: tip.id,
    author: "Smart Health clinical team",
    category: tip.category as FirstAidTip["category"],
    description: tip.description,
    procedure: tip.steps.join("\n"),
    severity: mapSeverity(tip.emergencyLevel),
    symptoms: "",
    title: tip.title,
    updatedAt: formatDate(tip.updatedAt),
    warnings: tip.warnings.join("\n"),
  };
}

export async function getDashboardStats() {
  const { data } = await api.get<DashboardStats>("/admin/dashboard");
  return data;
}

export async function getUsers() {
  const { data } = await api.get<{
    data: BackendUser[];
    limit: number;
    page: number;
    total: number;
  }>("/users", { params: { limit: 100 } });
  return {
    rows: data.data.map(mapUser),
    raw: data.data,
    total: data.total,
  };
}

export async function getReviewers() {
  const users = await getUsers();
  return users.raw
    .filter((user) => user.role === "REVIEWER")
    .map(mapReviewer);
}

export async function getHospitals() {
  const { data } = await api.get<BackendHospital[]>("/hospitals");
  return data.map(mapHospital);
}

export async function createHospital(data: {
  address: string;
  isEmergency: boolean;
  latitude: number;
  longitude: number;
  name: string;
  phoneNumber?: string;
}) {
  const response = await api.post<BackendHospital>("/hospitals", data);
  return mapHospital(response.data);
}

export async function getFirstAidTips(search?: string) {
  const { data } = await api.get<BackendFirstAidTip[]>("/first-aid-tips", {
    params: search ? { search } : undefined,
  });
  return data.map(mapFirstAidTip);
}

export async function createFirstAidTip(data: {
  category: string;
  description: string;
  emergencyLevel: BackendFirstAidTip["emergencyLevel"];
  isOfflineReady: boolean;
  steps: string[];
  title: string;
  warnings: string[];
}) {
  const response = await api.post<BackendFirstAidTip>("/first-aid-tips", data);
  return mapFirstAidTip(response.data);
}
