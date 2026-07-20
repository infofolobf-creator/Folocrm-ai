/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { Lead, Company, Task, Campaign, LandingPage, VeilleAlert, MessageSuggestion, LeadStatus, OrchestratorConfig, OrchestratorPlan } from "./types";

interface CRMContextType {
  leads: Lead[];
  companies: Company[];
  tasks: Task[];
  campaigns: Campaign[];
  landingPages: LandingPage[];
  alerts: VeilleAlert[];
  suggestions: MessageSuggestion[];
  orchestratorConfig: OrchestratorConfig | null;
  orchestratorPlans: OrchestratorPlan[];
  isLoading: boolean;
  error: string | null;
  refreshDb: () => Promise<void>;
  saveDb: (updatedState: any) => Promise<void>;
  addLead: (lead: Omit<Lead, "id" | "createdAt">) => Promise<void>;
  updateLeadStatus: (leadId: string, status: LeadStatus) => Promise<void>;
  updateLead: (lead: Lead) => Promise<void>;
  addCompany: (company: Omit<Company, "id" | "createdAt">) => Promise<Company>;
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
  toggleTaskStatus: (taskId: string) => Promise<void>;
  addCampaign: (campaign: Omit<Campaign, "id" | "createdAt" | "sentCount" | "deliveredCount" | "responseCount">) => Promise<void>;
  addLandingPage: (lp: Omit<LandingPage, "id" | "createdAt" | "clicks" | "conversions">) => Promise<void>;
  qualifyLeadAI: (leadId: string) => Promise<void>;
  suggestMessageAI: (leadId: string, channel: string, goal: string) => Promise<void>;
  triggerVeilleAlertAI: () => Promise<void>;
  approveSuggestion: (sugId: string) => Promise<void>;
  updateOrchestratorConfig: (config: OrchestratorConfig) => Promise<void>;
  buildOrchestratorPlanAI: (params: { goalDescription: string; targetLeadsCount: number; maxBudget: number; useOnlyFree: boolean; mode: string }) => Promise<void>;
  executeOrchestratorStepAI: (planId: string, stepIndex: number) => Promise<void>;
  triggerOrchestratorLearning: () => Promise<void>;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [alerts, setAlerts] = useState<VeilleAlert[]>([]);
  const [suggestions, setSuggestions] = useState<MessageSuggestion[]>([]);
  const [orchestratorConfig, setOrchestratorConfig] = useState<OrchestratorConfig | null>(null);
  const [orchestratorPlans, setOrchestratorPlans] = useState<OrchestratorPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshDb = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/db");
      if (!res.ok) throw new Error("Erreur de communication avec le serveur.");
      const data = await res.json();
      
      setLeads(data.leads || []);
      setCompanies(data.companies || []);
      setTasks(data.tasks || []);
      setCampaigns(data.campaigns || []);
      setLandingPages(data.landingPages || []);
      setAlerts(data.alerts || []);
      setSuggestions(data.suggestions || []);
      setOrchestratorConfig(data.orchestratorConfig || null);
      setOrchestratorPlans(data.orchestratorPlans || []);
      setError(null);
    } catch (err: any) {
      console.error("Database fetch error:", err);
      setError("Impossible de charger les données du CRM. Vérifiez que le serveur fonctionne.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshDb();
  }, []);

  const saveDb = async (updatedState: any) => {
    try {
      const stateToSave = {
        orchestratorConfig,
        orchestratorPlans,
        ...updatedState
      };
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stateToSave)
      });
      if (!res.ok) throw new Error("Erreur d'enregistrement.");
      const data = await res.json();
      
      setLeads(data.data.leads || []);
      setCompanies(data.data.companies || []);
      setTasks(data.data.tasks || []);
      setCampaigns(data.data.campaigns || []);
      setLandingPages(data.data.landingPages || []);
      setAlerts(data.data.alerts || []);
      setSuggestions(data.data.suggestions || []);
      setOrchestratorConfig(data.data.orchestratorConfig || null);
      setOrchestratorPlans(data.data.orchestratorPlans || []);
    } catch (err) {
      console.error("Database save error:", err);
      setError("Échec de la synchronisation des données avec le serveur.");
    }
  };

  const addLead = async (leadData: Omit<Lead, "id" | "createdAt">) => {
    const newLead: Lead = {
      ...leadData,
      id: "lead-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    const newState = {
      leads: [newLead, ...leads],
      companies,
      tasks,
      campaigns,
      landingPages,
      alerts,
      suggestions
    };
    await saveDb(newState);
  };

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    const updatedLeads = leads.map(l => l.id === leadId ? { ...l, status } : l);
    const newState = {
      leads: updatedLeads,
      companies,
      tasks,
      campaigns,
      landingPages,
      alerts,
      suggestions
    };
    await saveDb(newState);
  };

  const updateLead = async (updatedLead: Lead) => {
    const updatedLeads = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
    const newState = {
      leads: updatedLeads,
      companies,
      tasks,
      campaigns,
      landingPages,
      alerts,
      suggestions
    };
    await saveDb(newState);
  };

  const addCompany = async (companyData: Omit<Company, "id" | "createdAt">): Promise<Company> => {
    const newCompany: Company = {
      ...companyData,
      id: "comp-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    const newState = {
      leads,
      companies: [...companies, newCompany],
      tasks,
      campaigns,
      landingPages,
      alerts,
      suggestions
    };
    await saveDb(newState);
    return newCompany;
  };

  const addTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: "task-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    const newState = {
      leads,
      companies,
      tasks: [newTask, ...tasks],
      campaigns,
      landingPages,
      alerts,
      suggestions
    };
    await saveDb(newState);
  };

  const toggleTaskStatus = async (taskId: string) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: (t.status === "pending" ? "completed" : "pending") as "pending" | "completed" } : t);
    const newState = {
      leads,
      companies,
      tasks: updatedTasks,
      campaigns,
      landingPages,
      alerts,
      suggestions
    };
    await saveDb(newState);
  };

  const addCampaign = async (campData: Omit<Campaign, "id" | "createdAt" | "sentCount" | "deliveredCount" | "responseCount">) => {
    const newCampaign: Campaign = {
      ...campData,
      id: "camp-" + Math.random().toString(36).substr(2, 9),
      sentCount: 0,
      deliveredCount: 0,
      responseCount: 0,
      createdAt: new Date().toISOString()
    };
    const newState = {
      leads,
      companies,
      tasks,
      campaigns: [newCampaign, ...campaigns],
      landingPages,
      alerts,
      suggestions
    };
    await saveDb(newState);
  };

  const addLandingPage = async (lpData: Omit<LandingPage, "id" | "createdAt" | "clicks" | "conversions">) => {
    const newLp: LandingPage = {
      ...lpData,
      id: "lp-" + Math.random().toString(36).substr(2, 9),
      clicks: 0,
      conversions: 0,
      createdAt: new Date().toISOString()
    };
    const newState = {
      leads,
      companies,
      tasks,
      campaigns,
      landingPages: [newLp, ...landingPages],
      alerts,
      suggestions
    };
    await saveDb(newState);
  };

  // --- INTERACTIVE AI AGENT WRAPPERS ---

  const qualifyLeadAI = async (leadId: string) => {
    const res = await fetch("/api/ai/qualify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "La qualification AI a échoué.");
    }
    // Refresh local state to load updated lead with AI qualification
    await refreshDb();
  };

  const suggestMessageAI = async (leadId: string, channel: string, goal: string) => {
    const res = await fetch("/api/ai/suggest-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, channel, goal })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "La suggestion de message par l'IA a échoué.");
    }
    await refreshDb();
  };

  const triggerVeilleAlertAI = async () => {
    const res = await fetch("/api/ai/veille-alerts", {
      method: "POST"
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "La génération de l'alerte de veille a échoué.");
    }
    await refreshDb();
  };

  const approveSuggestion = async (sugId: string) => {
    const updatedSug = suggestions.map(s => s.id === sugId ? { ...s, status: "approved" as const } : s);
    const newState = {
      leads,
      companies,
      tasks,
      campaigns,
      landingPages,
      alerts,
      suggestions: updatedSug
    };
    await saveDb(newState);
  };

  const updateOrchestratorConfig = async (newConfig: OrchestratorConfig) => {
    setOrchestratorConfig(newConfig);
    const newState = {
      leads,
      companies,
      tasks,
      campaigns,
      landingPages,
      alerts,
      suggestions,
      orchestratorConfig: newConfig,
      orchestratorPlans
    };
    await saveDb(newState);
  };

  const buildOrchestratorPlanAI = async (params: { goalDescription: string; targetLeadsCount: number; maxBudget: number; useOnlyFree: boolean; mode: string }) => {
    const res = await fetch("/api/ai/orchestrator/build-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...params,
        policies: orchestratorConfig?.policies
      })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "La création du plan d'orchestration a échoué.");
    }
    await refreshDb();
  };

  const executeOrchestratorStepAI = async (planId: string, stepIndex: number) => {
    const res = await fetch("/api/ai/orchestrator/execute-step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, stepIndex })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "L'exécution de l'étape a échoué.");
    }
    await refreshDb();
  };

  const triggerOrchestratorLearning = async () => {
    const res = await fetch("/api/ai/orchestrator/learn-and-adapt", {
      method: "POST"
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "L'audit d'apprentissage de l'Orchestrateur a échoué.");
    }
    await refreshDb();
  };

  return (
    <CRMContext.Provider
      value={{
        leads,
        companies,
        tasks,
        campaigns,
        landingPages,
        alerts,
        suggestions,
        orchestratorConfig,
        orchestratorPlans,
        isLoading,
        error,
        refreshDb,
        saveDb,
        addLead,
        updateLeadStatus,
        updateLead,
        addCompany,
        addTask,
        toggleTaskStatus,
        addCampaign,
        addLandingPage,
        qualifyLeadAI,
        suggestMessageAI,
        triggerVeilleAlertAI,
        approveSuggestion,
        updateOrchestratorConfig,
        buildOrchestratorPlanAI,
        executeOrchestratorStepAI,
        triggerOrchestratorLearning
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error("useCRM must be used within a CRMProvider");
  }
  return context;
};
