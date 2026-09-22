import React from 'react';
import {
  Sparkles,
  ArrowRight,
  User,
  Building2,
  GraduationCap,
  Layers,
  Compass,
  Award,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Briefcase,
  BookOpen,
} from 'lucide-react';
import { UserRole } from '../types';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
  onOpenSystem: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onOpenSystem,
}) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-16 sm:py-24 text-center border border-indigo-900/40 shadow-xl">
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* SIH 2026 Project Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Smart India Hackathon 2026 • Problem Statement ID: SIH26044</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Bridge Skills to the{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">
              Right Opportunity
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            An AI-powered platform connecting students, industry and colleges through skill mapping, personalized learning and intelligent opportunity matching.
          </p>

          <p className="text-xs sm:text-sm text-indigo-300 font-mono">
            “From Current Skills → Skill Gap → Guided Learning → Verified Skills → Right Opportunity.”
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onSelectRole('student')}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSystem}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 text-slate-200 border border-white/20 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>How It Works</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />
      </section>

      {/* Three Stakeholder Cards Section */}
      <section className="space-y-6 max-w-6xl mx-auto px-2">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for the Entire Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            A unified loop empowering learners, hiring teams, and academic institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Student */}
          <div
            onClick={() => onSelectRole('student')}
            className="group p-8 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Stakeholder 01
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  STUDENT
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                “Discover your skill gaps and career opportunities.”
              </p>
              <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Weighted explainable skill match
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Stable 8-stage curated roadmap
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Career Path Guardian protection
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600 group-hover:text-blue-700">
              <span>Enter Student Experience</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Industry */}
          <div
            onClick={() => onSelectRole('company')}
            className="group p-8 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-400 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  Stakeholder 02
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  INDUSTRY
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                “Find candidates based on actual skill requirements.”
              </p>
              <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                  Skill weight allocation (100% total)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                  Objectively ranked candidates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                  Verified assessment & project proofs
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-purple-600 group-hover:text-purple-700">
              <span>Enter Industry Experience</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: College */}
          <div
            onClick={() => onSelectRole('college')}
            className="group p-8 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-400 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Stakeholder 03
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  COLLEGE
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                “Understand industry demand and improve skill readiness.”
              </p>
              <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                  Dual-bar demand vs coverage view
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                  Top 5 training priority rankings
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                  Action center for curriculum alignment
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-teal-600 group-hover:text-teal-700">
              <span>Enter College Experience</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Visual Ecosystem Explanation (Section 2) */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs max-w-6xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Systematic Feedback Loop
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            How The Ecosystem Connects
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            From raw inputs to measurable career and institutional outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Flow 1 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Student Journey
            </h3>
            <div className="text-xs text-slate-600 space-y-2 font-mono">
              <div className="p-2 rounded bg-white border border-slate-200">Student Skills</div>
              <div className="text-center text-slate-400">↓</div>
              <div className="p-2 rounded bg-white border border-slate-200">Skill Analysis</div>
              <div className="text-center text-slate-400">↓</div>
              <div className="p-2 rounded bg-white border border-slate-200">Skill Gap</div>
              <div className="text-center text-slate-400">↓</div>
              <div className="p-2 rounded bg-white border border-slate-200">Learning Roadmap</div>
              <div className="text-center text-slate-400">↓</div>
              <div className="p-2 rounded bg-white border border-slate-200">Skill Verification</div>
              <div className="text-center text-slate-400">↓</div>
              <div className="p-2 rounded bg-white border border-slate-200">Opportunity Matching</div>
              <div className="text-center text-slate-400">↓</div>
              <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                Internship / Placement
              </div>
            </div>
          </div>

          {/* Flow 2 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              Industry Demand Loop
            </h3>
            <div className="text-xs text-slate-600 space-y-2 font-mono">
              <div className="p-2 rounded bg-white border border-slate-200">Industry Requirements</div>
              <div className="text-center text-slate-400">↓</div>
              <div className="p-2 rounded bg-white border border-slate-200">Weighted Skill Requirements (100%)</div>
              <div className="text-center text-slate-400">↓</div>
              <div className="p-2 rounded bg-white border border-slate-200">Candidate Matching</div>
              <div className="text-center text-slate-400">↓</div>
              <div className="p-2 rounded bg-purple-50 border border-purple-200 text-purple-800 font-bold">
                Skill Gap Feedback
              </div>
            </div>
          </div>

          {/* Flow 3 */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-teal-600" />
              College Skill Intelligence
            </h3>
            <div className="text-xs text-slate-600 space-y-2 font-mono">
              <div className="p-2 rounded bg-white border border-slate-200">College Student Data</div>
              <div className="text-center text-slate-400">↓</div>
              <div className="p-2 rounded bg-white border border-slate-200">
                Student Skill Coverage + Industry Demand
              </div>
              <div className="text-center text-slate-400">↓</div>
              <div className="p-2 rounded bg-teal-50 border border-teal-200 text-teal-800 font-bold">
                Training Priorities & Action Center
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
