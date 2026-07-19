/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useCRM } from "../CRMContext";
import { Plus, Mail, MessageSquare, Compass, Eye, Sparkles, BarChart2, Globe, ExternalLink, ArrowRight } from "lucide-react";

export const CampaignsView: React.FC = () => {
  const { campaigns, landingPages, addCampaign, addLandingPage } = useCRM();

  // Tabs inside this module
  const [innerTab, setInnerTab] = useState<"campaigns" | "lps">("campaigns");

  // Form modals
  const [showAddCamp, setShowAddCamp] = useState(false);
  const [showAddLp, setShowAddLp] = useState(false);

  // New Campaign Form State
  const [campName, setCampName] = useState("");
  const [campChannel, setCampChannel] = useState<"email" | "sms" | "whatsapp" | "linkedin">("email");
  const [campSubject, setCampSubject] = useState("");
  const [campTemplate, setCampTemplate] = useState("");

  // New Landing Page Form State
  const [lpTitle, setLpTitle] = useState("");
  const [lpSlug, setLpSlug] = useState("");
  const [lpDesc, setLpDesc] = useState("");
  const [lpHeaderTitle, setLpHeaderTitle] = useState("");
  const [lpHeaderSub, setLpHeaderSub] = useState("");
  const [lpCtaText, setLpCtaText] = useState("S'inscrire Maintenant");
  const [lpTheme, setLpTheme] = useState<"modern" | "dark" | "warm">("modern");

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName || !campTemplate) return;

    await addCampaign({
      name: campName,
      channel: campChannel,
      subject: campChannel === "email" ? campSubject : undefined,
      contentTemplate: campTemplate,
      status: "draft"
    });

    setCampName("");
    setCampSubject("");
    setCampTemplate("");
    setShowAddCamp(false);
  };

  const handleCreateLp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lpTitle || !lpSlug) return;

    await addLandingPage({
      title: lpTitle,
      slug: lpSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      description: lpDesc,
      headerTitle: lpHeaderTitle,
      headerSub: lpHeaderSub,
      ctaText: lpCtaText,
      theme: lpTheme,
      status: "published"
    });

    setLpTitle("");
    setLpSlug("");
    setLpDesc("");
    setLpHeaderTitle("");
    setLpHeaderSub("");
    setLpCtaText("S'inscrire Maintenant");
    setShowAddLp(false);
  };

  const getChannelIcon = (chan: string) => {
    switch (chan) {
      case "email":
        return <Mail className="w-4 h-4 text-blue-600" />;
      case "linkedin":
        return <Compass className="w-4 h-4 text-indigo-600" />;
      case "whatsapp":
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6" id="campaigns-module">
      {/* Module Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex border-b border-slate-100 p-0.5 bg-slate-50 rounded-lg">
          <button
            onClick={() => setInnerTab("campaigns")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition ${
              innerTab === "campaigns" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Campagnes de Prospection</span>
          </button>
          <button
            onClick={() => setInnerTab("lps")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition ${
              innerTab === "lps" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Landing Pages (Génération)</span>
          </button>
        </div>

        <button
          onClick={() => innerTab === "campaigns" ? setShowAddCamp(true) : setShowAddLp(true)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{innerTab === "campaigns" ? "Créer une Campagne" : "Créer une Landing Page"}</span>
        </button>
      </div>

      {/* Main Tab content */}
      {innerTab === "campaigns" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map(camp => (
            <div key={camp.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 inline-block">
                      {getChannelIcon(camp.channel)}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-800 text-xs">{camp.name}</h3>
                      <p className="text-[10px] text-slate-400 capitalize font-medium">Canal : {camp.channel}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    camp.status === "completed" ? "bg-green-100 text-green-800 border-green-200" :
                    camp.status === "sending" ? "bg-blue-100 text-blue-800 border-blue-200 animate-pulse" : "bg-slate-100 text-slate-700"
                  }`}>
                    {camp.status}
                  </span>
                </div>

                {camp.subject && (
                  <p className="text-xs font-medium text-slate-700">
                    <span className="text-slate-400">Objet :</span> {camp.subject}
                  </p>
                )}

                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 text-[11px] text-slate-600 font-mono whitespace-pre-wrap leading-relaxed line-clamp-4">
                  {camp.contentTemplate}
                </div>
              </div>

              {/* Performance Statistics */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-slate-500 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Envoyés</span>
                    <span className="font-bold text-slate-800">{camp.sentCount}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Délivrés</span>
                    <span className="font-bold text-slate-800">{camp.deliveredCount}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Réponses</span>
                    <span className="font-extrabold text-emerald-600">{camp.responseCount}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Taux de Rép.</span>
                  <span className="font-extrabold text-slate-800">
                    {camp.sentCount > 0 ? Math.round((camp.responseCount / camp.sentCount) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Landing Pages Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {landingPages.map(lp => (
            <div key={lp.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <span>{lp.title}</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">/lp/{lp.slug}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {lp.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{lp.description}</p>

                {/* Simulated visual layout representation */}
                <div className={`p-4 rounded-xl border text-center space-y-2 relative overflow-hidden ${
                  lp.theme === "dark" ? "bg-slate-900 text-white border-slate-800" :
                  lp.theme === "warm" ? "bg-amber-50/40 text-slate-800 border-amber-100" : "bg-slate-50 text-slate-800 border-slate-100"
                }`}>
                  <span className="absolute top-1 right-2 text-[8px] font-mono uppercase text-slate-400">Gabarit {lp.theme}</span>
                  <h4 className="font-extrabold text-[11px] leading-tight text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition" style={{ color: lp.theme === 'dark' ? '#fff' : '#1e293b' }}>
                    {lp.headerTitle}
                  </h4>
                  <p className="text-[9px] text-slate-400 line-clamp-1">{lp.headerSub}</p>
                  <button type="button" className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-[10px] text-white rounded font-bold transition inline-flex items-center gap-1 cursor-default">
                    <span>{lp.ctaText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Stats for landing page conversion */}
              <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="block text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Visites</span>
                      <span className="font-bold text-slate-800">{lp.clicks}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart2 className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="block text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Leads Générés</span>
                      <span className="font-extrabold text-emerald-600">{lp.conversions}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Taux de Conv.</span>
                  <span className="font-extrabold text-slate-800">
                    {lp.clicks > 0 ? Math.round((lp.conversions / lp.clicks) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD CAMPAIGN */}
      {showAddCamp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800">Créer une nouvelle Campagne</h3>
            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Nom de la Campagne</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sponsoring Entreprises RSE 2026"
                  value={campName}
                  onChange={e => setCampName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Canal Commercial</label>
                <select
                  value={campChannel}
                  onChange={e => setCampChannel(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="email">Email de masse</option>
                  <option value="whatsapp">WhatsApp Business</option>
                  <option value="linkedin">LinkedIn Outreach direct</option>
                  <option value="sms">SMS Marketing</option>
                </select>
              </div>

              {campChannel === "email" && (
                <div className="space-y-1 animate-fade-in">
                  <label className="font-semibold text-slate-600 block">Objet de l'Email</label>
                  <input
                    type="text"
                    placeholder="Ex: Découvrez les profils d'excellence FOLO"
                    value={campSubject}
                    onChange={e => setCampSubject(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-600 block">Gabarit du Message (Template)</label>
                  <span className="text-[10px] text-slate-400">Remplacements dispo: {"{contact_name}"}, {"{company_name}"}</span>
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="Bonjour {contact_name}, j'ai vu l'impact de {company_name}..."
                  value={campTemplate}
                  onChange={e => setCampTemplate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCamp(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Sauvegarder en Brouillon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD LANDING PAGE */}
      {showAddLp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold text-slate-800">Concevoir une Landing Page</h3>
            <form onSubmit={handleCreateLp} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Titre de la Page</label>
                  <input
                    type="text"
                    required
                    placeholder="Sponsoriser la Transition"
                    value={lpTitle}
                    onChange={e => {
                      setLpTitle(e.target.value);
                      setLpSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                    }}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Lien d'Accès (Slug)</label>
                  <input
                    type="text"
                    required
                    placeholder="sponsor-transition"
                    value={lpSlug}
                    onChange={e => setLpSlug(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Description interne</label>
                <input
                  type="text"
                  placeholder="Page d'inscription pour le sponsoring des bourses..."
                  value={lpDesc}
                  onChange={e => setLpDesc(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <h4 className="font-bold text-slate-800">Contenu Visuel de la Maquette</h4>
                
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Slogan d'Accroche Principal (H1)</label>
                  <input
                    type="text"
                    required
                    placeholder="Devenez Sponsor Officiel du Programme Solaire FOLO"
                    value={lpHeaderTitle}
                    onChange={e => setLpHeaderTitle(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Sous-titre explicatif</label>
                  <input
                    type="text"
                    required
                    placeholder="Financez l'insertion professionnelle de 25 femmes électriciennes au Burkina Faso."
                    value={lpHeaderSub}
                    onChange={e => setLpHeaderSub(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 block">Texte d'Appel à l'Action (CTA)</label>
                    <input
                      type="text"
                      required
                      value={lpCtaText}
                      onChange={e => setLpCtaText(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 block">Thème de Style</label>
                    <select
                      value={lpTheme}
                      onChange={e => setLpTheme(e.target.value as any)}
                      className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="modern">Moderne (Blanc & Emeraude)</option>
                      <option value="dark">Cosmique (Foncé & Emeraude)</option>
                      <option value="warm">Chaleureux (Crème & Ambre)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLp(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Publier la Page en Ligne
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
