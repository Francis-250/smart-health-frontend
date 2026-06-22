import type {
  AIUsageRow,
  HospitalReportRow,
  ReviewerReportRow,
  TipUsageRow,
  UserReportRow,
} from "../types/reports";

export const mockUserReportData: UserReportRow[] = [
  { id: "1", name: "Kevin Uwimana", email: "kevin@example.com", role: "Admin", status: "Active", joinedAt: "2023-11-01" },
  { id: "2", name: "Grace Njoroge", email: "grace@example.com", role: "Patient", status: "Active", joinedAt: "2024-01-12" },
  { id: "3", name: "Samuel Otieno", email: "samuel@example.com", role: "Patient", status: "Suspended", joinedAt: "2024-02-05" },
  { id: "4", name: "Amina Kariuki", email: "amina@example.com", role: "Patient", status: "Active", joinedAt: "2024-03-18" },
  { id: "5", name: "Peter Mwangi", email: "peter@example.com", role: "Reviewer", status: "Active", joinedAt: "2024-04-02" },
];

export const mockAIUsageData: AIUsageRow[] = [
  { id: "1", userName: "Grace Njoroge", query: "How to treat minor burns?", tokensUsed: 245, date: "2024-05-10" },
  { id: "2", userName: "Samuel Otieno", query: "CPR steps for adults", tokensUsed: 312, date: "2024-05-09" },
  { id: "3", userName: "Grace Njoroge", query: "Signs of heat exhaustion", tokensUsed: 198, date: "2024-05-08" },
  { id: "4", userName: "Amina Kariuki", query: "Snake bite first aid", tokensUsed: 276, date: "2024-05-07" },
  { id: "5", userName: "Kevin Uwimana", query: "Anaphylaxis emergency steps", tokensUsed: 340, date: "2024-05-06" },
  { id: "6", userName: "Amina Kariuki", query: "How to stop severe bleeding", tokensUsed: 221, date: "2024-05-05" },
];

export const mockTipUsageData: TipUsageRow[] = [
  { id: "1", tipTitle: "Treating Minor Burns", category: "Burns", views: 342, uniqueUsers: 128, lastViewed: "2024-05-10" },
  { id: "2", tipTitle: "Adult Choking Response", category: "Choking", views: 289, uniqueUsers: 95, lastViewed: "2024-05-09" },
  { id: "3", tipTitle: "CPR Basics", category: "CPR", views: 456, uniqueUsers: 201, lastViewed: "2024-05-10" },
  { id: "4", tipTitle: "Controlling Severe Bleeding", category: "Bleeding", views: 178, uniqueUsers: 67, lastViewed: "2024-05-08" },
  { id: "5", tipTitle: "Anaphylaxis First Response", category: "Allergies", views: 134, uniqueUsers: 52, lastViewed: "2024-05-07" },
];

export const mockReviewerReportData: ReviewerReportRow[] = [
  { id: "1", name: "Dr. Sarah Mwangi", specialty: "Emergency Medicine", tipsReviewed: 24, avgTurnaroundDays: 2.1, status: "Active" },
  { id: "2", name: "Dr. James Ochieng", specialty: "Trauma Care", tipsReviewed: 18, avgTurnaroundDays: 3.4, status: "Active" },
  { id: "3", name: "Dr. Amina Hassan", specialty: "Pediatrics", tipsReviewed: 0, avgTurnaroundDays: 0, status: "Pending" },
];

export const mockHospitalReportData: HospitalReportRow[] = [
  { id: "1", name: "Kigali Central Hospital", location: "Kigali, Rwanda", contact: "+250 788 000 001", referrals: 45, status: "Active" },
  { id: "2", name: "Nairobi General", location: "Nairobi, Kenya", contact: "+254 700 000 002", referrals: 32, status: "Active" },
  { id: "3", name: "Kampala Medical Centre", location: "Kampala, Uganda", contact: "+256 700 000 003", referrals: 12, status: "Inactive" },
];

export const chartUserRegistrations = [
  { month: "Jan", users: 12 },
  { month: "Feb", users: 19 },
  { month: "Mar", users: 28 },
  { month: "Apr", users: 35 },
  { month: "May", users: 42 },
];

export const chartTipCategories = [
  { name: "CPR", value: 456 },
  { name: "Burns", value: 342 },
  { name: "Choking", value: 289 },
  { name: "Bleeding", value: 178 },
  { name: "Allergies", value: 134 },
  { name: "Other", value: 98 },
];

export const chartAIUsageWeekly = [
  { day: "Mon", queries: 45 },
  { day: "Tue", queries: 62 },
  { day: "Wed", queries: 58 },
  { day: "Thu", queries: 71 },
  { day: "Fri", queries: 83 },
  { day: "Sat", queries: 34 },
  { day: "Sun", queries: 28 },
];

export const chartHospitalReferrals = [
  { name: "Kigali Central", referrals: 45 },
  { name: "Nairobi General", referrals: 32 },
  { name: "Kampala Medical", referrals: 12 },
];
