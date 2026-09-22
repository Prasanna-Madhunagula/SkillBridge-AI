import React from 'react';
import {
  Layers,
  Sparkles,
  Shield,
  Building2,
  GraduationCap,
  User,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Cpu,
  Database,
  Lock,
  Compass,
  FileCode,
  TrendingUp,
  Award,
} from 'lucide-react';

interface SystemOverviewProps {
  onNavigateToRole?: (role: 'student' | 'company' | 'college') => void;
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({ onNavigateToRole }) => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* SIH 2026 Pitch Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-800/40 pb-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Smart India Hackathon 2026
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Problem Statement ID: SIH26044
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Theme: Smart Automation • Category: Software
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              SKILL-NEXUS Architecture
            </h1>
            <p className="text-indigo-200 text-sm sm:text-base mt-1">
              “Bridging Skills to Opportunities” — A Multi-Stakeholder Intelligence Ecosystem
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Core Thesis</span>
            <span className="text-sm font-bold text-white">
              Competency-Driven Talent Matching
            </span>
          </div>
        </div>

        {/* Central Triangle Ecosystem Model */}
        <div className="mt-8 pt-2">
          <h2 className="text-center text-xs font-bold uppercase tracking-widest text-indigo-300 mb-6">
            The Three-Stakeholder Central AI Ecosystem
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Student Node */}
            <div
              onClick={() => onNavigateToRole?.('student')}
              className="p-5 rounded-2xl bg-white/5 border border-indigo-500/30 backdrop-blur-xs hover:bg-white/10 transition-all cursor-pointer text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center mx-auto border border-blue-400/30">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">STUDENTS</h3>
              <p className="text-xs text-slate-300">
                Input skills, calculate weighted gaps, follow stable learning roadmaps, earn verified credentials, and match relevant opportunities.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-300">
                Open Student View <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Central Engine Node */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-600/30 to-purple-600/30 border border-indigo-400/50 backdrop-blur-md text-center space-y-3 flex flex-col justify-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                SKILL-NEXUS AI
              </h3>
              <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                Central Matching & Verification Engine
              </p>
              <div className="text-[11px] text-slate-300 bg-black/30 p-2 rounded-xl font-mono">
                Score = ∑ (Weight_i × Proficiency_i)
              </div>
            </div>

            {/* Industry Node */}
            <div
              onClick={() => onNavigateToRole?.('company')}
              className="p-5 rounded-2xl bg-white/5 border border-indigo-500/30 backdrop-blur-xs hover:bg-white/10 transition-all cursor-pointer text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center mx-auto border border-purple-400/30">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">INDUSTRY</h3>
              <p className="text-xs text-slate-300">
                Publish openings with normalized 100% skill weights, discover objectively ranked candidates, and inspect verified evidence.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-300">
                Open Industry View <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Bottom College Node */}
          <div className="mt-6 max-w-md mx-auto">
            <div
              onClick={() => onNavigateToRole?.('college')}
              className="p-5 rounded-2xl bg-white/5 border border-teal-500/30 backdrop-blur-xs hover:bg-white/10 transition-all cursor-pointer text-center space-y-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center mx-auto border border-teal-400/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">COLLEGES</h3>
              <p className="text-xs text-slate-300">
                Access aggregate student skill coverage, analyze industry demand signals, and prioritize institutional curriculum interventions.
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-300">
                Open College View <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Three Stakeholder Workflow Pipelines (Section 17) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pipeline 1: Student Flow */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Pipeline</h3>
              <span className="text-xs text-slate-500">Learner Lifecycle</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {[
              '1. Current Skills + Career Goal Input',
              '2. Weighted Skill Analysis Engine',
              '3. Identified Skill Gap %',
              '4. Stable 8-Stage Learning Roadmap',
              '5. Assessment & Evidence Verification',
              '6. Ranked Opportunity Matching',
              '7. Internship / Placement Offer',
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 font-semibold text-slate-800 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline 2: Industry Flow */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Industry Pipeline</h3>
              <span className="text-xs text-slate-500">Recruiter Lifecycle</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {[
              '1. Opportunity Creation Portal',
              '2. Skill Weight Allocation (Total: 100%)',
              '3. Verified Opportunity Publishing',
              '4. Candidate Discovery & Weighted Ranking',
              '5. Transparent Skill Gap Feedback',
              '6. Evidence Audit (Assessments / Repos)',
              '7. Direct Shortlisting & Interviews',
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 font-semibold text-slate-800 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline 3: College Flow */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">College Pipeline</h3>
              <span className="text-xs text-slate-500">Institutional Lifecycle</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {[
              '1. Aggregate Student Skill Tracking',
              '2. Live Industry Demand Signal Intake',
              '3. Skill Gap Computation (Demand - Coverage)',
              '4. Top 5 Recommended Training Priorities',
              '5. Action Center Strategic Interventions',
              '6. Curriculum Alignment (Not Replacement)',
              '7. Cohort Readiness & Placement Uplift',
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 font-semibold text-slate-800 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Algorithmic Engine & Technical Stack Specifications */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Mathematical Matching Engine & Technical Architecture
            </h3>
            <p className="text-xs text-slate-500">
              Explainable, Non-Blackbox Algorithmic Formulation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formula Explanation */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Weighted Match Formula (Rule 2 & 3)
            </h4>
            <div className="p-3 bg-white rounded-lg font-mono text-slate-800 border border-slate-200">
              Match% = ∑ (W_i × C_i) for i in Required_Skills
            </div>
            <ul className="space-y-1.5 text-slate-600 list-disc pl-4">
              <li><strong>W_i:</strong> Employer skill weight (where ∑ W_i = 100%)</li>
              <li><strong>C_i:</strong> Candidate proficiency coefficient (1.0 for Strong/Verified, 0.6 for Partial/Developing, 0.0 for Missing)</li>
              <li><strong>Uncorrelated Skills:</strong> Extra skills not requested by the role do not artificially inflate the score (Rule 3)</li>
            </ul>
          </div>

          {/* Technical Specs */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-600" />
              SIH26044 Tech Stack Alignment
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-slate-400 block font-semibold">Frontend</span>
                <span className="font-bold text-slate-800">React 19 + TypeScript + Tailwind</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-slate-400 block font-semibold">Backend Ready</span>
                <span className="font-bold text-slate-800">Node.js + Express.js APIs</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-slate-400 block font-semibold">Database Schema</span>
                <span className="font-bold text-slate-800">Relational (MySQL / PostgreSQL)</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-slate-400 block font-semibold">Security & Ethics</span>
                <span className="font-bold text-slate-800">Zero Selection Probability Claims</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
