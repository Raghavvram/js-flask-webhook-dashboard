

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 text-white p-4 rounded-md border border-gray-700">
        <p className="label">{`${new Date(data.date).toLocaleDateString()} ${new Date(data.date).toLocaleTimeString()}`}</p>
        <p className="intro">{`Total Visitors: ${data.count}`}</p>
        <p className="intro">{`Unique Visitors: ${data.uniqueVisitors}`}</p>
        <p className="intro">{`Returning Visitors: ${data.returningVisitors}`}</p>
      </div>
    );
  }

  return null;
};

export function TrafficTimelineChart({ data }: { data: any[] }) {

  const chartData = data?.map(item => ({
    date: new Date(item.date),
    count: item.count,
    uniqueVisitors: item.unique_visitors || 0,
    returningVisitors: item.returning_visitors || 0,
  })).sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><LineChart className="h-5 w-5" /> Traffic Timeline</CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#9ca3af" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" stroke="#10b981" fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  );
};
