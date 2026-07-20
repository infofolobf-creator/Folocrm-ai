/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CRMProvider, useCRM } from "./CRMContext";
import { DashboardView } from "./components/DashboardView";
import { LeadsView } from "./components/LeadsView";
import { PipelineView } from "./components/PipelineView";
import { CampaignsView } from "./components/CampaignsView";
import { TasksView } from "./components/TasksView";
import { AgentsView } from "./components/AgentsView";
import { ReportingView } from "./components/ReportingView";
import { OpportunitiesView } from "./components/OpportunitiesView";
import { OrchestratorView } from "./components/OrchestratorView";
import { KnowledgeHubView } from "./components/KnowledgeHubView";
import { LayoutDashboard, Users, Target, Volume2, CheckSquare, Brain, FileText, Menu, X, HelpCircle, Loader2, Compass, Cpu, BookOpen } from "lucide-react";

type CRMTab = "dashboard" | "leads" | "pipeline" | "campaigns" | "tasks" | "agents" | "reporting" | "opportunities" | "orchestrator" | "knowledge";

function MainAppLayout() {
  const { isLoading, error } = useCRM();
  const [activeTab, setActiveTab] = useState<CRMTab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Map tabs to views
  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView onNavigateToOpportunities={() => setActiveTab("opportunities")} />;
      case "opportunities":
        return <OpportunitiesView />;
      case "leads":
        return <LeadsView />;
      case "pipeline":
        return <PipelineView />;
      case "campaigns":
        return <CampaignsView />;
      case "tasks":
        return <TasksView />;
      case "agents":
        return <AgentsView />;
      case "reporting":
        return <ReportingView />;
      case "orchestrator":
        return <OrchestratorView />;
      case "knowledge":
        return <KnowledgeHubView />;
      default:
        return <DashboardView />;
    }
  };

  const navItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "orchestrator", label: "Orchestrateur & Budgets", icon: Cpu },
    { id: "knowledge", label: "Cerveau FOLO (RAG)", icon: BookOpen },
    { id: "opportunities", label: "Opportunités détectées", icon: Compass },
    { id: "leads", label: "Prospects & Partenaires", icon: Users },
    { id: "pipeline", label: "Tunnel Commercial (Kanban)", icon: Target },
    { id: "campaigns", label: "Campagnes & Landing", icon: Volume2 },
    { id: "tasks", label: "Tâches & Suggestions", icon: CheckSquare },
    { id: "agents", label: "Équipe d'Agents AI", icon: Brain },
    { id: "reporting", label: "Rapport d'Audit (Auditeur)", icon: FileText }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
        <div className="text-center">
          <h2 className="text-base font-bold text-slate-800">Chargement de CRM FOLO Intelligent</h2>
          <p className="text-xs text-slate-400 mt-1">Initialisation des agents cognitifs et de la base de données locale...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col md:flex-row font-sans" id="app-viewport">
      {/* Top Mobile Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">FOLO CRM</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 hover:bg-slate-800 rounded transition"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-40 bg-slate-900 text-slate-300 w-64 p-5 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Header & Logo */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800/60">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center font-black text-white text-base">
              F
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-wider">CRM FOLO</h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Écosystème Commercial</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm font-bold"
                      : "hover:bg-slate-800/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="border-t border-slate-800/60 pt-4 space-y-3.5 text-[11px] text-slate-500">
          {error && (
            <div className="bg-red-950/40 border border-red-900/40 p-2.5 rounded-lg text-red-400">
              <span className="font-bold">Sync Error :</span> {error}
            </div>
          )}

          <div className="space-y-1 bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/40 text-[10px]">
            <p className="font-semibold text-slate-400 uppercase tracking-widest">Statut des API</p>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Gemini AI Engine</span>
              <span className="text-emerald-500 font-bold">Actif</span>
            </div>
          </div>

          <div className="text-center text-[10px]">
            &copy; 2026 Programme FOLO. Burkina Faso.
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-[1440px] mx-auto w-full">
        {renderActiveView()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CRMProvider>
      <MainAppLayout />
    </CRMProvider>
  );
}

