import {
  StudentProfile,
  Opportunity,
  OpportunityMatchResult,
  SkillMatchContribution,
  CandidateMatch,
  StudentSkill,
} from '../types';
import { toCanonicalSkill } from './skillNormalization';

/**
 * Derives the effective demonstrated score (0-100) for a student skill with graceful fallback.
 * Adheres strictly to backward compatibility with legacy records.
 */
export function getDemonstratedScore(skill: StudentSkill): number {
  if (typeof skill.demonstratedScore === 'number' && !isNaN(skill.demonstratedScore)) {
    return Math.max(0, Math.min(100, Math.round(skill.demonstratedScore)));
  }
  if (typeof skill.confidenceScore === 'number' && !isNaN(skill.confidenceScore)) {
    return Math.max(0, Math.min(100, Math.round(skill.confidenceScore)));
  }
  // Level-based standard fallback if not assessed yet
  if (skill.level === 'Advanced') return 90;
  if (skill.level === 'Intermediate') return 75;
  return 50; // Beginner
}

/**
 * Calculates the explainable weighted skill match between a student and an opportunity.
 * 
 * Adheres strictly to:
 * 1. Company weight: "How important is this skill for this particular role?" (weights sum to 100%)
 * 2. Student score: "How strong has the student demonstrated this skill?" (0 - 100)
 * 3. Canonical normalization: Aliases and casing match deterministically (e.g. 'js' -> 'JavaScript')
 * 4. Contribution Formula: Contribution = (Demonstrated Score * Company Weight) / 100
 * 5. Extra skills outside requirements do not falsely inflate the score
 * 6. Full explainability of each required skill's contribution
 */
export function calculateOpportunityMatch(
  student: StudentProfile,
  opportunity: Opportunity
): OpportunityMatchResult {
  // Build lookup map indexed by canonical lowercase skill name
  const studentSkillMap = new Map<string, StudentSkill>();
  for (const s of student.skills) {
    const canonicalName = toCanonicalSkill(s.name);
    studentSkillMap.set(canonicalName.toLowerCase(), s);
  }

  let totalWeightedScore = 0;
  const breakdown: SkillMatchContribution[] = [];
  const strongSkills: string[] = [];
  const partialSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const req of opportunity.skillsRequired) {
    const canonicalReqSkill = toCanonicalSkill(req.skill);
    const studentSkill = studentSkillMap.get(canonicalReqSkill.toLowerCase());

    if (studentSkill) {
      const demonstratedScore = getDemonstratedScore(studentSkill);
      // Contribution = (Score * Weight) / 100
      const exactContribution = (demonstratedScore * req.weight) / 100;
      const contribution = Math.round(exactContribution * 10) / 10;

      let status: 'Strong' | 'Partial' | 'Missing' = 'Partial';
      if (demonstratedScore >= 75 || studentSkill.level === 'Advanced') {
        status = 'Strong';
        strongSkills.push(canonicalReqSkill);
      } else {
        status = 'Partial';
        partialSkills.push(canonicalReqSkill);
      }

      totalWeightedScore += exactContribution;

      breakdown.push({
        skill: canonicalReqSkill,
        weight: req.weight,
        demonstratedScore,
        studentLevel: studentSkill.level,
        studentStatus: status,
        contribution: Math.round(contribution),
        verified: studentSkill.verified,
        evidenceTypes: studentSkill.evidenceTypes || [],
      });
    } else {
      missingSkills.push(canonicalReqSkill);
      breakdown.push({
        skill: canonicalReqSkill,
        weight: req.weight,
        demonstratedScore: 0,
        studentStatus: 'Missing',
        contribution: 0,
        verified: false,
        evidenceTypes: [],
      });
    }
  }

  // Ensure bounded between 0 and 100
  const finalMatchScore = Math.min(100, Math.max(0, Math.round(totalWeightedScore)));
  const skillGapPercentage = Math.max(0, 100 - finalMatchScore);

  return {
    opportunity,
    skillMatchPercentage: finalMatchScore,
    skillGapPercentage,
    strongSkills,
    partialSkills,
    missingSkills,
    breakdown,
  };
}

/**
 * Filter & rank opportunities for a student:
 * - Only includes opportunities with at least one matching skill (no 0% irrelevance)
 * - Ranked descending by weighted match
 */
export function getRankedOpportunitiesForStudent(
  student: StudentProfile,
  allOpportunities: Opportunity[]
): OpportunityMatchResult[] {
  const matches = allOpportunities.map((opp) => calculateOpportunityMatch(student, opp));

  // Filter out 0% matches where no required skill matched
  const relevant = matches.filter(
    (m) => m.skillMatchPercentage > 0 && (m.strongSkills.length > 0 || m.partialSkills.length > 0)
  );

  // Rank by weighted skill match descending
  return relevant.sort((a, b) => b.skillMatchPercentage - a.skillMatchPercentage);
}

/**
 * Calculates candidate matches for a company's specific opportunity:
 * - Ranked descending by weighted skill match
 * - Synthesizes candidate evidence (assessments, projects, certificates, workshops, hackathons)
 * - Note: Certificates and achievements are supporting evidence only (do not artificially inflate match)
 */
export function getRankedCandidatesForOpportunity(
  opportunity: Opportunity,
  allStudents: StudentProfile[]
): CandidateMatch[] {
  const candidateMatches: CandidateMatch[] = allStudents.map((student) => {
    const match = calculateOpportunityMatch(student, opportunity);

    // Aggregate evidence types from student's skills and achievements
    const evidenceSet = new Set<'Assessment' | 'Project' | 'Certificate'>();
    for (const s of student.skills) {
      if (s.evidenceTypes) {
        s.evidenceTypes.forEach((ev) => evidenceSet.add(ev));
      }
    }
    if (student.achievements && student.achievements.length > 0) {
      evidenceSet.add('Certificate');
    }

    return {
      student,
      matchPercentage: match.skillMatchPercentage,
      skillGapPercentage: match.skillGapPercentage,
      strongSkills: match.strongSkills,
      partialSkills: match.partialSkills,
      missingSkills: match.missingSkills,
      evidenceSummary: Array.from(evidenceSet),
      breakdown: match.breakdown,
      applicationStatus: 'New',
    };
  });

  // Rank candidates descending by match percentage
  return candidateMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

/**
 * Validates whether company opportunity skill weights sum to exactly 100% (Rule 1)
 */
export function validateSkillWeights(skills: { skill: string; weight: number }[]): {
  isValid: boolean;
  totalWeight: number;
  message: string;
} {
  const total = skills.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
  const isValid = total === 100;
  let message = 'Weights sum to exactly 100%.';

  if (total < 100) {
    message = `Current total is ${total}%. Need ${100 - total}% more to reach required 100%.`;
  } else if (total > 100) {
    message = `Current total is ${total}%. Please reduce weights by ${total - 100}% to reach exactly 100%.`;
  }

  return { isValid, totalWeight: total, message };
}

