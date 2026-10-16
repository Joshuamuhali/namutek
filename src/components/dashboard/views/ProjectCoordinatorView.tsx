import React, { useState } from 'react';
import {
  HardHat,
  Calendar,
  AlertOctagon,
  CheckCircle,
  Clock,
  Layers,
  Flag,
  ChevronRight,
} from 'lucide-react';

export const ProjectCoordinatorView: React.FC = () => {
  const [flaggedBlock, setFlaggedBlock] = useState(false);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Civil & Project Operations</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">Project Coordinator Workspace</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Coordinate construction, civil earthworks, mobilization milestones, plant dispatch & customer handover.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-950/60 text-amber-300 border border-amber-800/60 rounded-md text-xs font-semibold">
            Safeguard: Blocked tasks can be reported with cause, but cannot alter contract values
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Active Projects</span>
            <HardHat className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">4</div>
          <div className="text-[11px] text-slate-400 mt-1">2 Building, 2 Civil Earthworks</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Milestones Due This Week</span>
            <Calendar className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-blue-400">3</div>
          <div className="text-[11px] text-slate-400 mt-1">Foundation inspection scheduled</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Blocked Tasks</span>
            <AlertOctagon className="h-4 w-4 text-red-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-red-400">{flaggedBlock ? '2' : '1'}</div>
          <div className="text-[11px] text-red-400/90 mt-1 font-semibold">Awaiting site power clearance</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Awaiting Sign-off</span>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">1</div>
          <div className="text-[11px] text-slate-400 mt-1">Phase 1 Handover document ready</div>
        </div>
      </div>

      {/* Main Project Breakdown */}
      <div className="rounded-xl border border-slate-800 bg-[#161b22] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-red-400">PROJECT PRJ-2026-03</span>
            <h3 className="font-bold text-white text-base">Lusaka South MFEZ — Access Road & Culvert Earthworks</h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Overall Progress</span>
            <span className="text-emerald-400 font-black font-mono text-base">64% COMPLETE</span>
          </div>
        </div>

        {/* Milestones timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Milestone Execution Board</h4>
          <div className="space-y-2">
            {[
              {
                phase: 'Phase 1: Site Clearance & Topsoil Stripping',
                dates: '01 Oct - 08 Oct 2026',
                status: 'COMPLETED',
                notes: 'Signed off by resident engineer.',
              },
              {
                phase: 'Phase 2: Drainage Trench Excavation & Culvert Laying',
                dates: '09 Oct - 18 Oct 2026',
                status: 'IN PROGRESS',
                notes: 'CAT 320D Excavator on site. 120m laid.',
              },
              {
                phase: 'Phase 3: Sub-base Compaction & Aggregate Delivery',
                dates: '19 Oct - 26 Oct 2026',
                status: 'UPCOMING',
                notes: 'Awaiting aggregate dispatch from Kafue quarry.',
              },
            ].map((m, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{m.phase}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{m.dates} • {m.notes}</div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    m.status === 'COMPLETED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : m.status === 'IN PROGRESS'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {m.status}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => setFlaggedBlock(true)}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <Flag className="h-3.5 w-3.5 text-red-400" />
              {flaggedBlock ? 'Obstacle Flagged to Management' : 'Flag Site Delay / Obstacle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
