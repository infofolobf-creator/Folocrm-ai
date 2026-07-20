/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useCRM } from "../CRMContext";
import { BusinessOfferProposal, ScenarioDetail } from "../types";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  TrendingUp,
  Plus,
  Trash2,
  Check,
  FileText,
  Sliders,
  Cpu,
  Layers,
  AlertTriangle,
  CheckCircle,
  Calendar,
  DollarSign,
  Award,
  Network,
  ArrowRight,
  ChevronRight,
  Info,
  Lightbulb,
  ShieldAlert,
  ArrowRightLeft,
  RefreshCw,
  Printer,
  CheckCircle2,
  Briefcase
} from "lucide-react";

export const BusinessDesignStudioView: React.FC = () => {
  const {
    businessOffers,
    createBusinessOfferAI,
    updateBusinessOffer,
    deleteBusinessOffer,
    knowledge,
    isLoading
  } = useCRM();

  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>("");
  const [proposalTitle, setProposalTitle] = useState<string>("");
  const [demandDescription, setDemandDescription] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");

  // Editing states
  const [activeTab, setActiveTab] = useState<"analysis" | "skills" | "scenarios" | "compare" | "audit">("analysis");
  const [activeScenario, setActiveScenario] = useState<"essential" | "standard" | "premium" | "innovative">("standard");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedOffer, setEditedOffer] = useState<BusinessOfferProposal | null>(null);

  useEffect(() => {
    if (businessOffers.length > 0 && !selectedOfferId) {
      setSelectedOfferId(businessOffers[0].id);
    }
  }, [businessOffers, selectedOfferId]);

  const selectedOffer = businessOffers.find(o => o.id === selectedOfferId) || null;

  useEffect(() => {
    if (selectedOffer) {
      setEditedOffer(JSON.parse(JSON.stringify(selectedOffer))); // Deep copy
    } else {
      setEditedOffer(null);
    }
  }, [selectedOffer]);

  const runSimulationSimulationSteps = async (name: string, desc: string, titleStr: string) => {
    setGenerating(true);
    const steps = [
      "Incarner l'Agent 'Analyse de la Demande FOLO'... Décorticage des besoins implicites",
      "Interrogation sémantique du Cerveau FOLO... RAG sur les grilles tarifaires et bourses",
      "Incarner l'Agent 'Adéquation des Compétences'... Calcul du score de matching",
      "Incarner l'Agent 'Innovation FOLO'... Génération d'architectures solaires, IoT et mobiles",
      "Incarner l'Agent 'Construction d'Offre'... Rédaction des scénarios (Essentielle, Standard, Premium, Innovante)",
      "Incarner l'Agent 'Positionnement Concurrentiel'... Analyse des risques et des améliorations",
      "Orchestration générale... Finalisation et structuration de l'étude strategique"
    ];

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 1400));
    }

    try {
      const offer = await createBusinessOfferAI(name, desc, titleStr || `Étude : ${name}`);
      setSelectedOfferId(offer.id);
      setShowCreateForm(false);
      setClientName("");
      setProposalTitle("");
      setDemandDescription("");
    } catch (err: any) {
      alert("Erreur de génération : " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !demandDescription) return;
    runSimulationSimulationSteps(clientName, demandDescription, proposalTitle);
  };

  const handleSaveEdit = async () => {
    if (!editedOffer) return;
    await updateBusinessOffer(editedOffer);
    setEditMode(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette étude strategique ?")) {
      await deleteBusinessOffer(id);
      if (selectedOfferId === id) {
        setSelectedOfferId(businessOffers.find(o => o.id !== id)?.id || null);
      }
    }
  };

  const handleSelectScenario = async (scenarioKey: "essential" | "standard" | "premium" | "innovative") => {
    if (!editedOffer) return;
    const updated = {
      ...editedOffer,
      selectedScenario: scenarioKey,
      status: "finalized" as const
    };
    setEditedOffer(updated);
    await updateBusinessOffer(updated);
  };

  // Helper colors based on risk levels
  const getRiskColor = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "low": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "medium": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "high": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    }
  };

  const formatEuro = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 font-sans" id="business-design-studio-root">
      {/* Sidebar with all offers */}
      <div className="w-80 border-r border-slate-800 bg-slate-950 flex flex-col shrink-0 h-full">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-400" />
            <h2 className="font-semibold text-slate-200 tracking-tight text-sm">Business Design Studio</h2>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="p-1.5 bg-indigo-600 hover:bg-indigo-500 transition text-white rounded-md flex items-center justify-center cursor-pointer"
            title="Concevoir une nouvelle offre"
            id="btn-new-offer"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* List of generated Proposals */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {businessOffers.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              Aucune offre dans le studio. Cliquez sur le bouton + pour concevoir votre première proposition.
            </div>
          ) : (
            businessOffers.map(offer => {
              const isSelected = offer.id === selectedOfferId;
              const selectedScenarioDetail = offer.selectedScenario ? offer.scenarios[offer.selectedScenario] : null;

              return (
                <div
                  key={offer.id}
                  onClick={() => {
                    setSelectedOfferId(offer.id);
                    setShowCreateForm(false);
                    setEditMode(false);
                  }}
                  className={`p-3.5 rounded-lg border transition duration-200 cursor-pointer text-left ${
                    isSelected
                      ? "bg-slate-800 border-indigo-500/60 shadow-md shadow-indigo-500/5"
                      : "bg-slate-900/50 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700"
                  }`}
                  id={`offer-card-${offer.id}`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-mono text-indigo-400 font-semibold tracking-wider uppercase">
                      {offer.clientName}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(offer.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-0.5 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <h4 className="text-xs font-medium text-slate-200 line-clamp-2 mt-1">
                    {offer.title}
                  </h4>
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      offer.status === "finalized"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {offer.status === "finalized" ? "Validé" : "Brouillon d'étude"}
                    </span>
                    {selectedScenarioDetail && (
                      <span className="text-[11px] font-mono font-medium text-indigo-300">
                        {formatEuro(selectedScenarioDetail.estimatedBudget)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 bg-slate-900 overflow-y-auto flex flex-col h-full relative">
        <AnimatePresence mode="wait">
          {/* Form wizard when clicking '+' or no offer available */}
          {showCreateForm || businessOffers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto my-auto p-8 w-full"
              key="wizard-form"
            >
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 shadow-xl shadow-black/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 h-40 w-40 bg-purple-600/10 rounded-full blur-3xl"></div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 tracking-tight font-sans">
                      FOLO Business Design Studio
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Bureau d'études commercial assisté par IA d'élite : concevez des partenariats et offres de formation hyper-ciblées au Sahel.
                    </p>
                  </div>
                </div>

                {generating ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="relative h-16 w-16 flex items-center justify-center">
                      <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <Cpu className="h-6 w-6 text-indigo-400 animate-pulse" />
                    </div>
                    <div className="space-y-2 max-w-md">
                      <h4 className="text-sm font-semibold text-indigo-400 font-mono tracking-wider">
                        SIMULATION MULTI-AGENTS ACTIVE
                      </h4>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed animate-pulse">
                        {generationStep}
                      </p>
                    </div>
                    <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-4/5 animate-[pulse_1.5s_infinite]"></div>
                    </div>
                    <p className="text-[10px] text-slate-500 max-w-xs">
                      Les Agents de Diagnostic, de matching de Compétences, d'Innovation et d'Arbitrage financier collaborent pour concevoir les meilleures options.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleGenerate} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Nom du Client / Prospect *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Sahel Énergie, GIZ Burkina, Sinuhe"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                          Titre du Projet (Optionnel)
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Proposition de Bourses Solaire Off-Grid"
                          value={proposalTitle}
                          onChange={(e) => setProposalTitle(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Description de la Demande / Contexte Commercial *
                      </label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Exprimez ici le besoin exprimé par le client potentiel. Ex : Sinuhe Énergie souhaite sponsoriser la formation technique de 25 jeunes filles vulnérables à Bobo-Dioulasso aux compétences solaires et IoT d'irrigation. Budget max de 30 000 €, exigence d'un stage pratique et d'une certification d'État."
                        value={demandDescription}
                        onChange={(e) => setDemandDescription(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans leading-relaxed resize-none"
                      />
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 flex items-start gap-2.5">
                      <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        <strong>Grounding Technologique Actif :</strong> L'IA consultera automatiquement les fiches du <strong>Cerveau FOLO</strong> (grilles de parrainages RSE de cohorte de 25 personnes à 12 500 €, bourses de 1 500 €, filières Web Mobile / Solaire / Agroécologie, et l'étude de cas Sinuhe Énergie) pour aligner ses scénarios d'offres sur nos ressources réelles.
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
                      {businessOffers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowCreateForm(false)}
                          className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 rounded-lg hover:bg-slate-900 transition"
                        >
                          Annuler
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-2 transition shadow-lg shadow-indigo-600/10 cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Lancer la Conception IA
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          ) : selectedOffer && editedOffer ? (
            /* Selected Business Offer workspace */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 flex flex-col h-full w-full"
              key="workspace-view"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                      {editedOffer.clientName}
                    </span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs text-slate-400 font-mono">
                      Créé le {new Date(editedOffer.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <h1 className="text-lg font-bold text-slate-100 font-sans mt-1.5 tracking-tight">
                    {editedOffer.title}
                  </h1>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 transition cursor-pointer flex items-center justify-center"
                    title="Imprimer l'étude"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                  {editMode ? (
                    <>
                      <button
                        onClick={() => {
                          setEditedOffer(JSON.parse(JSON.stringify(selectedOffer)));
                          setEditMode(false);
                        }}
                        className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-3.5 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition flex items-center gap-1.5"
                      >
                        <Check className="h-3.5 w-3.5" /> Enregistrer
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-3.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
                    >
                      Éditer l'Offre
                    </button>
                  )}
                </div>
              </div>

              {/* Work Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800 max-w-fit mb-6">
                <button
                  onClick={() => setActiveTab("analysis")}
                  className={`px-4 py-1.5 text-xs rounded-md font-medium transition flex items-center gap-2 ${
                    activeTab === "analysis"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 text-indigo-400" /> Diagnostic Besoins
                </button>
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`px-4 py-1.5 text-xs rounded-md font-medium transition flex items-center gap-2 ${
                    activeTab === "skills"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Cpu className="h-3.5 w-3.5 text-purple-400" /> Adéquation & RDI
                </button>
                <button
                  onClick={() => setActiveTab("scenarios")}
                  className={`px-4 py-1.5 text-xs rounded-md font-medium transition flex items-center gap-2 ${
                    activeTab === "scenarios"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Sliders className="h-3.5 w-3.5 text-amber-400" /> Simulateur d'Offres
                </button>
                <button
                  onClick={() => setActiveTab("compare")}
                  className={`px-4 py-1.5 text-xs rounded-md font-medium transition flex items-center gap-2 ${
                    activeTab === "compare"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <ArrowRightLeft className="h-3.5 w-3.5 text-teal-400" /> Tableau Comparatif
                </button>
                <button
                  onClick={() => setActiveTab("audit")}
                  className={`px-4 py-1.5 text-xs rounded-md font-medium transition flex items-center gap-2 ${
                    activeTab === "audit"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-pink-400" /> Audit & Positionnement
                </button>
              </div>

              {/* Workspace Panes based on Active Tab */}
              <div className="flex-1 min-h-0 bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col">
                <AnimatePresence mode="wait">
                  {/* TAB 1: DIAGNOSTIC & ANALYSIS */}
                  {activeTab === "analysis" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 flex-1 overflow-y-auto"
                      key="tab-analysis"
                    >
                      {/* Original demand copy */}
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                          Description de la Demande Client brute
                        </span>
                        <p className="text-xs text-slate-300 italic leading-relaxed">
                          "{editedOffer.demandDescription}"
                        </p>
                      </div>

                      {/* Diagnostic breakdown cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Explicit Needs */}
                        <div className="border border-slate-850 bg-slate-900/40 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="h-4.5 w-4.5 text-indigo-400" />
                            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                              Besoins Explicites (Agent Diagnostic)
                            </h4>
                          </div>
                          {editMode ? (
                            <textarea
                              rows={4}
                              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300 font-sans focus:outline-none"
                              value={editedOffer.demandAnalysis.needs.join("\n")}
                              onChange={(e) => {
                                const needs = e.target.value.split("\n");
                                setEditedOffer({
                                  ...editedOffer,
                                  demandAnalysis: { ...editedOffer.demandAnalysis, needs }
                                });
                              }}
                            />
                          ) : (
                            <ul className="space-y-2">
                              {editedOffer.demandAnalysis.needs.map((n, i) => (
                                <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                                  <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full shrink-0 mt-1.5" />
                                  <span>{n}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Implicit Needs */}
                        <div className="border border-slate-850 bg-slate-900/40 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="h-4.5 w-4.5 text-indigo-400" />
                            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                              Besoins Implicites détectés (Agent Diagnostic)
                            </h4>
                          </div>
                          {editMode ? (
                            <textarea
                              rows={4}
                              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300 font-sans focus:outline-none"
                              value={editedOffer.demandAnalysis.implicitNeeds.join("\n")}
                              onChange={(e) => {
                                const implicitNeeds = e.target.value.split("\n");
                                setEditedOffer({
                                  ...editedOffer,
                                  demandAnalysis: { ...editedOffer.demandAnalysis, implicitNeeds }
                                });
                              }}
                            />
                          ) : (
                            <ul className="space-y-2">
                              {editedOffer.demandAnalysis.implicitNeeds.map((n, i) => (
                                <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                                  <span className="h-1.5 w-1.5 bg-purple-500 rounded-full shrink-0 mt-1.5" />
                                  <span>{n}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Decision Criteria */}
                        <div className="border border-slate-850 bg-slate-900/40 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Sliders className="h-4.5 w-4.5 text-indigo-400" />
                            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                              Critères d'Arbitrage & Choix Client
                            </h4>
                          </div>
                          {editMode ? (
                            <textarea
                              rows={3}
                              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300 font-sans focus:outline-none"
                              value={editedOffer.demandAnalysis.decisionCriteria.join("\n")}
                              onChange={(e) => {
                                const decisionCriteria = e.target.value.split("\n");
                                setEditedOffer({
                                  ...editedOffer,
                                  demandAnalysis: { ...editedOffer.demandAnalysis, decisionCriteria }
                                });
                              }}
                            />
                          ) : (
                            <ul className="space-y-2">
                              {editedOffer.demandAnalysis.decisionCriteria.map((n, i) => (
                                <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                                  <span className="h-1.5 w-1.5 bg-amber-500 rounded-full shrink-0 mt-1.5" />
                                  <span>{n}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Identified Risks */}
                        <div className="border border-slate-850 bg-slate-900/40 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="h-4.5 w-4.5 text-rose-400" />
                            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                              Risques Projet & Commerciaux identifiés
                            </h4>
                          </div>
                          {editMode ? (
                            <textarea
                              rows={3}
                              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300 font-sans focus:outline-none"
                              value={editedOffer.demandAnalysis.risks.join("\n")}
                              onChange={(e) => {
                                const risks = e.target.value.split("\n");
                                setEditedOffer({
                                  ...editedOffer,
                                  demandAnalysis: { ...editedOffer.demandAnalysis, risks }
                                });
                              }}
                            />
                          ) : (
                            <ul className="space-y-2">
                              {editedOffer.demandAnalysis.risks.map((n, i) => (
                                <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                                  <span className="h-1.5 w-1.5 bg-rose-500 rounded-full shrink-0 mt-1.5" />
                                  <span>{n}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* Strategic Keywords */}
                      <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-lg flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">
                          Mots-Clés Stratégiques :
                        </span>
                        {editedOffer.demandAnalysis.keywords.map((word, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-indigo-300 border border-slate-750"
                          >
                            #{word}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: SKILLS MATCHING & INNOVATION RECOMMENDATIONS */}
                  {activeTab === "skills" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 flex-1 overflow-y-auto"
                      key="tab-skills"
                    >
                      {/* Skills alignment panel with score gauge */}
                      <div className="bg-slate-900/50 border border-slate-850 p-6 rounded-lg flex flex-col md:flex-row items-center gap-8">
                        {/* Score gauge */}
                        <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="56"
                              cy="56"
                              r="46"
                              className="stroke-slate-800"
                              strokeWidth="8"
                              fill="transparent"
                            />
                            <circle
                              cx="56"
                              cy="56"
                              r="46"
                              className="stroke-indigo-500"
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 46}
                              strokeDashoffset={2 * Math.PI * 46 * (1 - editedOffer.skillsAlignment.skillsCoverageScore / 100)}
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-2xl font-bold font-mono text-slate-100">
                              {editedOffer.skillsAlignment.skillsCoverageScore}%
                            </span>
                            <span className="text-[9px] text-slate-400 uppercase tracking-wider text-center font-sans">
                              Adéquation
                            </span>
                          </div>
                        </div>

                        {/* RAG Alignment comments */}
                        <div className="flex-1 space-y-4">
                          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                            <Award className="h-4 w-4 text-indigo-400" />
                            Alignement sur le Référentiel de Connaissances (Agent Adéquation)
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            L'Agent Adéquation a analysé notre fiches techniques dans le <strong>Cerveau FOLO</strong>. Nous possédons une excellente correspondance sur nos filières standards, mais certaines compétences techniques de pointe requièrent des partenaires désignés ou un ajustement de programme.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                                Compétences Couvertes :
                              </span>
                              <ul className="space-y-1.5">
                                {editedOffer.skillsAlignment.matchedSkills.map((s, idx) => (
                                  <li key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                                    <span className="h-1 w-2 bg-emerald-500 rounded shrink-0" />
                                    <span>{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                                Compétences Manquantes :
                              </span>
                              <ul className="space-y-1.5">
                                {editedOffer.skillsAlignment.missingSkills.map((s, idx) => (
                                  <li key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                                    <span className="h-1 w-2 bg-amber-500 rounded shrink-0" />
                                    <span>{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Partners and Innovation */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Suggested ecosystem partners */}
                        <div className="border border-slate-850 bg-slate-900/40 rounded-lg p-5">
                          <div className="flex items-center gap-2 mb-4">
                            <Network className="h-4.5 w-4.5 text-indigo-400" />
                            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                              Écosystème & Partenaires recommandés
                            </h4>
                          </div>
                          <ul className="space-y-2">
                            {editedOffer.skillsAlignment.suggestedPartners.map((partner, idx) => (
                              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-850">
                                <span className="text-indigo-400 font-mono font-bold text-xs mt-0.5">[P-{idx + 1}]</span>
                                <span>{partner}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Agent Innovation panel */}
                        <div className="border border-slate-850 bg-slate-900/40 rounded-lg p-5">
                          <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-4.5 w-4.5 text-purple-400" />
                            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                              Recommandations d'Innovation (Agent Innovation)
                            </h4>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                                Approche Pédagogique Différenciante :
                              </span>
                              <p className="text-xs text-slate-300 italic leading-relaxed">
                                "{editedOffer.innovationIdeas.differentiators[0] || "Intégration d'outillage solaire et entrepreneuriat."}"
                              </p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                                Choix Technologiques recommandés :
                              </span>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {editedOffer.innovationIdeas.techRecommendations.map((t, idx) => (
                                  <span key={idx} className="text-[10px] font-mono bg-slate-950 text-indigo-300 border border-slate-850 px-2 py-0.5 rounded">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: SCENARIOS SIMULATION */}
                  {activeTab === "scenarios" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 flex-1 overflow-y-auto"
                      key="tab-scenarios"
                    >
                      {/* Active scenario selector pills */}
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
                        {(["essential", "standard", "premium", "innovative"] as const).map((key) => {
                          const sc = editedOffer.scenarios[key];
                          const isActive = key === activeScenario;
                          const isSelectedFinal = editedOffer.selectedScenario === key;

                          return (
                            <button
                              key={key}
                              onClick={() => setActiveScenario(key)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                                isActive
                                  ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                              } flex items-center gap-1.5`}
                            >
                              <span className="capitalize">{key === "essential" ? "Essentielle" : key === "standard" ? "Standard" : key === "premium" ? "Premium" : "Innovante"}</span>
                              <span className="text-[10px] font-mono opacity-80">
                                ({formatEuro(sc.estimatedBudget)})
                              </span>
                              {isSelectedFinal && (
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Active scenario editing & simulations */}
                      {(() => {
                        const sc = editedOffer.scenarios[activeScenario];
                        return (
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Details (Left 2 columns) */}
                            <div className="lg:col-span-2 space-y-4">
                              <div className="border border-slate-850 p-5 rounded-lg bg-slate-900/30 space-y-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span className="text-[10px] font-mono text-indigo-400 font-semibold tracking-wider uppercase block">
                                      SCÉNARIO : {activeScenario === "essential" ? "ESSENTIEL" : activeScenario === "standard" ? "STANDARD" : activeScenario === "premium" ? "PREMIUM" : "INNOVANT"}
                                    </span>
                                    {editMode ? (
                                      <input
                                        type="text"
                                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-sm font-semibold text-slate-100 mt-1 w-full"
                                        value={sc.title}
                                        onChange={(e) => {
                                          const scenarios = { ...editedOffer.scenarios };
                                          scenarios[activeScenario] = { ...sc, title: e.target.value };
                                          setEditedOffer({ ...editedOffer, scenarios });
                                        }}
                                      />
                                    ) : (
                                      <h3 className="text-sm font-bold text-slate-100 mt-1 font-sans">
                                        {sc.title}
                                      </h3>
                                    )}
                                  </div>

                                  <div className="text-right">
                                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                                      Budget estimé (EUR)
                                    </span>
                                    {editMode ? (
                                      <input
                                        type="number"
                                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-right font-mono text-indigo-300 w-32 mt-1"
                                        value={sc.estimatedBudget}
                                        onChange={(e) => {
                                          const scenarios = { ...editedOffer.scenarios };
                                          scenarios[activeScenario] = { ...sc, estimatedBudget: Number(e.target.value) };
                                          setEditedOffer({ ...editedOffer, scenarios });
                                        }}
                                      />
                                    ) : (
                                      <span className="text-lg font-bold font-mono text-indigo-300 block">
                                        {formatEuro(sc.estimatedBudget)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-800/60">
                                  <div>
                                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                                      Durée estimée (Planning)
                                    </span>
                                    {editMode ? (
                                      <input
                                        type="text"
                                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 w-full mt-1"
                                        value={sc.planning}
                                        onChange={(e) => {
                                          const scenarios = { ...editedOffer.scenarios };
                                          scenarios[activeScenario] = { ...sc, planning: e.target.value };
                                          setEditedOffer({ ...editedOffer, scenarios });
                                        }}
                                      />
                                    ) : (
                                      <span className="text-xs text-slate-200 font-medium flex items-center gap-1.5 mt-1">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                        {sc.planning}
                                      </span>
                                    )}
                                  </div>

                                  <div>
                                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                                      Méthodologie Proposée
                                    </span>
                                    {editMode ? (
                                      <textarea
                                        rows={2}
                                        className="bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-200 w-full mt-1"
                                        value={sc.methodology}
                                        onChange={(e) => {
                                          const scenarios = { ...editedOffer.scenarios };
                                          scenarios[activeScenario] = { ...sc, methodology: e.target.value };
                                          setEditedOffer({ ...editedOffer, scenarios });
                                        }}
                                      />
                                    ) : (
                                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mt-1">
                                        {sc.methodology}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Objectives & Deliverables lists */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/60">
                                  <div>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                                      Objectifs du Scénario
                                    </span>
                                    {editMode ? (
                                      <textarea
                                        rows={3}
                                        className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 font-sans"
                                        value={sc.objectives.join("\n")}
                                        onChange={(e) => {
                                          const scenarios = { ...editedOffer.scenarios };
                                          scenarios[activeScenario] = { ...sc, objectives: e.target.value.split("\n") };
                                          setEditedOffer({ ...editedOffer, scenarios });
                                        }}
                                      />
                                    ) : (
                                      <ul className="space-y-1">
                                        {sc.objectives.map((obj, i) => (
                                          <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                                            <span className="h-1 w-1 bg-indigo-500 rounded-full mt-1.5" />
                                            <span>{obj}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>

                                  <div>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                                      Livrables Clés
                                    </span>
                                    {editMode ? (
                                      <textarea
                                        rows={3}
                                        className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-slate-300 font-sans"
                                        value={sc.deliverables.join("\n")}
                                        onChange={(e) => {
                                          const scenarios = { ...editedOffer.scenarios };
                                          scenarios[activeScenario] = { ...sc, deliverables: e.target.value.split("\n") };
                                          setEditedOffer({ ...editedOffer, scenarios });
                                        }}
                                      />
                                    ) : (
                                      <ul className="space-y-1">
                                        {sc.deliverables.map((del, i) => (
                                          <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                                            <span className="h-1 w-1 bg-purple-500 rounded-full mt-1.5" />
                                            <span>{del}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Action to validate scenario */}
                              <div className="bg-slate-900 border border-indigo-900/40 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                  <div className="h-8 w-8 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mt-0.5">
                                    <Check className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-semibold text-slate-200">
                                      Sélectionner comme Proposition Commerciale finale
                                    </h4>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                      Valide cette structure de budget et d'objectifs pour la soumission au client.
                                    </p>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleSelectScenario(activeScenario)}
                                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                                    editedOffer.selectedScenario === activeScenario
                                      ? "bg-emerald-600 text-white hover:bg-emerald-500"
                                      : "bg-indigo-600 text-white hover:bg-indigo-500"
                                  }`}
                                >
                                  {editedOffer.selectedScenario === activeScenario ? "Proposition Validée" : "Valider l'Offre"}
                                </button>
                              </div>
                            </div>

                            {/* Simulation Engine (Right Column) */}
                            <div className="space-y-4">
                              <div className="border border-slate-850 p-5 rounded-lg bg-slate-900/40 space-y-4">
                                <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
                                  SIMULATION & FIABILITÉ COMMERCIALE
                                </h4>

                                <div className="space-y-3.5">
                                  {/* Probabilité de succès */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                      <span className="text-slate-300">Probabilité de succès :</span>
                                      <span className="text-indigo-400 font-mono">{sc.simulation.probabilityOfSuccess}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-indigo-500 transition-all duration-500"
                                        style={{ width: `${sc.simulation.probabilityOfSuccess}%` }}
                                      />
                                    </div>
                                  </div>

                                  {/* Adéquation besoins (Fit) */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                      <span className="text-slate-300">Adéquation besoins (Fit Score) :</span>
                                      <span className="text-purple-400 font-mono">{sc.simulation.fitScore}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-purple-500 transition-all duration-500"
                                        style={{ width: `${sc.simulation.fitScore}%` }}
                                      />
                                    </div>
                                  </div>

                                  {/* Rentabilité */}
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                      <span className="text-slate-300">Indice de Rentabilité :</span>
                                      <span className="text-teal-400 font-mono">{sc.simulation.profitability}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-teal-500 transition-all duration-500"
                                        style={{ width: `${sc.simulation.profitability}%` }}
                                      />
                                    </div>
                                  </div>

                                  {/* Risk level */}
                                  <div className="flex items-center justify-between p-2.5 rounded-lg border bg-slate-950 border-slate-850">
                                    <span className="text-xs text-slate-300">Niveau de Risque :</span>
                                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold border ${getRiskColor(sc.simulation.riskLevel)}`}>
                                      {sc.simulation.riskLevel === "low" ? "FAIBLE" : sc.simulation.riskLevel === "medium" ? "MODÉRÉ" : "ÉLEVÉ"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}

                  {/* TAB 4: COMPARATIVE GRID TABLE */}
                  {activeTab === "compare" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex-1 flex flex-col min-h-0 overflow-x-auto"
                      key="tab-compare"
                    >
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                            <th className="py-3 px-4 font-semibold">Critères d'évaluation</th>
                            <th className="py-3 px-4 font-semibold text-indigo-400">Essentielle</th>
                            <th className="py-3 px-4 font-semibold text-purple-400">Standard</th>
                            <th className="py-3 px-4 font-semibold text-amber-400">Premium</th>
                            <th className="py-3 px-4 font-semibold text-rose-400">Innovante</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                          {/* Title */}
                          <tr>
                            <td className="py-3.5 px-4 font-medium text-slate-400">Titre de l'offre</td>
                            <td className="py-3.5 px-4 font-semibold text-indigo-300">{editedOffer.scenarios.essential.title}</td>
                            <td className="py-3.5 px-4 font-semibold text-purple-300">{editedOffer.scenarios.standard.title}</td>
                            <td className="py-3.5 px-4 font-semibold text-amber-300">{editedOffer.scenarios.premium.title}</td>
                            <td className="py-3.5 px-4 font-semibold text-rose-300">{editedOffer.scenarios.innovative.title}</td>
                          </tr>
                          {/* Budget */}
                          <tr>
                            <td className="py-3.5 px-4 font-medium text-slate-400">Coût estimé (EUR)</td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-200">{formatEuro(editedOffer.scenarios.essential.estimatedBudget)}</td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-200">{formatEuro(editedOffer.scenarios.standard.estimatedBudget)}</td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-200">{formatEuro(editedOffer.scenarios.premium.estimatedBudget)}</td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-200">{formatEuro(editedOffer.scenarios.innovative.estimatedBudget)}</td>
                          </tr>
                          {/* Timeline */}
                          <tr>
                            <td className="py-3.5 px-4 font-medium text-slate-400">Délais & Calendrier</td>
                            <td className="py-3.5 px-4">{editedOffer.scenarios.essential.planning}</td>
                            <td className="py-3.5 px-4">{editedOffer.scenarios.standard.planning}</td>
                            <td className="py-3.5 px-4">{editedOffer.scenarios.premium.planning}</td>
                            <td className="py-3.5 px-4">{editedOffer.scenarios.innovative.planning}</td>
                          </tr>
                          {/* Success probability */}
                          <tr>
                            <td className="py-3.5 px-4 font-medium text-slate-400">Probabilité de succès</td>
                            <td className="py-3.5 px-4 font-mono font-semibold text-indigo-400">{editedOffer.scenarios.essential.simulation.probabilityOfSuccess}%</td>
                            <td className="py-3.5 px-4 font-mono font-semibold text-purple-400">{editedOffer.scenarios.standard.simulation.probabilityOfSuccess}%</td>
                            <td className="py-3.5 px-4 font-mono font-semibold text-amber-400">{editedOffer.scenarios.premium.simulation.probabilityOfSuccess}%</td>
                            <td className="py-3.5 px-4 font-mono font-semibold text-rose-400">{editedOffer.scenarios.innovative.simulation.probabilityOfSuccess}%</td>
                          </tr>
                          {/* Fit Score */}
                          <tr>
                            <td className="py-3.5 px-4 font-medium text-slate-400">Adéquation aux besoins (Fit)</td>
                            <td className="py-3.5 px-4 font-mono">{editedOffer.scenarios.essential.simulation.fitScore}%</td>
                            <td className="py-3.5 px-4 font-mono">{editedOffer.scenarios.standard.simulation.fitScore}%</td>
                            <td className="py-3.5 px-4 font-mono">{editedOffer.scenarios.premium.simulation.fitScore}%</td>
                            <td className="py-3.5 px-4 font-mono">{editedOffer.scenarios.innovative.simulation.fitScore}%</td>
                          </tr>
                          {/* Profitability */}
                          <tr>
                            <td className="py-3.5 px-4 font-medium text-slate-400">Indice de Rentabilité</td>
                            <td className="py-3.5 px-4 font-mono">{editedOffer.scenarios.essential.simulation.profitability}%</td>
                            <td className="py-3.5 px-4 font-mono">{editedOffer.scenarios.standard.simulation.profitability}%</td>
                            <td className="py-3.5 px-4 font-mono">{editedOffer.scenarios.premium.simulation.profitability}%</td>
                            <td className="py-3.5 px-4 font-mono">{editedOffer.scenarios.innovative.simulation.profitability}%</td>
                          </tr>
                          {/* Risk */}
                          <tr>
                            <td className="py-3.5 px-4 font-medium text-slate-400">Niveau de Risque</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 text-[10px] rounded border ${getRiskColor(editedOffer.scenarios.essential.simulation.riskLevel)}`}>
                                {editedOffer.scenarios.essential.simulation.riskLevel}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 text-[10px] rounded border ${getRiskColor(editedOffer.scenarios.standard.simulation.riskLevel)}`}>
                                {editedOffer.scenarios.standard.simulation.riskLevel}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 text-[10px] rounded border ${getRiskColor(editedOffer.scenarios.premium.simulation.riskLevel)}`}>
                                {editedOffer.scenarios.premium.simulation.riskLevel}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 text-[10px] rounded border ${getRiskColor(editedOffer.scenarios.innovative.simulation.riskLevel)}`}>
                                {editedOffer.scenarios.innovative.simulation.riskLevel}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </motion.div>
                  )}

                  {/* TAB 5: POST-SIMULATION AUDIT & POSITIONING */}
                  {activeTab === "audit" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 flex-1 overflow-y-auto"
                      key="tab-audit"
                    >
                      <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-lg flex items-start gap-4">
                        <div className="h-10 w-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 shrink-0">
                          <Sliders className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                            Analyse de Posture & Positionnement Commercial
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            L'Agent Positionnement Concurrentiel a analysé l'ensemble de notre proposition par rapport aux organismes d'apprentissage traditionnels de l'Afrique de l'Ouest.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Relevance analysis */}
                        <div className="border border-slate-850 bg-slate-900/30 p-4.5 rounded-lg space-y-2">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                            Pertinence Générale de notre offre :
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {editedOffer.competitivePositioning.relevance}
                          </p>
                        </div>

                        {/* Core differentiators */}
                        <div className="border border-slate-850 bg-slate-900/30 p-4.5 rounded-lg space-y-2">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                            Facteurs de Différenciation FOLO majeurs :
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {editedOffer.competitivePositioning.differentiators}
                          </p>
                        </div>

                        {/* Weaknesses */}
                        <div className="border border-slate-850 bg-slate-900/30 p-4.5 rounded-lg space-y-2">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                            Points faibles & Risques de négociation :
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {editedOffer.competitivePositioning.weaknesses}
                          </p>
                        </div>

                        {/* Suggested optimizations */}
                        <div className="border border-slate-850 bg-slate-900/30 p-4.5 rounded-lg space-y-2">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                            Optimisations & Améliorations recommandées :
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {editedOffer.competitivePositioning.improvements}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <Sparkles className="h-10 w-10 text-slate-600 mb-4 animate-pulse" />
              <h3 className="text-slate-400 text-sm font-semibold">Aucune proposition sélectionnée</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                Veuillez sélectionner une proposition existante dans la barre latérale ou cliquez sur le bouton "+" pour démarrer un diagnostic de Conception d'Offres.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
