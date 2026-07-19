/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useCRM } from "../CRMContext";
import { LeadStatus, Lead } from "../types";
import { Flame, ArrowLeft, ArrowRight, TrendingUp, Sparkles, AlertCircle } from "lucide-react";

export const PipelineView: React.FC = () => {
  const { leads, updateLeadStatus } = useCRM();

  // Define columns in the FOLO commercial pipeline
  const pipelineColumns: { id: LeadStatus; title: string; color: string; bg: string }[] = [
    { id: LeadStatus.NEW, title: "Nouveau", color: "text-blue-700 border-blue-200", bg: "bg-blue-50/40" },
    { id: LeadStatus.CONTACTED, title: "Contacté", color: "text-yellow-700 border-yellow-200", bg: "bg-yellow-50/20" },
    { id: LeadStatus.QUALIFIED, title: "Qualifié AI", color: "text-emerald-700 border-emerald-200", bg: "bg-emerald-50/40" },
    { id: LeadStatus.NEGOTIATION, title: "En Négociation", color: "text-purple-700 border-purple-200", bg: "bg-purple-50/30" },
    { id: LeadStatus.WON, title: "Gagné / Signé", color: "text-green-700 border-green-200", bg: "bg-green-50/50" },
    { id: LeadStatus.LOST, title: "Perdu", color: "text-red-700 border-red-200", bg: "bg-red-50/30" }
  ];

  // Helper to get next and previous stages for step-by-step moving
  const getNextStage = (current: LeadStatus): LeadStatus | null => {
    const sequence = [LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.NEGOTIATION, LeadStatus.WON];
    const idx = sequence.indexOf(current);
    if (idx !== -1 && idx < sequence.length - 1) {
      return sequence[idx + 1];
    }
    return null;
  };

  const getPrevStage = (current: LeadStatus): LeadStatus | null => {
    const sequence = [LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.NEGOTIATION, LeadStatus.WON];
    const idx = sequence.indexOf(current);
    if (idx > 0) {
      return sequence[idx - 1];
    }
    return null;
  };

  // Move directly to Lost
  const handleMarkAsLost = async (leadId: string) => {
    await updateLeadStatus(leadId, LeadStatus.LOST);
  };

  const handleMoveStage = async (leadId: string, targetStatus: LeadStatus) => {
    await updateLeadStatus(leadId, targetStatus);
  };

  // Compute stats for metrics bar
  const totalPipelineValue = leads.reduce((acc, l) => acc + (l.status !== LeadStatus.LOST ? l.value : 0), 0);
  const wonPipelineValue = leads.filter(l => l.status === LeadStatus.WON).reduce((acc, l) => acc + l.value, 0);

  return (
    <div className="space-y-6" id="pipeline-module">
      {/* Top pipeline overview */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Tunnel de Vente & Partenariats</h2>
          <p className="text-xs text-slate-500 mt-0.5">Suivez la maturation de vos deals RSE et d'insertion professionnelle FOLO en temps réel.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            <span>Encours Actifs : <span className="font-bold text-sm">{(totalPipelineValue - wonPipelineValue).toLocaleString()} €</span></span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-green-50 text-green-800 border border-green-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Signé FOLO : <span className="font-bold text-sm">{wonPipelineValue.toLocaleString()} €</span></span>
          </div>
        </div>
      </div>

      {/* Grid columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto pb-4" id="pipeline-columns-grid">
        {pipelineColumns.map(col => {
          const colLeads = leads.filter(l => l.status === col.id);
          const colSum = colLeads.reduce((acc, l) => acc + l.value, 0);

          return (
            <div key={col.id} className={`rounded-xl border border-slate-100 p-3 flex flex-col min-h-[500px] ${col.bg} shrink-0 min-w-[200px]`}>
              {/* Column Header */}
              <div className="border-b border-slate-200/50 pb-2 mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-xs">{col.title}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{colSum.toLocaleString()} €</p>
                </div>
                <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500 border border-slate-100">
                  {colLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colLeads.length === 0 ? (
                  <div className="text-center py-10 text-[10px] text-slate-400 italic">
                    Aucun deal à cette étape
                  </div>
                ) : (
                  colLeads.map((lead: Lead) => {
                    const next = getNextStage(lead.status);
                    const prev = getPrevStage(lead.status);

                    return (
                      <div
                        key={lead.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs hover:shadow-md hover:border-slate-200 transition space-y-3 group"
                      >
                        {/* Card header */}
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{lead.companyName}</p>
                          <h4 className="font-bold text-slate-800 text-xs leading-tight">{lead.name}</h4>
                        </div>

                        {/* Middle info */}
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-700 text-xs">{lead.value.toLocaleString()} €</span>
                          
                          {/* AI Badge if available */}
                          {lead.agentQualification && (
                            <span className={`inline-flex items-center gap-0.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                              lead.agentQualification.status === "hot" ? "bg-red-50 text-red-600 border border-red-100" :
                              lead.agentQualification.status === "warm" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-blue-50 text-blue-600"
                            }`}>
                              {lead.agentQualification.status === "hot" && <Flame className="w-2.5 h-2.5 text-red-500 animate-pulse" />}
                              Score {lead.agentQualification.score}
                            </span>
                          )}
                        </div>

                        {/* Notes snippet */}
                        {lead.notes && (
                          <p className="text-[10px] text-slate-400 line-clamp-2 italic leading-relaxed">
                            "{lead.notes}"
                          </p>
                        )}

                        {/* Navigation controls underneath the card */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-2 gap-1.5 opacity-80 group-hover:opacity-100 transition">
                          {/* Left Arrow */}
                          {prev ? (
                            <button
                              type="button"
                              onClick={() => handleMoveStage(lead.id, prev)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition"
                              title="Étape précédente"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="w-5" />
                          )}

                          {/* Quick Actions: Mark lost / restore from lost */}
                          {lead.status !== LeadStatus.LOST ? (
                            <button
                              type="button"
                              onClick={() => handleMarkAsLost(lead.id)}
                              className="px-1.5 py-0.5 hover:bg-red-50 rounded text-[9px] font-semibold text-slate-400 hover:text-red-600 border border-transparent hover:border-red-100 transition"
                            >
                              Perdu
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleMoveStage(lead.id, LeadStatus.NEW)}
                              className="px-1.5 py-0.5 hover:bg-blue-50 rounded text-[9px] font-semibold text-blue-600 border border-blue-100 transition"
                            >
                              Réactiver
                            </button>
                          )}

                          {/* Right Arrow */}
                          {next ? (
                            <button
                              type="button"
                              onClick={() => handleMoveStage(lead.id, next)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition"
                              title="Étape suivante"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="w-5" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanban guidance banner */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-bold text-slate-800">Conseil Commercial FOLO :</p>
          <p>
            Mettez à jour le tunnel au fur et à mesure de vos négociations de bourse d'insertion. Le Directeur Commercial AI audite l'ensemble de ces positions pour ajuster ses prévisions de chiffre d'affaires et vous suggérer les bons messages de suivi dans l'onglet de reporting.
          </p>
        </div>
      </div>
    </div>
  );
};
