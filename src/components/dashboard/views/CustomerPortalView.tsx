import React, { useState } from 'react';
import {
  FileText,
  Truck,
  Receipt,
  Clock,
  CheckCircle,
  Download,
  Send,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const CustomerPortalView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'quotes' | 'bookings' | 'invoices'>('quotes');
  const [acceptedQuote, setAcceptedQuote] = useState(false);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Client Self-Service Portal</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">Customer Workspace & Tracking</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review formal quotations, accept terms, monitor confirmed bookings and download invoices with verified security.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-red-950/60 text-red-300 border border-red-800/60 rounded-md text-xs font-semibold">
            Account: Konkola Copper Mines (Verified Client ID: #CLT-981)
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'quotes' ? 'bg-red-600 text-white' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          My Quotations (1 Actionable)
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'bookings' ? 'bg-red-600 text-white' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Confirmed Bookings (2 Active)
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'invoices' ? 'bg-red-600 text-white' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Invoices & Statements
        </button>
      </div>

      {activeTab === 'quotes' ? (
        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-red-400">QUOTATION #Q-2026-104</span>
              <h3 className="font-bold text-white text-base">Heavy Haulage Lusaka → Chililabombwe (4x Lowbeds)</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Status</span>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                APPROVED BY MANAGEMENT
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Quotation Value:</span>
              <span className="text-white font-mono font-bold text-base">ZMW 186,500.00</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Includes VAT & Road Tolls</span>
            </div>
            <div className="p-3 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Validity:</span>
              <span className="text-slate-200 font-mono font-bold">Valid until 30 Oct 2026</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">14 Days Remaining</span>
            </div>
            <div className="p-3 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Payment Terms:</span>
              <span className="text-slate-200 font-bold">50% Advance on Booking</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Balance upon waybill sign-off</span>
            </div>
          </div>

          {acceptedQuote ? (
            <div className="p-4 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span>Quotation Accepted. Booking reference #BK-2026-455 generated and queued for Dispatch allocation.</span>
              </div>
              <button
                onClick={() => setActiveTab('bookings')}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold"
              >
                View Booking
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                <Download className="h-3.5 w-3.5" /> Download Formal PDF Quotation
              </button>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold">
                  Request Revision
                </button>
                <button
                  onClick={() => setAcceptedQuote(true)}
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
                >
                  Accept Quotation & Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === 'bookings' ? (
        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-5 space-y-3">
          <h3 className="font-bold text-white text-sm mb-2">Confirmed Service Bookings</h3>
          <div className="space-y-3">
            {[
              {
                id: 'BK-2026-441',
                cargo: '4x High-Tensile Slurry Pumps',
                status: 'IN TRANSIT (Kapiri Mposhi)',
                eta: 'Today, 14:00 CAT',
              },
              {
                id: 'BK-2026-412',
                cargo: 'Excavator Dry Hire (Solwezi)',
                status: 'CONFIRMED / MOBILIZATION 20 OCT',
                eta: 'Starts Monday',
              },
            ].map((bk, i) => (
              <div key={i} className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-mono font-bold text-red-400">{bk.id}</div>
                  <div className="text-white font-medium mt-0.5">{bk.cargo}</div>
                  <div className="text-slate-500 text-[11px]">ETA: {bk.eta}</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono text-[10px] font-bold">
                  {bk.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-5">
          <h3 className="font-bold text-white text-sm mb-3">Customer Invoices & Receipts</h3>
          <div className="text-xs text-slate-400 p-4 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-mono text-red-400 font-bold block">INV-2026-081</span>
              <span className="text-white font-medium">Lusaka → Chililabombwe Transport Advance (ZMW 85,000.00)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold">PAID</span>
          </div>
        </div>
      )}
    </div>
  );
};
