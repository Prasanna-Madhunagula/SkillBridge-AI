/**
 * Canonical Skill Normalization Utility for Skill-Nexus
 * 
 * Normalizes skill names across alias variations, abbreviations, casing,
 * and punctuation to ensure accurate deterministic matching.
 */

// Mapping of normalized aliases to canonical display names
const CANONICAL_SKILL_MAP: Record<string, string> = {
  // JavaScript & TypeScript ecosystem
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'vanilla js': 'JavaScript',
  'vanillajs': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'react': 'React',
  'reactjs': 'React',
  'react.js': 'React',
  'react native': 'React Native',
  'reactnative': 'React Native',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'express': 'Express.js',
  'expressjs': 'Express.js',
  'express.js': 'Express.js',
  'next': 'Next.js',
  'nextjs': 'Next.js',
  'next.js': 'Next.js',
  'vue': 'Vue.js',
  'vuejs': 'Vue.js',
  'angular': 'Angular',
  'angularjs': 'Angular',

  // Python & Data Science ecosystem
  'py': 'Python',
  'python': 'Python',
  'python3': 'Python',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'scipy': 'SciPy',
  'sklearn': 'Scikit-Learn',
  'scikit-learn': 'Scikit-Learn',
  'scikit learn': 'Scikit-Learn',
  'ml': 'Machine Learning',
  'machine learning': 'Machine Learning',
  'machinelearning': 'Machine Learning',
  'ai': 'Artificial Intelligence',
  'artificial intelligence': 'Artificial Intelligence',
  'deep learning': 'Deep Learning',
  'dl': 'Deep Learning',
  'nlp': 'Natural Language Processing',
  'cv': 'Computer Vision',
  'statistics': 'Statistics',
  'stats': 'Statistics',
  'data analysis': 'Data Analysis',
  'data science': 'Data Science',

  // Web Foundations & Styling
  'html': 'HTML',
  'html5': 'HTML',
  'css': 'CSS',
  'css3': 'CSS',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'bootstrap': 'Bootstrap',
  'sass': 'Sass',
  'scss': 'Sass',

  // Databases & Storage
  'sql': 'SQL',
  'rdbms': 'SQL',
  'relational database': 'SQL',
  'mysql': 'MySQL',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'pl/sql': 'PL/SQL',
  'mongo': 'MongoDB',
  'mongodb': 'MongoDB',
  'redis': 'Redis',
  'firebase': 'Firebase',
  'firestore': 'Firestore',

  // Tools, Cloud & DevOps
  'git': 'Git',
  'github': 'Git',
  'gitlab': 'Git',
  'version control': 'Git',
  'docker': 'Docker',
  'containerization': 'Docker',
  'k8s': 'Kubernetes',
  'kubernetes': 'Kubernetes',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'gcp': 'Google Cloud',
  'azure': 'Microsoft Azure',
  'ci/cd': 'CI/CD',
  'linux': 'Linux',

  // Analytics & Business Intelligence
  'power bi': 'Power BI',
  'powerbi': 'Power BI',
  'tableau': 'Tableau',
  'excel': 'Excel',
  'ms excel': 'Excel',
  'microsoft excel': 'Excel',

  // Design & Product
  'figma': 'Figma',
  'ui design': 'UI Design',
  'uidesign': 'UI Design',
  'ux research': 'UX Research',
  'uxresearch': 'UX Research',
  'ui': 'UI/UX Design',
  'ux': 'UI/UX Design',
  'ui/ux': 'UI/UX Design',
  'uiux': 'UI/UX Design',
  'user research': 'User Research',
  'userresearch': 'User Research',
  'wireframing': 'Wireframing',
  'prototyping': 'Prototyping',

  // Backend & Enterprise
  'spring boot': 'Spring Boot',
  'springboot': 'Spring Boot',
  'spring': 'Spring Boot',
  'rest apis': 'REST APIs',
  'rest api': 'REST APIs',
  'restapi': 'REST APIs',
  'restful api': 'REST APIs',
  'restful apis': 'REST APIs',
  'database management': 'Database Management',
  'dbms': 'Database Management',
  'rdbms management': 'Database Management',

  // Programming Languages
  'java': 'Java',
  'c': 'C',
  'c++': 'C++',
  'cpp': 'C++',
  'c#': 'C#',
  'csharp': 'C#',
  'golang': 'Go',
  'go': 'Go',
  'rust': 'Rust',
  'kotlin': 'Kotlin',
  'swift': 'Swift',
  'php': 'PHP',
};

/**
 * Normalizes a raw string into standard lookup key:
 * trims, removes extraneous symbols/spaces, converts to lowercase.
 */
function cleanKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[._\-\s]+/g, ' ')
    .trim();
}

/**
 * Returns the canonical display name for a skill.
 * If known in the canonical mapping, returns standard name (e.g., "js" -> "JavaScript").
 * Otherwise formats input into clean title casing.
 */
export function toCanonicalSkill(rawSkill: string): string {
  if (!rawSkill || typeof rawSkill !== 'string') return '';
  const trimmed = rawSkill.trim();
  if (!trimmed) return '';

  const lower = trimmed.toLowerCase();
  if (CANONICAL_SKILL_MAP[lower]) {
    return CANONICAL_SKILL_MAP[lower];
  }

  const cleaned = cleanKey(trimmed);
  if (CANONICAL_SKILL_MAP[cleaned]) {
    return CANONICAL_SKILL_MAP[cleaned];
  }

  // Preserve acronyms if short and uppercase (e.g., "AWS", "SQL", "API")
  if (trimmed.length <= 4 && trimmed === trimmed.toUpperCase()) {
    return trimmed;
  }

  // Capitalize words nicely as fallback
  return trimmed
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Checks whether two skill representations refer to the same canonical skill.
 */
export function areSkillsEquivalent(skillA: string, skillB: string): boolean {
  if (!skillA || !skillB) return false;
  const canonicalA = toCanonicalSkill(skillA).toLowerCase();
  const canonicalB = toCanonicalSkill(skillB).toLowerCase();
  return canonicalA === canonicalB;
}
