import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Send,
  Plus,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const QuotationOfficerView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'queue' | 'builder'>('queue');
  const [submittedRevision, setSubmittedRevision] = useState(false);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Commercial Operations</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">Quotation Workspace & Pricing Engine</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Turn customer requests into accurate, itemized formal quotations using approved pricing models.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-950/60 text-blue-300 border border-blue-800/60 rounded-md text-xs font-semibold">
            Strict Control: Officer prepares and submits; MD must approve before issuing
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Unpriced Requests</span>
            <Clock className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">8</div>
          <div className="text-[11px] text-amber-400 mt-1">3 Urgent (&gt;48h SLA)</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Draft Quotations</span>
            <FileText className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-200">5</div>
          <div className="text-[11px] text-slate-400 mt-1">In calculation stage</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Awaiting MD Approval</span>
            <ShieldCheck className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-400">3</div>
          <div className="text-[11px] text-slate-400 mt-1">Locked from alteration</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Returned Revisions</span>
            <RotateCcw className="h-4 w-4 text-red-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-red-400">1</div>
          <div className="text-[11px] text-slate-400 mt-1">Requires scope correction</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'queue' ? 'bg-red-600 text-white' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Unpriced Request Queue (8)
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'builder' ? 'bg-red-600 text-white' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Interactive Quotation Builder (Revision v1)
        </button>
      </div>

      {activeTab === 'queue' ? (
        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-5">
          <h3 className="font-bold text-white text-sm mb-3">Service Requests Requiring Formal Costing</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Ref ID</th>
                  <th className="p-3">Customer & Company</th>
                  <th className="p-3">Division</th>
                  <th className="p-3">Route / Location</th>
                  <th className="p-3">Est. Scope</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300">
                {[
                  {
                    id: 'REQ-2026-891',
                    client: 'Dangote Cement Zambia',
                    division: 'Freight & Haulage',
                    location: 'Ndola to Lusaka (320 km)',
                    scope: '120 MT bulk bagged cement',
                  },
                  {
                    id: 'REQ-2026-894',
                    client: 'Avic International',
                    division: 'Civil Infrastructure',
                    location: 'Lusaka Ring Road Site B',
                    scope: 'Drainage trenching & compaction',
                  },
                  {
                    id: 'REQ-2026-902',
                    client: 'Zambezi Resources',
                    division: 'Plant Hire',
                    location: 'Solwezi Mine Site',
                    scope: '2x 30T Excavator for 14 days dry hire',
                  },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono font-bold text-red-400">{item.id}</td>
                    <td className="p-3 font-medium text-white">{item.client}</td>
                    <td className="p-3">{item.division}</td>
                    <td className="p-3 text-slate-400">{item.location}</td>
                    <td className="p-3 text-slate-400">{item.scope}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setActiveTab('builder')}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-bold"
                      >
                        Build Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold text-red-400">ACTIVE QUOTATION DRAFT • Q-2026-118</span>
              <h3 className="font-bold text-white text-base">Dangote Cement Zambia — Bulk Freight</h3>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Pricing Version</span>
              <span className="text-xs font-mono font-bold text-emerald-400">v1.4.2 (Published)</span>
            </div>
          </div>

          {/* Line items table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Itemized Line Items</h4>
            <div className="rounded-lg border border-slate-800 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-400">
                  <tr>
                    <th className="p-2.5">Scope Description</th>
                    <th className="p-2.5">Unit</th>
                    <th className="p-2.5">Quantity</th>
                    <th className="p-2.5">Unit Rate (ZMW)</th>
                    <th className="p-2.5 text-right">Subtotal (ZMW)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="p-2.5 font-medium">30-Ton Tri-axle Freight (Ndola → Lusaka 320km)</td>
                    <td className="p-2.5">Trip</td>
                    <td className="p-2.5 font-mono">4</td>
                    <td className="p-2.5 font-mono">18,500.00</td>
                    <td className="p-2.5 font-mono text-right">74,000.00</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Loading & Offloading Crew Handling</td>
                    <td className="p-2.5">Ton</td>
                    <td className="p-2.5 font-mono">120</td>
                    <td className="p-2.5 font-mono">65.00</td>
                    <td className="p-2.5 font-mono text-right">7,800.00</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Road Toll & Transit Permits</td>
                    <td className="p-2.5">Fixed</td>
                    <td className="p-2.5 font-mono">4</td>
                    <td className="p-2.5 font-mono">450.00</td>
                    <td className="p-2.5 font-mono text-right">1,800.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Calculations summary */}
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-wrap justify-between items-center gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Calculated Direct Fuel & Fleet Cost:</span>
                <span className="text-slate-200 font-bold font-mono">ZMW 52,400.00</span>
              </div>
              <div>
                <span className="text-slate-400 block">Projected Margin:</span>
                <span className="text-emerald-400 font-bold font-mono">37.3% (Compliant &gt;28%)</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Total Quotation Value (VAT incl):</span>
                <span className="text-xl font-black text-white font-mono">ZMW 96,976.00</span>
              </div>
            </div>

            {submittedRevision ? (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Revision v1 locked and submitted to Managing Director for formal sign-off.</span>
              </div>
            ) : (
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setSubmittedRevision(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Send className="h-3.5 w-3.5" />
                  Submit Revision for MD Approval
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
