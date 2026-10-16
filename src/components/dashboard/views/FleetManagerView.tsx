import React, { useState } from 'react';
import {
  Wrench,
  Truck,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Clock,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export const FleetManagerView: React.FC = () => {
  const [fleetAssets, setFleetAssets] = useState([
    {
      id: 'AST-01',
      plate: 'BAF 8921 ZM',
      model: 'Freightliner Argus 6x4',
      type: 'Heavy Haulage Truck',
      status: 'ALLOCATED',
      hours: '142,000 km',
      serviceDue: 'In 3,000 km',
    },
    {
      id: 'AST-02',
      plate: 'BAL 4102 ZM',
      model: 'Scania R500 Flatbed',
      type: 'Flatbed Transport',
      status: 'AVAILABLE',
      hours: '89,500 km',
      serviceDue: 'In 10,500 km',
    },
    {
      id: 'AST-03',
      plate: 'PLT-EX-01',
      model: 'CAT 320D Hydraulic Excavator',
      type: 'Earthmoving Plant',
      status: 'UNDER MAINTENANCE',
      hours: '4,210 hrs',
      serviceDue: 'Hydraulic Seal Replacement',
    },
    {
      id: 'AST-04',
      plate: 'BAK 1190 ZM',
      model: 'Volvo FH16 540 Globetrotter',
      type: 'Lowbed Haulage',
      status: 'AVAILABLE',
      hours: '112,000 km',
      serviceDue: 'In 8,000 km',
    },
  ]);

  const toggleMaintenance = (assetId: string) => {
    setFleetAssets((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          const nextStatus = a.status === 'UNDER MAINTENANCE' ? 'AVAILABLE' : 'UNDER MAINTENANCE';
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Fleet & Plant Engineering</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">Fleet & Heavy Plant Asset Registry</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Asset availability calendars, preventative maintenance schedules, downtime logs and roadworthiness audits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-950/60 text-amber-300 border border-amber-800/60 rounded-md text-xs font-semibold">
            Enforced Rule: Marking an asset 'Under Maintenance' instantly blocks it on Dispatch Board
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Total Fleet Assets</span>
            <Truck className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">24</div>
          <div className="text-[11px] text-slate-400 mt-1">16 Vehicles, 8 Plant Machinery</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Available For Dispatch</span>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">14</div>
          <div className="text-[11px] text-slate-400 mt-1">Fully certified & inspected</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>In Active Deployment</span>
            <Clock className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-blue-400">8</div>
          <div className="text-[11px] text-slate-400 mt-1">On road or active site</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Under Maintenance</span>
            <Wrench className="h-4 w-4 text-red-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-red-400">2</div>
          <div className="text-[11px] text-red-400/90 mt-1 font-semibold">Blocked from allocation</div>
        </div>
      </div>

      {/* Asset Table */}
      <div className="rounded-xl border border-slate-800 bg-[#161b22] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="font-bold text-white text-sm">Asset Health & Availability Register</h3>
          <span className="text-xs text-slate-400">Preventative maintenance overrides dispatch allocation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="p-3">Asset ID / Plate</th>
                <th className="p-3">Model & Specification</th>
                <th className="p-3">Type</th>
                <th className="p-3">Operating Hours</th>
                <th className="p-3">Maintenance Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {fleetAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-mono">
                    <span className="text-red-400 font-bold block">{asset.id}</span>
                    <span className="text-slate-400 text-[11px]">{asset.plate}</span>
                  </td>
                  <td className="p-3 font-medium text-white">{asset.model}</td>
                  <td className="p-3 text-slate-400">{asset.type}</td>
                  <td className="p-3 font-mono">{asset.hours}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        asset.status === 'AVAILABLE'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : asset.status === 'ALLOCATED'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-red-950 text-red-300 border border-red-800'
                      }`}
                    >
                      {asset.status}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">{asset.serviceDue}</span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleMaintenance(asset.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                        asset.status === 'UNDER MAINTENANCE'
                          ? 'bg-emerald-950 border-emerald-700 text-emerald-300 hover:bg-emerald-900'
                          : 'bg-red-950 border-red-800 text-red-300 hover:bg-red-900'
                      }`}
                    >
                      {asset.status === 'UNDER MAINTENANCE' ? 'Clear for Dispatch' : 'Mark Maintenance'}
                    </button>
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
