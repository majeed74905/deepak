export interface RuleAnalysis {
  ruleName: string; // Short headline (e.g., "Travelling Violation")
  summary: string; // Step 1: Summarize what happened
  relevantRules: string[]; // Step 2: Identify Applicable Rules
  decision: string; // Step 3: State the Decision
  reasoning: string; // Step 4: Explain the Reasoning
  citations: string[]; // Step 5: Cite Sources
}

export interface HistoryItem extends RuleAnalysis {
  id: string;
  query: string;
  timestamp: number;
}

export enum AppView {
  ANALYZE = 'ANALYZE',
  HISTORY = 'HISTORY',
  RULEBOOK = 'RULEBOOK'
}

export interface RuleBookEntry {
  category: string;
  rules: { title: string; summary: string }[];
}