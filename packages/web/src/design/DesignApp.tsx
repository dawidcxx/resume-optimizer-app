import { Link, Route, Router, Switch, useLocation } from "wouter";
import { cn } from "@/lib/cn";
import { Text, ThemeSwitcher } from "@/ui";
import { ButtonDemo } from "./demos/ButtonDemo";
import { FormDemo } from "./demos/FormDemo";
import { InputDemo } from "./demos/InputDemo";
import { LabelDemo } from "./demos/LabelDemo";
import { ListDemo } from "./demos/ListDemo";
import { OverviewDemo } from "./demos/OverviewDemo";
import { TableDemo } from "./demos/TableDemo";
import { ThemeDemo } from "./demos/ThemeDemo";
import { TypographyDemo } from "./demos/TypographyDemo";

const NAV = [
  { path: "/", label: "Overview" },
  { path: "/typography", label: "Typography" },
  { path: "/buttons", label: "Buttons" },
  { path: "/input", label: "Input" },
  { path: "/label", label: "Label" },
  { path: "/list", label: "List" },
  { path: "/table", label: "Table" },
  { path: "/form", label: "Form" },
  { path: "/theme", label: "Theme" },
] as const;

export function DesignApp() {
  return (
    <Router base="/design">
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1">
            <Switch>
              <Route path="/typography" component={TypographyDemo} />
              <Route path="/buttons" component={ButtonDemo} />
              <Route path="/input" component={InputDemo} />
              <Route path="/label" component={LabelDemo} />
              <Route path="/list" component={ListDemo} />
              <Route path="/table" component={TableDemo} />
              <Route path="/form" component={FormDemo} />
              <Route path="/theme" component={ThemeDemo} />
              <Route path="/" component={OverviewDemo} />
              <Route component={OverviewDemo} />
            </Switch>
          </main>
        </div>
      </div>
    </Router>
  );
}

function isActive(path: string, location: string) {
  return path === "/" ? location === "/" : location === path || location.startsWith(`${path}/`);
}

function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-subtle">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-ui bg-primary text-[11px] font-semibold text-primary-foreground">
          UI
        </span>
        <span className="text-sm font-semibold">Design system</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <Text
          variant="subtle"
          className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide"
        >
          Components
        </Text>
        <ul className="space-y-0.5">
          {NAV.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={cn(
                  "block rounded-ui px-2 py-1.5 text-sm transition-colors",
                  isActive(item.path, location)
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <Text variant="subtle">Pure UI layer · no third-party deps</Text>
      </div>
    </aside>
  );
}

function TopBar() {
  const [location] = useLocation();
  const current = NAV.find((item) => isActive(item.path, location)) ?? NAV[0];

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur">
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-muted-foreground">Design system</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-semibold">{current.label}</span>
      </div>
      <ThemeSwitcher />
    </header>
  );
}
