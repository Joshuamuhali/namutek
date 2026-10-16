import React, { useState } from 'react';
import {
  Smartphone,
  MapPin,
  CheckSquare,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Shield,
  FileCheck,
} from 'lucide-react';

export const FieldStaffView: React.FC = () => {
  const [checklist, setChecklist] = useState({
    vehicleInspected: true,
    cargoSecured: true,
    waybillSigned: false,
    offloadPhotoUploaded: false,
  });

  const [jobStatus, setJobStatus] = useState<'SCHEDULED' | 'DEPARTED' | 'ARRIVED' | 'DELIVERED'>('DEPARTED');

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Mobile-first Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest block">
            DRIVER & FIELD WORKSPACE
          </span>
          <h1 className="text-xl font-black text-white">Active Assignment #BK-2026-441</h1>
        </div>
        <span className="px-2.5 py-1 bg-red-950/80 text-red-300 border border-red-800 text-xs font-mono font-bold rounded">
          {jobStatus}
        </span>
      </div>

      {/* Safety Notice: Privacy & Scope Enforcement */}
      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
        <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>Restricted View: You have direct access only to your assigned work order and instructions.</span>
      </div>

      {/* Primary Job Card */}
      <div className="rounded-xl border border-slate-800 bg-[#161b22] p-4 space-y-4">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Route & Client Details</div>
          <div className="font-bold text-base text-white mt-0.5">Konkola Copper Mines (KCM)</div>
          <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
            <span>Lusaka Heavy Industrial Yard → Chililabombwe Plant Gate 4</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-2">
          <div className="text-slate-400 font-semibold">Authorized Cargo:</div>
          <div className="text-white font-medium">4x High-Tensile Slurry Pumps & Associated Valving (28 MT)</div>
          <div className="text-slate-400 pt-1 text-[11px]">
            Vehicle: Freightliner Argus (BAF 8921 ZM) • Escort vehicle required at Kapiri Mposhi
          </div>
        </div>

        {/* Task Checklist */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckSquare className="h-3.5 w-3.5 text-red-400" /> Pre-Trip & Delivery Checklist
          </div>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 text-slate-300 p-2 rounded bg-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.vehicleInspected}
                onChange={(e) => setChecklist({ ...checklist, vehicleInspected: e.target.checked })}
                className="rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-0"
              />
              <span>Pre-trip tyre pressure, fuel level & oil checks passed</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 p-2 rounded bg-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.cargoSecured}
                onChange={(e) => setChecklist({ ...checklist, cargoSecured: e.target.checked })}
                className="rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-0"
              />
              <span>Cargo lashing straps tensioned & tarpaulin fastened</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 p-2 rounded bg-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.waybillSigned}
                onChange={(e) => setChecklist({ ...checklist, waybillSigned: e.target.checked })}
                className="rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-0"
              />
              <span>Receiver site agent physical sign-off captured</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 p-2 rounded bg-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.offloadPhotoUploaded}
                onChange={(e) => setChecklist({ ...checklist, offloadPhotoUploaded: e.target.checked })}
                className="rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-0"
              />
              <span>Delivery proof photo uploaded (with timestamp)</span>
            </label>
          </div>
        </div>

        {/* Action Buttons for driver execution */}
        <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
          {jobStatus === 'DEPARTED' ? (
            <button
              onClick={() => setJobStatus('ARRIVED')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow"
            >
              Confirm Site Arrival
            </button>
          ) : jobStatus === 'ARRIVED' ? (
            <button
              onClick={() => {
                setJobStatus('DELIVERED');
                setChecklist({ ...checklist, waybillSigned: true, offloadPhotoUploaded: true });
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow"
            >
              Submit Signed Proof & Complete
            </button>
          ) : (
            <div className="col-span-2 p-2.5 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Trip Completed & Synced to Dispatch
            </div>
          )}

          <button className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5">
            <Camera className="h-3.5 w-3.5 text-slate-400" />
            Capture Photo
          </button>
        </div>
      </div>
    </div>
  );
};
