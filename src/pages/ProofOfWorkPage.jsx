import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Filter, Sparkles, Smartphone, Monitor, FileText, Database, Share2, Layers } from 'lucide-react';
import { PROOF_PROJECTS, BRIEF_TO_PROOF_CASE } from '../data/proofData';
import MascotBadge from '../components/MascotBadge';

export default function ProofOfWorkPage({ setActivePage }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['ALL', 'VIDEO', 'DESIGN', 'DATA', 'CODE', 'MARKETING', 'AGENTS'];

  const filteredProjects = activeCategory === 'ALL'
    ? PROOF_PROJECTS
    : PROOF_PROJECTS.filter(p => p.category === activeCategory);

  return (
    <div className="bg-[#FFFFFF] pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="container">
        {/* Page Hero */}
        <div className="max-w-4xl mb-16">
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            The Digital Portfolio Exhibition
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-[#111111] mb-6">
            YOUR WORK IS<br />
            <span className="text-[#E91D2B]">THE RECEIPT.</span>
          </h1>
          <p className="font-display text-xl sm:text-2xl text-[#5A5751] font-medium max-w-2xl leading-relaxed">
            What you can show matters more than what you can claim. Welcome to the public gallery of deliverables shipped by Upshifters across all 6 disciplines.
          </p>
        </div>

        {/* Lightweight Editorial Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-12 pb-6 border-b border-[#E7E4DF]">
          <span className="text-xs font-mono text-[#88857F] uppercase mr-3 flex items-center gap-1">
            <Filter size={13} />
            Filter Discipline:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'bg-[#FAF8F5] text-[#5A5751] border border-[#E7E4DF] hover:border-[#111111]'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-xs font-mono text-[#88857F] ml-auto">
            Showing {filteredProjects.length} Verified Artifacts
          </span>
        </div>

        {/* Gallery of Representative Outputs (Varying Dimensions & Device Frames) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="bg-[#FAF8F5] border border-[#E7E4DF] rounded-3xl p-7 flex flex-col justify-between hover:border-[#111111] hover:shadow-md transition-all cursor-pointer group"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between mb-4">
                  <span 
                    className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider"
                    style={{ backgroundColor: `${project.accentColor}15`, color: project.accentColor }}
                  >
                    {project.category} // {project.format}
                  </span>
                  <span className="text-xs font-mono text-[#88857F]">
                    {project.program}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-2xl text-[#111111] mb-2 leading-snug group-hover:text-[#E91D2B] transition-colors">
                  {project.title}
                </h3>

                <p className="text-xs text-[#5A5751] leading-relaxed mb-6">
                  {project.briefSummary}
                </p>

                {/* Physical Deliverable Card View */}
                <div className="bg-white rounded-2xl border border-[#E7E4DF] p-5 mb-6 shadow-sm">
                  <div className="text-[10px] font-mono text-[#88857F] uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>BUSINESS PROBLEM SOLVED</span>
                    <span className="text-[#059669] font-bold">{project.badge}</span>
                  </div>
                  <p className="text-xs text-[#111111] font-medium leading-relaxed">
                    {project.problemSolved}
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#E7E4DF] flex flex-wrap gap-1">
                    {project.skillsUsed.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-[#FAF8F5] rounded text-[10px] font-mono text-[#5A5751]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Author & Inspection */}
              <div className="pt-4 border-t border-[#E7E4DF] flex items-center justify-between text-xs">
                <div>
                  <span className="font-display font-bold text-[#111111] block">
                    {project.author}
                  </span>
                  <span className="text-[11px] text-[#88857F]">
                    {project.role}
                  </span>
                </div>
                <span className="text-[#E91D2B] font-display font-bold flex items-center gap-1 group-hover:underline">
                  <span>Inspect Spec</span>
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ============================================================ */}
        {/* FROM BRIEF TO PROOF — CASE STUDY SECTION                     */}
        {/* ============================================================ */}
        <section className="p-8 sm:p-14 rounded-3xl bg-[#FAF8F5] border border-[#E7E4DF] mb-20">
          <div className="max-w-3xl mb-12">
            <span className="eyebrow">
              <span className="eyebrow-dot"></span>
              The Anatomy of Real Work
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl text-[#111111] mb-3">
              FROM BRIEF TO PROOF.
            </h2>
            <p className="font-display text-base sm:text-lg text-[#5A5751]">
              AI outputs alone are rough. Real proof requires the full sequence: client context, strategic thinking, model prompting, human refinement, and final packaging.
            </p>
            <div className="mt-3 inline-block px-3 py-1 bg-white border border-[#E7E4DF] rounded-md text-xs font-mono text-[#111111]">
              <strong>Live Case:</strong> {BRIEF_TO_PROOF_CASE.challengeTitle} · {BRIEF_TO_PROOF_CASE.clientType}
            </div>
          </div>

          {/* Connected Step Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {BRIEF_TO_PROOF_CASE.stages.map((st, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl border border-[#E7E4DF] p-5 flex flex-col justify-between shadow-sm relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#E91D2B]">
                      {st.step}
                    </span>
                    <span className="text-[10px] font-mono text-[#88857F] uppercase">
                      Stage {i + 1}
                    </span>
                  </div>
                  <h4 className="font-heading text-base text-[#111111] mb-1">
                    {st.name}
                  </h4>
                  <span className="text-[11px] font-mono text-[#059669] block mb-3 font-semibold">
                    {st.tagline}
                  </span>
                  <p className="text-xs text-[#5A5751] leading-relaxed">
                    {st.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-white rounded-xl border border-[#E7E4DF] flex items-center justify-between text-xs text-[#5A5751]">
            <span>
              <strong>Crucial Rule:</strong> Generative AI accelerates execution, but <strong>human judgment</strong> defines whether the asset is ready for real clients.
            </span>
            <span className="font-mono font-bold text-[#E91D2B] ml-4 shrink-0">
              HUMAN-IN-THE-LOOP STANDARD
            </span>
          </div>
        </section>

        {/* Project Inspection Modal */}
        {selectedProject && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in-up"
            onClick={() => setSelectedProject(null)}
          >
            <div 
              className="bg-white rounded-2xl border border-[#E7E4DF] max-w-2xl w-full p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E7E4DF] mb-6">
                <span className="font-mono text-xs uppercase font-bold text-[#E91D2B]">
                  {selectedProject.category} // {selectedProject.program}
                </span>
                <button 
                  onClick={() => setSelectedProject(null)} 
                  className="p-1.5 hover:bg-[#FAF8F5] rounded-full text-[#111111] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <h3 className="font-heading text-3xl text-[#111111] mb-3">
                {selectedProject.title}
              </h3>
              <p className="text-sm text-[#5A5751] mb-6">
                {selectedProject.briefSummary}
              </p>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E4DF]">
                  <span className="font-mono text-xs font-bold text-[#88857F] uppercase block mb-1">
                    Problem & Impact
                  </span>
                  <p className="text-xs text-[#111111]">
                    {selectedProject.problemSolved}
                  </p>
                </div>

                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E4DF]">
                  <span className="font-mono text-xs font-bold text-[#88857F] uppercase block mb-1">
                    Verified Deliverables
                  </span>
                  <p className="text-xs text-[#111111]">
                    {selectedProject.deliverables}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E7E4DF]">
                <div className="text-xs text-[#88857F]">
                  Author: <strong className="text-[#111111]">{selectedProject.author}</strong> ({selectedProject.role})
                </div>
                <button
                  onClick={() => {
                    alert(`Project asset spec verified for ${selectedProject.title}.`);
                    setSelectedProject(null);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <span>Close Spec</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mascot Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF8F5] border border-[#E7E4DF] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="eyebrow">
              <span className="eyebrow-dot"></span>
              Build Your Own Receipt
            </span>
            <h3 className="font-heading text-3xl text-[#111111] mb-3">
              Don't Leave Your Capability to Chance
            </h3>
            <p className="text-sm text-[#5A5751] leading-relaxed mb-6">
              Start with one flagship track, ship your first commercial deliverable, and add verifiable proof to your public record.
            </p>
            <button
              onClick={() => {
                setActivePage('programs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn btn-primary btn-md group"
            >
              <span>Explore The Programs</span>
              <ArrowUpRight size={15} className="btn-arrow" />
            </button>
          </div>
          <MascotBadge 
            pose="inspecting" 
            size="md" 
            caption="VERIFIABLE RECEIPT"
            showBadge={true}
          />
        </div>
      </div>
    </div>
  );
}
