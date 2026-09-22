import React from 'react';
import { X, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';
import { OpportunityMatchResult } from '../types';

interface ExplainMatchModalProps {
  matchResult: OpportunityMatchResult | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRoadmap?: (skillName: string) => void;
}

export const ExplainMatchModal: React.FC<ExplainMatchModalProps> = ({
  matchResult,
  isOpen,
  onClose,
  onNavigateToRoadmap,
}) => {
  if (!isOpen || !matchResult) return null;

  const { opportunity, skillMatchPercentage, skillGapPercentage, breakdown } = matchResult;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Explainable AI Matching Engine
              </span>
              <span className="text-xs text-slate-400 font-mono">SIH26044 Verified</span>
            </div>
            <h3 className="text-xl font-bold mt-1 text-white">
              {opportunity.role}
            </h3>
            <p className="text-sm text-slate-300">
              {opportunity.companyName} • {opportunity.workMode} • {opportunity.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary Score Bar */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="border-r border-slate-200 pr-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Requirement Coverage
                </span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Weighted Score
                </span>
              </div>
              <div className="text-3xl font-extrabold text-blue-700 mt-1">
                {skillMatchPercentage}%
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated from employer skill weight distribution
              </p>
            </div>

            <div className="pl-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Remaining Skill Gap
                </span>
                <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Actionable Area
                </span>
              </div>
              <div className="text-3xl font-extrabold text-amber-600 mt-1">
                {skillGapPercentage}%
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Addressable via guided learning roadmaps
              </p>
            </div>
          </div>

          {/* Detailed Skill Breakdown Table */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Required Skill Contribution Breakdown
              </h4>
              <span className="text-xs text-slate-500">Total Employer Weight: 100%</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Required Skill</th>
                    <th className="py-2.5 px-3 text-center">Company Weight</th>
                    <th className="py-2.5 px-3 text-center">Demonstrated Score</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {breakdown.map((item) => {
                    const isStrong = item.studentStatus === 'Strong';
                    const isPartial = item.studentStatus === 'Partial';
                    const isMissing = item.studentStatus === 'Missing';

                    return (
                      <tr key={item.skill} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          <div className="flex items-center gap-1.5">
                            {item.skill}
                            {item.verified && (
                              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800" title="Verified Skill">
                                Verified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-medium text-slate-600">
                          {item.weight}%
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-medium text-slate-700">
                          {item.demonstratedScore > 0 ? (
                            <span>
                              {item.demonstratedScore}%{' '}
                              {item.studentLevel && (
                                <span className="text-[10px] text-slate-400 font-sans">
                                  ({item.studentLevel.charAt(0)})
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {isStrong && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Strong
                            </span>
                          )}
                          {isPartial && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              <HelpCircle className="w-3.5 h-3.5" />
                              Partial
                            </span>
                          )}
                          {isMissing && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Missing
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold">
                          <span
                            className={
                              item.contribution > 0
                                ? 'text-emerald-700'
                                : 'text-slate-400'
                            }
                          >
                            +{item.contribution}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200 text-slate-800">
                  <tr>
                    <td className="py-2.5 px-3">Total Skill Match</td>
                    <td className="py-2.5 px-3 text-center">100%</td>
                    <td className="py-2.5 px-3 text-center text-slate-500 font-normal text-xs">
                      Evaluated
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-normal text-xs">
                      Requirement Coverage
                    </td>
                    <td className="py-2.5 px-3 text-right text-blue-700 font-mono text-base">
                      {skillMatchPercentage}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Transparent Mathematical Formula Box */}
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
              <span className="font-bold text-slate-800">Mathematical Formula:</span>{' '}
              <span className="font-mono text-indigo-700 font-semibold">
                Contribution = (Demonstrated Score × Company Weight) / 100
              </span>
              . Total match is the sum of contributions across all required skills. Company weights sum to exactly 100%. Student skills not required by this job do not artificially alter this match.
            </div>
          </div>

          {/* Missing Skills Learning Link */}
          {matchResult.missingSkills.length > 0 && onNavigateToRoadmap && (
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  Close Your Skill Gap
                </h5>
                <p className="text-xs text-indigo-700 mt-0.5">
                  Missing: {matchResult.missingSkills.join(', ')}. Study guided roadmaps to boost requirement coverage.
                </p>
              </div>
              <button
                onClick={() => {
                  onNavigateToRoadmap(matchResult.missingSkills[0]);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
              >
                Open Roadmap <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mandatory SIH Ethical Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-600 text-xs flex items-start gap-2.5">
            <div className="p-1 rounded-md bg-slate-200 text-slate-700 shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-800">Ethical AI Transparency: </span>
              This score represents weighted requirement coverage based on published employer criteria.
              It is an objective competency benchmark and is <strong className="text-slate-900 font-bold">NOT a guaranteed selection probability or employment guarantee</strong>.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
