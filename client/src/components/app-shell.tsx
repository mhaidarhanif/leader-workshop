import { Gavel, Home, Trophy, Upload } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { AppContainer } from "@/components/app-container";
import { cn } from "@/lib/utils";

const navItems: {
  to: string;
  label: string;
  icon: typeof Home;
  end?: boolean;
  liveDot?: boolean;
}[] = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/submit", label: "Submit", icon: Upload },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy, liveDot: true },
  { to: "/judge", label: "Judge", icon: Gavel },
];

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <AppContainer className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <NavLink
            to="/"
            end
            className="flex items-center gap-3 rounded-xl transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Leader Workshop home"
          >
            <div
              className="flex size-9 items-center justify-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground"
              aria-hidden
            >
              LW
            </div>
            <div>
              <p className="font-display text-xl font-bold tracking-tight">Leader Workshop</p>
              <p className="text-sm text-muted-foreground">Hackathon showcase</p>
            </div>
          </NavLink>
          <nav aria-label="Main navigation" className="flex flex-wrap gap-2">
            {navItems.map(({ to, label, icon: Icon, end, liveDot }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "inline-flex h-10 items-center gap-2 rounded-full px-4 text-base font-medium transition-[background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="size-4" aria-hidden />
                    {label}
                    {liveDot && (
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          isActive ? "bg-primary-foreground" : "bg-primary",
                        )}
                        aria-hidden
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </AppContainer>
      </header>
      <Outlet />
    </div>
  );
}
