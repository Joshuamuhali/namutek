import React from 'react';
import {
  ShieldAlert,
  Building2,
  FileSpreadsheet,
  TrendingUp,
  Truck,
  HardHat,
  Wrench,
  Receipt,
  Smartphone,
  UserCheck,
  ChevronRight,
  Search,
  Bell,
  Menu,
  X,
  ArrowRight,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { ROLES, RoleId } from './types';

interface DashboardShellProps {
  currentRole: RoleId;
  onRoleChange: (role: RoleId) => void;
  activeNav: string;
  onNavChange: (nav: string) => void;
  children: React.ReactNode;
}

const ROLE_ICONS: Record<RoleId, React.ElementType> = {
  super_admin: ShieldAlert,
  managing_director: Building2,
  quotation_officer: FileSpreadsheet,
  sales_officer: TrendingUp,
  dispatcher: Truck,
  project_coordinator: HardHat,
  fleet_manager: Wrench,
  finance_officer: Receipt,
  field_staff: Smartphone,
  customer: UserCheck,
};

export const DashboardShell: React.FC<DashboardShellProps> = ({
  currentRole,
  onRoleChange,
  activeNav,
  onNavChange,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = React.useState(false);
  const roleConfig = ROLES[currentRole];
  const CurrentIcon = ROLE_ICONS[currentRole];

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Banner / Role Quick Switch Bar */}
      <header className="border-b border-slate-800 bg-[#161b22] px-4 py-2.5 sticky top-0 z-40 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-md border border-slate-700 hover:bg-slate-800"
            aria-label="Toggle sidebar"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="font-extrabold uppercase tracking-wider text-xs text-red-500">Namutek Logistics</span>
            <span className="text-slate-600 text-xs hidden sm:inline">•</span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Industrial ERP & Operations Shell</span>
          </div>
        </div>

        {/* Global Quick Persona Switcher */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <CurrentIcon className="h-3.5 w-3.5 text-red-400" />
              <span className="hidden md:inline text-slate-400 font-normal">Active Role:</span>
              <span className="text-white font-bold">{roleConfig.name}</span>
              <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-800/60 px-1.5 py-0.2 rounded font-mono uppercase">
                {roleConfig.badge}
              </span>
              <ChevronRight className={`h-3 w-3 text-slate-400 transition-transform ${roleSwitcherOpen ? 'rotate-90' : ''}`} />
            </button>

            {/* Persona Switcher Dropdown */}
            {roleSwitcherOpen && (
              <div
                className="absolute right-0 mt-2 w-72 md:w-80 rounded-xl bg-[#161b22] border border-slate-700/90 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setRoleSwitcherOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">10-Role Persona Switcher</p>
                  <p className="text-xs text-slate-500 mt-0.5">Switch role workspace to verify tailored views & controls</p>
                </div>
                <div className="max-h-[380px] overflow-y-auto space-y-1 pr-1">
                  {(Object.keys(ROLES) as RoleId[]).map((rId) => {
                    const r = ROLES[rId];
                    const Icon = ROLE_ICONS[rId];
                    const isSelected = rId === currentRole;
                    return (
                      <button
                        key={rId}
                        onClick={() => {
                          onRoleChange(rId);
                          onNavChange('Overview');
                          setRoleSwitcherOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                          isSelected
                            ? 'bg-red-600/15 text-red-400 border border-red-500/30'
                            : 'hover:bg-slate-800/70 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 ${isSelected ? 'text-red-400' : 'text-slate-400'}`} />
                          <div>
                            <div className="font-semibold">{r.name}</div>
                            <div className="text-[10px] text-slate-500 line-clamp-1">{r.tagline}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">{r.category.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
            <button className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 relative" title="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? 'block fixed inset-0 z-30 pt-16' : 'hidden'
          } md:block md:relative md:w-64 bg-[#11161d] border-r border-slate-800/80 p-4 shrink-0 flex flex-col justify-between`}
        >
          <div>
            {/* Active Workspace Info */}
            <div className="p-3 mb-4 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-red-400" />
                {roleConfig.category}
              </div>
              <div className="font-bold text-sm text-white mt-1">{roleConfig.name}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{roleConfig.tagline}</div>
            </div>

            {/* Navigation items allowed for this persona */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">Workspace Modules</div>
              {roleConfig.allowedNav.map((navItem) => {
                const isActive = activeNav.toLowerCase() === navItem.toLowerCase();
                return (
                  <button
                    key={navItem}
                    onClick={() => {
                      onNavChange(navItem);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-red-600 text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <span>{navItem}</span>
                    {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/80" />}
                  </button>
                );
              })}
            </div>

            {/* Role Governance & Core Responsibilities */}
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">Core Responsibilities</div>
              <ul className="space-y-1.5 px-3 mt-1">
                {roleConfig.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Footer info */}
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            <div>Branch: Lusaka HQ (Foxdale)</div>
            <div className="text-slate-600 text-[10px] mt-0.5">Dual-Enforced RBAC & Audit Trails</div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#0d1117] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
