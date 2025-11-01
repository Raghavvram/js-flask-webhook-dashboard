
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

// This is a placeholder for the actual data type
type Visitor = any;

interface VisitorsTableProps {
  visitors: Visitor[];
}

export function VisitorsTable({ visitors }: VisitorsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>👤 Recent Visitor Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Browser</TableHead>
              <TableHead>Page Visited</TableHead>
              <TableHead>Session Time</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody id="visitorsTableBody">
            {visitors && visitors.length > 0 ? (
              visitors.map((visitor, index) => {
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

                const now = new Date();
                const minutesSinceCreation = (now.getTime() - createdAt.getTime()) / 1000 / 60;
                const SESSION_TIMEOUT_MINUTES = 5;

                let status, statusClass;
                const hasTimeSpent =
                  visitor.time_spent_seconds !== null &&
                  typeof visitor.time_spent_seconds !== "undefined";

                if (hasTimeSpent) {
                  status = visitor.time_spent_seconds > 30 ? "Engaged" : "Brief";
                  statusClass = "secondary";
                } else if (minutesSinceCreation < SESSION_TIMEOUT_MINUTES) {
                  status = "Active";
                  statusClass = "default";
                } else {
                  status = "Ended";
                  statusClass = "secondary";
                }

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
