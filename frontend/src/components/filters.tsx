
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export function Filters({ onFiltersChange, meta }: { onFiltersChange: (filters: any) => void, meta: any }) {
  const [country, setCountry] = useState("all");
  const [device, setDevice] = useState("all");
  const [browser, setBrowser] = useState("all");
  const [visitorType, setVisitorType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApply = () => {
    onFiltersChange({
      country_filter: country === "all" ? "" : country,
      device_filter: device === "all" ? "" : device,
      browser_filter: browser === "all" ? "" : browser,
      visitor_type_filter: visitorType,
      start_date_filter: startDate,
      end_date_filter: endDate,
    });
  };

  const handleReset = () => {
    setCountry("all");
    setDevice("all");
    setBrowser("all");
    setVisitorType("all");
    setStartDate("");
    setEndDate("");
    onFiltersChange({});
  };

  return (
    <Card className="mb-12" style={{ position: "relative" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          🔍 Advanced Filters
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Refine your analytics with these advanced filters.</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
          <div className="grid gap-2">
            <Label htmlFor="countryFilter" className="flex items-center gap-1">
              Country
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter visitors by country.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
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
            <Label htmlFor="deviceFilter" className="flex items-center gap-1">
              Device Type
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter visitors by device type (e.g., Desktop, Mobile).</p>
                </TooltipContent>
              </Tooltip>
            </Label>
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
            <Label htmlFor="browserFilter" className="flex items-center gap-1">
              Browser
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter visitors by browser.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
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
            <Label htmlFor="visitorTypeFilter" className="flex items-center gap-1">
              Visitor Type
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter by unique or returning visitors.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
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
          <div className="grid gap-2">
            <Label htmlFor="startDateFilter" className="flex items-center gap-1">
              Start Date
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The start of the date range.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input type="date" id="startDateFilter" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endDateFilter" className="flex items-center gap-1">
              End Date
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The end of the date range.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input type="date" id="endDateFilter" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            🔄 Reset Filters
          </Button>
          <Button onClick={handleApply}>
            🔍 Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
