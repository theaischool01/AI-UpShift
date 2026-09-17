import React from 'react';
import { Pin, ArrowUpRight, Clock, FileText, CheckCircle } from 'lucide-react';

export default function BriefSheet({ brief, onInspect }) {
  return (
    <div 
      className="brief-sheet relative group cursor-pointer"
      style={{
        transform: `rotate(${brief.rotation})`,
      }}
      onClick={() => onInspect && onInspect(brief)}
    >
      {/* Studio Pushpin Visual */}
      <div 
        className="absolute -top-3 left-6 w-6 h-6 rounded-full shadow-md flex items-center justify-center border-2 border-white z-10"
        style={{ backgroundColor: brief.pinColor }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80"></div>
      </div>

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between pt-2 pb-3 border-b border-[#E7E4DF] text-xs">
        <span className="font-mono font-bold text-[#111111] tracking-wider">
          {brief.sheetNumber}
        </span>
        <span 
          className="font-display font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 rounded"
          style={{ backgroundColor: `${brief.pinColor}15`, color: brief.pinColor }}
        >
          {brief.track}
        </span>
      </div>

      {/* Title & Client */}
      <div className="py-4">
        <span className="text-[11px] font-medium text-[#88857F] uppercase tracking-wider block mb-1">
          Client Scenario: {brief.client}
        </span>
        <h3 className="font-heading text-xl text-[#111111] leading-snug group-hover:text-[#E91D2B] transition-colors">
          {brief.title}
        </h3>
      </div>

      {/* Raw Prompt / Input Seed */}
      <div className="p-3 bg-[#FAF8F5] rounded border border-[#E7E4DF] text-xs text-[#5A5751] mb-3">
        <div className="font-mono text-[10px] text-[#88857F] uppercase tracking-wider mb-1 flex items-center gap-1">
          <FileText size={11} />
          Input Seed / Raw Material
        </div>
        <p className="italic">"{brief.promptSeed}"</p>
      </div>

      {/* Required Deliverable */}
      <div className="space-y-2 mb-4 text-xs">
        <div className="text-[#111111] font-semibold flex items-start gap-1.5">
          <CheckCircle size={14} className="text-[#059669] shrink-0 mt-0.5" />
          <span><strong>Deliverable:</strong> {brief.deliverable}</span>
        </div>
        <div className="text-[#666666] text-[11px] pl-5 border-l-2 border-[#E7E4DF]">
          <strong>Studio Rule:</strong> {brief.keyConstraint}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="pt-3 border-t border-[#E7E4DF] flex items-center justify-between text-xs font-semibold text-[#111111]">
        <span className="flex items-center gap-1 font-mono text-[11px] text-[#88857F]">
          <Clock size={12} />
          {brief.deadline}
        </span>
        <span className="inline-flex items-center gap-1 text-[#E91D2B] group-hover:underline">
          <span>Inspect Studio Brief</span>
          <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
}
