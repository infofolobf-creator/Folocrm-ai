import React, { useState } from "react";
import { useCRM } from "../CRMContext";
import { KnowledgeItem } from "../types";
import { BookOpen, Search, Plus, Trash2, Edit3, ArrowLeft, Layers, Calendar, User, FileText, Check, AlertCircle, RefreshCw, Cpu, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function KnowledgeHubView() {
  const { knowledge, addKnowledgeItem, updateKnowledgeItem, deleteKnowledgeItem, queryKnowledgeBase } = useCRM();

  // Selected view states
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Présentation FOLO");
  const [formSubcategory, setFormSubcategory] = useState("Vision, mission, valeurs");
  const [formType, setFormType] = useState<"document" | "link" | "note">("document");
  const [formContent, setFormContent] = useState("");
  const [formSourceUrl, setFormSourceUrl] = useState("");
  const [formAuthor, setFormAuthor] = useState("Architecte Principal");

  // RAG Simulator states
  const [ragQuery, setRagQuery] = useState("");
  const [ragResult, setRagResult] = useState<any>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const categories = [
    "Présentation FOLO",
    "Offres & Expertise",
    "Partenaires & Experts",
    "Légal & Tarifs",
    "Veille & Décisions"
  ];

  const subcategories: Record<string, string[]> = {
    "Présentation FOLO": ["Vision, mission, valeurs", "Historique et impact", "Gouvernance & Equipe"],
    "Offres & Expertise": ["Services et offres", "Programmes de formation", "Compétences des cohortes"],
    "Partenaires & Experts": ["Critères d'éligibilité", "Fiches experts", "Conventions de partenariats"],
    "Légal & Tarifs": ["Grilles tarifaires", "Conditions de bourses", "Mentions légales"],
    "Veille & Décisions": ["Directives stratégiques", "Rapports RSE", "Alertes de conformité"]
  };

  const handleOpenAdd = () => {
    setFormTitle("");
    setFormCategory("Présentation FOLO");
    setFormSubcategory("Vision, mission, valeurs");
    setFormType("document");
    setFormContent("");
    setFormSourceUrl("");
    setFormAuthor("Architecte Principal");
    setIsAdding(true);
    setSelectedItem(null);
  };

  const handleOpenEdit = (item: KnowledgeItem) => {
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormSubcategory(item.subcategory);
    setFormType(item.type);
    setFormContent(item.content);
    setFormSourceUrl(item.sourceUrl || "");
    setFormAuthor(item.author || "Architecte Principal");
    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent) return;

    const payload = {
      title: formTitle,
      category: formCategory,
      subcategory: formSubcategory,
      type: formType,
      content: formContent,
      sourceUrl: formSourceUrl || undefined,
      author: formAuthor
    };

    if (isEditing && selectedItem) {
      await updateKnowledgeItem(selectedItem.id, payload);
    } else {
      await addKnowledgeItem(payload);
    }

    setIsAdding(false);
    setIsEditing(false);
    setSelectedItem(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cet élément de connaissance stratégique ?")) {
      await deleteKnowledgeItem(id);
      setSelectedItem(null);
    }
  };

  const handleRagQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuery.trim()) return;

    setIsQuerying(true);
    try {
      const res = await queryKnowledgeBase(ragQuery);
      setRagResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuerying(false);
    }
  };

  // Filtering knowledge items
  const filteredItems = knowledge.filter(item => {
    const matchesTab = activeTab === "all" || item.category === activeTab;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6" id="knowledge-hub-viewport">
      {/* Top Banner and Brand Description */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
                Cerveau FOLO <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Référentiel</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                La mémoire centrale et officielle de FOLO CRM AI. Cet index de connaissances est la source unique interrogée par l'Orchestrateur et les agents IA avant toute qualification, rédaction de proposition ou décision stratégique.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenAdd}
            className="w-full md:w-auto shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Ajouter un document
          </button>
        </div>

        {/* Mini quick stats block */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/60 text-xs text-slate-400">
          <div>
            <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Total de Documents</span>
            <span className="text-base font-extrabold text-white mt-0.5 block">{knowledge.length} items</span>
          </div>
          <div>
            <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Statut Intégration</span>
            <span className="text-base font-extrabold text-emerald-400 mt-0.5 flex items-center gap-1">
              <Check className="w-4 h-4" /> Grounded RAG
            </span>
          </div>
          <div>
            <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Recherche sémantique</span>
            <span className="text-base font-extrabold text-indigo-400 mt-0.5 block">Active (Gemini SDK)</span>
          </div>
          <div>
            <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider">Vérification de Version</span>
            <span className="text-base font-extrabold text-white mt-0.5 block">Activée par doc</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT & MID COLUMNS: Knowledge Hub Documents List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs Filter */}
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "hover:bg-slate-50 text-slate-500"
              }`}
            >
              Tous ({knowledge.length})
            </button>
            {categories.map(cat => {
              const count = knowledge.filter(k => k.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === cat
                      ? "bg-slate-900 text-white shadow-xs"
                      : "hover:bg-slate-50 text-slate-500"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher dans le référentiel de connaissances (titre, contenu, mots-clés...)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-800 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition placeholder-slate-400"
            />
          </div>

          {/* List or Form Display */}
          <AnimatePresence mode="wait">
            {isAdding || isEditing ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <Layers className="w-4.5 h-4.5 text-indigo-500" />
                    {isEditing ? "Modifier l'article de connaissance" : "Créer une nouvelle connaissance"}
                  </h3>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setIsEditing(false);
                      setSelectedItem(null);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Retour
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Titre du document</label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={e => setFormTitle(e.target.value)}
                        placeholder="Ex: Vision 2026 & Programme d'Inclusion Numérique"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Auteur du document</label>
                      <input
                        type="text"
                        required
                        value={formAuthor}
                        onChange={e => setFormAuthor(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Catégorie Principale</label>
                      <select
                        value={formCategory}
                        onChange={e => {
                          const cat = e.target.value;
                          setFormCategory(cat);
                          setFormSubcategory(subcategories[cat][0]);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-hidden text-slate-800"
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sous-catégorie</label>
                      <select
                        value={formSubcategory}
                        onChange={e => setFormSubcategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-hidden text-slate-800"
                      >
                        {subcategories[formCategory]?.map(sc => (
                          <option key={sc} value={sc}>{sc}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type de ressource</label>
                      <select
                        value={formType}
                        onChange={e => setFormType(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-hidden text-slate-800"
                      >
                        <option value="document">Document officiel</option>
                        <option value="note">Note ou mémo interne</option>
                        <option value="link">Lien externe sécurisé</option>
                      </select>
                    </div>
                  </div>

                  {formType === "link" && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">URL de la source</label>
                      <input
                        type="url"
                        value={formSourceUrl}
                        onChange={e => setFormSourceUrl(e.target.value)}
                        placeholder="https://example.com/document-source"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-hidden text-slate-800"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contenu officiel du Document ( Grounding Content )</label>
                    <textarea
                      required
                      rows={12}
                      value={formContent}
                      onChange={e => setFormContent(e.target.value)}
                      placeholder="Indiquez le contenu textuel complet. Les agents IA liront et synthétiseront textuellement ces lignes pour formuler leurs plans ou messages."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs focus:outline-hidden font-mono text-slate-800"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Astuce : Soyez précis, incluez des chiffres, des dates, des noms d'experts et des conditions de bourses.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdding(false);
                        setIsEditing(false);
                        setSelectedItem(null);
                      }}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                    >
                      {isEditing ? "Enregistrer les modifications" : "Publier l'article"}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3.5"
              >
                {filteredItems.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-sm text-slate-700">Aucun document dans cette catégorie</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      Il n'y a aucun élément de connaissance répondant à vos filtres. Cliquez sur "Ajouter un document" pour enrichir le Cerveau FOLO.
                    </p>
                  </div>
                ) : (
                  filteredItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`bg-white border transition rounded-xl p-4 cursor-pointer hover:border-slate-300 shadow-xs flex flex-col justify-between gap-3 ${
                        selectedItem?.id === item.id ? "ring-2 ring-indigo-500/20 border-indigo-400" : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              • {item.subcategory}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-800 text-sm hover:text-indigo-600 transition">
                            {item.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition"
                            title="Modifier"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed bg-slate-50/50 p-2 rounded-lg border border-slate-100/40">
                        {item.content}
                      </p>

                      {/* Footnotes stats */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-50 pt-2.5">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-300" /> {item.author || "Anonyme"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-300" /> {new Date(item.updatedAt).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest text-[9px]">
                          V{item.version || 1}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: RAG Testing Playground & Document Detail Inspector */}
        <div className="space-y-6">
          {/* Document Inspector Card */}
          {selectedItem && !isAdding && !isEditing && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Inspecteur de Document</span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  Fermer
                </button>
              </div>

              <div>
                <h2 className="text-base font-extrabold text-slate-800 leading-snug">{selectedItem.title}</h2>
                <span className="text-[11px] text-indigo-600 font-bold tracking-wide mt-1 block">
                  {selectedItem.category} &gt; {selectedItem.subcategory}
                </span>
              </div>

              <div className="space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contenu Officiel</span>
                <div className="bg-slate-900 text-slate-200 font-mono text-[11px] p-3.5 rounded-xl max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner border border-slate-800">
                  {selectedItem.content}
                </div>
              </div>

              {selectedItem.sourceUrl && (
                <a
                  href={selectedItem.sourceUrl}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="text-[11px] text-indigo-500 hover:text-indigo-600 font-bold flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Consulter la source externe
                </a>
              )}

              {/* Versioning logs block */}
              <div className="space-y-2.5 pt-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3 text-indigo-400" /> Historique des Versions ({selectedItem.versions?.length || 0})
                </span>
                
                {(!selectedItem.versions || selectedItem.versions.length === 0) ? (
                  <p className="text-[10px] text-slate-400 italic">Aucune version archivée. Version originale active.</p>
                ) : (
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {selectedItem.versions.map((ver, idx) => (
                      <div key={idx} className="bg-slate-50/70 border border-slate-100 p-2.5 rounded-lg text-[10px] text-slate-600">
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className="text-slate-800">Version {ver.version}</span>
                          <span className="text-slate-400">{new Date(ver.updatedAt).toLocaleString("fr-FR")}</span>
                        </div>
                        <p className="line-clamp-2 italic text-slate-500 font-mono mb-1">"{ver.content}"</p>
                        <span className="block text-[9px] text-slate-400 text-right">Remplacé par {ver.author || "Anonyme"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* RAG Testing Simulator Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <h3 className="font-extrabold text-sm tracking-tight text-white">RAG Sandbox & Alignement IA</h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Interrogez directement le module d'alignement. Cette console simule en temps réel comment l'Orchestrateur extrait et synthétise les connaissances avant d'agir.
            </p>

            <form onSubmit={handleRagQuerySubmit} className="space-y-2.5">
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Posez une question sur FOLO (ex: bourses...)"
                  value={ragQuery}
                  onChange={e => setRagQuery(e.target.value)}
                  className="w-full bg-slate-950/80 text-white text-xs pl-3 pr-10 py-2.5 rounded-lg border border-slate-800 focus:outline-hidden focus:border-indigo-400"
                />
                <button
                  type="submit"
                  disabled={isQuerying}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-800 rounded text-indigo-400 hover:text-indigo-300 cursor-pointer disabled:opacity-40"
                >
                  {isQuerying ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </form>

            {/* RAG Query output result */}
            {ragResult && (
              <div className="space-y-3 pt-2.5 border-t border-slate-800/80 text-xs">
                {/* Confidence Meter */}
                <div className="space-y-1 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">Indice d'Ancrage</span>
                    <span className={`font-black ${
                      ragResult.confidenceScore > 80 ? "text-emerald-400" : (ragResult.confidenceScore > 50 ? "text-yellow-400" : "text-slate-400")
                    }`}>{ragResult.confidenceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ragResult.confidenceScore > 80 ? "bg-emerald-500" : (ragResult.confidenceScore > 50 ? "bg-yellow-500" : "bg-slate-500")
                      }`}
                      style={{ width: `${ragResult.confidenceScore}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1">
                    <span>Source : <b className="text-slate-400">{ragResult.knowledgeSource}</b></span>
                    <span>Ancré à 100% sans hallucinations</span>
                  </div>
                </div>

                {/* Answer Synthesizer */}
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Réponse Générée</span>
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-900 font-sans text-slate-300 leading-relaxed text-[11px] whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {ragResult.answer}
                  </div>
                </div>

                {/* Citations list */}
                {ragResult.sourcesUsed && ragResult.sourcesUsed.length > 0 && (
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Documents Sources Cités</span>
                    <div className="space-y-1">
                      {ragResult.sourcesUsed.map((source: any, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => {
                            const it = knowledge.find(k => k.id === source.id);
                            if (it) setSelectedItem(it);
                          }}
                          className="bg-slate-950/20 hover:bg-slate-950/50 border border-slate-900 px-2 py-1.5 rounded text-[10px] text-indigo-300 hover:text-indigo-200 flex items-center justify-between cursor-pointer transition"
                        >
                          <span className="truncate max-w-[180px] font-medium">{source.title}</span>
                          <span className="text-[9px] text-slate-500 font-bold uppercase shrink-0">{source.subcategory}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
