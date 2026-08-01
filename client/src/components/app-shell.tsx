import { Gavel, Home, Trophy, Upload } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems: { to: string; label: string; icon: typeof Home; end?: boolean }[] = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/submit', label: 'Submit', icon: Upload },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/judge', label: 'Judge', icon: Gavel },
];

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-xl font-bold">Workshop Judge Platform</p>
          <nav aria-label="Main navigation" className="flex flex-wrap gap-2">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'inline-flex h-10 items-center gap-2 rounded-md px-4 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                  )
                }
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
