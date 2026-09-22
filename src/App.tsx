import React, { useState } from 'react';
import {
  UserRole,
  StudentProfile,
  Opportunity,
  OpportunityMatchResult,
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_OPPORTUNITIES,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { IndustryDashboard } from './components/IndustryDashboard';
import { CollegeDashboard } from './components/CollegeDashboard';
import { LearningRoadmapView } from './components/LearningRoadmapView';
import { CareerPathGuardianView } from './components/CareerPathGuardianView';
import { SkillVerificationView } from './components/SkillVerificationView';
import { SystemOverview } from './components/SystemOverview';
import { ExplainMatchModal } from './components/ExplainMatchModal';
import { getRankedOpportunitiesForStudent } from './utils/matchingEngine';
import {
  Briefcase,
  MapPin,
  HelpCircle,
  BookOpen,
  Filter,
  Search,
  Sparkles,
} from 'lucide-react';

import { toCanonicalSkill } from './utils/skillNormalization';

const VALID_VIEWS = [
  'student',
  'industry',
  'college',
  'roadmap',
  'opportunities',
  'verification',
  'guardian',
  'system',
  'home',
  'login',
] as const;

function getInitialView(): string {
  if (typeof window !== 'undefined') {
    try {
      // 1. URL Hash (most reliable across browser tab refresh / iframe reload)
      const rawHash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
      if (rawHash) {
        if ((VALID_VIEWS as readonly string[]).includes(rawHash)) {
          return rawHash;
        }
        if (rawHash === 'candidateprofile' || rawHash === 'company') return 'industry';
        if (rawHash === 'careerguardian') return 'guardian';
      }

      // 2. SessionStorage
      const sess = sessionStorage.getItem('skill_nexus_active_view') || sessionStorage.getItem('skill_nexus_current_view');
      if (sess && (VALID_VIEWS as readonly string[]).includes(sess)) {
        return sess;
      }

      // 3. LocalStorage
      const local = localStorage.getItem('skill_nexus_active_view') || localStorage.getItem('skill_nexus_current_view');
      if (local && (VALID_VIEWS as readonly string[]).includes(local)) {
        return local;
      }
    } catch {
      // ignore storage access errors
    }
  }
  return 'student';
}

function getInitialRole(initialView: string): UserRole {
  // If the view directly belongs to a specific stakeholder role, honor that role strictly
  if (initialView === 'industry') return 'company';
  if (initialView === 'college') return 'college';
  if (['student', 'roadmap', 'opportunities', 'verification', 'guardian'].includes(initialView)) return 'student';

  if (typeof window !== 'undefined') {
    try {
      const savedRole = (sessionStorage.getItem('skill_nexus_current_role') || localStorage.getItem('skill_nexus_current_role')) as UserRole;
      if (savedRole && ['student', 'company', 'college', 'guest'].includes(savedRole)) {
        return savedRole;
      }
    } catch {
      // ignore
    }
  }

  if (initialView === 'home') return 'guest';
  return 'student';
}

export default function App() {
  // Authoritative Application State with Indefinite Persistence (No time limits or auto-resets)
  const [activeView, setActiveView] = useState<string>(() => getInitialView());
  const [currentRole, setCurrentRole] = useState<UserRole>(() => getInitialRole(getInitialView()));

  // Keep state saved indefinitely and update URL hash so user stays on the current view across reloads or inactive tabs
  React.useEffect(() => {
    try {
      sessionStorage.setItem('skill_nexus_current_role', currentRole);
      localStorage.setItem('skill_nexus_current_role', currentRole);
      sessionStorage.setItem('skill_nexus_active_view', activeView);
      localStorage.setItem('skill_nexus_active_view', activeView);
      sessionStorage.setItem('skill_nexus_current_view', activeView);
      localStorage.setItem('skill_nexus_current_view', activeView);
      if (window.location.hash.replace(/^#\/?/, '').trim().toLowerCase() !== activeView) {
        window.location.hash = activeView;
      }
    } catch {
      // ignore
    }
  }, [currentRole, activeView]);

  // Support browser back/forward and hash changes without page reset
  React.useEffect(() => {
    const handleHashChange = () => {
      try {
        const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
        if (hash && (VALID_VIEWS as readonly string[]).includes(hash) && hash !== activeView) {
          handleNavigate(hash);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeView]);

  // Persist Student Profiles across reloads so added skills, proofs & assessments are preserved
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skill_nexus_students_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_STUDENTS;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('skill_nexus_students_data', JSON.stringify(students));
    } catch {
      // ignore
    }
  }, [students]);

  // Persist Opportunities across reloads
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skill_nexus_opportunities_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_OPPORTUNITIES;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('skill_nexus_opportunities_data', JSON.stringify(opportunities));
    } catch {
      // ignore
    }
  }, [opportunities]);

  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skill_nexus_current_student_id');
        if (saved) return saved;
      } catch {
        // fallback
      }
    }
    return 'std-1';
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('skill_nexus_current_student_id', currentStudentId);
    } catch {
      // ignore
    }
  }, [currentStudentId]);

  const [currentCompanyName, setCurrentCompanyName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skill_nexus_company_name');
        if (saved) return saved;
      } catch {
        // fallback
      }
    }
    return 'CloudForge';
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('skill_nexus_company_name', currentCompanyName);
    } catch {
      // ignore
    }
  }, [currentCompanyName]);

  const [currentCollegeName, setCurrentCollegeName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skill_nexus_college_name');
        if (saved) return saved;
      } catch {
        // fallback
      }
    }
    return 'Sphoorthy Engineering College';
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('skill_nexus_college_name', currentCollegeName);
    } catch {
      // ignore
    }
  }, [currentCollegeName]);

  // Roadmap & Verification deep link target skill
  const [targetSkillForRoadmap, setTargetSkillForRoadmap] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('skill_nexus_target_skill') || localStorage.getItem('skill_nexus_target_skill');
        if (saved) return saved;
      } catch {
        // fallback
      }
    }
    return 'JavaScript';
  });

  React.useEffect(() => {
    try {
      sessionStorage.setItem('skill_nexus_target_skill', targetSkillForRoadmap);
      localStorage.setItem('skill_nexus_target_skill', targetSkillForRoadmap);
    } catch {
      // ignore
    }
  }, [targetSkillForRoadmap]);

  // Opportunity page filter state
  const [oppSearchQuery, setOppSearchQuery] = useState('');
  const [oppWorkModeFilter, setOppWorkModeFilter] = useState('All');
  const [selectedMatchModal, setSelectedMatchModal] = useState<OpportunityMatchResult | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  // Active student entity
  const currentStudent =
    students.find((s) => s.id === currentStudentId) || students[0];

  // Current display name in navbar
  const getCurrentDisplayName = () => {
    if (currentRole === 'student') return currentStudent?.name || 'Alex Rivera';
    if (currentRole === 'company') return currentCompanyName;
    if (currentRole === 'college') return currentCollegeName;
    return 'Guest';
  };

  // Student profile update handler
  const handleUpdateStudentProfile = (updated: Partial<StudentProfile>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === currentStudent.id ? { ...s, ...updated } : s))
    );
  };

  // Toggle stage completion on student roadmap
  const handleToggleStageCompletion = (skillName: string, stageNumber: number) => {
    const canonical = toCanonicalSkill(skillName);
    const currentCompleted = currentStudent.completedRoadmapStages[canonical] || currentStudent.completedRoadmapStages[skillName] || [];
    const isCompleted = currentCompleted.includes(stageNumber);

    const updated = isCompleted
      ? currentCompleted.filter((st) => st !== stageNumber)
      : [...currentCompleted, stageNumber].sort((a, b) => a - b);

    const updatedStages = {
      ...currentStudent.completedRoadmapStages,
      [canonical]: updated,
    };

    handleUpdateStudentProfile({ completedRoadmapStages: updatedStages });
  };

  // Add newly verified skill or evidence to student profile
  const handleSkillVerified = (
    skillName: string,
    score: number,
    evidenceType: 'Assessment' | 'Project' | 'Certificate',
    achievementData?: {
      title: string;
      type: 'Certificate' | 'Workshop' | 'Hackathon';
      issuerOrOrganizer: string;
      credentialUrl?: string;
      description?: string;
    }
  ) => {
    const canonical = toCanonicalSkill(skillName);
    const existingIndex = currentStudent.skills.findIndex(
      (s) => toCanonicalSkill(s.name).toLowerCase() === canonical.toLowerCase()
    );

    let nextSkills = [...currentStudent.skills];

    if (existingIndex >= 0) {
      const existing = nextSkills[existingIndex];
      const existingEvidence = new Set(existing.evidenceTypes || []);
      existingEvidence.add(evidenceType);

      nextSkills[existingIndex] = {
        ...existing,
        name: canonical,
        verified: true,
        demonstratedScore: Math.max(existing.demonstratedScore || 0, score),
        confidenceScore: Math.max(existing.confidenceScore || 0, score),
        level: score >= 80 ? 'Advanced' : 'Intermediate',
        evidenceTypes: Array.from(existingEvidence),
        lastAssessedDate: new Date().toISOString().split('T')[0],
      };
    } else {
      nextSkills.push({
        name: canonical,
        level: score >= 80 ? 'Advanced' : 'Intermediate',
        demonstratedScore: score,
        verified: true,
        confidenceScore: score,
        evidenceTypes: [evidenceType],
        lastAssessedDate: new Date().toISOString().split('T')[0],
      });
    }

    const updates: Partial<StudentProfile> = { skills: nextSkills };

    if (achievementData) {
      const newAch = {
        id: `ach-${Date.now()}`,
        title: achievementData.title,
        type: achievementData.type,
        issuerOrOrganizer: achievementData.issuerOrOrganizer,
        date: new Date().toISOString().split('T')[0],
        credentialUrl: achievementData.credentialUrl,
        associatedSkills: [canonical],
        description: achievementData.description,
      };
      updates.achievements = [newAch, ...(currentStudent.achievements || [])];
    }

    handleUpdateStudentProfile(updates);
  };

  // Add published opportunity by industry employer
  const handleAddOpportunity = (newOpp: Opportunity) => {
    setOpportunities((prev) => [newOpp, ...prev]);
  };

  // Login handler with synchronous persistence
  const handleLoginSuccess = (
    role: UserRole,
    userData: {
      name: string;
      email: string;
      secondary?: string;
      tertiary?: string;
    }
  ) => {
    let targetView = 'student';
    if (role === 'student') {
      const existing = students.find((s) => s.email === userData.email);
      if (existing) {
        setCurrentStudentId(existing.id);
      } else {
        const newStudent: StudentProfile = {
          id: `std-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          college: currentCollegeName,
          education: userData.tertiary || 'B.Tech in Computer Science',
          department: userData.secondary || 'Department of CSE',
          careerGoal: 'Full-Stack Web Developer',
          workPreference: 'Remote',
          experienceLevel: 'Intermediate',
          preferredLocation: 'Hyderabad',
          skills: [
            { name: 'HTML', level: 'Advanced', demonstratedScore: 90, verified: true, confidenceScore: 90, evidenceTypes: ['Assessment'] },
            { name: 'CSS', level: 'Advanced', demonstratedScore: 88, verified: true, confidenceScore: 88, evidenceTypes: ['Project'] },
            { name: 'JavaScript', level: 'Intermediate', demonstratedScore: 80, verified: true, confidenceScore: 80, evidenceTypes: ['Assessment'] },
            { name: 'SQL', level: 'Intermediate', demonstratedScore: 75, verified: true, confidenceScore: 75, evidenceTypes: ['Assessment'] },
            { name: 'Git', level: 'Intermediate', demonstratedScore: 78, verified: true, confidenceScore: 78, evidenceTypes: ['Project'] },
          ],
          achievements: [],
          completedRoadmapStages: { JavaScript: [1, 2, 3, 4] },
          savedOpportunityIds: [],
        };
        setStudents((prev) => [newStudent, ...prev]);
        setCurrentStudentId(newStudent.id);
      }
      targetView = 'student';
    } else if (role === 'company') {
      setCurrentCompanyName(userData.name);
      targetView = 'industry';
    } else if (role === 'college') {
      setCurrentCollegeName(userData.name);
      targetView = 'college';
    }

    setCurrentRole(role);
    setActiveView(targetView);

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('skill_nexus_current_role', role);
        localStorage.setItem('skill_nexus_current_role', role);
        sessionStorage.setItem('skill_nexus_active_view', targetView);
        localStorage.setItem('skill_nexus_active_view', targetView);
        sessionStorage.setItem('skill_nexus_current_view', targetView);
        localStorage.setItem('skill_nexus_current_view', targetView);
        window.location.hash = targetView;
      } catch {
        // ignore
      }
    }
  };

  // Authoritative navigation handler - strictly intentional navigation with indefinite stay
  const handleNavigate = (view: string) => {
    let targetView = view;
    let targetRole = currentRole;

    // Normalize any alternate view names
    if (targetView === 'candidateProfile' || targetView === 'candidateprofile' || targetView === 'company') {
      targetView = 'industry';
      targetRole = 'company';
    } else if (targetView === 'careerGuardian' || targetView === 'careerguardian') {
      targetView = 'guardian';
    }

    if (targetView === 'home') {
      if (currentRole === 'guest') {
        targetRole = 'guest';
      }
    } else if (targetView === 'student') {
      targetRole = 'student';
    } else if (targetView === 'industry') {
      targetRole = 'company';
    } else if (targetView === 'college') {
      targetRole = 'college';
    } else if (['roadmap', 'opportunities', 'verification', 'guardian'].includes(targetView)) {
      if (targetRole === 'guest') {
        targetRole = 'student';
      }
    }

    setCurrentRole(targetRole);
    setActiveView(targetView);

    // Synchronously write to all persistence layers
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('skill_nexus_current_role', targetRole);
        localStorage.setItem('skill_nexus_current_role', targetRole);
        sessionStorage.setItem('skill_nexus_active_view', targetView);
        localStorage.setItem('skill_nexus_active_view', targetView);
        sessionStorage.setItem('skill_nexus_current_view', targetView);
        localStorage.setItem('skill_nexus_current_view', targetView);
        window.location.hash = targetView;
      } catch {
        // ignore
      }
    }
  };

  // Persona switch helper for instant evaluation
  const handleRoleSwitch = (newRole: UserRole) => {
    let targetView = 'student';
    if (newRole === 'student') {
      targetView = 'student';
    } else if (newRole === 'company') {
      targetView = 'industry';
    } else if (newRole === 'college') {
      targetView = 'college';
    } else if (newRole === 'guest') {
      targetView = 'home';
    }

    setCurrentRole(newRole);
    setActiveView(targetView);

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('skill_nexus_current_role', newRole);
        localStorage.setItem('skill_nexus_current_role', newRole);
        sessionStorage.setItem('skill_nexus_active_view', targetView);
        localStorage.setItem('skill_nexus_active_view', targetView);
        sessionStorage.setItem('skill_nexus_current_view', targetView);
        localStorage.setItem('skill_nexus_current_view', targetView);
        window.location.hash = targetView;
      } catch {
        // ignore
      }
    }
  };

  // Deep linking to roadmap
  const handleNavigateToRoadmap = (skillName: string) => {
    setTargetSkillForRoadmap(skillName);
    try {
      sessionStorage.setItem('skill_nexus_target_skill', skillName);
      localStorage.setItem('skill_nexus_target_skill', skillName);
    } catch {
      // ignore
    }
    handleNavigate('roadmap');
  };

  // Deep linking to verification
  const handleNavigateToVerification = (skillName: string) => {
    setTargetSkillForRoadmap(skillName);
    try {
      sessionStorage.setItem('skill_nexus_target_skill', skillName);
      localStorage.setItem('skill_nexus_target_skill', skillName);
      sessionStorage.setItem('skill_nexus_verification_skill', skillName);
      localStorage.setItem('skill_nexus_verification_skill', skillName);
    } catch {
      // ignore
    }
    handleNavigate('verification');
  };

  // Filtered opportunities list
  const allRankedOpportunities = getRankedOpportunitiesForStudent(currentStudent, opportunities);
  const filteredOpportunities = allRankedOpportunities.filter((match) => {
    const opp = match.opportunity;
    const matchesSearch =
      opp.role.toLowerCase().includes(oppSearchQuery.toLowerCase()) ||
      opp.companyName.toLowerCase().includes(oppSearchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(oppSearchQuery.toLowerCase());
    const matchesMode =
      oppWorkModeFilter === 'All' || opp.workMode === oppWorkModeFilter;
    return matchesSearch && matchesMode;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Professional Navigation */}
      <Navbar
        currentRole={currentRole}
        currentUserName={getCurrentDisplayName()}
        activeView={activeView}
        onNavigate={handleNavigate}
        onRoleSwitch={handleRoleSwitch}
        onLogout={() => {
          try {
            sessionStorage.removeItem('skill_nexus_current_role');
            localStorage.removeItem('skill_nexus_current_role');
            sessionStorage.removeItem('skill_nexus_active_view');
            localStorage.removeItem('skill_nexus_active_view');
            sessionStorage.removeItem('skill_nexus_current_view');
            localStorage.removeItem('skill_nexus_current_view');
            window.location.hash = 'home';
          } catch {
            // ignore
          }
          setCurrentRole('guest');
          setActiveView('home');
        }}
        onOpenLogin={() => handleNavigate('login')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VIEW 1: LANDING PAGE */}
        {activeView === 'home' && (
          <LandingPage
            onSelectRole={(role) => {
              if (role === 'guest') {
                handleNavigate('login');
              } else {
                const target = role === 'company' ? 'industry' : role;
                handleNavigate(target);
              }
            }}
            onOpenSystem={() => handleNavigate('system')}
          />
        )}

        {/* VIEW 2: LOGIN / ROLE SELECTOR */}
        {activeView === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => handleNavigate('home')}
          />
        )}

        {/* VIEW 3: STUDENT DASHBOARD */}
        {activeView === 'student' && (
          <StudentDashboard
            student={currentStudent}
            opportunities={opportunities}
            onUpdateProfile={handleUpdateStudentProfile}
            onNavigateToRoadmap={handleNavigateToRoadmap}
            onNavigateToVerification={handleNavigateToVerification}
            onNavigateToGuardian={() => handleNavigate('guardian')}
          />
        )}

        {/* VIEW 4: INDUSTRY DASHBOARD */}
        {activeView === 'industry' && (
          <IndustryDashboard
            currentCompany={currentCompanyName}
            opportunities={opportunities}
            students={students}
            onAddOpportunity={handleAddOpportunity}
          />
        )}

        {/* VIEW 5: COLLEGE SKILL INTELLIGENCE DASHBOARD */}
        {activeView === 'college' && (
          <CollegeDashboard collegeName={currentCollegeName} />
        )}

        {/* VIEW 6: LEARNING ROADMAP */}
        {activeView === 'roadmap' && (
          <LearningRoadmapView
            student={currentStudent}
            initialSkill={targetSkillForRoadmap}
            onToggleStageCompletion={handleToggleStageCompletion}
            onNavigateToVerification={handleNavigateToVerification}
          />
        )}

        {/* VIEW 7: CAREER PATH GUARDIAN */}
        {activeView === 'guardian' && (
          <CareerPathGuardianView
            student={currentStudent}
            onNavigateToRoadmap={handleNavigateToRoadmap}
          />
        )}

        {/* VIEW 8: SKILL VERIFICATION */}
        {activeView === 'verification' && (
          <SkillVerificationView
            student={currentStudent}
            initialSkill={targetSkillForRoadmap}
            onSkillVerified={handleSkillVerified}
            onNavigateToRoadmap={handleNavigateToRoadmap}
          />
        )}

        {/* VIEW 9: SYSTEM OVERVIEW (SIH PRESENTATION VIEW) */}
        {activeView === 'system' && (
          <SystemOverview
            onNavigateToRole={(role) => {
              const target = role === 'company' ? 'industry' : role;
              handleNavigate(target);
            }}
          />
        )}

        {/* VIEW 10: OPPORTUNITIES DIRECT EXPLORER */}
        {activeView === 'opportunities' && (
          <div className="space-y-6">
            {/* Header & Filter Bar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    Opportunities Catalog
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Evaluated for {currentStudent.name}
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-indigo-600" />
                  Verified Internships & Openings
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Ranked by your explainable weighted skill coverage. Partial matches included for structured career progression.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={oppSearchQuery}
                    onChange={(e) => setOppSearchQuery(e.target.value)}
                    placeholder="Search role, company, location..."
                    className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 w-48 sm:w-60"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
                  {['All', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setOppWorkModeFilter(mode)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        oppWorkModeFilter === mode
                          ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Opportunities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOpportunities.map((match) => {
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
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">{opportunity.stipendOrSalary}</span>
                          </p>
                        </div>

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

                      {/* Required Skills weights bar */}
                      <div className="mt-3 flex items-center gap-1 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-500 mr-1">Required:</span>
                        {opportunity.skillsRequired.map((sr) => (
                          <span
                            key={sr.skill}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                          >
                            {sr.skill} <strong className="text-indigo-600 font-mono">({sr.weight}%)</strong>
                          </span>
                        ))}
                      </div>

                      {/* Alignment breakdown */}
                      <div className="mt-2.5 flex items-center gap-3 text-xs flex-wrap">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-emerald-700">Matched:</span>
                          <span className="text-slate-700">{strongSkills.join(', ') || 'Developing'}</span>
                        </div>
                        {missingSkills.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-amber-700">Missing:</span>
                            <span className="text-slate-500">{missingSkills.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedMatchModal(match);
                          setIsMatchModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> Explain Match
                      </button>

                      {missingSkills.length > 0 && (
                        <button
                          onClick={() => handleNavigateToRoadmap(missingSkills[0])}
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

            {/* Explain Match Modal */}
            <ExplainMatchModal
              isOpen={isMatchModalOpen}
              onClose={() => setIsMatchModalOpen(false)}
              matchResult={selectedMatchModal}
              onNavigateToRoadmap={handleNavigateToRoadmap}
            />
          </div>
        )}
      </main>

      {/* Global SIH 2026 Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">SKILL-NEXUS</span>
            <span>•</span>
            <span>Bridging Skills to Opportunities</span>
            <span>•</span>
            <span className="font-mono text-indigo-600 font-semibold">SIH26044</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavigate('system')}
              className="hover:text-indigo-600 transition-colors"
            >
              System Overview
            </button>
            <button
              onClick={() => handleNavigate('guardian')}
              className="hover:text-indigo-600 transition-colors"
            >
              Career Path Guardian
            </button>
            <button
              onClick={() => handleNavigate('college')}
              className="hover:text-indigo-600 transition-colors"
            >
              College Intelligence
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
