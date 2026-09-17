import React from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert, Sparkles, Layers, Briefcase, Award, Compass } from 'lucide-react';
import MascotBadge from '../components/MascotBadge';

export default function HowItWorksPage({ setActivePage }) {
  const handleNavigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#FFFFFF] pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="container">
        {/* Page Hero */}
        <div className="max-w-4xl mb-20">
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            The Upshift Pedagogy
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-[#111111] mb-6">
            LEARNING IS ONLY<br />
            <span className="text-[#E91D2B]">STEP ONE.</span>
          </h1>
          <p className="font-display text-xl sm:text-2xl text-[#5A5751] font-medium max-w-2xl leading-relaxed">
            The world doesn't pay for what you watched. It pays for what you can ship. Here is how Upshift bridges the gap between awareness and verified capability.
          </p>
        </div>

        {/* The 4-Stage Connected Methodology */}
        <div className="mb-28">
          <div className="border-b border-[#E7E4DF] pb-4 mb-10 flex items-center justify-between">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-[#111111]">
              The 4-Stage Operational Architecture
            </span>
            <span className="font-mono text-xs text-[#88857F]">
              Phase 01 to Phase 04
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stage 1 */}
            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E4DF] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#E91D2B] block mb-2">01 // SKILLS</span>
                <h3 className="font-heading text-2xl text-[#111111] mb-3">LEARN</h3>
                <p className="text-sm text-[#5A5751] leading-relaxed mb-6">
                  Master applied AI tooling around real commercial tasks: structured prompting, diffusion directing, agent tool calling, and evaluation schemas.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E7E4DF] text-xs font-mono text-[#88857F]">
                Input: Real industry use cases
              </div>
            </div>

            {/* Stage 2 */}
            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E4DF] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#2563EB] block mb-2">02 // SPRINT</span>
                <h3 className="font-heading text-2xl text-[#111111] mb-3">BUILD</h3>
                <p className="text-sm text-[#5A5751] leading-relaxed mb-6">
                  Complete hands-on sprint challenges and production deliverables modeled on real startup briefs, client constraints, and tight turnarounds.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E7E4DF] text-xs font-mono text-[#88857F]">
                Execution: Hands-on deliverables
              </div>
            </div>

            {/* Stage 3 */}
            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E4DF] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#059669] block mb-2">03 // RECEIPT</span>
                <h3 className="font-heading text-2xl text-[#111111] mb-3">PROVE</h3>
                <p className="text-sm text-[#5A5751] leading-relaxed mb-6">
                  Every finished output undergoes peer review and quality benchmarks to become public, verifiable proof of capability in your portfolio.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E7E4DF] text-xs font-mono text-[#88857F]">
                Evidence: Public portfolio wall
              </div>
            </div>

            {/* Stage 4 */}
            <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E4DF] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#EA580C] block mb-2">04 // TRACTION</span>
                <h3 className="font-heading text-2xl text-[#111111] mb-3">PURSUE</h3>
                <p className="text-sm text-[#5A5751] leading-relaxed mb-6">
                  Leverage your tangible proof to pitch freelance clients, apply for startup sprints, secure paid internships, and unlock early-career velocity.
                </p>
              </div>
              <div className="pt-4 border-t border-[#E7E4DF] text-xs font-mono text-[#88857F]">
                Destination: Real-world opportunities
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars: Diagrammatic & Editorial Layout */}
        <div className="space-y-24 mb-28">
          {/* Pillar 1: Project-First Learning */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#E91D2B] mb-2 block">
                Pillar 01
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-[#111111] mb-4">
                PROJECT-FIRST LEARNING.
              </h2>
              <p className="text-base text-[#5A5751] leading-relaxed mb-4">
                Traditional education front-loads theory and saves application for the final week. Upshift reverses this: every single lesson begins with a tangible commercial deliverable.
              </p>
              <p className="text-sm text-[#666666] leading-relaxed">
                You don't study generative models in the abstract; you build a 5-part video series, engineer a 3D packaging launch, or wire an automated lead enrichment agent.
              </p>
            </div>
            <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#E7E4DF] rounded-3xl p-8">
              <div className="text-xs font-mono text-[#88857F] uppercase mb-4">
                THE DELIVERABLE-DRIVEN SPRINT CYCLE
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-[#E7E4DF] flex items-center justify-between">
                  <span className="font-semibold text-[#111111] text-sm">Day 01: Client Context & Raw Material Brief</span>
                  <span className="text-xs font-mono text-[#E91D2B]">Deconstruct Problem</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#E7E4DF] flex items-center justify-between">
                  <span className="font-semibold text-[#111111] text-sm">Day 02: Prompt Engineering & Model Orchestration</span>
                  <span className="text-xs font-mono text-[#2563EB]">Rapid Generation</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#E7E4DF] flex items-center justify-between">
                  <span className="font-semibold text-[#111111] text-sm">Day 03: Human-in-the-Loop Polish & Client Handoff</span>
                  <span className="text-xs font-mono text-[#059669]">Editorial Finish</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 2: Role Simulations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1 bg-[#FAF8F5] border border-[#E7E4DF] rounded-3xl p-8">
              <div className="text-xs font-mono text-[#88857F] uppercase mb-4">
                SIMULATION SCENARIOS VS TOY ASSIGNMENTS
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-[#E7E4DF]">
                  <div className="text-xs font-bold text-[#E91D2B] mb-1">Generic Online Course</div>
                  <p className="text-xs text-[#5A5751]">"Write a prompt to describe an imaginary sunset in 3 sentences."</p>
                  <span className="text-[10px] font-mono text-[#88857F] block mt-2">Zero commercial value</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#059669]">
                  <div className="text-xs font-bold text-[#059669] mb-1">Upshift Role Simulation</div>
                  <p className="text-xs text-[#111111] font-medium">"Client gives a 40-min founder audio. Cut into 5 vertical reels with matching AI B-roll within 48h."</p>
                  <span className="text-[10px] font-mono text-[#059669] block mt-2">Commercial-grade deliverable</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-2 block">
                Pillar 02
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-[#111111] mb-4">
                ROLE SIMULATIONS.
              </h2>
              <p className="text-base text-[#5A5751] leading-relaxed mb-4">
                Instead of isolated syntax drills, Upshifters learn inside realistic simulations: working as startup operators, agency contractors, and venture builders.
              </p>
              <p className="text-sm text-[#666666] leading-relaxed">
                You experience the friction of conflicting client feedback, messy inputs, ambiguous briefs, and deadline pressure—the exact conditions of professional work.
              </p>
            </div>
          </div>

          {/* Pillar 3: Portfolio Over Passive Certification */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#059669] mb-2 block">
                Pillar 03
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-[#111111] mb-4">
                PORTFOLIO OVER PASSIVE CERTIFICATION.
              </h2>
              <p className="text-base text-[#5A5751] leading-relaxed mb-4">
                Certificates validate that you had a browser tab open. Proof of work demonstrates that you can solve real problems and ship tangible artifacts.
              </p>
              <p className="text-sm text-[#666666] leading-relaxed">
                Every Upshifter graduates with a verifiable digital portfolio displaying real deliverables: functional code, campaign suites, video assets, and agent architectures.
              </p>
            </div>
            <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#E7E4DF] rounded-3xl p-8 flex flex-col justify-center">
              <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-[#E7E4DF] shadow-sm mb-4">
                <Award size={32} className="text-[#88857F] shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase text-[#88857F]">Typical Certificate of Completion</div>
                  <p className="text-xs text-[#666666]">Proves: Attendance & multiple-choice quiz completion.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border-2 border-[#059669] shadow-sm">
                <CheckCircle2 size={32} className="text-[#059669] shrink-0" />
                <div>
                  <div className="text-xs font-bold uppercase text-[#059669]">Upshift Proof of Work</div>
                  <p className="text-xs text-[#111111] font-semibold">Proves: 6 production artifacts, live code URLs, audited datasets, and client-ready decks.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 4: Explore Before Specializing */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1 bg-[#FAF8F5] border border-[#E7E4DF] rounded-3xl p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {['Video', 'Design', 'Data', 'Code', 'Marketing', 'Agents'].map((track, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-[#E7E4DF] rounded-lg text-xs font-display font-bold text-[#111111]">
                    {track}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#5A5751] leading-relaxed">
                By gaining exposure across all 6 core disciplines, an Upshifter becomes an <strong>AI Generalist</strong>—someone capable of designing a campaign, generating the video, scripting the landing page, and wiring the automation loop.
              </p>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#EA580C] mb-2 block">
                Pillar 04
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-[#111111] mb-4">
                EXPLORE BEFORE SPECIALIZING.
              </h2>
              <p className="text-base text-[#5A5751] leading-relaxed mb-4">
                Don't guess what AI track fits you. Upshift lets learners test multiple applied disciplines before choosing deeper specialization.
              </p>
              <p className="text-sm text-[#666666] leading-relaxed">
                The most valuable talent in the modern economy is the <strong>T-shaped AI builder</strong>: broad multimodal literacy with deep excellence in one chosen craft.
              </p>
            </div>
          </div>
        </div>

        {/* Mascot & CTA Block */}
        <div className="p-8 sm:p-14 bg-[#FAF8F5] border border-[#E7E4DF] rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="eyebrow">
              <span className="eyebrow-dot"></span>
              Ready to Shift From Knowing to Doing?
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl text-[#111111] mb-4">
              Explore the 6 Flagship Capabilities
            </h3>
            <p className="text-sm text-[#5A5751] leading-relaxed mb-6">
              Pick your first discipline, tackle your first real brief, and start building verifiable proof today.
            </p>
            <button
              onClick={() => handleNavigate('programs')}
              className="btn btn-primary btn-md group"
            >
              <span>Explore Programs</span>
              <ArrowRight size={16} className="btn-arrow" />
            </button>
          </div>
          <MascotBadge 
            pose="builder" 
            size="md" 
            caption="READY TO BUILD"
            showBadge={true}
          />
        </div>
      </div>
    </div>
  );
}
