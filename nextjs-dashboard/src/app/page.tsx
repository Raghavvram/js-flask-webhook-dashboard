
"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { StatsGrid } from "@/components/stats-cards";
import { Filters } from "@/components/filters";
import { AnalyticsChartsGrid, GlobalVisitorChart } from "@/components/charts";
import { VisitorsTable } from "@/components/visitors-table";
import { TrafficTimelineChart } from "@/components/traffic-timeline-chart";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState("analytics");

  const loadData = async (currentFilters: any) => {
    const cleanedFilters: { [key: string]: string } = {};
    for (const key in currentFilters) {
      if (currentFilters[key] && currentFilters[key] !== "all") {
        cleanedFilters[key] = currentFilters[key];
      }
    }

    const params = new URLSearchParams(cleanedFilters);
    try {
      const response = await fetch(`/api/analytics?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Failed to load analytics data:", error);
    }
  };

  useEffect(() => {
    loadData(filters);
    const interval = setInterval(() => loadData(filters), 30000);
    return () => clearInterval(interval);
  }, [filters]);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-7xl mx-auto p-8 pt-[7rem]">
        <StatsGrid stats={data?.stats} />
        <Filters onFiltersChange={handleFiltersChange} meta={data?.meta} />
        
        <div className="flex gap-2 mb-4">
            <Button variant={activeTab === 'analytics' ? 'default' : 'outline'} onClick={() => setActiveTab('analytics')}>Analytics</Button>
            <Button variant={activeTab === 'timeline' ? 'default' : 'outline'} onClick={() => setActiveTab('timeline')}>Traffic Timeline</Button>
            <Button variant={activeTab === 'global' ? 'default' : 'outline'} onClick={() => setActiveTab('global')}>Global Visitor Distribution</Button>
            <Button variant={activeTab === 'visitors' ? 'default' : 'outline'} onClick={() => setActiveTab('visitors')}>Recent Visitor Activity</Button>
        </div>

        <div>
            {activeTab === 'analytics' && <AnalyticsChartsGrid chartsData={data?.charts} />}
            {activeTab === 'timeline' && <TrafficTimelineChart data={data?.charts?.by_date} />}
            {activeTab === 'global' && <GlobalVisitorChart data={data?.charts?.by_country} />}
            {activeTab === 'visitors' && <VisitorsTable visitors={data?.visitor_list || []} />}
        </div>

      </main>
    </div>
  );
}
