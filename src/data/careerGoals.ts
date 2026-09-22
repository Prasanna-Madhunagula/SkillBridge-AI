import { SkillWeight, Opportunity, OpportunityMatchResult, StudentProfile } from '../types';
import { calculateOpportunityMatch } from '../utils/matchingEngine';

export interface CareerGoalDefinition {
  id: string;
  title: string;
  aliases: string[];
  skillsRequired: SkillWeight[];
  description: string;
}

/**
 * Authoritative Career Goal to Required Skills Mapping for Skill-Nexus
 * 
 * Rules:
 * 1. Full-Stack Web Developer: HTML, CSS, JavaScript, React, Node.js, SQL, Git
 * 2. Data Scientist: Python, SQL, Statistics, Pandas, NumPy, Machine Learning, Git
 * 3. Data Analyst / Data Analytics: Python, SQL, Excel, Statistics, Pandas, Power BI, Git
 * 4. UI/UX Designer: Figma, UI Design, UX Research, Wireframing, Prototyping, User Research
 * 5. Backend Developer: Java, Spring Boot, REST APIs, SQL, Git, Database Management
 * 
 * Weights are mathematically distributed to sum to exactly 100%.
 */
export const CAREER_GOAL_CONFIGS: Record<string, CareerGoalDefinition> = {
  'Full-Stack Web Developer': {
    id: 'full-stack-web-developer',
    title: 'Full-Stack Web Developer',
    aliases: [
      'full-stack web developer',
      'full stack web developer',
      'full-stack developer',
      'full stack developer',
      'full stack',
      'full-stack',
      'web developer',
    ],
    skillsRequired: [
      { skill: 'HTML', weight: 15 },
      { skill: 'CSS', weight: 10 },
      { skill: 'JavaScript', weight: 20 },
      { skill: 'React', weight: 15 },
      { skill: 'Node.js', weight: 15 },
      { skill: 'SQL', weight: 15 },
      { skill: 'Git', weight: 10 },
    ],
    description: 'End-to-end full-stack web application development across responsive client interfaces, microservices, databases, and version control.',
  },

  'Data Scientist': {
    id: 'data-scientist',
    title: 'Data Scientist',
    aliases: [
      'data scientist',
      'data science',
      'machine learning engineer',
      'ml engineer',
      'ai engineer',
    ],
    skillsRequired: [
      { skill: 'Python', weight: 20 },
      { skill: 'SQL', weight: 15 },
      { skill: 'Statistics', weight: 15 },
      { skill: 'Pandas', weight: 10 },
      { skill: 'NumPy', weight: 10 },
      { skill: 'Machine Learning', weight: 20 },
      { skill: 'Git', weight: 10 },
    ],
    description: 'Statistical inference, exploratory data analysis, predictive modeling pipelines, and production machine learning algorithms.',
  },

  'Data Analyst / Data Analytics': {
    id: 'data-analyst-analytics',
    title: 'Data Analyst / Data Analytics',
    aliases: [
      'data analyst / data analytics',
      'data analyst',
      'data analytics',
      'business intelligence analyst',
      'bi analyst',
      'business analyst',
    ],
    skillsRequired: [
      { skill: 'Python', weight: 15 },
      { skill: 'SQL', weight: 20 },
      { skill: 'Excel', weight: 15 },
      { skill: 'Statistics', weight: 15 },
      { skill: 'Pandas', weight: 10 },
      { skill: 'Power BI', weight: 15 },
      { skill: 'Git', weight: 10 },
    ],
    description: 'Data querying, automated statistical reporting, business metric modeling, spreadsheet modeling, and executive BI dashboards.',
  },

  'UI/UX Designer': {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    aliases: [
      'ui/ux designer',
      'ui ux designer',
      'ui designer',
      'ux designer',
      'product designer',
      'interaction designer',
    ],
    skillsRequired: [
      { skill: 'Figma', weight: 25 },
      { skill: 'UI Design', weight: 20 },
      { skill: 'UX Research', weight: 15 },
      { skill: 'Wireframing', weight: 15 },
      { skill: 'Prototyping', weight: 15 },
      { skill: 'User Research', weight: 10 },
    ],
    description: 'Human-centered user experience design, wireframing, high-fidelity interactive prototyping, design systems, and empirical user testing.',
  },

  'Backend Developer': {
    id: 'backend-developer',
    title: 'Backend Developer',
    aliases: [
      'backend developer',
      'back-end developer',
      'backend engineer',
      'java backend developer',
      'java developer',
    ],
    skillsRequired: [
      { skill: 'Java', weight: 20 },
      { skill: 'Spring Boot', weight: 20 },
      { skill: 'REST APIs', weight: 15 },
      { skill: 'SQL', weight: 20 },
      { skill: 'Git', weight: 10 },
      { skill: 'Database Management', weight: 15 },
    ],
    description: 'Scalable server-side systems, RESTful microservices, transactional data architecture, persistence layers, and enterprise Java ecosystems.',
  },

  'Frontend Developer': {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    aliases: [
      'frontend developer',
      'front-end developer',
      'frontend engineer',
    ],
    skillsRequired: [
      { skill: 'HTML', weight: 20 },
      { skill: 'CSS', weight: 20 },
      { skill: 'JavaScript', weight: 25 },
      { skill: 'React', weight: 20 },
      { skill: 'Git', weight: 15 },
    ],
    description: 'Modern client-side web applications, reactive components, UI state management, and accessible interface engineering.',
  },
};

export const CAREER_GOALS_LIST = [
  'Full-Stack Web Developer',
  'Data Scientist',
  'Data Analyst / Data Analytics',
  'UI/UX Designer',
  'Backend Developer',
  'Frontend Developer',
];

/**
 * Normalizes any career goal input or alias to the canonical career goal title
 */
export function normalizeCareerGoalName(raw: string): string {
  if (!raw || typeof raw !== 'string') return 'Full-Stack Web Developer';
  const clean = raw.trim().toLowerCase();

  for (const [key, cfg] of Object.entries(CAREER_GOAL_CONFIGS)) {
    if (cfg.title.toLowerCase() === clean) return cfg.title;
    if (cfg.aliases.some((a) => a.toLowerCase() === clean)) return cfg.title;
  }

  // Heuristic fuzzy matching
  if (clean.includes('scientist') || clean.includes('science') || clean.includes('machine learning')) {
    return 'Data Scientist';
  }
  if (clean.includes('analyst') || clean.includes('analytics') || clean.includes('power bi') || clean.includes('bi')) {
    return 'Data Analyst / Data Analytics';
  }
  if (clean.includes('ui') || clean.includes('ux') || clean.includes('design') || clean.includes('figma')) {
    return 'UI/UX Designer';
  }
  if (clean.includes('backend') || clean.includes('back-end') || clean.includes('spring') || clean.includes('java')) {
    return 'Backend Developer';
  }
  if (clean.includes('frontend') || clean.includes('front-end')) {
    return 'Frontend Developer';
  }
  if (clean.includes('web') || clean.includes('full') || clean.includes('stack')) {
    return 'Full-Stack Web Developer';
  }

  return 'Full-Stack Web Developer';
}

/**
 * Retrieves the authoritative configuration for a career goal
 */
export function getCareerGoalConfig(raw: string): CareerGoalDefinition {
  const canonicalTitle = normalizeCareerGoalName(raw);
  return CAREER_GOAL_CONFIGS[canonicalTitle] || CAREER_GOAL_CONFIGS['Full-Stack Web Developer'];
}

/**
 * Retrieves the exact list of required skill names for a career goal
 */
export function getRequiredSkillsForCareerGoal(raw: string): string[] {
  const config = getCareerGoalConfig(raw);
  return config.skillsRequired.map((s) => s.skill);
}

/**
 * Calculates the benchmark OpportunityMatchResult for a student against their target career goal.
 * Generates an explainable benchmark Opportunity object and runs it through the standard matching engine.
 */
export function calculateCareerGoalMatch(
  student: StudentProfile,
  careerGoal: string
): OpportunityMatchResult {
  const config = getCareerGoalConfig(careerGoal);

  const benchmarkOpportunity: Opportunity = {
    id: `goal-${config.id}`,
    role: config.title,
    companyName: 'Career Goal Benchmark',
    opportunityType: 'Full-time',
    workMode: student.workPreference || 'Hybrid',
    location: student.preferredLocation || 'Telangana',
    openings: 1,
    description: config.description,
    skillsRequired: config.skillsRequired,
    postedDate: '2026-09-01',
    deadline: '2026-12-31',
    stipendOrSalary: 'Role Standard Benchmark',
  };

  return calculateOpportunityMatch(student, benchmarkOpportunity);
}
