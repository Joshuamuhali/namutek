import React, { useState } from 'react';
import {
  FileCheck2,
  TrendingUp,
  Truck,
  Receipt,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';

interface MDProps {
  onApproveQuote?: (quoteId: string) => void;
}

export const ManagingDirectorView: React.FC<MDProps> = () => {
  const [selectedQuote, setSelectedQuote] = useState<any | null>({
    id: 'Q-2026-104',
    customer: 'Konkola Copper Mines (KCM)',
    division: 'Freight & Heavy Haulage',
    scope: '4x 30-Ton Lowbed transport Lusaka to Chililabombwe (420 km) with escort',
    price: 'ZMW 186,500',
    directCost: 'ZMW 128,000',
    margin: '31.4%',
    preparedBy: 'quotation_officer@namutek.com',
    revision: 'v2 (Discount Override Applied)',
    riskFlags: ['High axle weight road permit required', 'Night driving restriction on T2 highway'],
    notes: 'Client requested 5% bulk transport concession. Within allowable target margin (>28%).',
  });

  const [approvalActionTaken, setApprovalActionTaken] = useState<string | null>(null);

  const pendingApprovals = [
    {
      id: 'Q-2026-104',
      customer: 'Konkola Copper Mines',
      division: 'Freight',
      amount: 'ZMW 186,500',
      margin: '31.4%',
      status: 'Awaiting MD Approval',
      urgency: 'HIGH',
    },
    {
      id: 'Q-2026-108',
      customer: 'First Quantum Minerals (FQM)',
      division: 'Plant Hire',
      amount: 'ZMW 340,000',
      margin: '38.2%',
      status: 'Awaiting MD Approval',
      urgency: 'MEDIUM',
    },
    {
      id: 'Q-2026-112',
      customer: 'Lusaka South Multi-Facility Zone',
      division: 'Civil Infrastructure',
      amount: 'ZMW 620,000',
      margin: '26.8%',
      status: 'Price Override Review',
      urgency: 'CRITICAL',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Executive Overview</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">
            Managing Director Operations & Commercial Review
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Company-wide decisions, commercial approvals, operational delivery health and realized revenue.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-red-950/60 text-red-300 border border-red-800/60 rounded-md text-xs font-semibold">
            Strict Control: Invoiced & Collected Cash vs Unaccepted Estimates
          </span>
        </div>
      </div>

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Open Service Requests</span>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">42</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>18 Qualified Leads</span>
            <span className="text-emerald-400 font-semibold">+14% this mo</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Quotes Awaiting Approval</span>
            <FileCheck2 className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-400">{pendingApprovals.length}</div>
          <div className="text-[11px] text-amber-500/90 mt-1 font-semibold">
            Requires MD authorization
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Active Operational Jobs</span>
            <Truck className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">19</div>
          <div className="text-[11px] text-slate-400 mt-1">14 Freight, 5 Plant Hire</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Outstanding Receivables</span>
            <Receipt className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">ZMW 1.15M</div>
          <div className="text-[11px] text-slate-400 mt-1">ZMW 820k collected MTD</div>
        </div>
      </div>

      {/* Main Approval Panel & Quotation Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Approvals Queue */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#161b22] p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm">Commercial Approval Queue</h3>
              <p className="text-xs text-slate-400">Formal quotations requiring executive sign-off</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 text-xs font-mono font-bold">
              {pendingApprovals.length} PENDING
            </span>
          </div>

          <div className="space-y-2 mt-4">
            {pendingApprovals.map((q) => {
              const isSelected = selectedQuote?.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuote(q)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-red-500 bg-red-950/20 shadow-sm'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{q.customer}</span>
                    <span className="text-[10px] font-mono font-bold text-red-400">{q.id}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
                    <span>{q.division}</span>
                    <span className="text-white font-semibold font-mono">{q.amount}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
                    <span className="text-emerald-400 font-mono">Margin: {q.margin}</span>
                    <span
                      className={`font-semibold uppercase text-[10px] px-1.5 py-0.5 rounded ${
                        q.urgency === 'CRITICAL'
                          ? 'bg-red-950 text-red-300'
                          : q.urgency === 'HIGH'
                          ? 'bg-amber-950 text-amber-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {q.urgency}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Quotation Full Decision Inspector */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#161b22] p-5">
          {selectedQuote ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-xs font-mono text-red-400">{selectedQuote.id} • {selectedQuote.revision || 'v1'}</div>
                  <h3 className="font-bold text-white text-base mt-0.5">{selectedQuote.customer}</h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Value</div>
                  <div className="text-xl font-black text-white font-mono">{selectedQuote.amount || selectedQuote.price}</div>
                </div>
              </div>

              {/* Scope & Costing Breakdown */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Service Scope & Route:</span>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed">
                    {selectedQuote.scope || 'Full comprehensive scope breakdown as calculated by Quotation Engineer.'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Direct Operating Cost:</span>
                    <span className="text-slate-200 font-mono font-bold text-sm">
                      {selectedQuote.directCost || 'ZMW 128,000'}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[11px] block">Calculated Net Margin:</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm">
                      {selectedQuote.margin}
                    </span>
                  </div>
                </div>

                {/* Risk Flags */}
                <div>
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5 mb-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-400" /> Operational Risk Flags:
                  </span>
                  <div className="space-y-1">
                    {(selectedQuote.riskFlags || ['Standard transport insurance policy applies']).map((risk: string, i: number) => (
                      <div key={i} className="text-slate-300 text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800/80">
                        • {risk}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Return / Approval action notifications */}
                {approvalActionTaken && (
                  <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Decision Recorded: {approvalActionTaken} on {selectedQuote.id}. Audit trail generated.</span>
                  </div>
                )}
              </div>

              {/* Action Buttons: MD Approval Control */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => setApprovalActionTaken('Returned for Revision with Notes')}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
                  Return for Revision
                </button>
                <button
                  onClick={() => setApprovalActionTaken('Rejected with Reason')}
                  className="px-3 py-2 rounded-lg bg-red-950 hover:bg-red-900 text-red-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject Quote
                </button>
                <button
                  onClick={() => setApprovalActionTaken('Approved Formal Quotation (Immutable)')}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Approve Quotation
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              Select a quotation from the queue to inspect cost breakdown and authorize.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
