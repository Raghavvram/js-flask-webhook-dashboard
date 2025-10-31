
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="bg-secondary border-b p-8 fixed top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Analytics Dashboard
            <Badge>Live</Badge>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-muted-foreground text-sm" id="lastUpdate">
            Last updated: Loading...
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
