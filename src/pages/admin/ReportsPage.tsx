import { useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Filter } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/admin/PageHeader";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { getFullReports } from "../../lib/adminApi";
import { getApiError } from "../../lib/api";
import type {
  AIUsageRow,
  HospitalReportRow,
  ReportType,
  ReviewerReportRow,
  TipUsageRow,
  UserReportRow,
} from "../../types/reports";

const reportOptions: { value: ReportType; label: string; description: string }[] = [
  { value: "all-content", label: "All system content", description: "Complete export of all system data in one report" },
  { value: "users", label: "User registrations", description: "Registered users with roles and status" },
  { value: "ai-usage", label: "AI usage", description: "AI assistant queries recorded by the system" },
  { value: "tips-usage", label: "First Aid Tip usage", description: "Published first aid content and tracked engagement" },
  { value: "reviewers", label: "Reviewer activity", description: "Reviews completed and turnaround time" },
  { value: "hospitals", label: "Hospital network", description: "Partner hospitals and referral data" },
];

const inputClass =
  "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

function filterByDate<T extends { date?: string; joinedAt?: string; lastViewed?: string }>(
  rows: T[],
  startDate: string,
  endDate: string,
  dateKey: keyof T,
) {
  if (!startDate && !endDate) return rows;
  return rows.filter((row) => {
    const date = String(row[dateKey] ?? "");
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  });
}

interface AllContentData {
  users: UserReportRow[];
  aiUsage: AIUsageRow[];
  tipsUsage: TipUsageRow[];
  reviewers: ReviewerReportRow[];
  hospitals: HospitalReportRow[];
}

function UsersTable({ rows }: { rows: UserReportRow[] }) {
  return (
    <DataTable
      columns={[
        { key: "name", label: "User" },
        { key: "role", label: "Role" },
        { key: "status", label: "Status" },
        { key: "joined", label: "Joined" },
      ]}
    >
      {rows.map((r) => (
        <tr key={r.id} className="hover:bg-gray-50">
          <td className="px-5 py-4">
            <p className="font-medium text-gray-900">{r.name}</p>
            <p className="text-xs text-gray-500">{r.email}</p>
          </td>
          <td className="px-5 py-4 text-gray-600">{r.role}</td>
          <td className="px-5 py-4">
            <span
              className={[
                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                r.status === "Active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
              ].join(" ")}
            >
              {r.status}
            </span>
          </td>
          <td className="px-5 py-4 text-gray-500">{r.joinedAt}</td>
        </tr>
      ))}
    </DataTable>
  );
}

function AIUsageTable({ rows }: { rows: AIUsageRow[] }) {
  return (
    <DataTable
      columns={[
        { key: "user", label: "User" },
        { key: "query", label: "Query" },
        { key: "tokens", label: "Tokens" },
        { key: "date", label: "Date" },
      ]}
    >
      {rows.map((r) => (
        <tr key={r.id} className="hover:bg-gray-50">
          <td className="px-5 py-4 font-medium text-gray-900">{r.userName}</td>
          <td className="px-5 py-4 text-gray-600">{r.query}</td>
          <td className="px-5 py-4 text-gray-600">{r.tokensUsed}</td>
          <td className="px-5 py-4 text-gray-500">{r.date}</td>
        </tr>
      ))}
    </DataTable>
  );
}

function TipsUsageTable({ rows }: { rows: TipUsageRow[] }) {
  return (
    <DataTable
      columns={[
        { key: "tip", label: "Tip" },
        { key: "category", label: "Category" },
        { key: "views", label: "Views" },
        { key: "users", label: "Unique users" },
        { key: "last", label: "Last viewed" },
      ]}
    >
      {rows.map((r) => (
        <tr key={r.id} className="hover:bg-gray-50">
          <td className="px-5 py-4 font-medium text-gray-900">{r.tipTitle}</td>
          <td className="px-5 py-4 text-gray-600">{r.category}</td>
          <td className="px-5 py-4 text-gray-600">{r.views}</td>
          <td className="px-5 py-4 text-gray-600">{r.uniqueUsers}</td>
          <td className="px-5 py-4 text-gray-500">{r.lastViewed}</td>
        </tr>
      ))}
    </DataTable>
  );
}

function ReviewersTable({ rows }: { rows: ReviewerReportRow[] }) {
  return (
    <DataTable
      columns={[
        { key: "name", label: "Reviewer" },
        { key: "specialty", label: "Specialty" },
        { key: "reviewed", label: "Tips reviewed" },
        { key: "turnaround", label: "Avg turnaround (days)" },
        { key: "status", label: "Status" },
      ]}
    >
      {rows.map((r) => (
        <tr key={r.id} className="hover:bg-gray-50">
          <td className="px-5 py-4 font-medium text-gray-900">{r.name}</td>
          <td className="px-5 py-4 text-gray-600">{r.specialty}</td>
          <td className="px-5 py-4 text-gray-600">{r.tipsReviewed}</td>
          <td className="px-5 py-4 text-gray-600">{r.avgTurnaroundDays}</td>
          <td className="px-5 py-4">
            <span
              className={[
                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                r.status === "Active" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700",
              ].join(" ")}
            >
              {r.status}
            </span>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

function HospitalsTable({ rows }: { rows: HospitalReportRow[] }) {
  return (
    <DataTable
      columns={[
        { key: "name", label: "Hospital" },
        { key: "location", label: "Location" },
        { key: "contact", label: "Contact" },
        { key: "referrals", label: "Referrals" },
        { key: "status", label: "Status" },
      ]}
    >
      {rows.map((r) => (
        <tr key={r.id} className="hover:bg-gray-50">
          <td className="px-5 py-4 font-medium text-gray-900">{r.name}</td>
          <td className="px-5 py-4 text-gray-600">{r.location}</td>
          <td className="px-5 py-4 text-gray-600">{r.contact}</td>
          <td className="px-5 py-4 text-gray-600">{r.referrals}</td>
          <td className="px-5 py-4">
            <span
              className={[
                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                r.status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600",
              ].join(" ")}
            >
              {r.status}
            </span>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

function ReportSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div className="flex items-center justify-between bg-gray-50 px-5 py-3">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-600 shadow-sm">
          {count} record{count !== 1 ? "s" : ""}
        </span>
      </div>
      {count > 0 ? children : (
        <p className="px-5 py-6 text-center text-sm text-gray-500">No records for this section.</p>
      )}
    </div>
  );
}

export function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("users");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userId, setUserId] = useState("");
  const [generated, setGenerated] = useState(false);
  const { data, error, isLoading } = useQuery({
    queryKey: ["admin-full-reports"],
    queryFn: getFullReports,
  });

  const selectedOption = reportOptions.find((o) => o.value === reportType);
  const users = data?.users ?? [];

  const allContentData = useMemo((): AllContentData | null => {
    if (!generated || reportType !== "all-content" || !data) return null;

    let reportUsers = filterByDate(data.users, startDate, endDate, "joinedAt");
    let aiUsage = filterByDate(data.aiUsage, startDate, endDate, "date");
    const tipsUsage = filterByDate(data.tipsUsage, startDate, endDate, "lastViewed");

    if (userId) {
      reportUsers = reportUsers.filter((r) => r.id === userId);
      const user = data.users.find((u) => u.id === userId);
      if (user) aiUsage = aiUsage.filter((r) => r.userName === user.name);
    }

    return {
      users: reportUsers,
      aiUsage,
      tipsUsage,
      reviewers: data.reviewers,
      hospitals: data.hospitals,
    };
  }, [data, reportType, startDate, endDate, userId, generated]);

  const reportData = useMemo(() => {
    if (!generated || reportType === "all-content" || !data) return [];

    switch (reportType) {
      case "users": {
        let rows = filterByDate(data.users, startDate, endDate, "joinedAt");
        if (userId) rows = rows.filter((r) => r.id === userId);
        return rows;
      }
      case "ai-usage": {
        let rows = filterByDate(data.aiUsage, startDate, endDate, "date");
        if (userId) {
          const user = data.users.find((u) => u.id === userId);
          if (user) rows = rows.filter((r) => r.userName === user.name);
        }
        return rows;
      }
      case "tips-usage":
        return filterByDate(data.tipsUsage, startDate, endDate, "lastViewed");
      case "reviewers":
        return data.reviewers;
      case "hospitals":
        return data.hospitals;
      default:
        return [];
    }
  }, [data, reportType, startDate, endDate, userId, generated]);

  const totalAllRecords = allContentData
    ? allContentData.users.length +
      allContentData.aiUsage.length +
      allContentData.tipsUsage.length +
      allContentData.reviewers.length +
      allContentData.hospitals.length
    : 0;

  function handleGenerate() {
    if (isLoading) {
      toast.message("Report data is still loading");
      return;
    }
    if (error) {
      toast.error(getApiError(error));
      return;
    }
    setGenerated(true);
    toast.success("Report generated");
  }

  function handleExport() {
    if (reportType === "all-content") {
      if (!allContentData || totalAllRecords === 0) {
        toast.error("No data to export. Generate a report first.");
        return;
      }
    } else if (!reportData.length) {
      toast.error("No data to export. Generate a report first.");
      return;
    }
    toast.success(`Exporting "${selectedOption?.label}" report…`);
  }

  return (
    <div>
      <PageHeader section="Data" title="Custom Reports" />

      {isLoading && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
          Loading live report data…
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
          {getApiError(error)}
        </div>
      )}

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4 text-brand" />
          <h2 className="text-sm font-semibold text-gray-900">Configure report</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Report type</label>
            <select
              className={`${inputClass} w-full`}
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value as ReportType);
                setGenerated(false);
              }}
            >
              {reportOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {selectedOption && (
              <p className="mt-1 text-xs text-gray-400">{selectedOption.description}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Start date</label>
            <input
              type="date"
              className={`${inputClass} w-full`}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setGenerated(false);
              }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">End date</label>
            <input
              type="date"
              className={`${inputClass} w-full`}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setGenerated(false);
              }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">Filter by user</label>
            <select
              className={`${inputClass} w-full`}
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setGenerated(false);
              }}
            >
              <option value="">All users</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button onClick={handleGenerate}>Generate report</Button>
          <Button variant="secondary" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {generated && reportType === "all-content" && allContentData && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h3 className="font-medium text-gray-900">All system content</h3>
            <p className="text-sm text-gray-500">
              {totalAllRecords} total records
              {startDate && endDate && ` · ${startDate} to ${endDate}`}
            </p>
          </div>

          <ReportSection title="Users" count={allContentData.users.length}>
            <UsersTable rows={allContentData.users} />
          </ReportSection>
          <ReportSection title="AI usage" count={allContentData.aiUsage.length}>
            <AIUsageTable rows={allContentData.aiUsage} />
          </ReportSection>
          <ReportSection title="First Aid Tip usage" count={allContentData.tipsUsage.length}>
            <TipsUsageTable rows={allContentData.tipsUsage} />
          </ReportSection>
          <ReportSection title="Reviewers" count={allContentData.reviewers.length}>
            <ReviewersTable rows={allContentData.reviewers} />
          </ReportSection>
          <ReportSection title="Hospitals" count={allContentData.hospitals.length}>
            <HospitalsTable rows={allContentData.hospitals} />
          </ReportSection>
        </div>
      )}

      {generated && reportType !== "all-content" && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h3 className="font-medium text-gray-900">{selectedOption?.label}</h3>
            <p className="text-sm text-gray-500">
              {reportData.length} record{reportData.length !== 1 ? "s" : ""} found
              {startDate && endDate && ` · ${startDate} to ${endDate}`}
            </p>
          </div>

          {reportType === "users" && <UsersTable rows={reportData as UserReportRow[]} />}
          {reportType === "ai-usage" && <AIUsageTable rows={reportData as AIUsageRow[]} />}
          {reportType === "tips-usage" && <TipsUsageTable rows={reportData as TipUsageRow[]} />}
          {reportType === "reviewers" && <ReviewersTable rows={reportData as ReviewerReportRow[]} />}
          {reportType === "hospitals" && <HospitalsTable rows={reportData as HospitalReportRow[]} />}

          {reportData.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-gray-500">
              No records match your filters. Try adjusting the date range or user filter.
            </p>
          )}
        </div>
      )}

      {!generated && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-sm text-gray-500">
            Select a report type, set your filters, and click &ldquo;Generate report&rdquo; to view data.
          </p>
        </div>
      )}
    </div>
  );
}
