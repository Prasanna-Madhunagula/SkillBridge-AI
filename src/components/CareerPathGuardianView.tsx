import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Compass,
  Layers,
  Sparkles,
  Award,
  BookMarked,
  HelpCircle,
} from 'lucide-react';
import { StudentProfile, EmergingSkillClassification } from '../types';
import { CAREER_PATH_GUARDIAN_CATALOG } from '../data/mockData';

interface CareerPathGuardianViewProps {
  student: StudentProfile;
  onNavigateToRoadmap?: (skillName: string) => void;
}

export const CareerPathGuardianView: React.FC<CareerPathGuardianViewProps> = ({
  student,
  onNavigateToRoadmap,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<string>(student.careerGoal || 'Full-Stack Web Developer');

  useEffect(() => {
    if (student.careerGoal) {
      setSelectedGoal(student.careerGoal);
    }
  }, [student.careerGoal]);
  const [customTrendInput, setCustomTrendInput] = useState('');
  const [evaluatedTrend, setEvaluatedTrend] = useState<EmergingSkillClassification | null>(null);

  const guardianData = CAREER_PATH_GUARDIAN_CATALOG[selectedGoal] || CAREER_PATH_GUARDIAN_CATALOG['Full-Stack Web Developer'];

  const studentSkillNames = new Set(student.skills.map((s) => s.name.toLowerCase()));
  const foundationalSkillsCount = guardianData.coreFoundations.length;
  const studentFoundationalSkillsCount = guardianData.coreFoundations.filter((skill) =>
    studentSkillNames.has(skill.toLowerCase())
  ).length;

  const isFoundationComplete = studentFoundationalSkillsCount >= Math.min(4, foundationalSkillsCount);

  // Intelligent trend evaluator simulator
  const handleEvaluateCustomTrend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTrendInput.trim()) return;

    const query = customTrendInput.trim().toLowerCase();

    // Deterministic intelligence matching
    if (query.includes('genai') || query.includes('ai') || query.includes('llm') || query.includes('gpt')) {
      setEvaluatedTrend({
        name: customTrendInput.trim(),
        category: 'Complementary',
        relevanceScore: 88,
        rationale: `${customTrendInput.trim()} is an emerging multiplier for ${selectedGoal} roles. However, models require standard application architecture to deploy.`,
        recommendedAction: isFoundationComplete
          ? `Congratulations! You have demonstrated core foundations in ${selectedGoal}. Adding ${customTrendInput.trim()} as an enhancement stage will significantly elevate your profile.`
          : `Complete your core ${selectedGoal} foundations first. Do NOT abandon your foundational roadmap. Schedule ${customTrendInput.trim()} as Stage 2.`,
        prerequisiteFoundation: 'Core Programming & Data Structures',
        stageTiming: isFoundationComplete ? 'Learn alongside' : 'Complete foundation first',
      });
    } else if (query.includes('web3') || query.includes('blockchain') || query.includes('crypto') || query.includes('solidity')) {
      setEvaluatedTrend({
        name: customTrendInput.trim(),
        category: 'Not Relevant',
        relevanceScore: 18,
        rationale: `Enterprise employment demand for ${selectedGoal} prioritizes established cloud, web, and data architectures over speculative crypto ecosystems.`,
        recommendedAction: `Guardian Warning: Do not derail your primary roadmap for speculative trends. Keep focus on verified industry requirements.`,
        prerequisiteFoundation: 'Advanced Distributed Systems',
        stageTiming: 'Deprioritize',
      });
    } else if (query.includes('docker') || query.includes('container') || query.includes('kubernetes') || query.includes('devops')) {
      setEvaluatedTrend({
        name: customTrendInput.trim(),
        category: 'Complementary',
        relevanceScore: 78,
        rationale: `Containerization is a standard industry operational skill that complements software engineering.`,
        recommendedAction: `Beneficial once you have built and deployed a working application. Learn basic Docker CLI commands.`,
        prerequisiteFoundation: 'Terminal / CLI & Server Basics',
        stageTiming: 'Complete foundation first',
      });
    } else if (query.includes('rust') || query.includes('go') || query.includes('golang')) {
      setEvaluatedTrend({
        name: customTrendInput.trim(),
        category: 'Optional',
        relevanceScore: 40,
        rationale: `Great systems language, but high initial learning curve and primarily required for low-level infrastructure rather than entry-level roles.`,
        recommendedAction: `Keep as an optional hobbyist exploration after establishing strong baseline proficiency in your primary stack.`,
        prerequisiteFoundation: 'Memory Management & Concurrency',
        stageTiming: 'Deprioritize',
      });
    } else {
      setEvaluatedTrend({
        name: customTrendInput.trim(),
        category: 'Optional',
        relevanceScore: 50,
        rationale: `Identified as a specialized tool for specific domains. Does not supersede core syllabus prerequisites.`,
        recommendedAction: `Anchor to your core career roadmap. Evaluate industry job postings for ${selectedGoal} before committing significant learning hours.`,
        prerequisiteFoundation: 'General Software Fundamentals',
        stageTiming: 'Complete foundation first',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Guardian Philosophy Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white p-6 sm:p-8 shadow-lg border border-indigo-800/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-3">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            Skill-Nexus Signature Stability Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Career Path Guardian
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Protects students from hype-driven career abandonment and “trend fatigue.”
            Industry hiring relies on rock-solid foundations. Guardian classifies new technologies into
            structured layers so you expand your capabilities without destroying your core progress.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-indigo-200">
              <Compass className="w-4 h-4 text-indigo-400" /> Goal: {student.careerGoal}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Layers className="w-4 h-4 text-emerald-400" /> Core Foundation Progress: {studentFoundationalSkillsCount}/{foundationalSkillsCount}
            </span>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Shield className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Career Goal & Foundation Status Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Foundation Health */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Core Foundation Map
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {selectedGoal}
            </span>
          </div>

          <p className="text-xs text-slate-600">
            These foundational competencies represent non-negotiable industry prerequisites.
          </p>

          <div className="space-y-2">
            {guardianData.coreFoundations.map((skill) => {
              const hasSkill = studentSkillNames.has(skill.toLowerCase());
              return (
                <div
                  key={skill}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                    hasSkill
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="font-semibold">{skill}</span>
                  {hasSkill ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Acquired
                    </span>
                  ) : (
                    <button
                      onClick={() => onNavigateToRoadmap?.(skill)}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium hover:underline flex items-center gap-0.5"
                    >
                      Study Roadmap <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Status Verdict */}
          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
            isFoundationComplete
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-1.5 font-bold mb-1">
              {isFoundationComplete ? (
                <Award className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
              {isFoundationComplete ? 'Core Foundation Secure' : 'Foundation Under Construction'}
            </div>
            {isFoundationComplete ? (
              <p>
                Congratulations! You have locked in the key pillars of {selectedGoal}. You are now in a primed position to layer on complementary skills like GenAI or Docker to increase your weighted opportunity matches!
              </p>
            ) : (
              <p>
                Guardian Advice: Prioritize completing your remaining foundational skills before branching into speculative or bleeding-edge frameworks. Recruiters evaluate fundamental problem solving first.
              </p>
            )}
          </div>
        </div>

        {/* Middle & Right: Trend Evaluator & Skill Categorization */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guardian Interactive Trend Evaluator */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Evaluate an Emerging Technology / Trend
                </h3>
                <p className="text-xs text-slate-500">
                  Hear about a new hype technology? Test it against your {selectedGoal} path.
                </p>
              </div>

              {/* Quick sample chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400">Try:</span>
                {['GenAI / LLMs', 'Docker', 'Rust', 'Web3'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setCustomTrendInput(item);
                    }}
                    className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleEvaluateCustomTrend} className="flex gap-2">
              <input
                type="text"
                value={customTrendInput}
                onChange={(e) => setCustomTrendInput(e.target.value)}
                placeholder="e.g. Generative AI, Rust, Web3, LangChain, Docker..."
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                Analyze Trend <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Evaluation Result Card */}
            {evaluatedTrend && (
              <div className="mt-4 p-5 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">{evaluatedTrend.name}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        evaluatedTrend.category === 'Core'
                          ? 'bg-emerald-100 text-emerald-800'
                          : evaluatedTrend.category === 'Complementary'
                          ? 'bg-blue-100 text-blue-800'
                          : evaluatedTrend.category === 'Optional'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {evaluatedTrend.category} Skill
                    </span>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                    Timing: {evaluatedTrend.stageTiming}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Rationale:</strong> {evaluatedTrend.rationale}
                </p>

                <div className="p-3 bg-white rounded-lg border border-slate-200/80 text-xs text-indigo-950 font-medium">
                  <strong>Guardian Recommendation:</strong> {evaluatedTrend.recommendedAction}
                </div>
              </div>
            )}
          </div>

          {/* Categorized Emerging Skills for Chosen Track */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-600" />
                Industry Skill Classification for {selectedGoal}
              </h3>
              <span className="text-xs text-slate-500">
                Guarded Taxonomy
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guardianData.emergingSkills.map((skill) => (
                <div
                  key={skill.name}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{skill.name}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                        skill.category === 'Core'
                          ? 'bg-emerald-100 text-emerald-800'
                          : skill.category === 'Complementary'
                          ? 'bg-blue-100 text-blue-800'
                          : skill.category === 'Optional'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {skill.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {skill.rationale}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Prereq: {skill.prerequisiteFoundation}</span>
                    <span className="font-semibold text-indigo-600">{skill.stageTiming}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SIH Architectural Note */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">Why Career Path Guardian Matters for SIH 2026: </span>
          College students frequently abandon 60-70% completed foundational tracks to pursue short-lived trend buzzwords, arriving at placement drives with shallow knowledge across 10 frameworks and zero depth. Guardian enforces pedagogical stability by categorizing emerging technologies as progressive multipliers rather than curriculum disruptors.
        </div>
      </div>
    </div>
  );
};
