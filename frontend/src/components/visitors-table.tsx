
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

// This is a placeholder for the actual data type
type Visitor = any;

interface VisitorsTableProps {
  visitors: Visitor[];
}

export function VisitorsTable({ visitors }: VisitorsTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

  const sortedVisitors = useMemo(() => {
    let sortableVisitors = [...visitors];
    if (sortConfig !== null) {
      sortableVisitors.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableVisitors;
  }, [visitors, sortConfig]);

  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
  };

  return (
    <Card style={{ position: "relative" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          👤 Recent Visitor Activity
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>A table showing the most recent visitors to your website.</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => requestSort('created_at')}>
                Timestamp{getSortIndicator('created_at')}
              </TableHead>
              <TableHead onClick={() => requestSort('location')}>
                Location{getSortIndicator('location')}
              </TableHead>
              <TableHead onClick={() => requestSort('device_type')}>
                Device{getSortIndicator('device_type')}
              </TableHead>
              <TableHead onClick={() => requestSort('browser')}>
                Browser{getSortIndicator('browser')}
              </TableHead>
              <TableHead onClick={() => requestSort('page_visited')}>
                Page Visited{getSortIndicator('page_visited')}
              </TableHead>
              <TableHead onClick={() => requestSort('time_spent_seconds')}>
                Session Time{getSortIndicator('time_spent_seconds')}
              </TableHead>
              <TableHead onClick={() => requestSort('public_ip')}>
                IP Address{getSortIndicator('public_ip')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody id="visitorsTableBody">
            {sortedVisitors && sortedVisitors.length > 0 ? (
              sortedVisitors.map((visitor, index) => {
                const createdAt = new Date(visitor.created_at);
                const timeSpent = visitor.time_spent_seconds
                  ? `${visitor.time_spent_seconds}s`
                  : "-";
                const pageUrl =
                  visitor.page_visited?.length > 40
                    ? `${visitor.page_visited.substring(0, 40)}...`
                    : visitor.page_visited || "-";
                const location =
                  [visitor.city, visitor.country].filter(Boolean).join(", ") || "-";

                return (
                  <TableRow key={index}>
                    <TableCell>{createdAt.toLocaleString()}</TableCell>
                    <TableCell>{location}</TableCell>
                    <TableCell>{visitor.device_type || "-"}</TableCell>
                    <TableCell>{visitor.browser || "-"}</TableCell>
                    <TableCell title={visitor.page_visited || ""}>
                      {pageUrl}
                    </TableCell>
                    <TableCell>{timeSpent}</TableCell>
                    <TableCell>
                      <code>{visitor.public_ip || "-"}</code>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading visitor data...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
