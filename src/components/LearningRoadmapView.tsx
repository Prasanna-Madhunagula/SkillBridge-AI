import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Clock,
  ChevronRight,
  Sparkles,
  Award,
  Video,
  FileText,
  Code2,
  Layers,
  HelpCircle,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Bookmark,
} from 'lucide-react';
import { StudentProfile, KnowledgeState } from '../types';
import { SKILL_ROADMAPS } from '../data/mockData';
import { toCanonicalSkill } from '../utils/skillNormalization';

interface LearningRoadmapViewProps {
  student: StudentProfile;
  initialSkill?: string;
  onToggleStageCompletion: (skillName: string, stageNumber: number) => void;
  onNavigateToVerification?: (skillName: string) => void;
}

export const LearningRoadmapView: React.FC<LearningRoadmapViewProps> = ({
  student,
  initialSkill = 'JavaScript',
  onToggleStageCompletion,
  onNavigateToVerification,
}) => {
  const availableSkills = Object.keys(SKILL_ROADMAPS);
  const [selectedSkill, setSelectedSkill] = useState<string>(
    availableSkills.includes(initialSkill) ? initialSkill : 'JavaScript'
  );

  const canonicalSelected = toCanonicalSkill(selectedSkill);
  const roadmap = SKILL_ROADMAPS[canonicalSelected] || SKILL_ROADMAPS[selectedSkill] || SKILL_ROADMAPS['JavaScript'];
  const completedStages = student.completedRoadmapStages[canonicalSelected] || student.completedRoadmapStages[selectedSkill] || [];
  const totalStages = roadmap.stages.length;
  const progressPercent = Math.round((completedStages.length / totalStages) * 100);

  // Compute 4-state Partial Knowledge classification
  const studentSkill = student.skills.find(
    (s) => toCanonicalSkill(s.name).toLowerCase() === canonicalSelected.toLowerCase()
  );

  const demonstratedScore = studentSkill?.demonstratedScore ?? studentSkill?.confidenceScore ?? 0;
  const isVerified = studentSkill?.verified ?? false;

  let knowledgeState: KnowledgeState = 'Needs Learning';
  let knowledgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
  let stateExplanation = 'New foundational competency. Complete stages below to build practical readiness.';

  if (!studentSkill) {
    knowledgeState = 'Needs Learning';
    knowledgeColor = 'text-rose-700 bg-rose-50 border-rose-200';
    stateExplanation = 'Skill not yet in your portfolio. Work through foundational modules below.';
  } else if (isVerified && (demonstratedScore >= 80 || progressPercent === 100)) {
    knowledgeState = 'Mastered';
    knowledgeColor = 'text-emerald-800 bg-emerald-50 border-emerald-200';
    stateExplanation = `Demonstrated high technical mastery (${demonstratedScore}% score). Meets or exceeds enterprise benchmarks.`;
  } else if (demonstratedScore >= 50 || completedStages.length > 0) {
    knowledgeState = 'Needs Practice';
    knowledgeColor = 'text-blue-800 bg-blue-50 border-blue-200';
    stateExplanation = `Demonstrated partial competency (${demonstratedScore}% score, ${completedStages.length} stages completed). Targeted code challenges will bridge remaining gap.`;
  } else if (!isVerified && (studentSkill.evidenceTypes || []).length === 0) {
    knowledgeState = 'Not Assessed';
    knowledgeColor = 'text-purple-800 bg-purple-50 border-purple-200';
    stateExplanation = 'Self-declared competency without proctored technical diagnostic. Validate in Verification Hub.';
  } else {
    knowledgeState = 'Needs Learning';
    knowledgeColor = 'text-amber-800 bg-amber-50 border-amber-200';
    stateExplanation = 'Demonstrated score is below required benchmark. Follow structured curriculum below.';
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Personalized Learning Path
            </span>
            <span className="text-xs text-slate-500 font-medium">Verified Curricula</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            {roadmap.skillName} Mastery Roadmap
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {roadmap.description}
          </p>
        </div>

        {/* Skill Selector Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {availableSkills.map((skill) => {
            const canonical = toCanonicalSkill(skill);
            const isSelected = canonical.toLowerCase() === canonicalSelected.toLowerCase();
            const stagesDone = student.completedRoadmapStages[canonical]?.length || student.completedRoadmapStages[skill]?.length || 0;

            return (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
                }`}
              >
                <span>{canonical}</span>
                {stagesDone > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {stagesDone}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Partial Knowledge State Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Current Skill Proficiency State
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${knowledgeColor}`}>
                {knowledgeState}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {canonicalSelected}: {stateExplanation}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateToVerification?.(canonicalSelected)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Verify Score ({demonstratedScore}%)</span>
            </button>
          </div>
        </div>

        {/* 4 Knowledge States Legend */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 text-xs">
          <div className={`p-3 rounded-xl border ${knowledgeState === 'Mastered' ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mastered</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Score ≥80% with verified proctoring or completed roadmap.
            </p>
          </div>

          <div className={`p-3 rounded-xl border ${knowledgeState === 'Needs Practice' ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-1.5 font-bold text-blue-800">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Needs Practice</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Score 50–79% or active stages completed. Needs exercises.
            </p>
          </div>

          <div className={`p-3 rounded-xl border ${knowledgeState === 'Needs Learning' ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Needs Learning</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Score &lt;50% or unstarted. Begin with foundational stages.
            </p>
          </div>

          <div className={`p-3 rounded-xl border ${knowledgeState === 'Not Assessed' ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-500/20' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-1.5 font-bold text-purple-800">
              <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
              <span>Not Assessed</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Self-declared baseline. Take assessment to validate.
            </p>
          </div>
        </div>
      </div>

      {/* Progress & Milestone Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">
              Roadmap Progression
            </span>
            <div className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              <span>{completedStages.length} of {totalStages} Stages Completed</span>
              <span className="text-indigo-400 font-mono text-sm">({progressPercent}%)</span>
            </div>
          </div>

          {progressPercent === 100 ? (
            <button
              onClick={() => onNavigateToVerification?.(canonicalSelected)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Award className="w-4 h-4" /> Ready for Skill Verification!
            </button>
          ) : (
            <div className="text-xs text-slate-400">
              Complete stages to advance knowledge state from Needs Learning to Mastered.
            </div>
          )}
        </div>

        {/* Progress bar track */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Structured Stages Flow */}
      <div className="space-y-4">
        {roadmap.stages.map((stage) => {
          const isDone = completedStages.includes(stage.stageNumber);
          const isNextUp = !isDone && (completedStages.length === stage.stageNumber - 1 || completedStages.length === 0 && stage.stageNumber === 1);

          return (
            <div
              key={stage.stageNumber}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                isDone
                  ? 'border-emerald-200 shadow-xs bg-emerald-50/10'
                  : isNextUp
                  ? 'border-indigo-300 shadow-xs ring-1 ring-indigo-500/20'
                  : 'border-slate-200/90 shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left Stage Details */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : isNextUp
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {stage.stageNumber}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {stage.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium ml-auto sm:ml-0">
                      <Clock className="w-3.5 h-3.5" /> ~{stage.estimatedHours} hrs
                    </span>
                    <span
                      className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : isNextUp
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isDone ? 'Mastered' : isNextUp ? 'Needs Practice' : 'Needs Learning'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    <strong className="text-slate-800">Objective:</strong> {stage.objective}
                  </p>

                  {/* Key Topics tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] text-slate-400 font-semibold">Key Topics:</span>
                    {stage.keyTopics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Curated Resources */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                      Curated Free Resources:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {stage.resources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 text-xs text-slate-800 hover:text-indigo-600 transition-colors group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            {res.type === 'Video' && <Video className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                            {res.type === 'Interactive Tutorial' && <Code2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                            {res.type === 'Article' && <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                            {res.type === 'Project Guide' && <Layers className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                            <span className="truncate font-medium">{res.title}</span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200 group-hover:text-indigo-600 shrink-0 ml-1">
                            {res.provider}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Action: Mark as Completed Toggle */}
                <div className="md:border-l md:border-slate-100 md:pl-5 flex md:flex-col items-center justify-between md:justify-center gap-3 shrink-0">
                  <button
                    onClick={() => onToggleStageCompletion(canonicalSelected, stage.stageNumber)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
                      isDone
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-white' : 'text-slate-400'}`} />
                    {isDone ? 'Stage Completed' : 'Mark Completed'}
                  </button>

                  <button
                    onClick={() => onNavigateToVerification?.(canonicalSelected)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center gap-1"
                  >
                    Verify Skill <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
