
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Filter, RotateCw, Search } from "lucide-react";

export interface FiltersProps {
  onFiltersChange: (filters: {
    country_filter: string;
    device_filter: string;
    browser_filter: string;
    visitor_type_filter: string;
    start_date_filter: string;
    end_date_filter: string;
  }) => void;
  meta: {
    distinct_countries: string[];
    distinct_devices: string[];
    distinct_browsers: string[];
  };
}

export function Filters({ onFiltersChange, meta, showDateInputs = true, showMonthPicker = false, showDayPicker = false }: FiltersProps & { showDateInputs?: boolean; showMonthPicker?: boolean; showDayPicker?: boolean }) {
  const [country, setCountry] = useState("all");
  const [device, setDevice] = useState("all");
  const [browser, setBrowser] = useState("all");
  const [visitorType, setVisitorType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Day Picker State
  const [selectedDay, setSelectedDay] = useState("");

  // Month Picker State
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());

  const handleApply = () => {
    let finalStartDate = startDate;
    let finalEndDate = endDate;

    if (showDayPicker) {
      if (selectedDay) {
        finalStartDate = selectedDay;
        finalEndDate = selectedDay;
      } else {
        // Default to today if nothing selected? Or maybe just empty which implies "all time" or backend default?
        // Usually for "Day View" if nothing is selected, maybe we shouldn't send anything or send today.
        // Let's assume if empty, we send empty (no filter) or let backend handle defaults.
        // But the requirement implies selecting a day.
      }
    } else if (showMonthPicker) {
      // Calculate start/end of month
      const y = parseInt(selectedYear);
      const m = parseInt(selectedMonth);
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0); // Last day of month

      // Format as YYYY-MM-DD
      // Note: toISOString() uses UTC. We should probably stick to local time YYYY-MM-DD for consistency with inputs,
      // or handle timezone carefully.
      // Simple way:
      const format = (d: Date) => {
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().split('T')[0];
      }
      finalStartDate = format(start);
      finalEndDate = format(end);
    }

    onFiltersChange({
      country_filter: country === "all" ? "" : country,
      device_filter: device === "all" ? "" : device,
      browser_filter: browser === "all" ? "" : browser,
      visitor_type_filter: visitorType,
      start_date_filter: finalStartDate,
      end_date_filter: finalEndDate,
    });
  };

  const handleReset = () => {
    setCountry("all");
    setDevice("all");
    setBrowser("all");
    setVisitorType("all");
    setStartDate("");
    setEndDate("");
    setSelectedDay("");
    // Reset month picker too
    setSelectedYear(currentYear.toString());
    setSelectedMonth((new Date().getMonth() + 1).toString());

    onFiltersChange({
      country_filter: "",
      device_filter: "",
      browser_filter: "",
      visitor_type_filter: "",
      start_date_filter: "",
      end_date_filter: "",
    });
  };

  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <Card className="mb-4 md:mb-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" /> Advanced Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
          <div className="grid gap-2">
            <Label htmlFor="countryFilter">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="countryFilter">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {meta?.distinct_countries?.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deviceFilter">Device Type</Label>
            <Select value={device} onValueChange={setDevice}>
              <SelectTrigger id="deviceFilter">
                <SelectValue placeholder="All Devices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                {meta?.distinct_devices?.map((d: string) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="browserFilter">Browser</Label>
            <Select value={browser} onValueChange={setBrowser}>
              <SelectTrigger id="browserFilter">
                <SelectValue placeholder="All Browsers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Browsers</SelectItem>
                {meta?.distinct_browsers?.map((b: string) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="visitorTypeFilter">Visitor Type</Label>
            <Select value={visitorType} onValueChange={setVisitorType}>
              <SelectTrigger id="visitorTypeFilter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visitors</SelectItem>
                <SelectItem value="unique">Unique Only</SelectItem>
                <SelectItem value="repeated">Returning Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {showDateInputs && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="startDateFilter">Start Date</Label>
                <Input type="date" id="startDateFilter" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDateFilter">End Date</Label>
                <Input type="date" id="endDateFilter" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </>
          )}
          {showDayPicker && (
            <div className="grid gap-2">
              <Label htmlFor="dateFilter">Date</Label>
              <Input type="date" id="dateFilter" value={selectedDay} onChange={e => setSelectedDay(e.target.value)} />
            </div>
          )}
          {showMonthPicker && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="yearFilter">Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger id="yearFilter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="monthFilter">Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger id="monthFilter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCw className="h-4 w-4 mr-2" /> Reset Filters
          </Button>
          <Button onClick={handleApply}>
            <Search className="h-4 w-4 mr-2" /> Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
