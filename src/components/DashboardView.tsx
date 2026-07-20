/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useCRM } from "../CRMContext";
import { LeadStatus } from "../types";
import { TrendingUp, Users, Target, Volume2, ShieldAlert, CheckSquare, Search, Brain, Loader2 } from "lucide-react";

interface DashboardViewProps {
  onNavigateToOpportunities?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateToOpportunities }) => {
  const { leads, campaigns, alerts, tasks, triggerVeilleAlertAI, toggleTaskStatus } = useCRM();
  const [isSearchingVeille, setIsSearchingVeille] = useState(false);
  const [veilleError, setVeilleError] = useState<string | null>(null);

  // Compute stats
  const totalLeads = leads.length;
  const pipelineValue = leads.reduce((acc, lead) => acc + (lead.value || 0), 0);
  const activeCampaigns = campaigns.filter(c => c.status === "sending" || c.status === "scheduled").length;
  
  const leadsWon = leads.filter(l => l.status === LeadStatus.WON).length;
  const leadsLost = leads.filter(l => l.status === LeadStatus.LOST).length;
  const finishedDeals = leadsWon + leadsLost;
  const conversionRate = finishedDeals > 0 ? Math.round((leadsWon / finishedDeals) * 100) : 0;

  const qualifiedLeads = leads.filter(l => l.status === LeadStatus.QUALIFIED || l.status === LeadStatus.NEGOTIATION || l.status === LeadStatus.WON).length;
  const qualifiedPercentage = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

  // AI Agents Overview
  const aiAgents = [
    { name: "Veilleur FOLO AI", role: "Veille & Appels d'Offres", status: "Actif", desc: "Détecte les subventions, RSE et opportunités régionales.", color: "emerald" },
    { name: "Qualificateur AI", role: "Audit de leads", status: "Veille", desc: "Analyse et note le potentiel des prospects (0-100).", color: "indigo" },
    { name: "Rédacteur AI", role: "Communication", status: "Actif", desc: "Rédige des templates d'emails, WhatsApp et LinkedIn.", color: "blue" },
    { name: "Relanceur AI", role: "Suivi temporel", status: "Veille", desc: "Détecte les deals froids et propose des relances.", color: "amber" },
    { name: "Directeur Commercial AI", role: "Conseil & Stratégie", status: "Actif", desc: "Fournit un coaching de négociation commerciale.", color: "purple" },
    { name: "Auditeur AI", role: "Reporting Global", status: "Prêt", desc: "Génère des rapports d'activité analytiques.", color: "rose" }
  ];

  const handleTriggerVeille = async () => {
    try {
      setIsSearchingVeille(true);
      setVeilleError(null);
      await triggerVeilleAlertAI();
    } catch (err: any) {
      setVeilleError(err.message || "Erreur de veille.");
    } finally {
      setIsSearchingVeille(false);
    }
  };

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tableau de Bord Commercial</h1>
          <p className="text-slate-300 text-sm mt-1">
            Écosystème intelligent de vente et de qualification automatique pour le <span className="font-semibold text-emerald-400">Programme FOLO</span>.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 px-3 py-1.5 rounded-full text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Workspace Connecté au Modèle <span className="font-semibold text-emerald-400">Gemini 3.5 Flash</span></span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Valeur du Pipeline</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{pipelineValue.toLocaleString()} €</h3>
            <p className="text-xs text-slate-400 mt-0.5">Valeur cumulée estimée</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Prospects</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalLeads}</h3>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">{qualifiedPercentage}% qualifiés ou +</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Taux de Conversion</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{conversionRate}%</h3>
            <p className="text-xs text-slate-400 mt-0.5">Ratio gagné / conclu</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Campagnes Actives</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{activeCampaigns}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Canaux email & LinkedIn</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Veille AI Alerts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-600" />
                <h2 className="font-semibold text-slate-800">Alertes d'Opportunités Commerciales (Veilleur AI)</h2>
              </div>
              <button
                onClick={handleTriggerVeille}
                disabled={isSearchingVeille}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition duration-200 disabled:opacity-50"
              >
                {isSearchingVeille ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyse du marché...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Lancer la Veille AI</span>
                  </>
                )}
              </button>
            </div>

            {veilleError && (
              <div className="mb-4 bg-red-50 text-red-600 text-xs p-3 rounded-lg">
                {veilleError}
              </div>
            )}

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Aucune alerte de veille pour le moment. Cliquez sur "Lancer la Veille AI" pour que l'agent scanne le marché.
                </div>
              ) : (
                <>
                  {alerts.map(alert => (
                    <div key={alert.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 hover:border-emerald-200 transition">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            Pertinence : {alert.relevance}%
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                            Source : {alert.source}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {new Date(alert.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-xs md:text-sm">{alert.title}</h3>
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{alert.summary}</p>
                      
                      {/* Suggested Action generated by the watch agent */}
                      {alert.suggestedAction && (
                        <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/30 text-[11px] text-slate-700 space-y-0.5">
                          <span className="font-bold text-emerald-800 block text-[10px] uppercase tracking-wider">Action suggérée par les Agents :</span>
                          <p className="leading-relaxed">{alert.suggestedAction}</p>
                        </div>
                      )}
                      
                      {alert.url && (
                        <a href={alert.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-emerald-600 hover:underline inline-block font-semibold">
                          Consulter la source d'information →
                        </a>
                      )}
                    </div>
                  ))}
                  
                  {onNavigateToOpportunities && (
                    <div className="pt-2 text-center">
                      <button
                        onClick={onNavigateToOpportunities}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition py-2 px-4 rounded-lg bg-indigo-50/40 border border-indigo-100/50 hover:bg-indigo-50 w-full justify-center"
                      >
                        Gérer et qualifier ces opportunités dans le module dédié →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* AI Team Operational Status */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
              <Brain className="w-5 h-5 text-indigo-600" />
              <h2 className="font-semibold text-slate-800">Équipe des Agents FOLO AI en Action</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {aiAgents.map((agent, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/30 flex flex-col justify-between hover:border-slate-200 transition">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-xs text-slate-800">{agent.name}</h4>
                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{agent.role}</p>
                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">{agent.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Tasks & Pipeline Stage Overview */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
              <CheckSquare className="w-5 h-5 text-slate-700" />
              <h2 className="font-semibold text-slate-800">Tâches en Cours ({tasks.filter(t => t.status === "pending").length})</h2>
            </div>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {tasks.filter(t => t.status === "pending").length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Aucune tâche urgente en attente !
                </div>
              ) : (
                tasks.filter(t => t.status === "pending").map(task => (
                  <div key={task.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-start gap-2.5 text-xs hover:border-slate-200 transition">
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      onChange={() => toggleTaskStatus(task.id)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 border-slate-300"
                    />
                    <div className="flex-1 space-y-0.5">
                      <p className="font-medium text-slate-800">{task.title}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{task.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
                          task.priority === "high" ? "bg-red-50 text-red-600" :
                          task.priority === "medium" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-[10px] text-slate-400">
                            Échéance : {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Metrics of the Pipeline stages */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 border-b border-slate-100 pb-4 mb-4">Aperçu du Tunnel Commercial</h2>
            <div className="space-y-3 text-xs">
              {[
                { label: "Nouveau", count: leads.filter(l => l.status === "new").length, color: "bg-blue-500" },
                { label: "Contacté", count: leads.filter(l => l.status === "contacted").length, color: "bg-yellow-500" },
                { label: "Qualifié", count: leads.filter(l => l.status === "qualified").length, color: "bg-emerald-500" },
                { label: "Négociation", count: leads.filter(l => l.status === "negotiation").length, color: "bg-purple-500" },
                { label: "Gagné (Sponsor/Signé)", count: leads.filter(l => l.status === "won").length, color: "bg-green-600 animate-pulse" },
                { label: "Perdu", count: leads.filter(l => l.status === "lost").length, color: "bg-rose-500" }
              ].map((stage, idx) => {
                const pct = totalLeads > 0 ? (stage.count / totalLeads) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-medium">{stage.label}</span>
                      <span className="font-semibold text-slate-800">{stage.count} ({Math.round(pct)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`${stage.color} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
