import React from 'react';
import { ArrowRight, ArrowUpRight, Globe, ShieldCheck, HeartHandshake, Compass, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import MascotBadge from '../components/MascotBadge';

export default function AboutPage({ setActivePage }) {
  const handleNavigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const gaps = [
    { from: "Education", to: "Application", note: "From passive lectures to building real-world deliverables." },
    { from: "AI Awareness", to: "Practical Capability", note: "From knowing ChatGPT exists to directing multitrack AI pipelines." },
    { from: "Qualification", to: "Proof of Work", note: "From attendance certificates to verified portfolio receipts." },
    { from: "Passive Learning", to: "Real Opportunity", note: "From waiting for jobs to proactively pitching clients and startups." }
  ];

  return (
    <div className="bg-[#FFFFFF] pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="container">
        {/* Page Hero */}
        <div className="max-w-4xl mb-20">
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            The Upshift Manifesto
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-[#111111] mb-6">
            THE GAP ISN'T ACCESS TO INFORMATION.<br />
            <span className="text-[#E91D2B]">IT'S ACCESS TO PRACTICAL CAPABILITY.</span>
          </h1>
          <p className="font-display text-xl sm:text-2xl text-[#5A5751] font-medium max-w-3xl leading-relaxed">
            Every person with an internet connection has access to the most powerful generative AI models in human history. The bottleneck is no longer access—it is knowing what to build, how to build it responsibly, and how to prove it.
          </p>
        </div>

        {/* The 4 Gaps We Bridge */}
        <div className="mb-24">
          <div className="pb-4 border-b border-[#E7E4DF] mb-8 flex items-center justify-between">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-[#111111]">
              The Core Transitions
            </span>
            <span className="font-mono text-xs text-[#88857F]">
              Why Upshift Exists
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gaps.map((gap, i) => (
              <div key={i} className="bg-[#FAF8F5] border border-[#E7E4DF] rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-[#E91D2B] font-bold uppercase mb-2">
                    Gap 0{i + 1}
                  </div>
                  <div className="text-lg font-heading text-[#111111] mb-1 flex items-center gap-2">
                    <span>{gap.from}</span>
                    <span className="text-[#E91D2B]">→</span>
                    <span>{gap.to}</span>
                  </div>
                  <p className="text-xs text-[#5A5751] mt-3 leading-relaxed">
                    {gap.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deep Narrative Sections */}
        <div className="space-y-20 mb-28">
          {/* Section: Practical AI Capability & Youth Employability */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="eyebrow">
                <span className="eyebrow-dot"></span>
                Youth Employability & Economic Mobility
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-[#111111] mb-4">
                PREPARING LEARNERS FOR THE WORK THAT ACTUALLY EXISTS.
              </h2>
              <p className="text-base text-[#5A5751] leading-relaxed mb-4">
                College students, recent graduates, and early-career creators are entering a labor market radically altered by artificial intelligence. Traditional resumes are losing their signaling power.
              </p>
              <p className="text-sm text-[#666666] leading-relaxed">
                Upshift acts as a career-launch springboard. By replacing rote memorization with role simulations and tangible sprint deliverables, we give young builders the exact proof of competence that modern founders, agencies, and small businesses are eager to pay for.
              </p>
            </div>
            <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#E7E4DF] rounded-3xl p-8 flex flex-col items-center justify-center">
              <MascotBadge 
                pose="builder" 
                size="md" 
                caption="CREATOR & BUILDER CULTURE"
                showBadge={true}
              />
            </div>
          </div>

          {/* Section: Responsible AI & Human-in-the-Loop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 bg-[#FAF8F5] border border-[#E7E4DF] rounded-3xl p-8">
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-[#E7E4DF]">
                  <div className="text-xs font-bold text-[#E91D2B] mb-1">Human Judgment is the Filter</div>
                  <p className="text-xs text-[#5A5751]">We reject mindless copy-paste. Every prompt output is subjected to editorial critique, fact-checking, and brand alignment.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#E7E4DF]">
                  <div className="text-xs font-bold text-[#2563EB] mb-1">Ethics & Attribution</div>
                  <p className="text-xs text-[#5A5751]">Learners are taught data hygiene, licensing standards, transparent AI disclosure, and bias auditing.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#E7E4DF]">
                  <div className="text-xs font-bold text-[#059669] mb-1">High Taste Over Raw Volume</div>
                  <p className="text-xs text-[#5A5751]">Producing 100 bad AI images is easy. Producing 3 impeccable brand assets that solve a client problem is the Upshift benchmark.</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2">
              <span className="eyebrow">
                <span className="eyebrow-dot"></span>
                Responsible AI Standard
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-[#111111] mb-4">
                COMBINING AI EFFICIENCY WITH HUMAN JUDGMENT.
              </h2>
              <p className="text-base text-[#5A5751] leading-relaxed mb-4">
                Artificial intelligence without human taste produces digital noise. Upshift instills a culture of discernment, accountability, and critical thinking.
              </p>
              <p className="text-sm text-[#666666] leading-relaxed">
                Our learners understand that AI is not an autonomous replacement for thought, but a high-leverage instrument. The value lies in the human orchestrator who knows how to evaluate accuracy, maintain brand tone, and deliver excellence.
              </p>
            </div>
          </div>
        </div>

        {/* Global Parent Brand & Footprint */}
        <div className="p-8 sm:p-14 bg-[#FAF8F5] border border-[#E7E4DF] rounded-3xl mb-24">
          <div className="max-w-3xl mb-8">
            <span className="eyebrow">
              <span className="eyebrow-dot"></span>
              The Parent Organization
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl text-[#111111] mb-3">
              THE AI SCHOOL GLOBAL ECOSYSTEM
            </h3>
            <p className="text-sm text-[#5A5751] leading-relaxed">
              Upshift is the flagship proof-of-work platform created by <strong>The AI School</strong>. Headquartered across key digital talent hubs with teams and learners active in:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#E7E4DF]">
            <div className="p-5 bg-white rounded-2xl border border-[#E7E4DF]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#111111] mb-1">
                <Globe size={16} className="text-[#E91D2B]" />
                <span>India Hub</span>
              </div>
              <p className="text-xs text-[#5A5751]">
                Serving engineering, design, and growth talent across high-velocity technology corridors.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#E7E4DF]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#111111] mb-1">
                <Globe size={16} className="text-[#2563EB]" />
                <span>Philippines Hub</span>
              </div>
              <p className="text-xs text-[#5A5751]">
                Powering global creative agencies, video operations, and autonomous business workflows.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#E7E4DF]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#111111] mb-1">
                <Globe size={16} className="text-[#059669]" />
                <span>USA & Global</span>
              </div>
              <p className="text-xs text-[#5A5751]">
                Connecting early-stage venture startups, D2C brands, and creator enterprises with certified Upshifters.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="font-heading text-3xl sm:text-4xl text-[#111111] mb-4">
            Become an Upshifter.
          </h3>
          <p className="text-sm text-[#5A5751] mb-6">
            Explore the flagship programs and start turning your AI curiosity into verifiable proof of work today.
          </p>
          <button
            onClick={() => handleNavigate('programs')}
            className="btn btn-primary btn-lg group"
          >
            <span>Explore Programs</span>
            <ArrowRight size={16} className="btn-arrow" />
          </button>
        </div>
      </div>
    </div>
  );
}
