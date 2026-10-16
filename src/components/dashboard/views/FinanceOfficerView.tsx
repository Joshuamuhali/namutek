import React, { useState } from 'react';
import {
  Receipt,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  FileCheck,
  TrendingUp,
} from 'lucide-react';

export const FinanceOfficerView: React.FC = () => {
  const [recordedPayment, setRecordedPayment] = useState(false);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Finance & Commercial Invoicing</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">Finance Officer Workspace</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Issue tax-compliant invoices, record bank/mobile money receipts, manage customer aging receivables & reconciliation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 rounded-md text-xs font-semibold">
            Separation: Invoices generated only from accepted quotes or completed work orders
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Outstanding Balance</span>
            <Receipt className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">ZMW 1,148,000</div>
          <div className="text-[11px] text-slate-400 mt-1">Across 14 customer accounts</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Overdue (&gt;30 Days)</span>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-red-400">ZMW 245,000</div>
          <div className="text-[11px] text-red-400/90 mt-1 font-semibold">3 accounts require reminder</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Payments To Reconcile</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-400">{recordedPayment ? '3' : '4'}</div>
          <div className="text-[11px] text-slate-400 mt-1">Stanbic & Airtel Money receipts</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Issued This Period</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">ZMW 892,000</div>
          <div className="text-[11px] text-slate-400 mt-1">MTD Collections verified</div>
        </div>
      </div>

      {/* Invoices & Payment Register */}
      <div className="rounded-xl border border-slate-800 bg-[#161b22] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <h3 className="font-bold text-white text-sm">Commercial Invoices & Payment Audit</h3>
            <p className="text-xs text-slate-400">Linked directly to accepted quotations & confirmed delivery notes</p>
          </div>
          <button
            onClick={() => setRecordedPayment(true)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <Plus className="h-3.5 w-3.5" />
            Record Payment Receipt
          </button>
        </div>

        {recordedPayment && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Stanbic Bank Transfer (REF: FT26088912) recorded for INV-2026-081 (ZMW 85,000.00). Ledger updated.</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="p-3">Invoice No.</th>
                <th className="p-3">Client / Company</th>
                <th className="p-3">Linked Order / Quote</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Amount (ZMW)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {[
                {
                  id: 'INV-2026-081',
                  client: 'Konkola Copper Mines',
                  link: 'Q-2026-089 / BK-402',
                  due: '18 Oct 2026',
                  amount: '142,000.00',
                  status: recordedPayment ? 'PAID' : 'PARTIALLY PAID',
                },
                {
                  id: 'INV-2026-084',
                  client: 'Zambezi Resources',
                  link: 'Q-2026-094 / BK-418',
                  due: '12 Oct 2026',
                  amount: '78,500.00',
                  status: 'OVERDUE (3 Days)',
                },
                {
                  id: 'INV-2026-089',
                  client: 'Dangote Cement Zambia',
                  link: 'Q-2026-101 / BK-430',
                  due: '30 Oct 2026',
                  amount: '96,976.00',
                  status: 'ISSUED',
                },
              ].map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-mono font-bold text-red-400">{inv.id}</td>
                  <td className="p-3 font-medium text-white">{inv.client}</td>
                  <td className="p-3 font-mono text-slate-400">{inv.link}</td>
                  <td className="p-3 text-slate-400">{inv.due}</td>
                  <td className="p-3 font-mono font-bold text-white">{inv.amount}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        inv.status.includes('PAID')
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : inv.status.includes('OVERDUE')
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
