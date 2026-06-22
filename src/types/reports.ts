export type ReportType =
  | "users"
  | "ai-usage"
  | "tips-usage"
  | "reviewers"
  | "hospitals"
  | "all-content";

export interface ReportFilter {
  reportType: ReportType;
  startDate: string;
  endDate: string;
  userId?: string;
}

export interface UserReportRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedAt: string;
}

export interface AIUsageRow {
  id: string;
  userName: string;
  query: string;
  tokensUsed: number;
  date: string;
}

export interface TipUsageRow {
  id: string;
  tipTitle: string;
  category: string;
  views: number;
  uniqueUsers: number;
  lastViewed: string;
}

export interface ReviewerReportRow {
  id: string;
  name: string;
  specialty: string;
  tipsReviewed: number;
  avgTurnaroundDays: number;
  status: string;
}

export interface HospitalReportRow {
  id: string;
  name: string;
  location: string;
  contact: string;
  referrals: number;
  status: string;
}
