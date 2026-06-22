import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "../../components/admin/PageHeader";
import {
  chartAIUsageWeekly,
  chartHospitalReferrals,
  chartTipCategories,
  chartUserRegistrations,
} from "../../data/mockAnalytics";

const PIE_COLORS = ["#005f54", "#0d9488", "#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4"];

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
      <div className="mt-4 h-72">{children}</div>
    </div>
  );
}

export function AnalyticsPage() {
  return (
    <div>
      <PageHeader section="Insights" title="Analytics" />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="User registrations" subtitle="Monthly new user sign-ups">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartUserRegistrations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="users" fill="#005f54" radius={[4, 4, 0, 0]} name="Users" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="First Aid Tip views by category" subtitle="Total views per category">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartTipCategories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartTipCategories.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="AI usage this week" subtitle="Daily AI assistant queries">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartAIUsageWeekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="queries"
                stroke="#005f54"
                strokeWidth={2}
                dot={{ fill: "#005f54", r: 4 }}
                name="Queries"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Hospital referrals" subtitle="Patient referrals per partner hospital">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartHospitalReferrals} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="referrals" fill="#0d9488" radius={[0, 4, 4, 0]} name="Referrals" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
