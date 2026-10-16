import React, { useState } from 'react';
import {
  Truck,
  Calendar,
  Clock,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  MapPin,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export const DispatcherView: React.FC = () => {
  const [allocationDone, setAllocationDone] = useState(false);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Transport & Movement Control</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">Dispatcher Operational Board</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Coordinate confirmed transport bookings, allocate available vehicles & drivers, and track daily trip execution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-950/60 text-amber-300 border border-amber-800/60 rounded-md text-xs font-semibold">
            Enforced Rule: Cannot allocate vehicles undergoing maintenance or already booked
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Today's Trips</span>
            <Calendar className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">12</div>
          <div className="text-[11px] text-emerald-400 mt-1">8 en route, 4 scheduled</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Awaiting Allocation</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-400">3</div>
          <div className="text-[11px] text-slate-400 mt-1">Requires driver/vehicle pairing</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Available Vehicles</span>
            <Truck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">9</div>
          <div className="text-[11px] text-slate-400 mt-1">Passed inspection checklist</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Schedule Conflicts</span>
            <AlertTriangle className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">0</div>
          <div className="text-[11px] text-emerald-400 mt-1">Zero overlaps detected</div>
        </div>
      </div>

      {/* Active Dispatch Board */}
      <div className="rounded-xl border border-slate-800 bg-[#161b22] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <h3 className="font-bold text-white text-sm">Confirmed Bookings & Movement Allocations</h3>
            <p className="text-xs text-slate-400">Dispatch schedule for today: Lusaka · Copperbelt · Solwezi corridor</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">Date: Today</span>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              id: 'BK-2026-441',
              cargo: '30 MT Steel Reinforcement Rods',
              route: 'Lusaka Heavy Industrial → Ndola Plant Site',
              departure: '06:30 CAT',
              status: 'EN ROUTE',
              vehicle: 'Freightliner Argus (BAF 8921 ZM)',
              driver: 'Mwansa Kabwe (Lic: CE-9912)',
              eta: '14:00 CAT (On schedule)',
            },
            {
              id: 'BK-2026-442',
              cargo: '18 MT Civil Earthmoving Bucket & Spare Teeth',
              route: 'Kafue Quarry → Lusaka South MFEZ',
              departure: '09:00 CAT',
              status: 'CONFIRMED / DISPATCHED',
              vehicle: 'Scania R500 Flatbed (BAL 4102 ZM)',
              driver: 'Peter Mulenga (Lic: CE-7731)',
              eta: '11:30 CAT',
            },
            {
              id: 'BK-2026-445',
              cargo: '24 MT Structural Steel Beams',
              route: 'Lusaka HQ Yard → Kitwe Roundabout Project',
              departure: '13:00 CAT',
              status: 'AWAITING ALLOCATION',
              vehicle: allocationDone ? 'Volvo FH16 (BAK 1190 ZM)' : 'Unassigned',
              driver: allocationDone ? 'Lameck Phiri (Lic: CE-3310)' : 'Unassigned',
              eta: '19:30 CAT',
            },
          ].map((trip, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-red-400">{trip.id}</span>
                  <span className="font-bold text-white">{trip.cargo}</span>
                </div>
                <div className="text-slate-400 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-red-400" /> {trip.route}
                </div>
                <div className="text-[11px] text-slate-500">
                  Planned Departure: <span className="text-slate-300 font-mono">{trip.departure}</span> • ETA: {trip.eta}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-semibold text-slate-200">{trip.vehicle}</div>
                  <div className="text-[11px] text-slate-400">{trip.driver}</div>
                </div>

                {trip.status === 'AWAITING ALLOCATION' && !allocationDone ? (
                  <button
                    onClick={() => setAllocationDone(true)}
                    className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow"
                  >
                    Allocate Fleet & Driver
                  </button>
                ) : (
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase font-mono ${
                      trip.status === 'EN ROUTE'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {trip.status === 'AWAITING ALLOCATION' && allocationDone ? 'ASSIGNED & READY' : trip.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
