import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Briefcase,
  Layers,
  Award,
  BookOpen,
  Plus,
  X,
  Compass,
  Building2,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle,
  FileCheck,
  FolderGit2,
  Trophy,
  Filter,
  FileText,
  Eye,
  Trash2,
  Paperclip,
} from 'lucide-react';
import {
  StudentProfile,
  Opportunity,
  WorkPreference,
  ExperienceLevel,
  OpportunityMatchResult,
  StudentAchievement,
} from '../types';
import { POPULAR_SKILLS, CAREER_GOALS, TELANGANA_LOCATIONS } from '../data/mockData';
import {
  calculateCareerGoalMatch,
  getRequiredSkillsForCareerGoal,
  getCareerGoalConfig,
} from '../data/careerGoals';
import {
  calculateOpportunityMatch,
  getRankedOpportunitiesForStudent,
} from '../utils/matchingEngine';
import { toCanonicalSkill } from '../utils/skillNormalization';
import { CircularProgress } from './CircularProgress';
import { ExplainMatchModal } from './ExplainMatchModal';
import { ProofPreviewModal } from './ProofPreviewModal';

interface StudentDashboardProps {
  student: StudentProfile;
  opportunities: Opportunity[];
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onNavigateToRoadmap: (skillName: string) => void;
  onNavigateToVerification: (skillName: string) => void;
  onNavigateToGuardian: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  opportunities,
  onUpdateProfile,
  onNavigateToRoadmap,
  onNavigateToVerification,
  onNavigateToGuardian,
}) => {
  // Input form state
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [careerGoal, setCareerGoal] = useState(student.careerGoal || 'Full-Stack Web Developer');
  const [workPref, setWorkPref] = useState<WorkPreference>(student.workPreference || 'Remote');
  const [expLevel, setExpLevel] = useState<ExperienceLevel>(student.experienceLevel || 'Intermediate');
  const [preferredLoc, setPreferredLoc] = useState<string>(student.preferredLocation || 'Hyderabad');

  // Modal states
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [modalSkillInput, setModalSkillInput] = useState('');
  const [modalSkillLevel, setModalSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [modalSkillError, setModalSkillError] = useState('');

  const [isAddAchievementModalOpen, setIsAddAchievementModalOpen] = useState(false);
  const [achTitle, setAchTitle] = useState('');
  const [achType, setAchType] = useState<'Certificate' | 'Workshop' | 'Hackathon'>('Certificate');
  const [achIssuer, setAchIssuer] = useState('');
  const [achDate, setAchDate] = useState(new Date().toISOString().split('T')[0]);
  const [achUrl, setAchUrl] = useState('');
  const [achSkills, setAchSkills] = useState('');
  const [achDesc, setAchDesc] = useState('');
  const [achError, setAchError] = useState('');

  // Proof / Certificate uploaded file state
  const [achFile, setAchFile] = useState<{
    name: string;
    size: string;
    type: string;
    dataUrl?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active proof preview modal state
  const [previewProof, setPreviewProof] = useState<{
    fileName: string;
    fileType?: string;
    fileSize?: string;
    fileData: string;
    title?: string;
  } | null>(null);

  // Location filter state for opportunities
  const [filterByLocation, setFilterByLocation] = useState(false);

  // Analysis state (persisted & reactive)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMatchForModal, setSelectedMatchForModal] = useState<OpportunityMatchResult | null>(null);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);

  // Synchronize career goal with student prop if changed externally
  useEffect(() => {
    if (student.careerGoal && student.careerGoal !== careerGoal) {
      setCareerGoal(student.careerGoal);
      setSelectedOpportunityId(null);
    }
  }, [student.careerGoal]);

  // Compute matched opportunities
  const rankedOpportunities = getRankedOpportunitiesForStudent(student, opportunities);

  const displayedOpportunities = filterByLocation
    ? rankedOpportunities.filter((m) =>
        m.opportunity.location.toLowerCase().includes(preferredLoc.toLowerCase()) ||
        preferredLoc.toLowerCase().includes(m.opportunity.location.toLowerCase()) ||
        m.opportunity.workMode === 'Remote'
      )
    : rankedOpportunities;

  // Active benchmark: Default to the authoritative Career Goal requirement blueprint.
  // If the student explicitly clicks to inspect a specific company opportunity, that company's published
  // requirements and weightages take priority for that opportunity evaluation.
  const selectedCompanyOpportunity = selectedOpportunityId
    ? opportunities.find((o) => o.id === selectedOpportunityId) || null
    : null;

  const benchmarkOpportunity: OpportunityMatchResult = selectedCompanyOpportunity
    ? calculateOpportunityMatch(student, selectedCompanyOpportunity)
    : calculateCareerGoalMatch(student, careerGoal);

  const overallSkillMatch = benchmarkOpportunity ? benchmarkOpportunity.skillMatchPercentage : 0;
  const overallSkillGap = benchmarkOpportunity ? benchmarkOpportunity.skillGapPercentage : 100;

  // The authoritative list of required skills for the current career goal
  const currentCareerRequiredSkills = getRequiredSkillsForCareerGoal(careerGoal);

  // Add skill handler with canonical normalization
  const handleAddSkill = (skillNameToAdd?: string, levelToAdd?: 'Beginner' | 'Intermediate' | 'Advanced') => {
    const raw = (skillNameToAdd || newSkillInput).trim();
    if (!raw) return;

    const canonical = toCanonicalSkill(raw);
    const level = levelToAdd || newSkillLevel;

    // Check if already exists
    if (student.skills.some((s) => toCanonicalSkill(s.name).toLowerCase() === canonical.toLowerCase())) {
      setNewSkillInput('');
      return;
    }

    const defaultScore = level === 'Advanced' ? 90 : level === 'Intermediate' ? 75 : 50;

    const updatedSkills = [
      ...student.skills,
      {
        name: canonical,
        level: level,
        demonstratedScore: defaultScore,
        verified: false,
        confidenceScore: defaultScore,
        evidenceTypes: [],
      },
    ];

    onUpdateProfile({ skills: updatedSkills });
    setNewSkillInput('');
  };

  // Modal submit for adding skill
  const handleModalAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = modalSkillInput.trim();
    if (!raw) {
      setModalSkillError('Please enter a skill name.');
      return;
    }

    const canonical = toCanonicalSkill(raw);
    if (student.skills.some((s) => toCanonicalSkill(s.name).toLowerCase() === canonical.toLowerCase())) {
      setModalSkillError(`Skill "${canonical}" is already in your portfolio.`);
      return;
    }

    const defaultScore = modalSkillLevel === 'Advanced' ? 90 : modalSkillLevel === 'Intermediate' ? 75 : 50;

    const updatedSkills = [
      ...student.skills,
      {
        name: canonical,
        level: modalSkillLevel,
        demonstratedScore: defaultScore,
        verified: false,
        confidenceScore: defaultScore,
        evidenceTypes: [],
      },
    ];

    onUpdateProfile({ skills: updatedSkills });
    setModalSkillInput('');
    setModalSkillError('');
    setIsAddSkillModalOpen(false);
  };

  // Quick skill level change
  const handleChangeSkillLevel = (skillName: string, newLevel: 'Beginner' | 'Intermediate' | 'Advanced') => {
    const canonical = toCanonicalSkill(skillName);
    const updatedSkills = student.skills.map((s) => {
      if (toCanonicalSkill(s.name).toLowerCase() === canonical.toLowerCase()) {
        const defaultScore = newLevel === 'Advanced' ? 90 : newLevel === 'Intermediate' ? 75 : 50;
        return {
          ...s,
          level: newLevel,
          demonstratedScore: s.verified ? s.demonstratedScore : defaultScore,
          confidenceScore: s.verified ? s.confidenceScore : defaultScore,
        };
      }
      return s;
    });

    onUpdateProfile({ skills: updatedSkills });
  };

  // Remove skill handler
  const handleRemoveSkill = (skillName: string) => {
    const canonical = toCanonicalSkill(skillName);
    const updatedSkills = student.skills.filter(
      (s) => toCanonicalSkill(s.name).toLowerCase() !== canonical.toLowerCase()
    );
    onUpdateProfile({ skills: updatedSkills });
  };

  // Certificate / Proof File Selection Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    const isPdf = ext === '.pdf' || file.type === 'application/pdf';
    const isJpg = ext === '.jpg' || ext === '.jpeg' || file.type === 'image/jpeg';
    const isPng = ext === '.png' || file.type === 'image/png';

    if (!isPdf && !isJpg && !isPng) {
      setAchError('Unsupported file format. Please upload a PDF, JPG, JPEG, or PNG file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const maxBytes = 5 * 1024 * 1024; // 5 MB prototype limit
    if (file.size > maxBytes) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setAchError(`File size (${sizeMb} MB) exceeds the 5 MB limit. Please select a smaller file.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const formattedSize =
      file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    const fileTypeLabel = isPdf ? 'PDF' : isPng ? 'PNG' : 'JPG';

    const reader = new FileReader();
    reader.onload = (event) => {
      setAchFile({
        name: file.name,
        size: formattedSize,
        type: fileTypeLabel,
        dataUrl: event.target?.result as string,
      });
      setAchError('');
    };
    reader.onerror = () => {
      setAchError('Failed to read selected file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setAchFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add Certificate/Achievement handler
  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle.trim()) {
      setAchError('Please enter the Title / Event Name.');
      return;
    }
    if (!achIssuer.trim()) {
      setAchError('Please enter the Issuer / Host Organization.');
      return;
    }
    // Validation: Require at least one proof source (uploaded file OR credential URL)
    if (!achFile && !achUrl.trim()) {
      setAchError('Please provide at least one proof source: either upload a certificate/proof file or provide an external credential URL.');
      return;
    }

    const parsedSkills = achSkills
      .split(',')
      .map((s) => toCanonicalSkill(s.trim()))
      .filter((s) => s.length > 0);

    const newAchievement: StudentAchievement = {
      id: `ach-${Date.now()}`,
      title: achTitle.trim(),
      type: achType,
      issuerOrOrganizer: achIssuer.trim(),
      date: achDate || new Date().toISOString().split('T')[0],
      credentialUrl: achUrl.trim() || undefined,
      fileName: achFile ? achFile.name : undefined,
      fileSize: achFile ? achFile.size : undefined,
      fileType: achFile ? achFile.type : undefined,
      fileData: achFile ? achFile.dataUrl : undefined,
      associatedSkills: parsedSkills.length > 0 ? parsedSkills : ['General'],
      description: achDesc.trim() || undefined,
    };

    const updatedAchievements = [newAchievement, ...(student.achievements || [])];

    // Add 'Certificate' evidence type to associated student skills
    const updatedSkills = student.skills.map((s) => {
      const canonical = toCanonicalSkill(s.name);
      if (parsedSkills.some((ps) => ps.toLowerCase() === canonical.toLowerCase())) {
        const evSet = new Set(s.evidenceTypes || []);
        evSet.add('Certificate');
        return {
          ...s,
          evidenceTypes: Array.from(evSet),
        };
      }
      return s;
    });

    onUpdateProfile({
      achievements: updatedAchievements,
      skills: updatedSkills,
    });

    // Reset and close
    setAchTitle('');
    setAchIssuer('');
    setAchUrl('');
    setAchSkills('');
    setAchDesc('');
    setAchError('');
    setAchFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsAddAchievementModalOpen(false);
  };

  const handleRemoveAchievement = (id: string) => {
    const updated = (student.achievements || []).filter((a) => a.id !== id);
    onUpdateProfile({ achievements: updated });
  };

  // Analyze Profile button handler (NEVER makes page blank, immediately updates!)
  const handleAnalyzeProfile = () => {
    setIsAnalyzing(true);
    onUpdateProfile({
      careerGoal,
      workPreference: workPref,
      experienceLevel: expLevel,
      preferredLocation: preferredLoc,
    });

    setTimeout(() => {
      setIsAnalyzing(false);
    }, 250);
  };

  const achievementsList = student.achievements || [];

  return (
    <div className="space-y-6">
      {/* Student Welcome & Profile Summary Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Student Dashboard
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ID: {student.id} • {student.college}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              <MapPin className="w-3 h-3 text-indigo-600" />
              {student.preferredLocation || preferredLoc}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back, {student.name}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-slate-600 flex-wrap">
            <span className="font-semibold text-slate-800">{student.education}</span>
            <span>•</span>
            <span className="text-slate-500">{student.department}</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
              {careerGoal}
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
              {student.workPreference}
            </span>
          </div>
        </div>

        <button
          onClick={onNavigateToGuardian}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-900 to-slate-900 hover:from-indigo-800 hover:to-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Sparkles className="w-4 h-4 text-indigo-300" />
          <span>Career Path Guardian</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Current Skills */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Current Skills</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {student.skills.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {student.skills.filter((s) => s.verified).length} verified with assessment score
          </p>
        </div>

        {/* Metric 2: Skill Match */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Skill Match</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-blue-700">
            {overallSkillMatch}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Formula: Score × Weight contribution
          </p>
        </div>

        {/* Metric 3: Skill Gap */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Skill Gap</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600">
            {overallSkillGap}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Guided by personalized roadmaps
          </p>
        </div>

        {/* Metric 4: Supporting Evidence */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Supporting Evidence</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-700">
            {achievementsList.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Certificates, workshops & hackathons
          </p>
        </div>
      </div>

      {/* Profile & Skill Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Skill Portfolio, Adding Skills & Location Preferences */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Technical Competency Portfolio & Location
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every skill maintains an independent proficiency level and demonstrated score
              </p>
            </div>
            <button
              onClick={() => {
                setModalSkillInput('');
                setModalSkillError('');
                setIsAddSkillModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Skill
            </button>
          </div>

          {/* Active Skills Table / Cards with Independent Levels & Demonstrated Scores */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Active Skills ({student.skills.length})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {student.skills.map((skill) => {
                const canonicalName = toCanonicalSkill(skill.name);
                const score = skill.demonstratedScore ?? skill.confidenceScore ?? (skill.level === 'Advanced' ? 90 : skill.level === 'Intermediate' ? 75 : 50);

                return (
                  <div
                    key={canonicalName}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-indigo-300 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800 truncate">{canonicalName}</span>
                        {skill.verified ? (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800" title="Verified via technical assessment">
                            ✓ {score}%
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-200 text-slate-600" title="Self-Declared baseline">
                            {score}% Decl
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
                        <span>Level:</span>
                        <select
                          value={skill.level}
                          onChange={(e) => handleChangeSkillLevel(skill.name, e.target.value as any)}
                          className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-[11px] font-medium text-slate-700"
                        >
                          <option value="Beginner">Beginner (50%)</option>
                          <option value="Intermediate">Intermediate (75%)</option>
                          <option value="Advanced">Advanced (90%)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!skill.verified && (
                        <button
                          type="button"
                          onClick={() => onNavigateToVerification(canonicalName)}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded text-[10px] border border-emerald-200 transition-colors"
                          title="Verify via Technical Assessment"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill.name)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors rounded"
                        title={`Remove ${canonicalName}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Add Bar with Canonical Normalization Preview */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="Quick add skill (e.g. js, react, python, postgres, aws)..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                />
                {newSkillInput.trim() && (
                  <span className="absolute right-3 top-2.5 text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                    Canonical: {toCanonicalSkill(newSkillInput)}
                  </span>
                )}
              </div>
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value as any)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Beginner">Beginner (50%)</option>
                <option value="Intermediate">Intermediate (75%)</option>
                <option value="Advanced">Advanced (90%)</option>
              </select>
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {/* Quick Pick Chips for Missing Required Skills of the selected Career Goal */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[11px] font-semibold text-slate-400">Target Role Skills:</span>
              {currentCareerRequiredSkills.map((reqSkill) => {
                const canonicalReq = toCanonicalSkill(reqSkill);
                const alreadyHas = student.skills.some((s) => toCanonicalSkill(s.name).toLowerCase() === canonicalReq.toLowerCase());
                if (alreadyHas) return null;
                return (
                  <button
                    key={reqSkill}
                    type="button"
                    onClick={() => handleAddSkill(reqSkill)}
                    className="px-2 py-0.5 rounded-md text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors flex items-center gap-1 font-medium"
                  >
                    + {reqSkill}
                  </button>
                );
              })}
              {currentCareerRequiredSkills.every((req) => student.skills.some((s) => toCanonicalSkill(s.name).toLowerCase() === toCanonicalSkill(req).toLowerCase())) && (
                <span className="text-[11px] text-emerald-600 font-semibold">All target skills present in profile!</span>
              )}
            </div>
          </div>

          {/* Preferences Settings: Career Goal, Work Mode, Experience, and Preferred Location (TELANGANA) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Preferred Location (Telangana)
              </label>
              <select
                value={preferredLoc}
                onChange={(e) => setPreferredLoc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
              >
                {TELANGANA_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Career Goal
              </label>
              <select
                value={careerGoal}
                onChange={(e) => {
                  const newGoal = e.target.value;
                  setCareerGoal(newGoal);
                  setSelectedOpportunityId(null);
                  onUpdateProfile({ careerGoal: newGoal });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
              >
                {CAREER_GOALS.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Work Mode
              </label>
              <select
                value={workPref}
                onChange={(e) => setWorkPref(e.target.value as WorkPreference)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Experience Level
              </label>
              <select
                value={expLevel}
                onChange={(e) => setExpLevel(e.target.value as ExperienceLevel)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Beginner">Beginner (0-1 yrs)</option>
                <option value="Intermediate">Intermediate (1-2 yrs)</option>
                <option value="Advanced">Advanced (2+ yrs)</option>
              </select>
            </div>
          </div>

          {/* Analyze Profile Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleAnalyzeProfile}
              disabled={isAnalyzing}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              {isAnalyzing ? 'Recalculating Weighted Match...' : 'Analyze My Profile & Update Preferences'}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Recalculates weighted employer coverage, aligns location filter, and re-ranks matching opportunities.
            </p>
          </div>
        </div>

        {/* Right 1 Col: Explainable Skill Match Gauge & Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Your Skill Match
              </h3>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                selectedCompanyOpportunity ? 'bg-amber-100 text-amber-800' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}>
                {selectedCompanyOpportunity ? 'Company Requirement' : 'Career Goal Standard'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1 text-xs">
              <p className="text-slate-500">
                Target Role: <span className="font-semibold text-slate-800">{benchmarkOpportunity?.opportunity.role || careerGoal}</span>
                {selectedCompanyOpportunity && (
                  <span className="text-slate-400"> ({selectedCompanyOpportunity.companyName})</span>
                )}
              </p>
              {selectedCompanyOpportunity && (
                <button
                  type="button"
                  onClick={() => setSelectedOpportunityId(null)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline ml-2"
                >
                  Reset to Career Goal
                </button>
              )}
            </div>
          </div>

          {/* Circular Progress Gauge */}
          <div className="py-2 flex items-center justify-center">
            <CircularProgress
              percentage={overallSkillMatch}
              size={155}
              strokeWidth={12}
              label="Skill Match"
              sublabel={`Skill Gap: ${overallSkillGap}%`}
              colorScheme={overallSkillMatch >= 70 ? 'teal' : overallSkillMatch >= 40 ? 'blue' : 'amber'}
            />
          </div>

          {/* Explainable Required Skills Breakdown List */}
          {benchmarkOpportunity && (
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Required Skills ({benchmarkOpportunity.breakdown.length})</span>
                <span>Contribution</span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {benchmarkOpportunity.breakdown.map((item) => (
                  <div
                    key={item.skill}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60 text-xs hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onNavigateToRoadmap(item.skill)}
                        className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors text-left"
                        title={`View ${item.skill} Learning Roadmap`}
                      >
                        {item.skill}
                      </button>
                      <span className="text-[10px] text-slate-400">({item.weight}%)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToVerification(item.skill)}
                        title={item.studentStatus === 'Strong' ? 'Skill verified' : `Verify or Take Assessment for ${item.skill}`}
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded hover:opacity-85 transition-opacity ${
                          item.studentStatus === 'Strong'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.studentStatus === 'Partial'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.studentStatus} ({item.demonstratedScore}%)
                      </button>
                      <span className="font-mono font-bold text-slate-700 min-w-[32px] text-right">
                        +{item.contribution}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs mt-2">
                <span className="font-bold text-indigo-950">Total Requirement Coverage:</span>
                <span className="font-mono font-extrabold text-indigo-700 text-sm">{overallSkillMatch}%</span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => {
                if (benchmarkOpportunity) {
                  setSelectedMatchForModal(benchmarkOpportunity);
                  setIsExplainModalOpen(true);
                }
              }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> Explain Mathematical Formula
            </button>
          </div>
        </div>
      </div>

      {/* Certificates & Achievements Section (Supporting Evidence) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900">
                Certificates, Workshops & Hackathons
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Supporting Evidence
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical proof of practical application, co-curricular workshops, and competitive hackathon performance.
            </p>
          </div>

          <button
            onClick={() => {
              setAchTitle('');
              setAchIssuer('');
              setAchUrl('');
              setAchSkills('');
              setAchDesc('');
              setAchError('');
              setIsAddAchievementModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Achievement / Certificate
          </button>
        </div>

        {/* Critical System Notice */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">System Integrity Rule:</span> Certificates and achievements serve as verified <strong>Supporting Evidence</strong> for recruiter portfolio review. In accordance with objective standards, they do <strong>NOT</strong> artificially inflate the technical Skill Match calculation.
          </div>
        </div>

        {/* Achievements Grid */}
        {achievementsList.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
            No achievements logged yet. Add your certificates, workshops, or hackathons to reinforce your profile credibility.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {achievementsList.map((ach) => (
              <div
                key={ach.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-300 transition-colors flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ach.type === 'Hackathon'
                          ? 'bg-purple-100 text-purple-800'
                          : ach.type === 'Workshop'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ach.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAchievement(ach.id)}
                      className="text-slate-400 hover:text-rose-600 p-0.5"
                      title="Remove achievement"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-1.5">
                    {ach.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {ach.issuerOrOrganizer} • <Clock className="w-3 h-3 inline-block mr-0.5" />{ach.date}
                  </p>

                  {ach.description && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                      {ach.description}
                    </p>
                  )}

                  {/* Uploaded Certificate / Proof File Display */}
                  {ach.fileName && (
                    <div className="mt-2.5 p-2 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <FileText className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[150px]" title={ach.fileName}>
                          {ach.fileName}
                        </span>
                        {ach.fileSize && (
                          <span className="text-[10px] text-slate-500 shrink-0">
                            • {ach.fileSize}
                          </span>
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
                              title: ach.title,
                            })
                          }
                          className="px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-[10px] font-bold inline-flex items-center gap-1 shrink-0 shadow-2xs transition-colors"
                        >
                          <Eye className="w-3 h-3 text-amber-700" />
                          <span>Open Proof</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1 flex-wrap">
                    {ach.associatedSkills.map((s) => (
                      <span key={s} className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                  {ach.credentialUrl && (
                    <a
                      href={ach.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-[11px] font-bold inline-flex items-center gap-0.5 shrink-0"
                    >
                      View Credential <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Student Opportunity Matching Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Recommended Opportunities
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                Ranked by Weighted Match
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Filtered for positive compatibility (&gt;0% match). Partial matches included for structured career entry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Preferred Location Filter Toggle */}
            <button
              onClick={() => setFilterByLocation(!filterByLocation)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                filterByLocation
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>Matching {preferredLoc} ({displayedOpportunities.length})</span>
            </button>
          </div>
        </div>

        {/* Opportunity Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedOpportunities.map((match) => {
            const { opportunity, skillMatchPercentage, strongSkills, missingSkills } = match;

            return (
              <div
                key={opportunity.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all bg-white flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                          {opportunity.companyName}
                        </span>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {opportunity.opportunityType}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">
                        {opportunity.role}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {opportunity.location} ({opportunity.workMode})
                        </span>
                        <span>•</span>
                        <span>{opportunity.openings} Openings</span>
                      </p>
                    </div>

                    {/* Skill Match Badge */}
                    <div className="text-right shrink-0">
                      <div className="text-xl font-extrabold text-blue-700">
                        {skillMatchPercentage}%
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Skill Match
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                    {opportunity.description}
                  </p>

                  {/* Strong & Missing Skills Preview */}
                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-emerald-700">Strong:</span>
                      {strongSkills.length > 0 ? (
                        strongSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200/60"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-[11px]">Developing foundation</span>
                      )}
                    </div>

                    {missingSkills.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-amber-700">Missing:</span>
                        {missingSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-medium text-[11px] border border-amber-200/60"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedMatchForModal(match);
                        setIsExplainModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> Explain Match
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOpportunityId(opportunity.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 ${
                        selectedOpportunityId === opportunity.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {selectedOpportunityId === opportunity.id ? 'Active in Gauge' : 'Evaluate in Gauge'}
                    </button>
                  </div>

                  {missingSkills.length > 0 && (
                    <button
                      onClick={() => onNavigateToRoadmap(missingSkills[0])}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Study Missing Skills
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explain Match Modal */}
      <ExplainMatchModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        matchResult={selectedMatchForModal}
        onNavigateToRoadmap={onNavigateToRoadmap}
      />

      {/* Add Skill Modal (NO prompt() allowed!) */}
      {isAddSkillModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Add Technical Skill</h3>
              </div>
              <button
                onClick={() => setIsAddSkillModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalAddSkill} className="p-6 space-y-4 text-xs">
              {modalSkillError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-medium">
                  {modalSkillError}
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Skill Name / Alias
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={modalSkillInput}
                  onChange={(e) => {
                    setModalSkillInput(e.target.value);
                    setModalSkillError('');
                  }}
                  placeholder="e.g. js, React, python, postgresql, docker..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                />
                {modalSkillInput.trim() && (
                  <p className="mt-1 text-[11px] text-indigo-600 font-medium">
                    Normalized Canonical Name: <strong>{toCanonicalSkill(modalSkillInput)}</strong>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1.5">
                  Proficiency Level
                </label>
                <select
                  value={modalSkillLevel}
                  onChange={(e) => setModalSkillLevel(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Beginner">Beginner (Estimated 50% demonstrated score)</option>
                  <option value="Intermediate">Intermediate (Estimated 75% demonstrated score)</option>
                  <option value="Advanced">Advanced (Estimated 90% demonstrated score)</option>
                </select>
                <p className="mt-1 text-[11px] text-slate-400">
                  You can calibrate your exact score by taking a technical readiness check in the Verification tab.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSkillModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  Add to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Achievement / Certificate Modal */}
      {isAddAchievementModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Add Supporting Evidence</h3>
              </div>
              <button
                onClick={() => setIsAddAchievementModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAchievement} className="p-6 space-y-4 text-xs">
              {achError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-medium">
                  {achError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                    Evidence Type
                  </label>
                  <select
                    value={achType}
                    onChange={(e) => setAchType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Certificate">Certificate / Course</option>
                    <option value="Workshop">Hands-on Workshop</option>
                    <option value="Hackathon">Hackathon / Competition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    value={achDate}
                    onChange={(e) => setAchDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Title / Event Name
                </label>
                <input
                  type="text"
                  required
                  value={achTitle}
                  onChange={(e) => setAchTitle(e.target.value)}
                  placeholder="e.g. Smart India Hackathon College Winner, Meta Frontend Cert..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Issuer / Host Organization
                </label>
                <input
                  type="text"
                  required
                  value={achIssuer}
                  onChange={(e) => setAchIssuer(e.target.value)}
                  placeholder="e.g. Sphoorthy Engineering College, Coursera, IEEE Chapter..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Associated Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={achSkills}
                  onChange={(e) => setAchSkills(e.target.value)}
                  placeholder="e.g. JavaScript, React, Python"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* PROOF / CERTIFICATE FILE UPLOAD */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-800 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-amber-600" />
                    <span>Proof / Certificate File</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Max 5 MB • PDF, JPG, JPEG, PNG
                  </span>
                </div>

                {!achFile ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="supporting-evidence-file"
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="supporting-evidence-file"
                      className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-slate-300 hover:border-amber-500 bg-white hover:bg-amber-50/20 rounded-xl cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2 text-slate-700 font-bold group-hover:text-amber-700 text-xs">
                        <Paperclip className="w-4 h-4 text-amber-600" />
                        <span>Upload Certificate / Proof</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 text-center">
                        Select PDF, JPG, JPEG, or PNG saved on your computer or phone
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="p-2.5 bg-white border border-amber-300 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-xs truncate max-w-[190px]" title={achFile.name}>
                            {achFile.name}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-mono text-[9px] font-extrabold uppercase">
                            {achFile.type}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {achFile.size} • {achFile.type}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {achFile.dataUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewProof({
                              fileName: achFile.name,
                              fileType: achFile.type,
                              fileSize: achFile.size,
                              fileData: achFile.dataUrl!,
                              title: achTitle || 'Certificate Proof',
                            })
                          }
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>Preview</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Credential URL or Proof Link (Optional)
                </label>
                <input
                  type="url"
                  value={achUrl}
                  onChange={(e) => setAchUrl(e.target.value)}
                  placeholder="https://example.com/certificate/12345"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Brief Summary / Achievement Details
                </label>
                <textarea
                  rows={2}
                  value={achDesc}
                  onChange={(e) => setAchDesc(e.target.value)}
                  placeholder="Summarize outcomes, project context, or team ranking..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                Notice: Supporting evidence credentials are archived for employer recruitment verification. They do not alter technical algorithm scores.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAchievementModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  Save Evidence
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
