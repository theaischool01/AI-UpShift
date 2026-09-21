import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Sparkles, Layers, Briefcase, Eye } from 'lucide-react';
import { PROGRAMS_DATA } from '../data/programsData';
import MascotBadge from '../components/MascotBadge';

export default function ProgramsPage({ onSelectProgram, setActivePage }) {
  return (
    <div className="bg-[#FFFFFF] pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="container">
        {/* Editorial Page Header */}
        <div className="max-w-4xl mb-20">
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            6 Ways to Build with AI
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-[#111111] mb-6">
            PICK YOUR SKILL.<br />
            <span className="text-[#E91D2B]">BUILD YOUR PROOF.</span>
          </h1>
          <p className="font-display text-xl sm:text-2xl text-[#5A5751] font-medium max-w-2xl leading-relaxed">
            Each Upshift program develops a practical AI capability through hands-on work and portfolio-ready outputs.
          </p>
        </div>

        {/* Alternating Substantial Editorial Program Cards */}
        <div className="space-y-16">
          {PROGRAMS_DATA.map((program, index) => {
            const isEven = index % 2 === 1;
            return (
              <div
                key={program.id}
                className="bg-[#FAF8F5] border border-[#E7E4DF] rounded-3xl p-8 sm:p-12 transition-all hover:border-[#111111] shadow-sm relative overflow-hidden"
              >
                {/* Accent Ribbon Indicator */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: program.color }}
                ></div>

                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Text & Capability Details (7 cols) */}
                  <div className={`lg:col-span-7 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span 
                        className="px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider"
                        style={{ backgroundColor: program.bgColor, color: program.color }}
                      >
                        {program.code} // {program.category}
                      </span>
                      <span className="text-xs font-mono text-[#88857F]">
                        Cohort Ready
                      </span>
                    </div>

                    <h2 className="font-heading text-3xl sm:text-5xl text-[#111111] mb-3">
                      {program.name}
                    </h2>

                    <p className="text-lg font-semibold text-[#5A5751] mb-4">
                      "{program.tagline}"
                    </p>

                    <p className="text-sm sm:text-base text-[#666666] leading-relaxed mb-8 max-w-2xl">
                      {program.oneSentence}
                    </p>

                    {/* Skills & Deliverables Two-Column Sub-grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pt-6 border-t border-[#E7E4DF]">
                      <div>
                        <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#111111] mb-3 flex items-center gap-1.5">
                          <Sparkles size={14} className="text-[#E91D2B]" />
                          Example Skills
                        </h4>
                        <ul className="space-y-2 text-xs text-[#5A5751]">
                          {program.skills.slice(0, 4).map((s, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#111111]"></span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#111111] mb-3 flex items-center gap-1.5">
                          <Layers size={14} className="text-[#2563EB]" />
                          What You Build
                        </h4>
                        <ul className="space-y-2 text-xs text-[#5A5751]">
                          {program.whatYouBuild.slice(0, 3).map((w, i) => (
                            <li key={i} className="flex items-start gap-1.5 font-medium text-[#111111]">
                              <CheckCircle2 size={13} className="text-[#059669] shrink-0 mt-0.5" />
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-wrap items-center gap-4">
                      <Link
                        to={`/programs/${program.id}`}
                        className="btn btn-primary btn-md group"
                      >
                        <span>View Program Curriculum</span>
                        <ArrowUpRight size={15} className="btn-arrow" />
                      </Link>
                      <span className="text-xs font-mono text-[#88857F]">
                        Project-first evaluation · 100% Tangible
                      </span>
                    </div>
                  </div>

                  {/* Representative Artifact Box (5 cols) */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="bg-white rounded-2xl border border-[#E7E4DF] p-6 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E7E4DF] text-xs font-mono">
                        <span className="text-[#88857F]">REPRESENTATIVE ARTIFACT</span>
                        <span 
                          className="font-bold uppercase"
                          style={{ color: program.color }}
                        >
                          {program.code} Output
                        </span>
                      </div>

                      <div className="py-6 space-y-3">
                        <h3 className="font-heading text-xl text-[#111111] leading-snug">
                          {program.sampleArtifact.title}
                        </h3>
                        <p className="text-xs font-mono text-[#5A5751]">
                          {program.sampleArtifact.metrics}
                        </p>
                        <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E7E4DF] text-xs text-[#111111] font-medium">
                          <strong>Deliverable:</strong> {program.sampleArtifact.deliverable}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#E7E4DF] flex items-center justify-between">
                        <span className="text-xs text-[#88857F] font-mono">
                          Target Persona: {program.whoItsFor.split(',')[0]}
                        </span>
                        <button
                          onClick={() => onSelectProgram(program)}
                          className="text-xs font-display font-bold text-[#E91D2B] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Full Syllabus</span>
                          <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mascot Inspection Banner */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-[#FAF8F5] border border-[#E7E4DF] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="eyebrow">
              <span className="eyebrow-dot"></span>
              Human Quality Control
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl text-[#111111] mb-2">
              Every Program Teaches Human-In-The-Loop Judgment
            </h3>
            <p className="text-sm text-[#5A5751] leading-relaxed">
              Anyone can push a button. Upshifters are trained to critique, edit, fact-check, and refine AI outputs into commercial-grade deliverables that clients trust.
            </p>
          </div>
          <MascotBadge 
            pose="inspecting" 
            size="md" 
            caption="CRITICAL HUMAN JUDGMENT"
            showBadge={true}
          />
        </div>
      </div>
    </div>
  );
}
