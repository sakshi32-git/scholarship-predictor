
export enum EligibilityStatus {
  ELIGIBLE = 'Eligible',
  NOT_ELIGIBLE = 'Not Eligible',
  BORDERLINE = 'Borderline',
  INCOMPLETE = 'Incomplete Data'
}

export interface MatchedScholarship {
  name: string;
  provider: string;
  url: string;
  amount?: string;
}

export interface ScholarshipAnalysis {
  eligibilityStatus: EligibilityStatus;
  acceptanceProbability: number; // 0 to 100
  riskFactors: string[];
  matchedScholarships: MatchedScholarship[];
  detailedReasoning: string;
  actionPlan: {
    shouldApply: boolean;
    reason: string;
    essentialDocuments: string[];
  };
  missingInformation?: string[];
}

export interface StudentInfo {
  name: string;
  state: string;
  category: string;
  annualIncome: string;
  lastClass: string;
  percentage: string;
  currentCourse: string;
  situationPrompt: string;
}

export interface SavedSearch {
  id: string;
  timestamp: number;
  studentInfo: StudentInfo;
  analysis: ScholarshipAnalysis;
}
