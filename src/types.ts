export type UserRole = 'student' | 'company' | 'college' | 'guest';

export type WorkPreference = 'Remote' | 'On-site' | 'Hybrid';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type OpportunityType = 'Internship' | 'Full-time' | 'Part-time';

export interface StudentAchievement {
  id: string;
  title: string;
  type: 'Certificate' | 'Workshop' | 'Hackathon';
  issuerOrOrganizer: string;
  date: string;
  credentialUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  fileData?: string;
  associatedSkills: string[];
  description?: string;
}

export interface StudentSkill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  demonstratedScore?: number; // 0-100 assessed score (if assessed)
  verified: boolean;
  confidenceScore?: number; // e.g. 85% from assessment
  evidenceTypes: ('Assessment' | 'Project' | 'Certificate')[];
  lastAssessedDate?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  education: string;
  department: string;
  careerGoal: string;
  workPreference: WorkPreference;
  experienceLevel: ExperienceLevel;
  preferredLocation?: string; // Telangana location (e.g. Hyderabad, Warangal, etc.)
  skills: StudentSkill[];
  achievements?: StudentAchievement[]; // Certificates, Workshops, Hackathons (supporting evidence)
  completedRoadmapStages: Record<string, number[]>; // skillName -> array of completed stage numbers
  savedOpportunityIds: string[];
}

export interface SkillWeight {
  skill: string;
  weight: number; // percentage, e.g. 30 for 30%
}

export interface Opportunity {
  id: string;
  companyName: string;
  companyLogo?: string;
  role: string;
  opportunityType: OpportunityType;
  workMode: WorkPreference;
  location: string;
  openings: number;
  description: string;
  skillsRequired: SkillWeight[]; // weights sum to 100%
  postedDate: string;
  deadline: string;
  stipendOrSalary?: string;
}

export interface SkillMatchContribution {
  skill: string;
  weight: number; // company weight %
  demonstratedScore: number; // student demonstrated score (0-100)
  studentLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  studentStatus: 'Strong' | 'Partial' | 'Missing';
  contribution: number; // calculated % contribution to overall score = (score * weight) / 100
  verified: boolean;
  evidenceTypes?: ('Assessment' | 'Project' | 'Certificate')[];
}

export interface OpportunityMatchResult {
  opportunity: Opportunity;
  skillMatchPercentage: number;
  skillGapPercentage: number;
  strongSkills: string[];
  partialSkills: string[];
  missingSkills: string[];
  breakdown: SkillMatchContribution[];
}

export interface CandidateMatch {
  student: StudentProfile;
  matchPercentage: number;
  skillGapPercentage: number;
  strongSkills: string[];
  partialSkills: string[];
  missingSkills: string[];
  evidenceSummary: ('Assessment' | 'Project' | 'Certificate')[];
  breakdown: SkillMatchContribution[];
  applicationStatus?: 'New' | 'Shortlisted' | 'Interviewed' | 'Hired';
}

export interface RoadmapResource {
  title: string;
  provider: 'W3Schools' | 'TopperWorld' | 'MDN Documentation' | 'YouTube' | 'FreeCodeCamp' | 'Official Docs';
  url: string;
  type: 'Article' | 'Interactive Tutorial' | 'Video' | 'Project Guide' | 'Official Docs';
}

export interface RoadmapStage {
  stageNumber: number;
  title: string;
  objective: string;
  keyTopics: string[];
  resources: RoadmapResource[];
  estimatedHours: number;
}

export interface SkillRoadmap {
  skillName: string;
  category: string;
  description: string;
  stages: RoadmapStage[];
}

export interface EmergingSkillClassification {
  name: string;
  category: 'Core' | 'Complementary' | 'Optional' | 'Not Relevant';
  relevanceScore: number; // 0 - 100
  rationale: string;
  recommendedAction: string;
  prerequisiteFoundation: string;
  stageTiming: 'Complete foundation first' | 'Learn alongside' | 'Future stage' | 'Deprioritize';
}

export interface SkillIntelligenceData {
  skillName: string;
  category: string;
  industryDemandPercentage: number; // e.g. 80
  studentCoveragePercentage: number; // e.g. 20
  skillGapPercentage: number; // e.g. 60
}

export interface CollegeTrainingPriority {
  skillName: string;
  industryDemand: number;
  studentCoverage: number;
  skillGap: number;
  priorityLabel: 'Highest Priority' | 'Next Priority' | 'High Priority' | 'Moderate Priority' | 'Lower Priority';
  recommendedAction: string;
  curriculumStatus: 'Not in Syllabus' | 'Elective Only' | 'Theory Only' | 'Active Lab Needed';
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SkillAssessment {
  skillName: string;
  timeMinutes: number;
  questions: AssessmentQuestion[];
}

export type KnowledgeState = 'Mastered' | 'Needs Practice' | 'Needs Learning' | 'Not Assessed';
