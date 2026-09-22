import React, { useState } from 'react';
import {
  Building2,
  Users,
  UserCheck,
  Calendar,
  Briefcase,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Sparkles,
  HelpCircle,
  FileCheck,
  FolderGit2,
  Award,
  ChevronRight,
  ShieldCheck,
  X,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Filter,
  FileText,
  Eye,
  ExternalLink,
} from 'lucide-react';
import {
  Opportunity,
  StudentProfile,
  SkillWeight,
  OpportunityType,
  WorkPreference,
  CandidateMatch,
} from '../types';
import { TELANGANA_LOCATIONS, POPULAR_SKILLS } from '../data/mockData';
import {
  getRankedCandidatesForOpportunity,
  validateSkillWeights,
} from '../utils/matchingEngine';
import { toCanonicalSkill } from '../utils/skillNormalization';
import { ProofPreviewModal } from './ProofPreviewModal';

interface IndustryDashboardProps {
  currentCompany: string;
  opportunities: Opportunity[];
  students: StudentProfile[];
  onAddOpportunity: (newOpp: Opportunity) => void;
}

export const IndustryDashboard: React.FC<IndustryDashboardProps> = ({
  currentCompany,
  opportunities,
  students,
  onAddOpportunity,
}) => {
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>(
    opportunities[0]?.id || ''
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<CandidateMatch | null>(null);
  const [selectedCandidateStudentId, setSelectedCandidateStudentId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('skill_nexus_industry_candidate_student_id') || localStorage.getItem('skill_nexus_industry_candidate_student_id');
      } catch {
        // fallback
      }
    }
    return null;
  });

  const [previewProof, setPreviewProof] = useState<{
    fileName: string;
    fileType?: string;
    fileSize?: string;
    fileData: string;
    title?: string;
  } | null>(null);

  // Candidate Screening Pagination: 5 candidates per view
  const [candidatePageIndex, setCandidatePageIndex] = useState<number>(0);
  const PAGE_SIZE = 5;

  // New Opportunity Form State
  const [companyName, setCompanyName] = useState(currentCompany || 'CloudForge');
  const [role, setRole] = useState('');
  const [oppType, setOppType] = useState<OpportunityType>('Internship');
  const [workMode, setWorkMode] = useState<WorkPreference>('Hybrid');
  const [location, setLocation] = useState('Hyderabad');
  const [openings, setOpenings] = useState(3);
  const [stipendOrSalary, setStipendOrSalary] = useState('₹25,000 / month');
  const [description, setDescription] = useState('');
  const [skillsRequired, setSkillsRequired] = useState<SkillWeight[]>([
    { skill: 'JavaScript', weight: 30 },
    { skill: 'React', weight: 25 },
    { skill: 'Node.js', weight: 20 },
    { skill: 'SQL', weight: 15 },
    { skill: 'Git', weight: 10 },
  ]);

  // Current active opportunity for viewing candidates
  const activeOpportunity =
    opportunities.find((o) => o.id === selectedOpportunityId) || opportunities[0];

  // Candidates ranked by weighted skill match for the selected opportunity
  const rankedCandidates = activeOpportunity
    ? getRankedCandidatesForOpportunity(activeOpportunity, students)
    : [];

  const totalCandidates = rankedCandidates.length;
  const totalPages = Math.ceil(totalCandidates / PAGE_SIZE) || 1;
  const currentStart = candidatePageIndex * PAGE_SIZE;
  const visibleCandidates = rankedCandidates.slice(currentStart, currentStart + PAGE_SIZE);

  // Skill weight validation (Rule 1: MUST sum to 100%)
  const weightValidation = validateSkillWeights(skillsRequired);

  // Auto-restore or maintain candidate modal across reloads or student updates
  React.useEffect(() => {
    if (selectedCandidateStudentId && rankedCandidates.length > 0) {
      const match = rankedCandidates.find((c) => c.student.id === selectedCandidateStudentId);
      if (match) {
        setSelectedCandidateForModal(match);
      }
    }
  }, [selectedCandidateStudentId, rankedCandidates]);

  const handleOpenCandidateModal = (cand: CandidateMatch) => {
    setSelectedCandidateForModal(cand);
    setSelectedCandidateStudentId(cand.student.id);
    try {
      sessionStorage.setItem('skill_nexus_industry_candidate_student_id', cand.student.id);
      localStorage.setItem('skill_nexus_industry_candidate_student_id', cand.student.id);
    } catch {
      // ignore
    }
  };

  const handleCloseCandidateModal = () => {
    setSelectedCandidateForModal(null);
    setSelectedCandidateStudentId(null);
    try {
      sessionStorage.removeItem('skill_nexus_industry_candidate_student_id');
      localStorage.removeItem('skill_nexus_industry_candidate_student_id');
    } catch {
      // ignore
    }
  };

  // Handlers for dynamic skill weights in creation form
  const handleUpdateSkill = (index: number, skillName: string) => {
    const next = [...skillsRequired];
    next[index].skill = skillName;
    setSkillsRequired(next);
  };

  const handleUpdateWeight = (index: number, weightVal: number) => {
    const next = [...skillsRequired];
    next[index].weight = Number(weightVal) || 0;
    setSkillsRequired(next);
  };

  const handleAddSkillRow = () => {
    setSkillsRequired([...skillsRequired, { skill: 'Python', weight: 10 }]);
  };

  const handleRemoveSkillRow = (index: number) => {
    if (skillsRequired.length <= 1) return;
    setSkillsRequired(skillsRequired.filter((_, i) => i !== index));
  };

  // Publish opportunity handler (strictly requires 100% weight sum!)
  const handlePublishOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightValidation.isValid) return;
    if (!role.trim() || !description.trim()) return;

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      companyName: companyName.trim(),
      role: role.trim(),
      opportunityType: oppType,
      workMode: workMode,
      location: location,
      openings: Number(openings) || 1,
      description: description.trim(),
      skillsRequired: skillsRequired.map((s) => ({
        skill: toCanonicalSkill(s.skill.trim()),
        weight: Number(s.weight),
      })),
      postedDate: new Date().toISOString().split('T')[0],
      deadline: '2026-11-30',
      stipendOrSalary: stipendOrSalary.trim() || 'Competitive',
    };

    onAddOpportunity(newOpp);
    setSelectedOpportunityId(newOpp.id);
    setCandidatePageIndex(0);
    setIsCreateModalOpen(false);

    // Reset fields
    setRole('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Industry Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Employer Dashboard
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Enterprise Talent Sourcing
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-600" />
            {currentCompany} Talent Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Define weighted skill requirements (100% total), publish accredited openings, and discover objectively ranked candidates.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Opportunity
        </button>
      </div>

      {/* Recruitment Pipeline Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Pool</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{students.length}</div>
          <p className="text-xs text-slate-500 mt-1">Telangana college network</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">High Match</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-indigo-600">
            {rankedCandidates.filter((c) => c.matchPercentage >= 70).length}
          </div>
          <p className="text-xs text-slate-500 mt-1">≥70% requirement coverage</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Openings</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{opportunities.length}</div>
          <p className="text-xs text-slate-500 mt-1">Published opportunities</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Weight</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-700">100%</div>
          <p className="text-xs text-slate-500 mt-1">Strict mathematical standard</p>
        </div>
      </div>

      {/* Main Container: Active Roles & Ranked Candidates */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        {/* Opportunity Selector Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Job Openings
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Select Opportunity to Screen Candidates
            </h3>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {opportunities.map((opp) => (
              <button
                key={opp.id}
                onClick={() => {
                  setSelectedOpportunityId(opp.id);
                  setCandidatePageIndex(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  opp.id === selectedOpportunityId
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {opp.role}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Opportunity Weight Breakdown Card */}
        {activeOpportunity && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">
                  Target Weights for {activeOpportunity.role}:
                </span>
                <span className="text-xs text-slate-500">
                  {activeOpportunity.location} • {activeOpportunity.workMode} • {activeOpportunity.stipendOrSalary}
                </span>
              </div>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Total Weight: 100%
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeOpportunity.skillsRequired.map((sr) => (
                <span
                  key={sr.skill}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5"
                >
                  <span>{sr.skill}</span>
                  <span className="text-indigo-600 font-mono font-bold">({sr.weight}%)</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ranked Candidate Discovery Table / Cards (Screening) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Ranked Candidates ({totalCandidates})
              </span>
              <p className="text-xs text-slate-400">
                Screening batch: Showing {totalCandidates > 0 ? currentStart + 1 : 0}–{Math.min(currentStart + PAGE_SIZE, totalCandidates)} of {totalCandidates}
              </p>
            </div>

            {/* Candidate Screening Toggle Controls ("Show next 5" / "Show first 5") */}
            <div className="flex items-center gap-2">
              {candidatePageIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setCandidatePageIndex(0)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Show first 5
                </button>
              )}

              {candidatePageIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setCandidatePageIndex((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Previous 5
                </button>
              )}

              {currentStart + PAGE_SIZE < totalCandidates && (
                <button
                  type="button"
                  onClick={() => setCandidatePageIndex((prev) => prev + 1)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1"
                >
                  Show next 5 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {visibleCandidates.map((cand) => {
              const { student, matchPercentage, strongSkills, partialSkills, missingSkills, evidenceSummary } = cand;

              return (
                <div
                  key={student.id}
                  className="p-5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white transition-all shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Candidate Profile Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-slate-900">
                        {student.name}
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">
                        • {student.college}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                        <MapPin className="w-3 h-3 text-indigo-600" />
                        {student.preferredLocation || 'Hyderabad'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      {student.education} • {student.department} • Prefers {student.workPreference}
                    </p>

                    {/* Skill Alignment Badges */}
                    <div className="flex items-center gap-3 flex-wrap text-xs pt-1">
                      {strongSkills.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-emerald-700">Strong:</span>
                          <span className="text-slate-700">{strongSkills.join(', ')}</span>
                        </div>
                      )}
                      {partialSkills.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-blue-700">Partial:</span>
                          <span className="text-slate-700">{partialSkills.join(', ')}</span>
                        </div>
                      )}
                      {missingSkills.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-amber-700">Missing:</span>
                          <span className="text-slate-500">{missingSkills.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Evidence Badges */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-500">Verified Evidence:</span>
                      {evidenceSummary.length > 0 ? (
                        evidenceSummary.map((ev) => (
                          <span
                            key={ev}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80"
                          >
                            {ev === 'Assessment' && <Award className="w-3 h-3 text-emerald-600" />}
                            {ev === 'Project' && <FolderGit2 className="w-3 h-3 text-indigo-600" />}
                            {ev === 'Certificate' && <FileCheck className="w-3 h-3 text-amber-600" />}
                            {ev}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Self-Declared Profile</span>
                      )}

                      {student.achievements && student.achievements.length > 0 && (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {student.achievements.length} Supporting Achievements
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Match Percentage & Action */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-blue-700">
                        {matchPercentage}%
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                        Requirement Coverage
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenCandidateModal(cand)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Candidate Breakdown
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom screening navigator */}
          {totalCandidates > PAGE_SIZE && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span>
                Page {candidatePageIndex + 1} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={candidatePageIndex === 0}
                  onClick={() => setCandidatePageIndex(0)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-30 hover:bg-slate-50 font-medium"
                >
                  Show first 5
                </button>
                <button
                  type="button"
                  disabled={candidatePageIndex === 0}
                  onClick={() => setCandidatePageIndex((prev) => Math.max(0, prev - 1))}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-30 hover:bg-slate-50 font-medium"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentStart + PAGE_SIZE >= totalCandidates}
                  onClick={() => setCandidatePageIndex((prev) => prev + 1)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-30 hover:bg-slate-50 font-medium"
                >
                  Show next 5
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Match Breakdown Modal (Detailed Candidate View) */}
      {selectedCandidateForModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between shrink-0">
              <div>
                <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                  Employer Candidate Evaluation Breakdown
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {selectedCandidateForModal.student.name} • {selectedCandidateForModal.matchPercentage}% Requirement Coverage
                </h3>
                <p className="text-xs text-slate-400">
                  {activeOpportunity?.role} at {activeOpportunity?.companyName} • Prefers: {selectedCandidateForModal.student.preferredLocation || 'Hyderabad'}
                </p>
              </div>
              <button
                onClick={handleCloseCandidateModal}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Profile Summary Card */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">College</span>
                  <span className="font-bold text-slate-800 truncate block">{selectedCandidateForModal.student.college}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Preferred Location</span>
                  <span className="font-bold text-indigo-700">{selectedCandidateForModal.student.preferredLocation || 'Hyderabad'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Work Mode</span>
                  <span className="font-bold text-slate-800">{selectedCandidateForModal.student.workPreference}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Career Goal</span>
                  <span className="font-bold text-slate-800 truncate block">{selectedCandidateForModal.student.careerGoal}</span>
                </div>
              </div>

              {/* Required Skills & Contribution Breakdown Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Skill Requirement Contribution
                  </h4>
                  <span className="text-[11px] text-slate-500">Contribution = (Score × Weight) / 100</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 text-left">Skill Required</th>
                        <th className="py-2.5 px-3 text-center">Company Weight</th>
                        <th className="py-2.5 px-3 text-center">Demonstrated Score</th>
                        <th className="py-2.5 px-3 text-left">Strength</th>
                        <th className="py-2.5 px-3 text-right">Contribution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {selectedCandidateForModal.breakdown.map((row) => (
                        <tr key={row.skill}>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            <div className="flex items-center gap-1.5">
                              <span>{row.skill}</span>
                              {row.verified && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  Verified
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-medium">{row.weight}%</td>
                          <td className="py-2.5 px-3 text-center font-mono font-medium">
                            {row.demonstratedScore > 0 ? (
                              <span>{row.demonstratedScore}% ({row.studentLevel?.charAt(0)})</span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                row.studentStatus === 'Strong'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : row.studentStatus === 'Partial'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {row.studentStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-700">
                            +{row.contribution}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Supporting Evidence Overview (Certificates, Workshops & Hackathons) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Supporting Evidence & Non-Technical Achievements ({selectedCandidateForModal.student.achievements?.length || 0})
                </h4>

                {(!selectedCandidateForModal.student.achievements || selectedCandidateForModal.student.achievements.length === 0) ? (
                  <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">
                    No external certificates or hackathons logged. Candidate evaluated purely on verified technical demonstrations.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedCandidateForModal.student.achievements.map((ach) => (
                      <div
                        key={ach.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{ach.title}</span>
                              <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                                {ach.type}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {ach.issuerOrOrganizer} • {ach.date}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 flex-wrap">
                            {ach.associatedSkills.map((s) => (
                              <span key={s} className="px-1.5 py-0.2 rounded bg-white text-slate-600 text-[10px] border border-slate-200">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Supporting Evidence File & Credential URL */}
                        {(ach.fileName || ach.credentialUrl) && (
                          <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between gap-2 flex-wrap">
                            {ach.fileName ? (
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="flex items-center gap-1.5 text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-200 text-[11px]">
                                  <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  <span className="font-medium truncate max-w-[170px]" title={ach.fileName}>
                                    {ach.fileName}
                                  </span>
                                  {ach.fileSize && (
                                    <span className="text-slate-400 text-[10px]">({ach.fileSize})</span>
                                  )}
                                </div>
                                {ach.fileData && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setPreviewProof({
                                        fileName: ach.fileName!,
                                        fileType: ach.fileType || 'Document',
                                        fileSize: ach.fileSize,
                                        fileData: ach.fileData!,
                                        title: `${selectedCandidateForModal.student.name} - ${ach.title}`,
                                      })
                                    }
                                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                                  >
                                    <Eye className="w-3 h-3 text-amber-700" />
                                    <span>View / Open Proof</span>
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div />
                            )}

                            {ach.credentialUrl && (
                              <a
                                href={ach.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 text-[11px] font-bold inline-flex items-center gap-1"
                              >
                                <span>View Credential</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
                <strong>Objective Scoring Architecture:</strong> Candidate match strictly equals the sum of weighted skill contributions. Non-technical certificates and extra unrequested skills do not distort this match, ensuring fair and verifiable hiring.
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end shrink-0">
              <button
                onClick={handleCloseCandidateModal}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Opportunity Modal Form (Enforces 100% Total Weight) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                  Employer Publishing Portal
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Create & Publish Opportunity
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishOpportunity} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Role / Job Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Junior Backend Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Opportunity Type
                  </label>
                  <select
                    value={oppType}
                    onChange={(e) => setOppType(e.target.value as OpportunityType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Apprenticeship">Apprenticeship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Work Mode
                  </label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value as WorkPreference)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Location (Telangana)
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                  >
                    {TELANGANA_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Openings
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={openings}
                    onChange={(e) => setOpenings(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Stipend / Compensation
                  </label>
                  <input
                    type="text"
                    required
                    value={stipendOrSalary}
                    onChange={(e) => setStipendOrSalary(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Role Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline key technical responsibilities and team context..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Company Weightage Builder (RULE 1: MUST sum to exactly 100%) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Required Skills & Company Weightage
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Relative importance of each skill (Mandatory total: exactly 100%)
                    </p>
                  </div>

                  {/* Real-time sum meter */}
                  <div
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                      weightValidation.isValid
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    <span>Sum: {weightValidation.totalWeight}% / 100%</span>
                    {weightValidation.isValid && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                </div>

                <div className="space-y-2">
                  {skillsRequired.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={row.skill}
                        onChange={(e) => handleUpdateSkill(idx, e.target.value)}
                        placeholder="Skill Name"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                      />
                      <div className="flex items-center gap-1 w-28">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={row.weight}
                          onChange={(e) => handleUpdateWeight(idx, Number(e.target.value))}
                          className="w-16 px-2 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-center font-bold"
                        />
                        <span className="text-xs font-semibold text-slate-500">%</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillRow(idx)}
                        disabled={skillsRequired.length <= 1}
                        className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleAddSkillRow}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Another Skill
                  </button>

                  <span className={`text-[11px] font-medium ${weightValidation.isValid ? 'text-emerald-700' : 'text-amber-800'}`}>
                    {weightValidation.message}
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!weightValidation.isValid}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Publish Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Supporting Evidence Proof Preview Modal */}
      {previewProof && (
        <ProofPreviewModal
          fileName={previewProof.fileName}
          fileType={previewProof.fileType}
          fileSize={previewProof.fileSize}
          fileData={previewProof.fileData}
          title={previewProof.title}
          onClose={() => setPreviewProof(null)}
        />
      )}
    </div>
  );
};
