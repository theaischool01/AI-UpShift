import React from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2, Building, Briefcase, Zap, Globe, Sparkles } from 'lucide-react';
import { OPPORTUNITY_PATHWAYS, WHO_NEEDS_AI_GENERALISTS, CONCEPTUAL_CLASSIFIEDS } from '../data/opportunitiesData';
import MascotBadge from '../components/MascotBadge';

export default function OpportunitiesPage({ setActivePage }) {
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
            Career Trajectory & Pathways
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-[#111111] mb-6">
            BUILD SOMETHING USEFUL.<br />
            <span className="text-[#E91D2B]">TAKE IT SOMEWHERE REAL.</span>
          </h1>
          <p className="font-display text-xl sm:text-2xl text-[#5A5751] font-medium max-w-2xl leading-relaxed">
            Upshift doesn't sell false promises or guarantee arbitrary salaries. We prepare you with practical capabilities and verified proof to pursue real-world opportunities with confidence.
          </p>
        </div>

        {/* Opportunity Pathways Grid */}
        <div className="mb-24">
          <div className="flex items-center justify-between pb-4 border-b border-[#E7E4DF] mb-8">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-[#111111]">
              7 Opportunity Pathways
            </span>
            <span className="font-mono text-xs text-[#88857F]">
              Where Proof of Work Unlocks Value
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OPPORTUNITY_PATHWAYS.map((path) => (
              <div
                key={path.id}
                className="bg-[#FAF8F5] border border-[#E7E4DF] rounded-2xl p-7 flex flex-col justify-between hover:border-[#111111] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#E91D2B] mb-3">
                    <span className="font-bold uppercase tracking-wider">{path.scope}</span>
                  </div>

                  <h3 className="font-heading text-2xl text-[#111111] mb-3">
                    {path.title}
                  </h3>

                  <p className="text-xs text-[#5A5751] leading-relaxed mb-6">
                    {path.description}
                  </p>

                  <div className="p-3.5 bg-white rounded-xl border border-[#E7E4DF] mb-4">
                    <span className="text-[10px] font-mono text-[#88857F] uppercase block mb-1">
                      Typical Deliverable Unlocking Door
                    </span>
                    <p className="text-xs font-medium text-[#111111]">
                      {path.typicalDeliverable}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E7E4DF] flex flex-wrap gap-1.5">
                  {path.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-white rounded-full text-[10px] font-mono text-[#5A5751] border border-[#E7E4DF]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* WHO NEEDS AI GENERALISTS?                                    */}
        {/* ============================================================ */}
        <section className="mb-24 p-8 sm:p-14 rounded-3xl bg-[#FAF8F5] border border-[#E7E4DF]">
          <div className="max-w-3xl mb-12">
            <span className="eyebrow">
              <span className="eyebrow-dot"></span>
              Market Dynamics
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl text-[#111111] mb-3">
              WHO NEEDS AI GENERALISTS?
            </h2>
            <p className="font-display text-base sm:text-lg text-[#5A5751]">
              Large enterprises can afford 10 siloed specialists. But startups, creators, boutique agencies, and growing businesses desperately need versatile builders who can move across content, design, code, data, and automations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHO_NEEDS_AI_GENERALISTS.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E7E4DF] p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <h4 className="font-heading text-xl text-[#111111] mb-2">
                    {item.type}
                  </h4>
                  <p className="text-xs text-[#5A5751] leading-relaxed mb-4">
                    {item.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E7E4DF] text-[11px] font-mono text-[#059669]">
                  <strong>Core Need:</strong> {item.exampleNeed}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* CONCEPTUAL CLASSIFIEDS / NOTICE BOARD PIECES                */}
        {/* ============================================================ */}
        <div className="mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#E7E4DF] mb-8 gap-4">
            <div>
              <span className="font-display text-xs font-bold uppercase tracking-wider text-[#111111] block mb-1">
                Ecosystem Notice Board · Conceptual Briefs
              </span>
              <p className="text-xs text-[#88857F]">
                Representative examples of current real-world requests circulating across startup and freelance networks.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#E7E4DF] rounded text-[11px] font-mono text-[#5A5751]">
              Notice Board: Conceptual Examples
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONCEPTUAL_CLASSIFIEDS.map((item) => (
              <div
                key={item.id}
                className="p-7 rounded-2xl bg-[#FFFFFF] border border-[#E7E4DF] flex flex-col justify-between shadow-sm hover:border-[#111111] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-3">
                    <span className="text-[#E91D2B] font-bold uppercase">{item.engagement}</span>
                    <span className="text-[#88857F]">{item.location}</span>
                  </div>

                  <h3 className="font-heading text-xl text-[#111111] mb-1">
                    {item.role}
                  </h3>
                  <span className="text-xs font-medium text-[#88857F] block mb-4">
                    {item.organization}
                  </span>

                  <p className="text-xs text-[#5A5751] leading-relaxed mb-6 italic">
                    "{item.briefSnippet}"
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {item.neededCapabilities.map((cap, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#FAF8F5] rounded text-[10px] font-mono text-[#111111] font-medium border border-[#E7E4DF]">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E7E4DF]">
                  <span className="text-[10px] font-mono text-[#88857F] uppercase block mb-1">
                    Proof Required to Compete
                  </span>
                  <p className="text-xs font-semibold text-[#111111]">
                    {item.proofRequirement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Card */}
        <div className="p-8 sm:p-14 rounded-3xl bg-[#FAF8F5] border border-[#E7E4DF] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="eyebrow">
              <span className="eyebrow-dot"></span>
              The Sequence Matters
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl text-[#111111] mb-3">
              Build the Proof First.
            </h3>
            <p className="text-sm text-[#5A5751] leading-relaxed mb-6">
              Don't apply cold with an empty resume. Graduate from an Upshift program with 6 tangible deliverables you can show, and watch how conversations change.
            </p>
            <button
              onClick={() => handleNavigate('programs')}
              className="btn btn-primary btn-md group"
            >
              <span>Build the Proof First → Explore Programs</span>
              <ArrowUpRight size={15} className="btn-arrow" />
            </button>
          </div>
          <MascotBadge 
            pose="arrow" 
            size="md" 
            caption="MOVE FORWARD WITH PROOF"
            showBadge={true}
          />
        </div>
      </div>
    </div>
  );
}
