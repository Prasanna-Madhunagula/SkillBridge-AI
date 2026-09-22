import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  TrendingUp,
  Award,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  BarChart3,
  Compass,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  X,
  Clock,
  User,
  MapPin,
} from 'lucide-react';
import {
  COLLEGE_SKILL_INTELLIGENCE,
  COLLEGE_TRAINING_PRIORITIES,
} from '../data/mockData';
import { CollegeTrainingPriority } from '../types';

interface CollegeInitiative {
  id: string;
  title: string;
  skill: string;
  targetCohort: string;
  duration?: string;
  startDate?: string;
  instructor?: string;
  mode?: 'Offline' | 'Online' | 'Hybrid';
  status: string;
  statusBadgeColor?: string;
  isNew?: boolean;
}

const DEFAULT_INITIATIVES: CollegeInitiative[] = [
  {
    id: 'init-1',
    title: '4-Week SQL Query Bootcamp',
    skill: 'SQL',
    targetCohort: '3rd Year CSE (240 students)',
    duration: '4 Weeks (20 Hours)',
    startDate: '2026-10-10',
    instructor: 'Prof. Dr. K. Rao (DBA Dept)',
    mode: 'Hybrid',
    status: 'Approved for Oct 2026',
    statusBadgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'init-2',
    title: 'Python Data Science Lab',
    skill: 'Python',
    targetCohort: '2nd Year IT (180 students)',
    duration: '3 Weeks (15 Hours)',
    startDate: '2026-10-24',
    instructor: 'Visiting Industry Lead (T-Hub)',
    mode: 'Offline',
    status: 'Lab Environment Configured',
    statusBadgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    id: 'init-3',
    title: 'Git & Open Source Workshop',
    skill: 'Git',
    targetCohort: '1st Year Engineering (420 students)',
    duration: '2 Days (Weekend)',
    startDate: '2026-11-07',
    instructor: 'College OSS Club & Mentors',
    mode: 'Offline',
    status: 'Scheduled Weekend Hackathon',
    statusBadgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
];

interface CollegeDashboardProps {
  collegeName?: string;
}

export const CollegeDashboard: React.FC<CollegeDashboardProps> = ({
  collegeName = 'Sphoorthy Engineering College',
}) => {
  const [selectedPriorityTab, setSelectedPriorityTab] = useState<string>('all');
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Active college initiatives state (initialized with defaults or saved sessions)
  const [initiatives, setInitiatives] = useState<CollegeInitiative[]>(() => {
    try {
      const saved = localStorage.getItem('skillnexus_college_initiatives');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_INITIATIVES;
  });

  // Workshop planning modal & form state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planForm, setPlanForm] = useState({
    workshopName: '',
    skill: '',
    targetCohort: '',
    duration: '',
    startDate: '',
    instructor: '',
    mode: 'Hybrid' as 'Offline' | 'Online' | 'Hybrid',
    notes: '',
  });

  // Top 3-5 training priorities strictly ordered by skill gap (Section 14)
  const topPriorities = COLLEGE_TRAINING_PRIORITIES.slice(0, 5);

  const handleOpenPlanWorkshop = (tp: CollegeTrainingPriority) => {
    const defaultCohort =
      tp.priorityLabel === 'Highest Priority'
        ? '3rd Year CSE & IT (240 students)'
        : tp.priorityLabel === 'Next Priority'
        ? '2nd & 3rd Year IT & CSE (180 students)'
        : '3rd & 4th Year Engineering (150 students)';

    const defaultDuration =
      tp.skillName === 'Statistics'
        ? '2 Weeks (12 Hours)'
        : tp.skillName === 'SQL'
        ? '4 Weeks (20 Hours)'
        : '3 Weeks (15 Hours)';

    const defaultInstructor =
      tp.skillName === 'SQL'
        ? 'Prof. Dr. K. Rao & Industry DBA Lead'
        : tp.skillName === 'Python'
        ? 'Dr. S. Reddy & Python Specialist'
        : tp.skillName === 'Machine Learning'
        ? 'Prof. P. Varma & AI Research Mentor'
        : tp.skillName === 'Statistics'
        ? 'Mathematics Dept. Faculty'
        : 'Industry Frontend Architect';

    setPlanForm({
      workshopName: `${tp.skillName} Workshop`,
      skill: tp.skillName,
      targetCohort: defaultCohort,
      duration: defaultDuration,
      startDate: '2026-10-15',
      instructor: defaultInstructor,
      mode: 'Hybrid',
      notes: tp.recommendedAction,
    });
    setIsPlanModalOpen(true);
  };

  const handleCreateWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.workshopName.trim() || !planForm.skill.trim()) return;

    let formattedDate = 'Oct 2026';
    if (planForm.startDate) {
      try {
        formattedDate = new Date(planForm.startDate).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
      } catch {
        formattedDate = planForm.startDate;
      }
    }

    const newInitiative: CollegeInitiative = {
      id: `workshop-${Date.now()}`,
      title: planForm.workshopName.trim(),
      skill: planForm.skill.trim(),
      targetCohort: planForm.targetCohort.trim() || 'All Engineering Cohorts',
      duration: planForm.duration.trim() || '3 Weeks',
      startDate: planForm.startDate || '2026-10-15',
      instructor: planForm.instructor.trim() || 'Faculty & Industry Lead',
      mode: planForm.mode,
      status: `Approved for ${formattedDate}`,
      statusBadgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      isNew: true,
    };

    const updated = [newInitiative, ...initiatives];
    setInitiatives(updated);
    try {
      localStorage.setItem('skillnexus_college_initiatives', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setIsPlanModalOpen(false);
    setActionSuccessNotice(
      `Workshop planned successfully! "${newInitiative.title}" for ${newInitiative.skill} has been scheduled and added to the College Roadmap.`
    );

    // Smooth scroll down to the initiatives roadmap section
    setTimeout(() => {
      const el = document.getElementById('college-initiatives-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 120);
  };

  return (
    <div className="space-y-6">
      {/* Institutional Intelligence Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
              Institutional Skill Intelligence
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Academic Year 2026-27 • SIH26044 Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-teal-600" />
            {collegeName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Aggregate institutional intelligence benchmarking student cohort competency against live regional employer demand signals.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-slate-700">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Last Signal Synchronization: <strong>Today, 09:30 AM</strong></span>
        </div>
      </div>

      {/* Aggregate Institutional Metrics Grid (Section 13) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Students Represented */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Students Represented</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">840</div>
          <p className="text-xs text-slate-500 mt-1">Across CSE, IT, ECE cohorts</p>
        </div>

        {/* Metric 2: Industry Skill Signals */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Industry Skill Signals</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-blue-600">48</div>
          <p className="text-xs text-slate-500 mt-1">Active verified hiring quotas</p>
        </div>

        {/* Metric 3: Highest Industry Demand */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Highest Demand</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-600">SQL (80%)</div>
          <p className="text-xs text-slate-500 mt-1">Present in 80% of employer criteria</p>
        </div>

        {/* Metric 4: Most Common Student Skill */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Most Common Skill</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">HTML / CSS (82%)</div>
          <p className="text-xs text-slate-500 mt-1">High baseline student proficiency</p>
        </div>
      </div>

      {/* Main Analytical Section: Left Horizontal Comparison + Right Top 3-5 Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: "Industry Demand vs Student Coverage" Horizontal Dual-Bar Visualization (Section 13) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-600" />
                Industry Demand vs Student Coverage
              </h3>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Aggregate Cohort Analysis
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Direct side-by-side benchmarking showing exact gaps between employer requirements and verified student proficiencies.
            </p>

            {/* Visual Legend */}
            <div className="flex items-center gap-4 mt-3 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-sm bg-indigo-600 inline-block" />
                <span className="text-slate-700">Industry Demand</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-sm bg-teal-500 inline-block" />
                <span className="text-slate-700">Student Coverage</span>
              </div>
              <div className="flex items-center gap-1.5 ml-auto text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                <span>Skill Gap</span>
              </div>
            </div>
          </div>

          {/* Horizontal Dual Bar Rows */}
          <div className="space-y-4">
            {COLLEGE_SKILL_INTELLIGENCE.map((item) => (
              <div
                key={item.skillName}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
              >
                {/* Header line: Skill name + Gap badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{item.skillName}</span>
                    <span className="text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-500">Skill Gap:</span>
                    <span
                      className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                        item.skillGapPercentage >= 40
                          ? 'bg-rose-100 text-rose-800'
                          : item.skillGapPercentage >= 20
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.skillGapPercentage}%
                    </span>
                  </div>
                </div>

                {/* Industry Demand Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                    <span>Industry Demand</span>
                    <span className="font-mono font-bold text-indigo-700">
                      {item.industryDemandPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                      style={{ width: `${item.industryDemandPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Student Coverage Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                    <span>Student Coverage</span>
                    <span className="font-mono font-bold text-teal-700">
                      {item.studentCoveragePercentage}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all duration-700"
                      style={{ width: `${item.studentCoveragePercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: "Recommended Training Priorities" (Section 14: strictly TOP 3-5 skills ordered by gap) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-600" />
                Recommended Training Priorities
              </h3>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Top 5 Gaps
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ordered by urgency (Industry Demand vs Student Coverage) to prioritize curriculum and workshop allocations.
            </p>
          </div>

          {/* Top 5 Priorities List with Professional Labels (Section 14) */}
          <div className="space-y-3.5">
            {topPriorities.map((tp) => {
              const badgeColors = {
                'Highest Priority': 'bg-rose-100 text-rose-800 border-rose-200',
                'Next Priority': 'bg-orange-100 text-orange-800 border-orange-200',
                'High Priority': 'bg-amber-100 text-amber-800 border-amber-200',
                'Moderate Priority': 'bg-blue-100 text-blue-800 border-blue-200',
                'Lower Priority': 'bg-slate-100 text-slate-700 border-slate-200',
              }[tp.priorityLabel];

              return (
                <div
                  key={tp.skillName}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      {tp.skillName}
                    </h4>
                    {/* Professional Priority Tag (No "1st", "2nd" literal labels!) */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeColors}`}>
                      {tp.priorityLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-lg bg-white border border-slate-200/70 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Demand</span>
                      <span className="font-bold font-mono text-indigo-700">{tp.industryDemand}%</span>
                    </div>
                    <div className="border-x border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase">Coverage</span>
                      <span className="font-bold font-mono text-teal-700">{tp.studentCoverage}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Skill Gap</span>
                      <span className="font-bold font-mono text-rose-700">{tp.skillGap}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    <strong className="text-slate-900">Recommended Action: </strong>
                    {tp.recommendedAction}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">
                      Status: <strong className="text-slate-700">{tp.curriculumStatus}</strong>
                    </span>
                    <button
                      id={`plan-workshop-btn-${tp.skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => handleOpenPlanWorkshop(tp)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      Plan Workshop <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {actionSuccessNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionSuccessNotice}</span>
              </div>
              <button
                onClick={() => setActionSuccessNotice(null)}
                className="text-emerald-700 hover:text-emerald-900 p-0.5 rounded cursor-pointer"
                aria-label="Dismiss notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Section 15: College Action Center (Decision Insights & Curriculum Alignment) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              College Action Center & Curriculum Alignment
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strategic interventions that preserve foundational teaching while systematically bridging industry gaps
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            Advisory Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Decision Insight 1 */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                Decision Insight: High Demand vs Low Coverage
              </h4>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Observation: </strong>
              SQL and Python demonstrate massive regional demand (80% and 65%), but student coverage lags at only 20%.
            </p>

            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
              <strong className="text-indigo-900 font-bold block">Recommended Institutional Response:</strong>
              <p>
                Provide structured foundation-level lab exercises for high-demand skills with low student coverage. Track student assessment confidence scores and correlate with internship offers.
              </p>
            </div>
          </div>

          {/* Decision Insight 2 */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                Core Philosophy: Curriculum Alignment, Not Replacement
              </h4>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Pedagogical Principle: </strong>
              If Python is already known by students but Java/Node is increasingly demanded by industry, the college does NOT need to discard Python.
            </p>

            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
              <strong className="text-teal-900 font-bold block">Recommended Institutional Response:</strong>
              <p>
                Add modular 3-week application bootcamps and monitor cohort adoption rather than destabilizing core semester curricula.
              </p>
            </div>
          </div>
        </div>

        {/* Action Table: Approved Faculty Action Items */}
        <div className="pt-2 border-t border-slate-100" id="college-initiatives-section">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Active College Initiatives & Intervention Roadmap
            </h4>
            <span className="text-xs font-semibold text-slate-500">
              {initiatives.length} Active {initiatives.length === 1 ? 'Initiative' : 'Initiatives'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            {initiatives.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.isNew
                    ? 'border-indigo-300 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-200/60'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-slate-800 text-sm leading-snug block">
                    {item.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80 shrink-0">
                    {item.skill}
                  </span>
                </div>

                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Target: {item.targetCohort}
                </span>

                {(item.duration || item.mode || item.startDate || item.instructor) && (
                  <div className="mt-2 pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                    <div className="flex items-center justify-between">
                      {item.duration && (
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" /> {item.duration}
                        </span>
                      )}
                      {item.mode && (
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400" /> {item.mode}
                        </span>
                      )}
                    </div>
                    {item.instructor && (
                      <span className="flex items-center gap-1 text-slate-500 truncate" title={item.instructor}>
                        <User className="w-3 h-3 text-slate-400 shrink-0" /> {item.instructor}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-2.5 flex items-center justify-between gap-1.5">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.statusBadgeColor || 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.isNew && (
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/90 border border-indigo-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> Newly Planned
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan Workshop Modal */}
      {isPlanModalOpen && (
        <div
          id="plan-workshop-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsPlanModalOpen(false)}
        >
          <div
            id="plan-workshop-modal"
            className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Plan Workshop: {planForm.skill}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Proactive curriculum intervention to bridge student cohort skill gap
                  </p>
                </div>
              </div>
              <button
                id="close-plan-workshop-modal-btn"
                onClick={() => setIsPlanModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateWorkshop} className="p-6 space-y-4 text-xs">
              {/* Workshop / Training Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Workshop / Training Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="workshop-name-input"
                  type="text"
                  required
                  value={planForm.workshopName}
                  onChange={(e) => setPlanForm({ ...planForm, workshopName: e.target.value })}
                  placeholder="e.g., Python Workshop"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold"
                />
              </div>

              {/* Skill & Target Students / Cohort */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Skill <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="workshop-skill-input"
                    type="text"
                    required
                    value={planForm.skill}
                    onChange={(e) => setPlanForm({ ...planForm, skill: e.target.value })}
                    placeholder="e.g., Python"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Target Students / Cohort <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="workshop-cohort-input"
                    type="text"
                    required
                    value={planForm.targetCohort}
                    onChange={(e) => setPlanForm({ ...planForm, targetCohort: e.target.value })}
                    placeholder="e.g., 3rd Year CSE & IT (180 students)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              {/* Duration & Start Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Duration <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="workshop-duration-input"
                    type="text"
                    required
                    value={planForm.duration}
                    onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                    placeholder="e.g., 3 Weeks (15 Hours)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="workshop-startdate-input"
                    type="date"
                    required
                    value={planForm.startDate}
                    onChange={(e) => setPlanForm({ ...planForm, startDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Instructor / Trainer & Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Instructor / Trainer <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="workshop-instructor-input"
                    type="text"
                    required
                    value={planForm.instructor}
                    onChange={(e) => setPlanForm({ ...planForm, instructor: e.target.value })}
                    placeholder="e.g., Prof. Dr. K. Rao & Industry Mentor"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Mode (Offline / Online / Hybrid) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="workshop-mode-select"
                    value={planForm.mode}
                    onChange={(e) =>
                      setPlanForm({
                        ...planForm,
                        mode: e.target.value as 'Offline' | 'Online' | 'Hybrid',
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-medium cursor-pointer"
                  >
                    <option value="Hybrid">Hybrid (Classroom Labs + Online Modules)</option>
                    <option value="Offline">Offline (Campus Computer Lab)</option>
                    <option value="Online">Online (Interactive Virtual Studio)</option>
                  </select>
                </div>
              </div>

              {/* Curriculum Objectives / Notes */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Curriculum Alignment & Scope
                </label>
                <textarea
                  id="workshop-notes-input"
                  rows={2}
                  value={planForm.notes}
                  onChange={(e) => setPlanForm({ ...planForm, notes: e.target.value })}
                  placeholder="Intervention scope, syllabus references, and expected cohort outcomes..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  id="cancel-plan-workshop-btn"
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-plan-workshop-btn"
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Schedule Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
