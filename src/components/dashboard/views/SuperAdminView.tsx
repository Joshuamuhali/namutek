import React from 'react';
import {
  Users,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Server,
  Lock,
  Layers,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const SuperAdminView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title & Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">System Administration</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">Platform Governance & Security Audit</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure system parameters, RBAC permissions, integrations and inspect system health.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-950/60 text-amber-300 border border-amber-800/60 rounded-md text-xs font-semibold">
            Strict Separation: No Routine Quote Approvals or Payments
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Active Staff Accounts</span>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">28</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> All 10 roles provisioned
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Pending Access Requests</span>
            <Lock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-400">3</div>
          <div className="text-[11px] text-slate-400 mt-1">2 Field staff, 1 Dispatcher</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>System Health</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">99.98%</div>
          <div className="text-[11px] text-slate-400 mt-1">Postgres & Supabase live</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Failed Jobs / Webhooks</span>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-200">0</div>
          <div className="text-[11px] text-emerald-400 mt-1">WhatsApp & SMS gateway clear</div>
        </div>
      </div>

      {/* Priority Work & Security Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#161b22] p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm">Security & Administrative Audit Stream</h3>
              <p className="text-xs text-slate-400">Immutable audit logs capturing privilege escalation and system changes</p>
            </div>
            <button className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1">
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>
          <div className="divide-y divide-slate-800/80 text-xs mt-3">
            {[
              {
                time: '10 mins ago',
                actor: 'super_admin@namutek.com',
                event: 'Published Pricing Rule v1.4.2 (Civil Excavator Hourly base: ZMW 1,250)',
                level: 'CONFIG',
              },
              {
                time: '42 mins ago',
                actor: 'super_admin@namutek.com',
                event: 'Role assigned: field_staff to user mwansa.k@namutek.com',
                level: 'IAM',
              },
              {
                time: '2 hours ago',
                actor: 'system_monitor',
                event: 'Database backup snapshot verified: 0002_namutek_platform_schema',
                level: 'SYSTEM',
              },
              {
                time: '5 hours ago',
                actor: 'md@namutek.com',
                event: 'Commercial approval granted for Quotation Q-2026-089 (ZMW 142,000)',
                level: 'APPROVAL',
              },
            ].map((log, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-slate-200 font-medium">{log.event}</div>
                  <div className="text-[11px] text-slate-500">
                    By <span className="text-slate-400 font-mono">{log.actor}</span> • {log.time}
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] rounded border border-slate-700 bg-slate-800/60 font-mono text-slate-300">
                  {log.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Governance Guidelines */}
        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-red-500" /> Administrative Governance
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Super Admin manages infrastructure, RBAC permissions, service catalogue definitions and pricing formulas.
            </p>
            <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2">
              <div className="font-semibold text-slate-200">Enforced Safeguards:</div>
              <ul className="text-slate-400 space-y-1.5 list-disc pl-4 text-[11px]">
                <li>Cannot approve commercial quotations without Managing Director authorization.</li>
                <li>Cannot record or reconcile finance payments directly.</li>
                <li>All IAM modifications trigger instant webhook audit alerts.</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
            <span>Schema: v1.0 Production</span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
