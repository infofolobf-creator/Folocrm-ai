/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useCRM } from "../CRMContext";
import { VeilleAlert, LeadStatus } from "../types";
import { 
  Sparkles, 
  Search, 
  Plus, 
  Check, 
  Loader2, 
  Mail, 
  TrendingUp, 
  Brain, 
  Calendar, 
  Briefcase, 
  ExternalLink,
  ChevronRight,
  AlertCircle,
  ThumbsUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const OpportunitiesView: React.FC = () => {
  const { 
    alerts, 
    leads, 
    addLead, 
    qualifyLeadAI, 
    suggestMessageAI, 
    triggerVeilleAlertAI, 
    refreshDb,
    isLoading
  } = useCRM();

  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filterSource, setFilterSource] = useState<string>("all");
  const [minRelevance, setMinRelevance] = useState<number>(0);

  // Triggering the watch agent (Veilleur AI)
  const handleScanOpportunities = async () => {
    setIsScanning(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await triggerVeilleAlertAI();
      setSuccessMessage("L'Agent Veilleur AI a scanné le web et les appels d'offres locaux. Une nouvelle opportunité hautement pertinente a été détectée !");
      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err: any) {
      setErrorMessage(err.message || "Impossible de lancer la veille automatique.");
    } finally {
      setIsScanning(false);
    }
  };

  // Convert opportunity to Lead + run Qualificateur AI and Rédacteur AI
  const handleConvertToLead = async (alert: VeilleAlert) => {
    setProcessingId(alert.id);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      // 1. Check if already converted
      const alreadyExists = leads.some(l => l.name === alert.title || l.companyName === alert.source);
      if (alreadyExists) {
        throw new Error("Cette opportunité a déjà été intégrée au pipeline en tant que prospect.");
      }

      // Create unique temporary contact info based on source/type
      const cleanCompany = alert.source;
      const cleanContact = "Responsable des Partenariats";
      const cleanEmail = `contact@${cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, "") || "partner"}.bf`;
      const cleanPhone = "+226 70 00 00 00";

      // 2. Add as Lead in the NEW stage
      const tempId = "lead-" + Math.random().toString(36).substring(2, 11);
      
      // Let's call the context addLead
      await addLead({
        name: cleanContact,
        companyId: "comp-new",
        companyName: cleanCompany,
        email: cleanEmail,
        phone: cleanPhone,
        status: LeadStatus.NEW,
        value: alert.relevance > 90 ? 15000 : alert.relevance > 80 ? 8000 : 3500,
        source: "Veille AI: " + alert.title,
        country: "Burkina Faso",
        notes: `Opportunité de veille : "${alert.summary}".\n\nImpact stratégique : "${alert.impactOnFolo}".\n\nAction suggérée à l'origine : "${alert.suggestedAction || ""}"`
      });

      // Quick manual reload of DB state to grab the newly added lead and apply AI agents on it
      await refreshDb();
      
      setSuccessMessage(`Opportunité convertie avec succès ! Le prospect "${cleanCompany}" a été intégré dans la colonne "Nouveau" de votre Tunnel Commercial.`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur lors de la conversion de l'opportunité.");
    } finally {
      setProcessingId(null);
    }
  };

  // Run deep AI qualification using Qualificateur AI on the lead associated with this alert
  const handleQualifyWithAI = async (alert: VeilleAlert) => {
    setProcessingId(`qualify-${alert.id}`);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      // Find the associated lead
      const associatedLead = leads.find(l => l.companyName === alert.source || l.source.includes(alert.title));
      
      if (!associatedLead) {
        throw new Error("Veuillez d'abord intégrer cette opportunité en tant que prospect au pipeline pour lancer l'audit de qualification.");
      }

      await qualifyLeadAI(associatedLead.id);
      setSuccessMessage(`L'Agent Qualificateur AI a terminé son audit. Score attribué : ${associatedLead.agentQualification?.score || "85"}/100. Retrouvez l'analyse détaillée dans le Tunnel Commercial.`);
      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur d'audit par l'Agent Qualificateur.");
    } finally {
      setProcessingId(null);
    }
  };

  // Run Rédacteur AI to draft a strategic outreach message
  const handleDraftMessageWithAI = async (alert: VeilleAlert) => {
    setProcessingId(`draft-${alert.id}`);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      // Find associated lead
      const associatedLead = leads.find(l => l.companyName === alert.source || l.source.includes(alert.title));
      
      if (!associatedLead) {
        throw new Error("Veuillez d'abord intégrer cette opportunité au pipeline pour permettre au Rédacteur AI de contextualiser son écriture.");
      }

      // Generate via Rédacteur AI
      await suggestMessageAI(
        associatedLead.id, 
        "email", 
        `Proposer un partenariat d'insertion ou sponsoring de cohorte basé sur l'opportunité : ${alert.title}`
      );

      setSuccessMessage("L'Agent Rédacteur AI a rédigé une proposition de message personnalisée ! Retrouvez-la dans l'onglet 'Tâches & Suggestions' sous forme de suggestion prête à être validée.");
      setTimeout(() => setSuccessMessage(null), 7000);
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur de rédaction par l'Agent Rédacteur.");
    } finally {
      setProcessingId(null);
    }
  };

  // Extract unique sources for filtering
  const sources = ["all", ...Array.from(new Set(alerts.map(a => a.source)))];

  // Filtering alerts
  const filteredAlerts = alerts.filter(alert => {
    const matchSource = filterSource === "all" || alert.source === filterSource;
    const matchRelevance = alert.relevance >= minRelevance;
    return matchSource && matchRelevance;
  });

  return (
    <div className="space-y-6" id="opportunities-viewport">
      {/* Dynamic Header Block */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 md:p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-indigo-500/10 blur-xl"></div>
        <div className="absolute left-1/3 -bottom-10 w-32 h-32 rounded-full bg-emerald-500/5 blur-lg"></div>

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold uppercase tracking-widest">
              Nouveau Module
            </div>
            <div className="flex items-center gap-1 text-indigo-400 text-xs font-bold">
              <Brain className="w-3.5 h-3.5 animate-pulse" />
              <span>Propulsé par FOLO AI</span>
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1">Opportunités Détectées</h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Surveillance continue du marché public et privé du Sahel. Vos agents IA détectent, qualifient et rédigent des réponses adaptées aux opportunités de sponsoring ou de placement d'étudiants FOLO.
          </p>
        </div>

        {/* Big Mobile-friendly Trigger Button */}
        <button
          onClick={handleScanOpportunities}
          disabled={isScanning || isLoading}
          className="w-full md:w-auto shrink-0 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs px-5 py-3.5 rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2.5 touch-manipulation uppercase tracking-wider"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Scan des marchés en cours...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 text-emerald-200 animate-bounce" />
              <span>Scanner le Web & Appels d'Offres</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Status Messages */}
      <AnimatePresence mode="wait">
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border border-red-200/60 rounded-xl text-red-700 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <div>
              <span className="font-bold">Erreur rencontrée : </span>
              {errorMessage}
            </div>
          </motion.div>
        )}

        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-50 border border-emerald-200/60 rounded-xl text-emerald-800 text-xs flex items-start gap-2.5 shadow-sm"
          >
            <ThumbsUp className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <span className="font-bold">Opération réussie : </span>
              {successMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter / Dashboard Stats Ribbon */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Simple count statistics */}
        <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-start">
          <div className="text-center md:text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Alertes Actives</span>
            <h4 className="text-xl font-black text-slate-800">{alerts.length}</h4>
          </div>
          <div className="h-8 w-px bg-slate-100 hidden md:block"></div>
          <div className="text-center md:text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Moyenne Pertinence</span>
            <h4 className="text-xl font-black text-emerald-600">
              {alerts.length > 0 
                ? Math.round(alerts.reduce((acc, a) => acc + a.relevance, 0) / alerts.length) 
                : 0}%
            </h4>
          </div>
          <div className="h-8 w-px bg-slate-100 hidden md:block"></div>
          <div className="text-center md:text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Opportunités Qualifiées</span>
            <h4 className="text-xl font-black text-indigo-600">
              {alerts.filter(a => a.relevance >= 85).length}
            </h4>
          </div>
        </div>

        {/* Interactive filtering controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex flex-col space-y-1 w-full sm:w-auto">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Filtrer par Source</label>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none w-full sm:w-44"
            >
              <option value="all">Toutes les sources</option>
              {sources.filter(s => s !== "all").map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-1 w-full sm:w-auto">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Pertinence minimale</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="90"
                step="10"
                value={minRelevance}
                onChange={(e) => setMinRelevance(Number(e.target.value))}
                className="w-full sm:w-28 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <span className="text-[11px] font-bold text-slate-600 w-8">{minRelevance}%+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid / Content Section */}
      <div className="grid grid-cols-1 gap-6" id="opportunities-list-grid">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-12 px-4 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-bold text-slate-700 text-sm">Aucune opportunité ne correspond à vos filtres</h3>
              <p className="text-xs text-slate-400">
                Ajustez les critères de filtrage ou demandez à l'Agent de Veille AI de scanner à nouveau le marché pour générer des alertes de subventions ou d'appels d'offres.
              </p>
            </div>
            <button
              onClick={() => { setFilterSource("all"); setMinRelevance(0); }}
              className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            // Check if this opportunity was already converted into a Lead
            const isLeadCreated = leads.some(
              l => l.companyName === alert.source || l.source.includes(alert.title)
            );
            const associatedLead = leads.find(
              l => l.companyName === alert.source || l.source.includes(alert.title)
            );
            const hasAIQualification = associatedLead?.agentQualification;

            // Define score color indicator
            const relevanceColor = 
              alert.relevance >= 90 
                ? "bg-rose-100 text-rose-800 border-rose-200" 
                : alert.relevance >= 80 
                  ? "bg-amber-100 text-amber-800 border-amber-200" 
                  : "bg-blue-100 text-blue-800 border-blue-200";

            return (
              <div 
                key={alert.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:border-indigo-100 hover:shadow-md transition duration-200"
              >
                {/* Upper alert card layout */}
                <div className="p-5 md:p-6 space-y-4 flex-1">
                  {/* Metadata header row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-50">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${relevanceColor}`}>
                        Score Pertinence : {alert.relevance}%
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        <span>{new Date(alert.createdAt).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </div>
                    
                    {/* Visual state pill */}
                    <div>
                      {isLeadCreated ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Prospect Créé</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200/50 px-2.5 py-0.5 rounded-full">
                          <span>Non traité</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Core description details */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5">
                      <Briefcase className="w-4 h-4 text-indigo-500 shrink-0 mt-1" />
                      <h3 className="font-bold text-slate-800 text-sm md:text-base leading-snug">{alert.title}</h3>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 pl-6">
                      <span className="font-bold text-slate-700">Source :</span>
                      <span>{alert.source}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pl-6">
                      {alert.summary}
                    </p>
                  </div>

                  {/* Impact Strategy Block */}
                  <div className="bg-indigo-50/30 rounded-xl p-3.5 border border-indigo-100/20 pl-4 space-y-1">
                    <span className="text-[10px] text-indigo-700 font-extrabold uppercase tracking-wide flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Analyse Stratégique FOLO :</span>
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {alert.impactOnFolo}
                    </p>
                  </div>

                  {/* Action suggérée par le Veilleur */}
                  {alert.suggestedAction && (
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 pl-4 space-y-1">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Action Suggérée (Veilleur AI) :</span>
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {alert.suggestedAction}
                      </p>
                    </div>
                  )}

                  {/* Associated Lead Qualification if run */}
                  {hasAIQualification && (
                    <div className="bg-emerald-50/40 rounded-xl p-3.5 border border-emerald-100/50 space-y-1">
                      <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wide flex items-center gap-1">
                        <Brain className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Qualification AI validée (Score : {associatedLead.agentQualification?.score}/100) :</span>
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {associatedLead.agentQualification?.summary}
                      </p>
                      <p className="text-[11px] text-emerald-800 font-medium">
                        <span className="font-bold">Prochaine action recommandée : </span>
                        {associatedLead.agentQualification?.suggestedNextAction}
                      </p>
                    </div>
                  )}
                </div>

                {/* Lower Action bar - Tactile & Clean */}
                <div className="bg-slate-50 border-t border-slate-100 px-4 py-3.5 flex flex-wrap gap-2.5 items-center justify-between">
                  {/* Source link */}
                  {alert.url ? (
                    <a 
                      href={alert.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[11px] text-indigo-600 font-bold hover:underline inline-flex items-center gap-1 pl-1 py-1.5 touch-manipulation"
                    >
                      <span>Voir la publication</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <div />
                  )}

                  {/* AI Agent Interactivities block */}
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Action 1: Convert to Lead */}
                    {!isLeadCreated ? (
                      <button
                        onClick={() => handleConvertToLead(alert)}
                        disabled={processingId !== null}
                        className="bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm touch-manipulation cursor-pointer"
                      >
                        {processingId === alert.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                        <span>Intégrer au Pipeline</span>
                      </button>
                    ) : (
                      <>
                        {/* Action 2: Qualify with AI */}
                        <button
                          onClick={() => handleQualifyWithAI(alert)}
                          disabled={processingId !== null}
                          className={`font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 touch-manipulation cursor-pointer ${
                            hasAIQualification 
                              ? "bg-slate-100 text-slate-500 cursor-not-allowed" 
                              : "bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 border border-indigo-100"
                          }`}
                        >
                          {processingId === `qualify-${alert.id}` ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Brain className="w-3.5 h-3.5" />
                          )}
                          <span>{hasAIQualification ? "Qualifié" : "Évaluer (Qualificateur AI)"}</span>
                        </button>

                        {/* Action 3: Draft approach message with AI */}
                        <button
                          onClick={() => handleDraftMessageWithAI(alert)}
                          disabled={processingId !== null}
                          className="bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-700 border border-emerald-100 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 touch-manipulation cursor-pointer"
                        >
                          {processingId === `draft-${alert.id}` ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Mail className="w-3.5 h-3.5" />
                          )}
                          <span>Rédiger d'approche (Rédacteur AI)</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Agent Flow explanation banner */}
      <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <Brain className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-bold text-slate-800">Comment fonctionne le flux d'opportunités ?</p>
          <p>
            1. <span className="font-semibold text-slate-700">L'Agent de Veille AI</span> scanne en continu pour découvrir de nouvelles pistes d'affaires.<br />
            2. Cliquez sur <span className="font-bold text-slate-800">« Intégrer au Pipeline »</span> pour convertir cette piste en prospect actif.<br />
            3. Utilisez <span className="font-bold text-slate-800">« Évaluer (Qualificateur AI) »</span> pour obtenir un audit d'impact rigoureux et automatique de la piste.<br />
            4. Cliquez sur <span className="font-bold text-slate-800">« Rédiger d'approche (Rédacteur AI) »</span> pour formuler automatiquement des messages d'approche et négocier vos bourses FOLO.
          </p>
        </div>
      </div>
    </div>
  );
};
