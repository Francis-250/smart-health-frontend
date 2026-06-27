import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  Building2,
  FileText,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import {
  chartAIUsageWeekly,
  chartTipCategories,
  mockAIUsageData,
  mockTipUsageData,
} from "../../data/mockAnalytics";
import { mockHospitals, mockReviewers, mockTips, mockUsers } from "../../data/mockData";
import { useSettingsStore } from "../../store/settingsStore";
import { getDashboardStats } from "../../lib/adminApi";
import { getApiError } from "../../lib/api";

const activeUsers = mockUsers.filter((u) => u.status === "Active").length;
const activeReviewers = mockReviewers.filter((r) => r.status === "Active").length;
const weeklyAIQueries = chartAIUsageWeekly.reduce((sum, d) => sum + d.queries, 0);
const topTip = [...mockTipUsageData].sort((a, b) => b.views - a.views)[0];

const modules = [
  { to: "/admin/users", label: "Users", desc: "Manage patient & admin accounts", icon: Users },
  { to: "/admin/reviewers", label: "Reviewers", desc: "Medical content reviewers", icon: UserCheck },
  { to: "/admin/hospitals", label: "Hospitals", desc: "Partner hospital network", icon: Building2 },
  { to: "/admin/tips", label: "First Aid Tips", desc: "Emergency guidance content", icon: BookOpen },
  { to: "/admin/analytics", label: "Analytics", desc: "Charts & usage insights", icon: BarChart3 },
  { to: "/admin/reports", label: "Reports", desc: "Custom data exports", icon: FileText },
];

const recentActivity = [
  { who: "Dr. Sarah Mwangi", action: "reviewed", target: "Treating Minor Burns", time: "2h ago", color: "bg-brand" },
  { who: "Grace Njoroge", action: "registered as patient", target: "", time: "5h ago", color: "bg-blue-500" },
  { who: "AI Assistant", action: "answered", target: "12 emergency queries", time: "Today", color: "bg-violet-500" },
  { who: "Kigali Central Hospital", action: "added to network", target: "", time: "Yesterday", color: "bg-purple-500" },
  { who: "Dr. James Ochieng", action: "approved", target: "CPR Basics tip", time: "2 days ago", color: "bg-amber-500" },
];

export function OverviewPage() {
  const user = useAuthStore((s) => s.user);
  const aiLimits = useSettingsStore((s) => s.aiLimits);
  const { data: stats, error: statsError } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getDashboardStats,
  });
  const aiUsagePercent = Math.min(100, Math.round((weeklyAIQueries / aiLimits.dailyQueryLimit) * 100 * 7));
  const statCards = [
    {
      label: "Total Users",
      value: stats?.users ?? mockUsers.length,
      sub: `${stats?.patients ?? activeUsers} patients`,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      link: "/admin/users",
    },
    {
      label: "Assessments",
      value: stats?.assessments ?? mockTips.length,
      sub: `${stats?.emergencyAssessments ?? 0} emergency`,
      icon: BookOpen,
      gradient: "from-brand to-teal-600",
      link: "/admin/reports",
    },
    {
      label: "Conversations",
      value: stats?.conversations ?? mockHospitals.length,
      sub: "AI health checks",
      icon: Building2,
      gradient: "from-violet-500 to-purple-600",
      link: "/admin/analytics",
    },
    {
      label: "Reviewers",
      value: stats?.reviewers ?? activeReviewers,
      sub: `${stats?.activeSos ?? 0} active SOS`,
      icon: UserCheck,
      gradient: "from-amber-500 to-orange-500",
      link: "/admin/reviewers",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-[#0d7a6e] to-[#0d9488] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-medium text-white/80">Welcome back</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            {user?.name?.split(" ")[0] ?? "Admin"}&rsquo;s Dashboard
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/80">
            Monitor users, first aid content, hospital network, AI usage, and system health — all in one place.
          </p>
          {statsError && (
            <p className="mt-3 max-w-xl rounded-xl bg-white/15 px-3 py-2 text-xs text-white">
              Live metrics unavailable: {getApiError(statsError)}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/admin/hospitals"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-brand shadow-sm transition hover:bg-white/95"
            >
              <Building2 className="h-4 w-4" />
              Add hospital
            </Link>
            <Link
              to="/admin/analytics"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <BarChart3 className="h-4 w-4" />
              View analytics
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, sub, icon: Icon, gradient, link }) => (
          <Link
            key={label}
            to={link}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-brand/20 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
                <p className="mt-1 text-xs text-gray-400">{sub}</p>
              </div>
              <div className={`rounded-xl bg-gradient-to-br ${gradient} p-3 text-white shadow-sm`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition group-hover:opacity-100">
              View details <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <Activity className="h-5 w-5 text-brand" />
              Recent activity
            </h2>
            <Link to="/admin/reports" className="text-xs font-medium text-brand hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-5 space-y-4">
            {recentActivity.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">{item.who}</span>{" "}
                    {item.action}
                    {item.target && (
                      <>
                        {" "}
                        <span className="font-medium text-brand">{item.target}</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <Bot className="h-5 w-5 text-violet-500" />
              AI usage
            </h2>
            <p className="mt-1 text-sm text-gray-500">This week&rsquo;s assistant activity</p>
            <p className="mt-4 text-3xl font-bold text-gray-900">{weeklyAIQueries}</p>
            <p className="text-xs text-gray-400">queries this week</p>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Weekly capacity</span>
                <span>{aiUsagePercent}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-brand transition-all"
                  style={{ width: `${aiUsagePercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Limit: {aiLimits.dailyQueryLimit}/day · {aiLimits.perUserDailyLimit}/user
              </p>
            </div>
            <p className="mt-4 truncate text-xs text-gray-500">
              Latest: &ldquo;{mockAIUsageData[0]?.query}&rdquo;
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <TrendingUp className="h-5 w-5 text-brand" />
              Top tip
            </h2>
            <p className="mt-3 font-medium text-gray-900">{topTip?.tipTitle}</p>
            <p className="text-sm text-gray-500">{topTip?.category} · {topTip?.views} views</p>
            <div className="mt-4 space-y-2">
              {chartTipCategories.slice(0, 3).map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{cat.name}</span>
                  <span className="font-medium text-gray-900">{cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-base font-semibold text-gray-900">System modules</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map(({ to, label, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-brand/30 hover:shadow-md"
            >
              <div className="rounded-xl bg-brand-light p-3 text-brand transition group-hover:bg-brand group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900">{label}</p>
                <p className="truncate text-xs text-gray-500">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">System status</p>
          <p className="mt-2 text-lg font-semibold text-green-900">All systems operational</p>
          <p className="mt-1 text-xs text-green-700/80">API, AI assistant, and content delivery online</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Active patients</p>
          <p className="mt-2 text-lg font-semibold text-blue-900">
            {mockUsers.filter((u) => u.role === "Patient" && u.status === "Active").length} users
          </p>
          <p className="mt-1 text-xs text-blue-700/80">Registered and active in the platform</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Pending reviews</p>
          <p className="mt-2 text-lg font-semibold text-amber-900">
            {mockReviewers.filter((r) => r.status === "Pending").length} reviewer
            {mockReviewers.filter((r) => r.status === "Pending").length !== 1 ? "s" : ""}
          </p>
          <p className="mt-1 text-xs text-amber-700/80">Awaiting approval to review tips</p>
        </div>
      </div>
    </div>
  );
}
