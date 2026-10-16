import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  PhoneCall,
  CalendarCheck,
  CheckCircle,
  MessageSquare,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const SalesOfficerView: React.FC = () => {
  const [pipelineFilter, setPipelineFilter] = useState('all');

  const pipelineStages = [
    { title: 'New Enquiries', count: 6, color: 'border-blue-500' },
    { title: 'Contacted & Qual', count: 4, color: 'border-indigo-500' },
    { title: 'Quotation In Prog', count: 3, color: 'border-amber-500' },
    { title: 'Quoted (Awaiting)', count: 5, color: 'border-emerald-500' },
    { title: 'Won & Booked', count: 8, color: 'border-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Commercial Pipeline</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">Sales Officer Pipeline & CRM</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Qualify leads, follow up client enquiries, log interaction history, and track opportunity conversions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 rounded-md text-xs font-semibold">
            Separation: Follow-up & CRM stages do not alter approved financial margins
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>New Enquiries</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">6</div>
          <div className="text-[11px] text-emerald-400 mt-1">2 from Web Portal today</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Follow-ups Due Today</span>
            <PhoneCall className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-400">4</div>
          <div className="text-[11px] text-slate-400 mt-1">Schedule calls before 15:00</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Awaiting Customer</span>
            <Clock className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">5</div>
          <div className="text-[11px] text-slate-400 mt-1">Formal quotes issued</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Won Quotations</span>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">8</div>
          <div className="text-[11px] text-slate-400 mt-1">ZMW 940k volume converted</div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="rounded-xl border border-slate-800 bg-[#161b22] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="font-bold text-white text-sm">Commercial Opportunity Pipeline</h3>
          <span className="text-xs text-slate-400">Drag or update stage according to qualification</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {pipelineStages.map((stage, idx) => (
            <div key={idx} className="rounded-lg bg-slate-900 border border-slate-800 p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200">{stage.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {stage.count}
                  </span>
                </div>
                <div className={`h-1 w-full rounded-full bg-slate-800 mb-3 border-t-2 ${stage.color}`} />

                {/* Sample opportunity card in column */}
                <div className="p-2.5 rounded bg-[#161b22] border border-slate-800 space-y-1.5 text-xs">
                  <div className="font-bold text-white">Chibuluma Mines</div>
                  <div className="text-[11px] text-slate-400">3x Dump Truck Hire</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                    <span>Follow-up: Today</span>
                    <span className="text-emerald-400 font-mono">ZMW 75k</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
