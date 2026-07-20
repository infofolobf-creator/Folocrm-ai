/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useCRM } from "../CRMContext";
import { 
  Cpu, 
  DollarSign, 
  Sliders, 
  ShieldCheck, 
  CheckCircle, 
  Play, 
  Loader2, 
  Sparkles, 
  AlertCircle, 
  Zap, 
  Coins, 
  Layers, 
  BookOpen, 
  FileText, 
  Check, 
  RefreshCw 
} from "lucide-react";
import { OrchestratorConfig, OrchestratorPolicy } from "../types";

export const OrchestratorView: React.FC = () => {
  const { 
    orchestratorConfig, 
    orchestratorPlans, 
    updateOrchestratorConfig, 
    buildOrchestratorPlanAI, 
    executeOrchestratorStepAI,
    triggerOrchestratorLearning,
    isLoading
  } = useCRM();

  // Local state for building a new plan
  const [goalDescription, setGoalDescription] = useState("Trouver 5 nouveaux prospects aujourd'hui et générer une ébauche d'email de sponsoring pour chacun.");
  const [targetLeadsCount, setTargetLeadsCount] = useState(5);
  const [maxBudget, setMaxBudget] = useState(10);
  const [useOnlyFree, setUseOnlyFree] = useState(true);
  const [selectedMode, setSelectedMode] = useState<"economy" | "balanced" | "performance" | "custom">("balanced");
  const [isBuildingPlan, setIsBuildingPlan] = useState(false);
  const [isExecutingStep, setIsExecutingStep] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Policy fields local states (initialized from config)
  const [humanValidationRequired, setHumanValidationRequired] = useState(orchestratorConfig?.policies?.humanValidationRequired ?? true);
  const [runFrequency, setRunFrequency] = useState(orchestratorConfig?.policies?.runFrequency ?? "manual");
  const [retryStrategy, setRetryStrategy] = useState(orchestratorConfig?.policies?.retryStrategy ?? "standard");
  const [approvedSources, setApprovedSources] = useState<string[]>(orchestratorConfig?.policies?.approvedSources ?? ["public_web", "tenders_bf", "linkedin"]);
  const [isSavingPolicies, setIsSavingPolicies] = useState(false);
  const [isLearning, setIsLearning] = useState(false);

  if (!orchestratorConfig) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const handleSavePolicies = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPolicies(true);
    setFeedbackMessage(null);
    try {
      const updatedConfig: OrchestratorConfig = {
        ...orchestratorConfig,
        policies: {
          humanValidationRequired,
          runFrequency,
          retryStrategy,
          approvedSources
        }
      };
      await updateOrchestratorConfig(updatedConfig);
      setFeedbackMessage({ type: "success", text: "Politiques d'exécution mises à jour avec succès !" });
    } catch (err: any) {
      setFeedbackMessage({ type: "error", text: err.message || "Impossible de sauvegarder les politiques." });
    } finally {
      setIsSavingPolicies(false);
    }
  };

  const handleBuildPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBuildingPlan(true);
    setFeedbackMessage(null);
    try {
      await buildOrchestratorPlanAI({
        goalDescription,
        targetLeadsCount,
        maxBudget,
        useOnlyFree,
        mode: selectedMode
      });
      setFeedbackMessage({ type: "success", text: "Nouveau plan d'action multi-agents construit et pré-approuvé par l'Orchestrateur !" });
    } catch (err: any) {
      setFeedbackMessage({ type: "error", text: err.message || "La construction du plan a échoué." });
    } finally {
      setIsBuildingPlan(false);
    }
  };

  const handleExecuteStep = async (planId: string, stepIndex: number) => {
    setIsExecutingStep(stepIndex);
    setFeedbackMessage(null);
    try {
      await executeOrchestratorStepAI(planId, stepIndex);
      setFeedbackMessage({ type: "success", text: "Étape exécutée avec succès par l'agent dédié !" });
    } catch (err: any) {
      setFeedbackMessage({ type: "error", text: err.message || "L'exécution de l'étape a échoué." });
    } finally {
      setIsExecutingStep(null);
    }
  };

  const toggleSource = (src: string) => {
    if (approvedSources.includes(src)) {
      setApprovedSources(approvedSources.filter(s => s !== src));
    } else {
      setApprovedSources([...approvedSources, src]);
    }
  };

  // Preset configuration modes helper
  const applyPresetMode = (mode: "economy" | "balanced" | "performance") => {
    setSelectedMode(mode);
    if (mode === "economy") {
      setUseOnlyFree(true);
      setMaxBudget(0);
      setRetryStrategy("none");
    } else if (mode === "balanced") {
      setUseOnlyFree(true);
      setMaxBudget(15);
      setRetryStrategy("standard");
    } else if (mode === "performance") {
      setUseOnlyFree(false);
      setMaxBudget(50);
      setRetryStrategy("aggressive");
    }
  };

  const currentPlan = orchestratorPlans[0];

  return (
    <div className="space-y-6" id="orchestrator-panel">
      {/* Visual Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>Orchestrateur Supérieur AI v2.5</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Supervision & Contrôle des Budgets Multi-Agents</h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-3xl leading-relaxed">
              Fixez vos objectifs commerciaux mensuels ou quotidiens. L'orchestrateur FOLO pilote de manière autonome et transparente les agents de veille, de qualification, de rédaction et de relance tout en respectant vos quotas gratuits et politiques de sécurité.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Orchestration en Ligne</span>
          </div>
        </div>
      </div>

      {/* Grid of Stats and Cost Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <span className="p-3 bg-indigo-50 rounded-lg text-indigo-600 block">
            <Coins className="w-5 h-5" />
          </span>
          <div className="space-y-0.5">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dépenses Jour</span>
            <span className="block text-lg font-extrabold text-slate-800">{orchestratorConfig.currentDailySpend.toFixed(4)} $</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <span className="p-3 bg-emerald-50 rounded-lg text-emerald-600 block">
            <DollarSign className="w-5 h-5" />
          </span>
          <div className="space-y-0.5">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Limite Budget</span>
            <span className="block text-lg font-extrabold text-slate-800">{orchestratorConfig.dailyBudgetLimit.toFixed(2)} $ / jour</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <span className="p-3 bg-amber-50 rounded-lg text-amber-600 block">
            <Zap className="w-5 h-5" />
          </span>
          <div className="space-y-0.5">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Quotas Gratuits Restants</span>
            <span className="block text-lg font-extrabold text-slate-800">{orchestratorConfig.remainingFreeQuota} req.</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
          <span className="p-3 bg-slate-50 rounded-lg text-slate-600 block">
            <Sliders className="w-5 h-5" />
          </span>
          <div className="space-y-0.5">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mode Actif</span>
            <span className="block text-sm font-extrabold text-indigo-600 uppercase tracking-wider">
              Mode {orchestratorConfig.mode === "economy" ? "Économie" : orchestratorConfig.mode === "balanced" ? "Équilibré" : orchestratorConfig.mode === "performance" ? "Performance" : "Personnalisé"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Build Plan & View active plan */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Define Goals */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Générateur d'objectifs de l'Orchestrateur</span>
            </h2>

            <form onSubmit={handleBuildPlan} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Votre objectif commercial d'aujourd'hui :</label>
                <textarea
                  value={goalDescription}
                  onChange={e => setGoalDescription(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 h-20 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 bg-slate-50/30"
                  placeholder="Décrivez votre objectif en langage naturel..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Prospects cibles</label>
                  <input
                    type="number"
                    value={targetLeadsCount}
                    onChange={e => setTargetLeadsCount(Number(e.target.value))}
                    min={1}
                    max={20}
                    className="w-full text-xs border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Budget max (USD)</label>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={e => setMaxBudget(Number(e.target.value))}
                    min={0}
                    disabled={useOnlyFree}
                    className="w-full text-xs border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1 flex flex-col justify-center">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Quotas API</span>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={useOnlyFree}
                      onChange={e => {
                        setUseOnlyFree(e.target.checked);
                        if (e.target.checked) setMaxBudget(0);
                      }}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Uniquement services gratuits</span>
                  </label>
                </div>
              </div>

              {/* Presets Row */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Sélectionner un mode d'exécution prédéfini :</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => applyPresetMode("economy")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      selectedMode === "economy"
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    🍃 Mode Économie (100% Gratuit)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetMode("balanced")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      selectedMode === "balanced"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    ⚖️ Mode Équilibré
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetMode("performance")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      selectedMode === "performance"
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    🚀 Mode Performance
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMode("custom")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      selectedMode === "custom"
                        ? "bg-rose-600 text-white border-rose-600"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    🔧 Mode Personnalisé
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isBuildingPlan}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {isBuildingPlan ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>L'Orchestrateur analyse l'objectif et configure le budget...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Construire le Plan Commercial Multi-Agents →</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Active Plan Steps Execution */}
          {currentPlan && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[9px] font-bold uppercase tracking-wider">
                    Plan commercial actif
                  </span>
                  <h3 className="text-sm font-bold text-slate-800">{currentPlan.goalDescription}</h3>
                </div>
                <span className={`self-start sm:self-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  currentPlan.status === "completed"
                    ? "bg-emerald-100 text-emerald-800"
                    : currentPlan.status === "active"
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {currentPlan.status === "completed" ? "Plan Complété" : currentPlan.status === "active" ? "Exécution en cours" : "Plan Draft"}
                </span>
              </div>

              {/* Budget Assessment Bubble */}
              <div className="bg-indigo-50/40 border border-indigo-100/60 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Audit de Faisabilité de l'Orchestrateur</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold bg-white/80 border border-slate-100 px-2 py-0.5 rounded-md">
                    Impact estimé : -{currentPlan.budgetAssessment.quotaImpact} requêtes API
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {currentPlan.budgetAssessment.reasoning}
                </p>
                <div className="pt-1.5 flex items-center gap-3 text-[11px] font-bold text-indigo-950">
                  <span>Coût prévisionnel : {currentPlan.budgetAssessment.estimatedCost.toFixed(2)} $</span>
                  <span>•</span>
                  <span className="text-emerald-700">Faisable : {currentPlan.budgetAssessment.isFeasible ? "Oui (Respecte les quotas)" : "Non (Quotas insuffisants)"}</span>
                </div>
              </div>

              {/* List of Steps */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Séquence d'exécution coordonnée :</h4>
                <div className="relative border-l-2 border-slate-100 ml-4 pl-6 space-y-6">
                  {currentPlan.steps.map((step, idx) => {
                    const isCompleted = step.status === "completed";
                    const isFailed = step.status === "failed";
                    const isStepExecuting = isExecutingStep === idx;
                    
                    // Determine agent avatar helper
                    let avatar = "🤖";
                    if (step.agentId === "agent-veille") avatar = "🔍";
                    else if (step.agentId === "agent-qualification") avatar = "🧠";
                    else if (step.agentId === "agent-redacteur") avatar = "✍️";
                    else if (step.agentId === "agent-relance") avatar = "⏳";
                    else if (step.agentId === "agent-director") avatar = "👔";
                    else if (step.agentId === "agent-auditor") avatar = "📊";

                    return (
                      <div key={idx} className="relative text-xs">
                        {/* Bullet point indicator */}
                        <div className={`absolute -left-10 top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${
                          isCompleted
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : isStepExecuting
                            ? "bg-indigo-100 border-indigo-600 text-indigo-800 animate-pulse"
                            : "bg-white border-slate-200 text-slate-400"
                        }`}>
                          {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <span className="p-1 bg-slate-100 rounded text-sm">{avatar}</span>
                              <span className="font-bold text-slate-800">{step.agentName}</span>
                              <span className="text-[9px] font-bold text-slate-400 px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded">
                                Coût : {step.costEstimate.toFixed(3)} $
                              </span>
                            </div>

                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              isCompleted
                                ? "bg-emerald-50 text-emerald-700"
                                : isFailed
                                ? "bg-red-50 text-red-700"
                                : isStepExecuting
                                ? "bg-indigo-50 text-indigo-700"
                                : "bg-slate-50 text-slate-400"
                            }`}>
                              {isCompleted ? "Complété" : isFailed ? "Échoué" : isStepExecuting ? "Exécution..." : "En attente"}
                            </span>
                          </div>

                          <p className="text-slate-600 leading-relaxed font-semibold pl-1">
                            {step.action}
                          </p>

                          {/* Monospaced output on step completed */}
                          {step.output && (
                            <div className="bg-slate-50 border border-slate-100/80 p-3 rounded-lg font-mono text-[10px] text-slate-700 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                              {step.output}
                            </div>
                          )}

                          {/* Trigger action button for step */}
                          {!isCompleted && !isStepExecuting && (
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => handleExecuteStep(currentPlan.id, idx)}
                                disabled={isExecutingStep !== null}
                                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg transition shadow-xs disabled:opacity-40"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>Déclencher l'Agent FOLO AI</span>
                              </button>
                            </div>
                          )}

                          {isStepExecuting && (
                            <div className="flex items-center gap-2 text-indigo-600 font-bold py-1 pl-1">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>L'agent spécialisé traite la requête commerciale en tâche de fond...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Execution Policies center */}
        <div className="space-y-6">
          
          {/* Section 0: Continuous Strategic Learning Center */}
          <div className="bg-gradient-to-b from-indigo-50/50 to-white rounded-xl border border-indigo-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600 animate-pulse" />
                <span>Cerveau Stratégique d'Apprentissage</span>
              </h2>
              <button
                type="button"
                onClick={async () => {
                  setIsLearning(true);
                  setFeedbackMessage(null);
                  try {
                    await triggerOrchestratorLearning();
                    setFeedbackMessage({ 
                      type: "success", 
                      text: "Audit d'apprentissage continu terminé ! L'orchestrateur a analysé vos conversions et ajusté sa stratégie commerciale." 
                    });
                  } catch (err: any) {
                    setFeedbackMessage({ type: "error", text: err.message || "L'audit d'apprentissage continu a échoué." });
                  } finally {
                    setIsLearning(false);
                  }
                }}
                disabled={isLearning}
                title="Lancer l'audit stratégique en temps réel"
                className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition disabled:opacity-40"
              >
                {isLearning ? (
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              L'Orchestrateur supérieur FOLO CRM AI analyse en continu l'historique des campagnes et la distribution de votre pipeline pour affiner ses futures suggestions d'approche commerciale.
            </p>

            {orchestratorConfig.learningInsights && orchestratorConfig.learningInsights.length > 0 ? (
              <div className="space-y-2.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Enseignements stratégiques récents :</span>
                  {orchestratorConfig.lastLearningAt && (
                    <span className="text-[9px] font-medium text-indigo-500 lowercase">
                      mis à jour {new Date(orchestratorConfig.lastLearningAt).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {orchestratorConfig.learningInsights.map((insight, idx) => {
                    let emoji = "💡";
                    if (insight.toLowerCase().includes("canal")) emoji = "📈";
                    else if (insight.toLowerCase().includes("sectoriel") || insight.toLowerCase().includes("secteur")) emoji = "🏢";
                    else if (insight.toLowerCase().includes("budgétaire") || insight.toLowerCase().includes("quota") || insight.toLowerCase().includes("coût")) emoji = "💰";
                    else if (insight.toLowerCase().includes("tâches") || insight.toLowerCase().includes("relance")) emoji = "⏳";
                    
                    return (
                      <div key={idx} className="flex gap-2.5 items-start p-2.5 bg-slate-50/50 border border-slate-100 rounded-lg text-xs">
                        <span className="text-sm shrink-0">{emoji}</span>
                        <p className="text-slate-600 leading-normal font-medium">{insight}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center space-y-2">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aucun enseignement stratégique stocké pour le moment. L'Orchestrateur a besoin d'analyser l'historique du CRM.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    setIsLearning(true);
                    setFeedbackMessage(null);
                    try {
                      await triggerOrchestratorLearning();
                      setFeedbackMessage({ 
                        type: "success", 
                        text: "Audit d'apprentissage continu terminé ! L'orchestrateur a analysé vos conversions et ajusté sa stratégie commerciale." 
                      });
                    } catch (err: any) {
                      setFeedbackMessage({ type: "error", text: err.message || "L'audit d'apprentissage continu a échoué." });
                    } finally {
                      setIsLearning(false);
                    }
                  }}
                  disabled={isLearning}
                  className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition"
                >
                  {isLearning ? (
                    <Loader2 className="w-3 h-3 animate-spin text-white" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  <span>Déclencher l'Audit d'Apprentissage</span>
                </button>
              </div>
            )}
            
            <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1.5 text-[9px] font-bold text-indigo-950 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Boucle de feedback active</span>
            </div>
          </div>
          
          {/* Section 1: Policies Center */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Centre de Politiques d'Exécution</span>
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Configurez des règles impératives et restrictives de conformité et de contrôle pour réguler le comportement de tous vos agents AI FOLO.
            </p>

            <form onSubmit={handleSavePolicies} className="space-y-4">
              {/* Policy 1 */}
              <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-100/50">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={humanValidationRequired}
                    onChange={e => setHumanValidationRequired(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-xs space-y-0.5">
                    <span className="block font-bold text-slate-800">Garde-Fou Validation Humaine</span>
                    <span className="block text-[10px] text-slate-400 leading-relaxed">L'agent rédacteur doit stocker les brouillons dans suggestions sans envoi automatisé direct.</span>
                  </div>
                </label>
              </div>

              {/* Policy 2 */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fréquence de veille AI :</label>
                <select
                  value={runFrequency}
                  onChange={e => setRunFrequency(e.target.value as any)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                >
                  <option value="manual">Exécution Manuelle (À la demande)</option>
                  <option value="daily">Scan Quotidien Automatique</option>
                  <option value="weekly">Scan Hebdomadaire Automatique</option>
                </select>
              </div>

              {/* Policy 3 */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Stratégie de relance :</label>
                <select
                  value={retryStrategy}
                  onChange={e => setRetryStrategy(e.target.value as any)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                >
                  <option value="none">Aucune relance AI</option>
                  <option value="standard">Standard (Suggérer relance après 5 jours)</option>
                  <option value="aggressive">Agressive (Relancer après 48h d'inactivité)</option>
                </select>
              </div>

              {/* Policy 4 */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Sources de données approuvées :</label>
                <div className="space-y-2 pt-0.5 pl-0.5">
                  {[
                    { id: "public_web", label: "Web Public Sahélien" },
                    { id: "tenders_bf", label: "Marchés & Appels d'offres UEMOA" },
                    { id: "linkedin", label: "LinkedIn Social Outreach" },
                    { id: "local_networks", label: "Groupes & Associations RSE locaux" }
                  ].map(source => (
                    <label key={source.id} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={approvedSources.includes(source.id)}
                        onChange={() => toggleSource(source.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{source.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingPolicies}
                  className="w-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200 hover:border-indigo-200"
                >
                  {isSavingPolicies ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Application des stratégies de conformité...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span>Enregistrer les Règles de Conformité</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Feedback message box */}
          {feedbackMessage && (
            <div className={`p-4 rounded-xl text-xs flex items-start gap-2.5 animate-fade-in ${
              feedbackMessage.type === "success"
                ? "bg-emerald-50 border border-emerald-100 text-emerald-800"
                : "bg-red-50 border border-red-100 text-red-800"
            }`}>
              {feedbackMessage.type === "success" ? (
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              )}
              <span className="leading-relaxed font-semibold">{feedbackMessage.text}</span>
            </div>
          )}

          {/* Section 2: Informative Cards */}
          <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-slate-200/50 rounded-xl p-5 space-y-2 text-xs">
            <h3 className="font-bold text-slate-800 flex items-center gap-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Optimisation Intelligente FOLO</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Le programme FOLO CRM AI utilise un système exclusif de mise en cache sémantique et de compression contextuelle des prompts. Cette architecture brevetée permet de diviser par 4 le nombre d'appels d'API Gemini payants, assurant un fonctionnement 100% gratuit et pérenne de votre CRM au quotidien.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
