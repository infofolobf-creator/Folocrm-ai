/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useCRM } from "../CRMContext";
import { Lead, LeadStatus, Company } from "../types";
import { User, Briefcase, Plus, Search, Building2, HelpCircle, Sparkles, Send, Check, Loader2, Mail, Phone, Flame, FileText, ChevronRight } from "lucide-react";

export const LeadsView: React.FC = () => {
  const { leads, companies, addLead, addCompany, qualifyLeadAI, suggestMessageAI, updateLead } = useCRM();

  // Search and Tabs
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"leads" | "companies">("leads");
  
  // Selection
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Form states
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);

  // New Lead form fields
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadCompId, setLeadCompId] = useState("");
  const [leadValue, setLeadValue] = useState("2000");
  const [leadSource, setLeadSource] = useState("Landing Page");
  const [leadCountry, setLeadCountry] = useState("Burkina Faso");
  const [leadNotes, setLeadNotes] = useState("");

  // New Company form fields
  const [compName, setCompName] = useState("");
  const [compIndustry, setCompIndustry] = useState("Technologies");
  const [compSize, setCompSize] = useState("11-50");
  const [compWebsite, setCompWebsite] = useState("");
  const [compAddress, setCompAddress] = useState("");
  const [compCountry, setCompCountry] = useState("Burkina Faso");

  // AI Interactive State
  const [isQualifying, setIsQualifying] = useState(false);
  const [isDraftingMsg, setIsDraftingMsg] = useState(false);
  const [draftChannel, setDraftChannel] = useState<"email" | "sms" | "whatsapp" | "linkedin">("email");
  const [draftGoal, setDraftGoal] = useState("Présenter le programme FOLO et proposer une rencontre d'affaires.");
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadCompId) return;

    const matchedComp = companies.find(c => c.id === leadCompId);
    if (!matchedComp) return;

    await addLead({
      name: leadName,
      companyId: leadCompId,
      companyName: matchedComp.name,
      email: leadEmail,
      phone: leadPhone,
      status: LeadStatus.NEW,
      value: Number(leadValue),
      source: leadSource,
      country: leadCountry,
      notes: leadNotes
    });

    // Reset
    setLeadName("");
    setLeadEmail("");
    setLeadPhone("");
    setLeadCompId("");
    setLeadValue("2000");
    setLeadNotes("");
    setShowAddLeadModal(false);
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName) return;

    const created = await addCompany({
      name: compName,
      industry: compIndustry,
      size: compSize,
      website: compWebsite,
      address: compAddress,
      country: compCountry
    });

    // Select the newly created company in lead form if user is setting that up
    setLeadCompId(created.id);
    
    // Reset
    setCompName("");
    setCompWebsite("");
    setCompAddress("");
    setShowAddCompanyModal(false);
  };

  const handleQualifyAI = async (leadId: string) => {
    try {
      setIsQualifying(true);
      setAiErrorMessage(null);
      setAiSuccessMessage(null);
      
      await qualifyLeadAI(leadId);
      
      setAiSuccessMessage("Félicitations ! L'Agent Qualificateur AI a analysé le prospect avec succès.");
      // Update local selected lead to reflect qualification immediately
      const refreshedLeads = leads.find(l => l.id === leadId);
      if (refreshedLeads) {
        setSelectedLead(refreshedLeads);
      }
    } catch (err: any) {
      setAiErrorMessage(err.message || "Erreur d'analyse.");
    } finally {
      setIsQualifying(false);
    }
  };

  const handleDraftMessageAI = async (leadId: string) => {
    try {
      setIsDraftingMsg(true);
      setAiErrorMessage(null);
      setAiSuccessMessage(null);

      await suggestMessageAI(leadId, draftChannel, draftGoal);

      setAiSuccessMessage(`L'Agent Rédacteur AI a généré un projet de message pour ${draftChannel.toUpperCase()} ! Retrouvez-le dans l'onglet Tâches & Suggestions.`);
    } catch (err: any) {
      setAiErrorMessage(err.message || "Erreur d'écriture.");
    } finally {
      setIsDraftingMsg(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const q = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(q) ||
      lead.companyName.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.source.toLowerCase().includes(q)
    );
  });

  const filteredCompanies = companies.filter(comp => {
    const q = searchTerm.toLowerCase();
    return (
      comp.name.toLowerCase().includes(q) ||
      comp.industry.toLowerCase().includes(q) ||
      comp.address.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case LeadStatus.CONTACTED:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case LeadStatus.QUALIFIED:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case LeadStatus.NEGOTIATION:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case LeadStatus.WON:
        return "bg-green-100 text-green-800 border-green-200";
      case LeadStatus.LOST:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="leads-module">
      {/* Left 2 Columns: Lists and Searches */}
      <div className="lg:col-span-2 space-y-4">
        {/* Navigation & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex border-b border-slate-100 p-0.5 bg-slate-50 rounded-lg">
            <button
              onClick={() => setActiveTab("leads")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition ${
                activeTab === "leads" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Prospects (Leads)</span>
            </button>
            <button
              onClick={() => setActiveTab("companies")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition ${
                activeTab === "companies" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Entreprises Partner</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={activeTab === "leads" ? "Chercher un prospect..." : "Chercher une entreprise..."}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50/50"
              />
            </div>

            <button
              onClick={() => activeTab === "leads" ? setShowAddLeadModal(true) : setShowAddCompanyModal(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{activeTab === "leads" ? "Ajouter Prospect" : "Ajouter Entreprise"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Table Card */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          {activeTab === "leads" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-medium uppercase tracking-wider">
                    <th className="p-4">Prospect / Contact</th>
                    <th className="p-4">Entreprise</th>
                    <th className="p-4">Acquisition / Pays</th>
                    <th className="p-4">Budget Deal</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4">Score AI</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-10 text-slate-400">
                        Aucun prospect trouvé. Ajoutez un lead ou modifiez la recherche.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map(lead => (
                      <tr
                        key={lead.id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setAiSuccessMessage(null);
                          setAiErrorMessage(null);
                        }}
                        className={`hover:bg-slate-50/50 cursor-pointer transition ${
                          selectedLead?.id === lead.id ? "bg-emerald-50/20 font-medium border-l-4 border-l-emerald-500" : ""
                        }`}
                      >
                        <td className="p-4">
                          <div className="font-semibold text-slate-800">{lead.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{lead.email}</div>
                        </td>
                        <td className="p-4 text-slate-700">{lead.companyName}</td>
                        <td className="p-4">
                          <div className="text-slate-700 font-medium">{lead.source}</div>
                          <div className="text-[10px] text-slate-400">{lead.country}</div>
                        </td>
                        <td className="p-4 font-bold text-slate-800">{lead.value.toLocaleString()} €</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 border rounded-full text-[10px] font-semibold uppercase ${getStatusBadge(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {lead.agentQualification ? (
                            <span className={`inline-flex items-center gap-1 font-bold text-xs px-1.5 py-0.5 rounded ${
                              lead.agentQualification.status === "hot" ? "bg-red-50 text-red-600" :
                              lead.agentQualification.status === "warm" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-600"
                            }`}>
                              {lead.agentQualification.status === "hot" && <Flame className="w-3 h-3 animate-pulse text-red-500" />}
                              {lead.agentQualification.score}/100
                            </span>
                          ) : (
                            <span className="text-slate-300 text-[10px] italic">Non qualifié</span>
                          )}
                        </td>
                        <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setAiSuccessMessage(null);
                              setAiErrorMessage(null);
                            }}
                            className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1"
                          >
                            <span>Détails</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-medium uppercase tracking-wider">
                    <th className="p-4">Raison Sociale</th>
                    <th className="p-4">Secteur d'Activité</th>
                    <th className="p-4">Taille</th>
                    <th className="p-4">Localisation</th>
                    <th className="p-4">Site Web</th>
                    <th className="p-4 text-right">Date d'Enregistrement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-10 text-slate-400">
                        Aucune entreprise partenaire enregistrée.
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map(comp => (
                      <tr key={comp.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-semibold text-slate-800">{comp.name}</td>
                        <td className="p-4 text-slate-600">{comp.industry}</td>
                        <td className="p-4 text-slate-500 font-medium">{comp.size} salariés</td>
                        <td className="p-4">
                          <div className="text-slate-700">{comp.address}</div>
                          <div className="text-[10px] text-slate-400">{comp.country}</div>
                        </td>
                        <td className="p-4">
                          {comp.website ? (
                            <a href={comp.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                              {comp.website}
                            </a>
                          ) : (
                            <span className="text-slate-300 italic">Non spécifié</span>
                          )}
                        </td>
                        <td className="p-4 text-right text-slate-400">
                          {new Date(comp.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Lead Detailed CRM Panel + AI Hub */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-6 self-start">
        {selectedLead ? (
          <div className="space-y-6">
            {/* Header section of detailed view */}
            <div className="border-b border-slate-100 pb-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800">{selectedLead.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedLead.companyName}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase ${getStatusBadge(selectedLead.status)}`}>
                  {selectedLead.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{selectedLead.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedLead.phone || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Core Info Details */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Pays d'Origine</span>
                <span className="font-semibold text-slate-700">{selectedLead.country}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Canal d'Entrée</span>
                <span className="font-semibold text-slate-700">{selectedLead.source}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Estimation Financière</span>
                <span className="font-bold text-emerald-600">{selectedLead.value.toLocaleString()} €</span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Notes & Description de la Demande</span>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed italic">
                  "{selectedLead.notes || "Aucune note."}"
                </p>
              </div>
            </div>

            {/* AI QUALIFICATION HUB (THE CROWN JEWEL) */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Audit & Qualification AI</span>
                </h4>
                {selectedLead.agentQualification && (
                  <span className="text-[9px] text-slate-400">
                    Analysé le {new Date(selectedLead.agentQualification.analyzedAt).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>

              {selectedLead.agentQualification ? (
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-3 relative overflow-hidden">
                  {/* Decorative status indicators */}
                  <div className={`absolute top-0 right-0 w-24 h-1.5 ${
                    selectedLead.agentQualification.status === "hot" ? "bg-red-500 animate-pulse" :
                    selectedLead.agentQualification.status === "warm" ? "bg-amber-400" : "bg-blue-400"
                  }`} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Score de Potentiel FOLO</span>
                    <span className={`text-base font-extrabold px-2 py-0.5 rounded ${
                      selectedLead.agentQualification.status === "hot" ? "text-red-600 bg-red-50" :
                      selectedLead.agentQualification.status === "warm" ? "text-amber-700 bg-amber-50" : "text-blue-600 bg-blue-50"
                    }`}>
                      {selectedLead.agentQualification.score}/100
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Raisonnement Qualitatif :</span>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {selectedLead.agentQualification.summary}
                    </p>
                  </div>

                  <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-700">
                    <span className="font-semibold text-slate-800 text-xs block mb-0.5">Action Recommandée par l'IA :</span>
                    {selectedLead.agentQualification.suggestedNextAction}
                  </div>
                </div>
              ) : (
                <div className="text-center p-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-xs space-y-3">
                  <p className="text-slate-500 leading-relaxed">
                    Ce prospect n'a pas encore fait l'objet d'un audit de qualification. L'agent AI évalue la valeur RSE, le secteur et l'urgence du besoin.
                  </p>
                </div>
              )}

              <button
                onClick={() => handleQualifyAI(selectedLead.id)}
                disabled={isQualifying}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-lg text-xs font-semibold transition shadow-sm disabled:opacity-50"
              >
                {isQualifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyse sémantique en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Lancer la Qualification AI</span>
                  </>
                )}
              </button>
            </div>

            {/* AI OUTBOUND MESSAGE GENERATOR (REDACTEUR) */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Générer un message de contact (Rédacteur AI)</span>
              </h4>

              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-50 rounded-lg">
                  {["email", "whatsapp", "linkedin", "sms"].map(ch => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setDraftChannel(ch as any)}
                      className={`py-1 text-[10px] rounded-md font-medium capitalize transition ${
                        draftChannel === ch ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold uppercase block">Objectif Commercial du message</label>
                  <textarea
                    rows={2}
                    value={draftGoal}
                    onChange={e => setDraftGoal(e.target.value)}
                    placeholder="Exemple : Proposer un audit de formation..."
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50/50"
                  />
                </div>

                {aiSuccessMessage && (
                  <div className="bg-emerald-50 text-emerald-800 text-[11px] p-2.5 rounded-lg border border-emerald-100 flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600" />
                    <span>{aiSuccessMessage}</span>
                  </div>
                )}

                {aiErrorMessage && (
                  <div className="bg-red-50 text-red-700 text-[11px] p-2.5 rounded-lg border border-red-100">
                    {aiErrorMessage}
                  </div>
                )}

                <button
                  onClick={() => handleDraftMessageAI(selectedLead.id!)}
                  disabled={isDraftingMsg || !draftGoal}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-xs font-semibold transition shadow-sm disabled:opacity-50"
                >
                  {isDraftingMsg ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Rédaction par l'IA en cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>Rédiger le projet (AI)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <HelpCircle className="w-10 h-10 mx-auto text-slate-200" />
            <div>
              <p className="font-semibold text-xs uppercase text-slate-500">Sélectionnez un Prospect</p>
              <p className="text-[11px] leading-relaxed mt-1">
                Cliquez sur un prospect dans la liste de gauche pour afficher ses notes de contacts, lancer la qualification AI et rédiger des messages de relance automatiques.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD LEAD */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800">Ajouter un Prospect (Lead)</h3>
            <form onSubmit={handleAddLead} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Nom complet du Contact</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ibrahim Sawadogo"
                  value={leadName}
                  onChange={e => setLeadName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Associer une Entreprise</label>
                <select
                  required
                  value={leadCompId}
                  onChange={e => setLeadCompId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">-- Choisir une entreprise --</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.industry})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Email</label>
                  <input
                    type="email"
                    placeholder="i.sawadogo@burkinatech.bf"
                    value={leadEmail}
                    onChange={e => setLeadEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Téléphone</label>
                  <input
                    type="text"
                    placeholder="+226 70 12..."
                    value={leadPhone}
                    onChange={e => setLeadPhone(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Budget Estimé (€)</label>
                  <input
                    type="number"
                    value={leadValue}
                    onChange={e => setLeadValue(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Canal d'Acquisition</label>
                  <select
                    value={leadSource}
                    onChange={e => setLeadSource(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Landing Page Partenaires">Landing Page Partenaires</option>
                    <option value="Landing Page Sponsoring">Landing Page Sponsoring</option>
                    <option value="LinkedIn Outreach">LinkedIn Outreach</option>
                    <option value="Veille AI">Veille AI (Alerte)</option>
                    <option value="Événementiel">Événementiel</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Notes additionnelles</label>
                <textarea
                  rows={3}
                  placeholder="Qu'est-ce que ce partenaire potentiel recherche ? Formation de dev, sponsoring, équipements..."
                  value={leadNotes}
                  onChange={e => setLeadNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Enregistrer Prospect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD COMPANY */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800">Ajouter une Entreprise Partenaire</h3>
            <form onSubmit={handleAddCompany} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Nom / Raison Sociale</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Burkina Tech Corp"
                  value={compName}
                  onChange={e => setCompName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Secteur</label>
                  <select
                    value={compIndustry}
                    onChange={e => setCompIndustry(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Technologies & Logiciels">Technologies & Logiciels</option>
                    <option value="Énergies Renouvelables">Énergies Renouvelables</option>
                    <option value="Agriculture & Agroalimentaire">Agriculture & Agroalimentaire</option>
                    <option value="Services Financiers & Banques">Services Financiers & Banques</option>
                    <option value="Construction & Bâtiment">Construction & Bâtiment</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Taille d'Entreprise</label>
                  <select
                    value={compSize}
                    onChange={e => setCompSize(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="1-10">1 à 10 salariés</option>
                    <option value="11-50">11 à 50 salariés</option>
                    <option value="51-200">51 à 200 salariés</option>
                    <option value="200+">Plus de 200 salariés</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Site Web</label>
                  <input
                    type="url"
                    placeholder="https://www.company.bf"
                    value={compWebsite}
                    onChange={e => setCompWebsite(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Pays</label>
                  <input
                    type="text"
                    value={compCountry}
                    onChange={e => setCompCountry(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Adresse physique</label>
                <input
                  type="text"
                  placeholder="Ex: Quartier Somgandé, Ouagadougou"
                  value={compAddress}
                  onChange={e => setCompAddress(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCompanyModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Ajouter l'Entreprise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
