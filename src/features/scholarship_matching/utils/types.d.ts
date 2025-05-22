export interface IMatchingEvaluate {
  ordinal_criteria: Record<string, ICriterion>;
  binary_criteria: Record<string, ICriterion>;
}

export interface ICriterion {
  score: number;
  evidence: string[];
}

export interface IMatchingCriteria {
  name: string;
  matchPercentage: number;
  status: "met" | "partially-met" | "not-met";
  advice: string;
}
