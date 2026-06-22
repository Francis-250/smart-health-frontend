import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/admin/PageHeader";
import { Button } from "../../components/ui/Button";

const reportTypes = [
  {
    id: "users",
    title: "User registrations",
    description: "Export all registered users with roles and status.",
    format: "CSV",
  },
  {
    id: "tips",
    title: "First aid tips usage",
    description: "Tip views, categories, and engagement metrics.",
    format: "PDF",
  },
  {
    id: "reviewers",
    title: "Reviewer activity",
    description: "Reviews completed, pending approvals, and turnaround time.",
    format: "CSV",
  },
  {
    id: "hospitals",
    title: "Hospital network",
    description: "Partner hospitals, locations, and contact details.",
    format: "PDF",
  },
];

export function ReportsPage() {
  function handleExport(title: string) {
    toast.success(`Generating "${title}" report…`);
  }

  return (
    <div>
      <PageHeader section="Analytics" title="Reports" />

      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-brand-light p-2.5 text-brand">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{report.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{report.description}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                  {report.format}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="secondary"
                onClick={() => handleExport(report.title)}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
