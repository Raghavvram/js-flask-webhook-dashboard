
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsGrid({ stats }: { stats: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
      <StatCard
        title="Total Visitors"
        value={stats?.total_visitors || "-"}
        icon={<span className="text-2xl">👥</span>}
      />
      <StatCard
        title="Unique Visitors"
        value={stats?.unique_visitors || "-"}
        icon={<span className="text-2xl">🆔</span>}
      />
      <StatCard
        title="Returning Visitors"
        value={stats?.repeated_visitors || "-"}
        icon={<span className="text-2xl">🔄</span>}
      />
      <StatCard
        title="Avg. Session (sec)"
        value={stats?.avg_time_on_page || "-"}
        icon={<span className="text-2xl">⏱️</span>}
      />
    </div>
  );
}
