/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum LeadStatus {
  NEW = "new",
  CONTACTED = "contacted",
  QUALIFIED = "qualified",
  NEGOTIATION = "negotiation",
  WON = "won",
  LOST = "lost"
}

export interface Lead {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  email: string;
  phone: string;
  status: LeadStatus;
  value: number; // estimated deal value in €
  source: string; // e.g., "Landing Page", "Veille AI", "LinkedIn"
  country: string;
  createdAt: string;
  notes: string;
  agentQualification?: {
    score: number; // 0-100 lead quality score
    status: "hot" | "warm" | "cold";
    summary: string; // qualification rationale
    needsFollowUp: boolean;
    suggestedNextAction: string;
    analyzedAt: string;
    agentId: string;
  };
  lastContactedAt?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string; // e.g. "1-10", "11-50", "51-200", "200+"
  website: string;
  country: string;
  address: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
  assignedAgentId: string;
  leadId?: string;
  createdAt: string;
}

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  description: string;
  headerTitle: string;
  headerSub: string;
  ctaText: string;
  theme: "modern" | "dark" | "warm";
  clicks: number;
  conversions: number;
  status: "draft" | "published";
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  channel: "email" | "sms" | "whatsapp" | "linkedin";
  subject?: string;
  contentTemplate: string;
  status: "draft" | "scheduled" | "sending" | "completed";
  sentCount: number;
  deliveredCount: number;
  responseCount: number;
  scheduledAt?: string;
  createdAt: string;
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  systemPrompt: string;
  accentColor: string;
  badgeText: string;
}

export interface MessageSuggestion {
  id: string;
  leadId: string;
  agentId: string;
  channel: "email" | "sms" | "whatsapp" | "linkedin";
  subject?: string;
  body: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected" | "sent";
}

export interface VeilleAlert {
  id: string;
  title: string;
  source: string;
  relevance: number; // 0-100 relevance score for FOLO program
  summary: string;
  impactOnFolo: string;
  url?: string;
  createdAt: string;
  suggestedAction?: string;
}

export interface CRMStats {
  totalLeads: number;
  pipelineValue: number;
  conversionRate: number;
  activeCampaigns: number;
  qualifiedPercentage: number;
  stageDistribution: { [key in LeadStatus]: number };
}

export interface OrchestratorPolicy {
  humanValidationRequired: boolean;
  runFrequency: "manual" | "daily" | "weekly";
  retryStrategy: "none" | "standard" | "aggressive";
  approvedSources: string[];
}

export interface OrchestratorConfig {
  mode: "economy" | "balanced" | "performance" | "custom";
  dailyBudgetLimit: number;
  costPerLeadLimit: number;
  useOnlyFreeServices: boolean;
  targetLeadsCount: number;
  currentDailySpend: number;
  remainingFreeQuota: number;
  policies: OrchestratorPolicy;
  learningInsights?: string[];
  lastLearningAt?: string;
}

export interface OrchestratorPlanStep {
  agentId: string;
  agentName: string;
  action: string;
  status: "pending" | "running" | "completed" | "failed";
  costEstimate: number;
  output?: string;
}

export interface OrchestratorPlan {
  id: string;
  goalDescription: string;
  budgetAssessment: {
    estimatedCost: number;
    isFeasible: boolean;
    reasoning: string;
    quotaImpact: number;
  };
  steps: OrchestratorPlanStep[];
  createdAt: string;
  status: "draft" | "active" | "completed" | "failed";
}

export interface KnowledgeVersion {
  version: number;
  content: string;
  updatedAt: string;
  author?: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: string; // e.g. "Présentation FOLO", "Offres & Expertise", "Partenaires & Experts", "Légal & Tarifs", "Veille & Décisions"
  subcategory: string; // e.g. "Vision, mission, valeurs", "Services et offres", "CV", "FAQ", etc.
  type: "document" | "link" | "note";
  content: string;
  sourceUrl?: string;
  fileName?: string;
  fileType?: string; // e.g. "pdf", "docx", "xlsx", "pptx"
  version: number;
  updatedAt: string;
  author: string;
  versions: KnowledgeVersion[];
}

export interface RagQueryResult {
  answer: string;
  confidenceScore: number; // 0-100 index of base knowledge integration
  knowledgeSource: "folo_internal" | "gemini_general" | "hybrid";
  sourcesUsed: { id: string; title: string; category: string; subcategory: string }[];
}

export interface ScenarioDetail {
  title: string;
  objectives: string[];
  deliverables: string[];
  methodology: string;
  planning: string;
  resources: string[];
  estimatedBudget: number;
  competitiveAdvantages: string[];
  simulation: {
    probabilityOfSuccess: number; // 0-100
    fitScore: number; // 0-100
    profitability: number; // 0-100
    riskLevel: "low" | "medium" | "high";
    estimatedTimelineDays: number;
    budgetLimitConsumption: number;
  };
}

export interface BusinessOfferProposal {
  id: string;
  title: string;
  clientName: string;
  demandDescription: string;
  createdAt: string;
  updatedAt: string;
  demandAnalysis: {
    needs: string[];
    implicitNeeds: string[];
    decisionCriteria: string[];
    keywords: string[];
    risks: string[];
  };
  skillsAlignment: {
    skillsCoverageScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    suggestedPartners: string[];
  };
  innovationIdeas: {
    differentiators: string[];
    approaches: string[];
    techRecommendations: string[];
    complementaryServices: string[];
  };
  scenarios: {
    essential: ScenarioDetail;
    standard: ScenarioDetail;
    premium: ScenarioDetail;
    innovative: ScenarioDetail;
  };
  competitivePositioning: {
    relevance: string;
    differentiators: string;
    weaknesses: string;
    improvements: string;
  };
  selectedScenario: "essential" | "standard" | "premium" | "innovative" | null;
  status: "draft" | "under_review" | "finalized" | "sent";
}



