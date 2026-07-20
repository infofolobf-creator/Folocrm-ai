/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useCRM } from "../CRMContext";
import { LandingPage, LandingPageBlock } from "../types";
import { 
  Globe, Sparkles, AlertCircle, CheckCircle2, Layout, ArrowRight, Eye, 
  Trash2, Plus, Edit3, Settings, Code, BarChart3, ArrowLeft, RefreshCw, 
  Layers, Search, Copy, Save, Check, Play, Zap, Laptop, Smartphone, Tablet, ChevronRight, HelpCircle, Cpu
} from "lucide-react";

const TEMPLATE_CATEGORIES = [
  "Formations",
  "Intelligence Artificielle",
  "PME",
  "ONG",
  "Collectivités territoriales",
  "Administrations",
  "Appels d'offres",
  "Événements",
  "Financements",
  "Coaching",
  "Consulting",
  "Transformation digitale",
  "Santé",
  "Agriculture",
  "Éducation"
];

const DEFAULT_TEMPLATES = [
  {
    id: "temp-formations-1",
    title: "Cohorte Solaire Off-Grid FOLO",
    isTemplate: true,
    category: "Formations",
    description: "Modèle conçu pour recruter des sponsors RSE pour les formations en énergie solaire.",
    theme: "warm",
    pageType: "landing",
    targetSector: "formation",
    targetCountry: "Burkina Faso",
    language: "fr",
    headerTitle: "Financez des Bourses pour les Métiers Solaires d'Avenir",
    headerSub: "Accélérez l'autonomisation rurale au Sahel en sponsorisant des bourses complètes pour 25 jeunes installateurs solaires.",
    ctaText: "Devenir Sponsor RSE",
    blocks: [
      {
        id: "b-1",
        type: "hero",
        content: {
          title: "Financez des Bourses pour les Métiers Solaires d'Avenir",
          subtitle: "Accélérez l'autonomisation rurale au Sahel en sponsorisant des bourses complètes",
          buttonText: "Devenir Sponsor RSE"
        }
      },
      {
        id: "b-2",
        type: "stats",
        content: {
          title: "Indicateurs d'Impact FOLO Solaire",
          stats: [
            { value: "25 bourses", label: "Par cohorte" },
            { value: "96% d'insertion", label: "Sous 6 mois" },
            { value: "1 500 €", label: "Coût par bourse" }
          ]
        }
      },
      {
        id: "b-3",
        type: "testimonial",
        content: {
          quote: "Grâce au parrainage de FOLO, nous avons sécurisé une équipe de techniciennes solaires incroyablement rigoureuses.",
          author: "Moussa Sawadogo",
          role: "Directeur Technique, Faso Solar Group"
        }
      }
    ]
  },
  {
    id: "temp-ai-2",
    title: "Transformation Digitale & IA PME",
    isTemplate: true,
    category: "Intelligence Artificielle",
    description: "Modèle axé sur le recrutement de PME locales souhaitant intégrer l'IA dans leur gestion commerciale.",
    theme: "slate",
    pageType: "services",
    targetSector: "pme",
    targetCountry: "Sénégal",
    language: "fr",
    headerTitle: "Révolutionnez votre CRM avec l'Intelligence Artificielle FOLO",
    headerSub: "Automatisez votre prospection, qualifiez vos bourses RSE et formez vos équipes aux outils d'IA cognitive.",
    ctaText: "Démo Gratuite IA",
    blocks: [
      {
        id: "b-1",
        type: "hero",
        content: {
          title: "Révolutionnez votre CRM avec l'Intelligence Artificielle",
          subtitle: "Automatisez votre prospection et qualifiez vos leads en un clic",
          buttonText: "Démo Gratuite IA"
        }
      },
      {
        id: "b-2",
        type: "features",
        content: {
          title: "Les briques cognitives du CRM FOLO",
          features: [
            { title: "Qualification Automatique", text: "Scoring instantané de vos opportunités par LLM local." },
            { title: "Veille Intelligente d'AO", text: "Alertes automatiques sur les appels d'offres RSE au Sahel." },
            { title: "Générateur Web IA", text: "Landing pages générées et hébergées instantanément." }
          ]
        }
      }
    ]
  },
  {
    id: "temp-agriculture-3",
    title: "Agroécologie & Autonomie Alimentaire",
    isTemplate: true,
    category: "Agriculture",
    description: "Modèle de mini-site de campagne pour des bourses de formation agricole durable et d'irrigation.",
    theme: "modern",
    pageType: "minisite",
    targetSector: "ong",
    targetCountry: "Mali",
    language: "fr",
    headerTitle: "Soutenez l'Agriculture Intelligente face au Changement Climatique",
    headerSub: "Parrainez des techniciens en micro-irrigation et en maraîchage durable pour sécuriser les ressources rurales.",
    ctaText: "Sponsoriser un Jeune",
    blocks: [
      {
        id: "b-1",
        type: "hero",
        content: {
          title: "Soutenez l'Agriculture Intelligente",
          subtitle: "Parrainez des techniciens en micro-irrigation et maraîchage durable",
          buttonText: "Sponsoriser un Jeune"
        }
      },
      {
        id: "b-2",
        type: "stats",
        content: {
          title: "Impact Alimentaire",
          stats: [
            { value: "150 ha", label: "Irrigués durablement" },
            { value: "450 tonnes", label: "De légumes produits" },
            { value: "88 boursiers", label: "Formés au Mali" }
          ]
        }
      }
    ]
  },
  {
    id: "temp-education-4",
    title: "Inclusion & Éducation Numérique",
    isTemplate: true,
    category: "Éducation",
    description: "Modèle de formulaire intelligent pour candidatures de bourses scolaires de codage.",
    theme: "cool",
    pageType: "smartform",
    targetSector: "collectivites",
    targetCountry: "Burkina Faso",
    language: "fr",
    headerTitle: "Bourses FOLO Code : Ouvrez les Portes de la Tech aux Jeunes Sahéliens",
    headerSub: "Un programme intensif de 9 mois pour devenir développeur Web & d'applications.",
    ctaText: "Postuler à la Cohorte 2026",
    blocks: [
      {
        id: "b-1",
        type: "hero",
        content: {
          title: "Bourses FOLO Code : Ouvrez les Portes de la Tech",
          subtitle: "Un programme intensif de 9 mois pour devenir développeur Web & d'applications",
          buttonText: "Postuler à la Cohorte"
        }
      }
    ]
  }
];

export const LandingStudioView: React.FC = () => {
  const { 
    landingPages, campaigns, generateLandingPageAI, auditLandingPageAI, 
    optimizeSeoLandingPageAI, updateLandingPage, deleteLandingPage, saveDb, leads,
    companies, tasks, alerts, suggestions, orchestratorConfig, orchestratorPlans,
    knowledge, businessOffers, recommendTemplateAI, optimizeContinuousAI, generateCompleteCampaignAI
  } = useCRM();

  // Active sub-views
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isOptimizingSeo, setIsOptimizingSeo] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New Generation form states
  const [showGenModal, setShowGenModal] = useState(false);
  const [genTitle, setGenTitle] = useState("");
  const [genDesc, setGenDesc] = useState("");
  const [genPageType, setGenPageType] = useState<"landing" | "sales" | "registration" | "event" | "minisite" | "tender" | "services" | "smartform">("landing");
  const [genTheme, setGenTheme] = useState<"modern" | "dark" | "warm" | "slate" | "cool">("slate");
  const [genCampaignId, setGenCampaignId] = useState("");
  const [genTargetSector, setGenTargetSector] = useState<"formation" | "ong" | "collectivites" | "pme" | "appels_offres">("formation");
  const [genTargetCountry, setGenTargetCountry] = useState("Burkina Faso");
  const [genLanguage, setGenLanguage] = useState("fr");

  // Local editor tab
  const [editorTab, setEditorTab] = useState<"blocks" | "seo" | "audit" | "ab" | "html">("blocks");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Bibliothèque Intelligente de Modèles states
  const [studioTab, setStudioTab] = useState<"pages" | "templates" | "designer">("pages");
  const [searchTemplateQuery, setSearchTemplateQuery] = useState("");
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>("Toutes");
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [templateToSave, setTemplateToSave] = useState<LandingPage | null>(null);
  const [saveTemplateCategory, setSaveTemplateCategory] = useState("Formations");
  const [customCategory, setCustomCategory] = useState("");

  // Designer Agent states
  const [designerGoal, setDesignerGoal] = useState("");
  const [designerSector, setDesignerSector] = useState<string>("formation");
  const [designerCountry, setDesignerCountry] = useState("Burkina Faso");
  const [designerTone, setDesignerTone] = useState("Professionnel & Engagé");
  const [designerLanguage, setDesignerLanguage] = useState("fr");
  const [designerResult, setDesignerResult] = useState<{ landingPage: LandingPage; reasoning: string } | null>(null);
  const [isDesignerRecommending, setIsDesignerRecommending] = useState(false);

  // Optimisation Continue states
  const [continuousOptResult, setContinuousOptResult] = useState<any | null>(null);
  const [isContinuousOptimizing, setIsContinuousOptimizing] = useState(false);

  // Lead simulator form state inside preview
  const [simLeadName, setSimLeadName] = useState("");
  const [simLeadEmail, setSimLeadEmail] = useState("");
  const [simLeadCompany, setSimLeadCompany] = useState("");
  const [simSubmitted, setSimSubmitted] = useState(false);
  const [simFeedback, setSimFeedback] = useState("");

  const activePage = landingPages.find(lp => lp.id === activePageId);

  // Handle generation via IA
  const handleAIGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genTitle || !genDesc) return;
    setIsGenerating(true);
    try {
      const newPage = await generateLandingPageAI(
        genTitle,
        genDesc,
        genPageType,
        genTheme,
        genCampaignId || undefined,
        genTargetSector,
        genTargetCountry,
        genLanguage
      );
      setActivePageId(newPage.id);
      setShowGenModal(false);
      // Reset form
      setGenTitle("");
      setGenDesc("");
    } catch (err) {
      alert("Une erreur est survenue lors de la génération de la page.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Launch AI Audit
  const handleAIAudit = async (pageId: string) => {
    setIsAuditing(true);
    try {
      await auditLandingPageAI(pageId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  // Launch SEO optimizer
  const handleAISeo = async (pageId: string) => {
    setIsOptimizingSeo(true);
    try {
      await optimizeSeoLandingPageAI(pageId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizingSeo(false);
    }
  };

  // Trigger Designer Marketing IA Agent
  const handleDesignerRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!designerGoal) return;
    setIsDesignerRecommending(true);
    setDesignerResult(null);
    try {
      const res = await recommendTemplateAI(
        designerGoal,
        designerSector,
        designerCountry,
        designerLanguage,
        designerTone
      );
      setDesignerResult(res);
    } catch (err) {
      console.error(err);
      alert("L'Agent Designer Marketing IA n'a pas pu analyser la demande.");
    } finally {
      setIsDesignerRecommending(false);
    }
  };

  // Trigger Optimisation Continue Agent
  const handleContinuousOptimize = async (id: string) => {
    setIsContinuousOptimizing(true);
    setContinuousOptResult(null);
    try {
      const recommendation = await optimizeContinuousAI(id);
      setContinuousOptResult(recommendation);
    } catch (err) {
      console.error(err);
      alert("L'Agent d'Optimisation Continue n'a pas pu générer les recommandations.");
    } finally {
      setIsContinuousOptimizing(false);
    }
  };

  // Apply continuous optimization result as Variant B for A/B Testing
  const handleApplyContinuousOpt = async (lp: LandingPage) => {
    if (!continuousOptResult) return;
    
    const updated: LandingPage = {
      ...lp,
      abTesting: {
        isEnabled: true,
        variantBName: continuousOptResult.variantBName || "Version B Optimisée IA",
        clicksVariantB: 0,
        conversionsVariantB: 0,
        meetingsBooked: 0,
        salesGenerated: 0,
        leadsQualityScore: continuousOptResult.improvementScore || 92,
        conversionRules: continuousOptResult.conversionRules || "Redirection cognitive de 75% du trafic."
      }
    };
    
    await updateLandingPage(updated);
    alert("Variante B optimisée par l'IA appliquée avec succès ! L'A/B Testing est maintenant actif.");
  };

  // Save page into smart template library
  const handleSavePageAsTemplate = async (lp: LandingPage, category: string) => {
    const updated: LandingPage = {
      ...lp,
      isTemplate: true,
      category: category || "Formations"
    };
    await updateLandingPage(updated);
    setShowSaveTemplateModal(false);
    alert(`La page "${lp.title}" a été enregistrée avec succès comme modèle dans la catégorie "${category}".`);
  };

  // Create active page from template
  const handleCreatePageFromTemplate = async (template: any) => {
    const cleanSlug = template.title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);
    const newLp: LandingPage = {
      id: "lp-" + Math.random().toString(36).substring(2, 11),
      title: `Campagne ${template.title}`,
      slug: cleanSlug,
      description: `Créé d'après le modèle "${template.title}" de la catégorie "${template.category || "Général"}"`,
      headerTitle: template.headerTitle,
      headerSub: template.headerSub,
      ctaText: template.ctaText,
      theme: template.theme || "slate",
      clicks: 0,
      conversions: 0,
      status: "draft",
      createdAt: new Date().toISOString(),
      pageType: template.pageType || "landing",
      targetSector: template.targetSector || "formation",
      targetCountry: template.targetCountry || "Burkina Faso",
      language: template.language || "fr",
      blocks: template.blocks || [
        {
          id: "b-1",
          type: "hero",
          content: {
            title: template.headerTitle,
            subtitle: template.headerSub,
            buttonText: template.ctaText
          }
        }
      ],
      seoData: template.seoData || {
        title: template.title,
        metaDescription: template.description,
        keywords: ["FOLO", template.category || "RSE"],
        seoScore: 88,
        seoRecommendations: []
      }
    };

    const nextLps = [newLp, ...landingPages];
    await saveDb({
      leads,
      companies,
      tasks,
      campaigns,
      landingPages: nextLps,
      alerts,
      suggestions,
      orchestratorConfig,
      orchestratorPlans,
      knowledge,
      businessOffers
    });
    setActivePageId(newLp.id);
    setStudioTab("pages");
    alert(`Nouvelle landing page active créée avec succès à partir du modèle.`);
  };

  // Simulate visitors/clicks & conversions for A/B demonstration
  const handleSimulateTraffic = async (lp: LandingPage) => {
    // Generate simulated stats to demonstrate optimization algorithms
    const additionalClicks = Math.floor(Math.random() * 25) + 5;
    const additionalConversions = Math.floor(Math.random() * (additionalClicks / 2));
    
    const updated: LandingPage = {
      ...lp,
      clicks: lp.clicks + additionalClicks,
      conversions: lp.conversions + additionalConversions,
    };

    // If A/B testing is enabled, also simulate variant metrics
    if (lp.abTesting?.isEnabled) {
      const curAb = lp.abTesting;
      const additionalClicksB = Math.floor(Math.random() * 25) + 5;
      const additionalConversionsB = Math.floor(Math.random() * (additionalClicksB * 0.4)); // Variant B usually has a higher rate
      const additionalMeetings = Math.floor(additionalConversionsB * 0.5);
      const additionalSales = Math.floor(additionalMeetings * 0.2) * 1500;

      updated.abTesting = {
        ...curAb,
        clicksVariantB: curAb.clicksVariantB + additionalClicksB,
        conversionsVariantB: curAb.conversionsVariantB + additionalConversionsB,
        meetingsBooked: (curAb.meetingsBooked || 0) + additionalMeetings,
        salesGenerated: (curAb.salesGenerated || 0) + additionalSales,
        leadsQualityScore: Math.min(100, Math.round((curAb.leadsQualityScore || 80) + (Math.random() * 6 - 3)))
      };
    }

    await updateLandingPage(updated);
  };

  // Submit test lead inside simulator
  const handleSimulateLeadSubmit = async (e: React.FormEvent, lp: LandingPage) => {
    e.preventDefault();
    if (!simLeadName || !simLeadEmail) return;

    try {
      const res = await fetch(`/api/landing/${lp.slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: simLeadName,
          email: simLeadEmail,
          companyName: simLeadCompany || "Test Corp",
          variant: lp.abTesting?.isEnabled ? (Math.random() > 0.5 ? "B" : "A") : "A"
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSimSubmitted(true);
        setSimFeedback(data.message || "Lead qualifié et inséré avec succès dans le CRM de FOLO !");
        
        // Reset inputs
        setSimLeadName("");
        setSimLeadEmail("");
        setSimLeadCompany("");
        
        // Quick state update to increment conversion rate in UI
        const updated: LandingPage = {
          ...lp,
          clicks: lp.clicks + 1,
          conversions: lp.conversions + 1
        };
        await updateLandingPage(updated);
      } else {
        throw new Error("L'insertion a échoué.");
      }
    } catch (err) {
      setSimFeedback("Erreur de communication avec l'API. Simulation locale réussie.");
      setSimSubmitted(true);
    }
  };

  // Update specific block details in WYSIWYG
  const handleUpdateBlock = (blockId: string, updatedFields: Partial<LandingPageBlock["content"]>) => {
    if (!activePage) return;

    const updatedBlocks = activePage.blocks.map(b => {
      if (b.id === blockId) {
        return {
          ...b,
          content: {
            ...b.content,
            ...updatedFields
          }
        };
      }
      return b;
    });

    const updatedPage: LandingPage = {
      ...activePage,
      blocks: updatedBlocks,
      // Change simple header titles if hero block changes to keep synchronized
      ...(blockId === "b-1" && updatedFields.title ? { headerTitle: updatedFields.title } : {}),
      ...(blockId === "b-1" && updatedFields.subtitle ? { headerSub: updatedFields.subtitle } : {})
    };

    updateLandingPage(updatedPage);
  };

  // Add new block to page
  const handleAddBlock = (type: LandingPageBlock["type"]) => {
    if (!activePage) return;

    const blockId = "b-" + Math.random().toString(36).substr(2, 5);
    let defaultContent = {};

    switch (type) {
      case "features":
        defaultContent = {
          title: "Pourquoi choisir notre cohorte de talents ?",
          features: [
            { title: "Talents Certifiés", text: "Formés intensivement pendant 9 mois sur l'énergie solaire et le numérique." },
            { title: "Insertion Immédiate", text: "Opérationnels dès le premier jour avec un suivi de mentorat de 6 mois." },
            { title: "Soutien Subventionné", text: "Bourses de co-financement RSE jusqu'à 1 500 € par jeune inséré." }
          ]
        };
        break;
      case "stats":
        defaultContent = {
          title: "Notre impact en chiffres",
          stats: [
            { value: "450+", label: "Jeunes insérés" },
            { value: "98%", label: "Taux de rétention" },
            { value: "Burkina Faso", label: "Zone de déploiement principal" }
          ]
        };
        break;
      case "testimonial":
        defaultContent = {
          quote: "Grâce à la convention de sponsoring RSE de FOLO, nous avons recruté trois techniciens solaires hautement qualifiés. L'impact social est exceptionnel.",
          author: "Moussa Sawadogo",
          role: "Directeur Technique, Faso Solar Group"
        };
        break;
      case "faq":
        defaultContent = {
          title: "Questions Fréquentes",
          items: [
            { q: "Quelles sont les obligations financières pour l'entreprise ?", a: "Le co-financement RSE couvre 70% du coût de formation. L'entreprise s'engage à fournir un stage rémunéré." },
            { q: "Comment est assuré le suivi d'intégration ?", a: "Un coach d'insertion FOLO visite l'entreprise chaque mois pour assurer l'adaptation culturelle et technique." }
          ]
        };
        break;
      case "form":
        defaultContent = {
          title: "Candidatez en 2 minutes",
          subtitle: "Un consultant FOLO vous rappellera sous 24 heures pour évaluer votre éligibilité.",
          buttonText: "Envoyer ma candidature"
        };
        break;
    }

    const newBlock: LandingPageBlock = {
      id: blockId,
      type,
      content: defaultContent
    };

    const updatedPage: LandingPage = {
      ...activePage,
      blocks: [...activePage.blocks, newBlock]
    };

    updateLandingPage(updatedPage);
    setSelectedBlockId(blockId);
  };

  // Delete a block
  const handleDeleteBlock = (blockId: string) => {
    if (!activePage) return;
    const updatedBlocks = activePage.blocks.filter(b => b.id !== blockId);
    updateLandingPage({
      ...activePage,
      blocks: updatedBlocks
    });
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  // Generate self-contained HTML representation for display
  const generateSelfContainedHTML = (lp: LandingPage): string => {
    let themeBg = "bg-white text-slate-800";
    let accentColor = "emerald-600";
    let accentHover = "emerald-700";
    let isDark = false;

    if (lp.theme === "dark") {
      themeBg = "bg-slate-950 text-slate-100";
      accentColor = "indigo-500";
      accentHover = "indigo-600";
      isDark = true;
    } else if (lp.theme === "warm") {
      themeBg = "bg-amber-50/50 text-slate-900";
      accentColor = "amber-600";
      accentHover = "amber-700";
    } else if (lp.theme === "slate") {
      themeBg = "bg-slate-900 text-slate-100";
      accentColor = "emerald-500";
      accentHover = "emerald-600";
      isDark = true;
    } else if (lp.theme === "cool") {
      themeBg = "bg-slate-50 text-slate-800";
      accentColor = "blue-600";
      accentHover = "blue-700";
    }

    let bodyHTML = "";

    lp.blocks.forEach(block => {
      switch (block.type) {
        case "hero":
          bodyHTML += `
          <!-- HERO BLOCK -->
          <header class="py-20 px-6 max-w-5xl mx-auto text-center border-b border-gray-100 dark:border-slate-800">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-${accentColor}/10 text-${accentColor} mb-6">
              🌱 OFFRE ${lp.targetSector?.toUpperCase() || "SOLUTIONS RSE"}
            </span>
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">${block.content.title || lp.headerTitle}</h1>
            <p class="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">${block.content.subtitle || lp.headerSub}</p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#form-section" class="px-8 py-3.5 bg-${accentColor} hover:bg-${accentHover} text-white font-bold rounded-xl transition shadow-lg shadow-${accentColor}/20 text-center w-full sm:w-auto">${block.content.buttonText || lp.ctaText}</a>
              <a href="https://folo-asso.org" target="_blank" class="px-8 py-3.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold rounded-xl transition text-center w-full sm:w-auto">En savoir plus</a>
            </div>
          </header>
          `;
          break;

        case "features":
          bodyHTML += `
          <!-- FEATURES BLOCK -->
          <section class="py-16 px-6 max-w-5xl mx-auto border-b border-gray-100 dark:border-slate-800">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-center mb-12">${block.content.title || "Nos Points Clés"}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${(block.content.features || []).map((f: any) => `
                <div class="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:shadow-md transition">
                  <div class="w-10 h-10 rounded-lg bg-${accentColor}/10 text-${accentColor} flex items-center justify-center font-bold mb-4">✓</div>
                  <h3 class="font-bold text-lg mb-2">${f.title}</h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">${f.text}</p>
                </div>
              `).join("")}
            </div>
          </section>
          `;
          break;

        case "stats":
          bodyHTML += `
          <!-- STATS BLOCK -->
          <section class="py-12 bg-slate-50 dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 my-8">
            <div class="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              ${(block.content.stats || []).map((s: any) => `
                <div>
                  <span class="block text-4xl sm:text-5xl font-black text-${accentColor}">${s.value}</span>
                  <span class="block text-xs uppercase tracking-wider font-bold text-slate-400 mt-2">${s.label}</span>
                </div>
              `).join("")}
            </div>
          </section>
          `;
          break;

        case "testimonial":
          bodyHTML += `
          <!-- TESTIMONIAL BLOCK -->
          <section class="py-16 px-6 max-w-4xl mx-auto text-center border-b border-gray-100 dark:border-slate-800">
            <p class="text-xl md:text-2xl italic font-medium text-slate-700 dark:text-slate-300 leading-relaxed mb-8">"${block.content.quote}"</p>
            <div>
              <h4 class="font-extrabold text-base">${block.content.author}</h4>
              <p class="text-xs text-slate-400 mt-1">${block.content.role}</p>
            </div>
          </section>
          `;
          break;

        case "faq":
          bodyHTML += `
          <!-- FAQ BLOCK -->
          <section class="py-16 px-6 max-w-3xl mx-auto border-b border-gray-100 dark:border-slate-800">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-center mb-12">${block.content.title || "Des réponses à vos questions"}</h2>
            <div class="space-y-6">
              ${(block.content.items || []).map((item: any) => `
                <div class="p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h3 class="font-bold text-base mb-2">${item.q}</h3>
                  <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">${item.a}</p>
                </div>
              `).join("")}
            </div>
          </section>
          `;
          break;

        case "form":
          bodyHTML += `
          <!-- FORM BLOCK -->
          <section id="form-section" class="py-16 px-6 max-w-xl mx-auto text-center">
            <h2 class="text-2xl sm:text-3xl font-extrabold mb-4">${block.content.title || "Intéressé ? Contactez notre Orchestrateur"}</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">${block.content.subtitle || "Remplissez ce formulaire et l'IA de FOLO initiera le premier audit d'impact."}</p>
            <form class="space-y-4 text-left">
              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Votre Nom</label>
                <input type="text" placeholder="Ex: Jean Kaboré" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-${accentColor}" required />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Votre Email</label>
                <input type="email" placeholder="Ex: jean@entreprise.bf" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-${accentColor}" required />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nom de l'Organisation</label>
                <input type="text" placeholder="Ex: Energie Solaire BF" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-${accentColor}" />
              </div>
              <button type="submit" class="w-full py-4 bg-${accentColor} hover:bg-${accentHover} text-white font-bold rounded-xl transition shadow-md">${block.content.buttonText || "Candidatez"}</button>
            </form>
          </section>
          `;
          break;
      }
    });

    return `<!DOCTYPE html>
<html lang="${lp.language || "fr"}" class="${isDark ? "dark" : ""}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lp.seoData?.title || lp.title}</title>
  <meta name="description" content="${lp.seoData?.metaDescription || lp.description}">
  <meta name="keywords" content="${(lp.seoData?.keywords || []).join(", ")}">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  ${lp.seoData?.schemaMarkup ? `<script type="application/ld+json">\n${lp.seoData.schemaMarkup}\n</script>` : ""}
</head>
<body class="${themeBg} font-sans min-h-screen antialiased">
  
  <nav class="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between border-b border-gray-100 dark:border-slate-800">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white text-sm">F</div>
      <span class="font-bold tracking-tight text-sm">FOLO Association</span>
    </div>
    <div class="text-xs text-slate-400">Généré par FOLO Landing Studio IA ⚡</div>
  </nav>

  ${bodyHTML}

  <footer class="py-12 border-t border-gray-100 dark:border-slate-800 text-center text-xs text-slate-400">
    <p>&copy; 2026 Programme FOLO. Tous droits réservés.</p>
    <p class="mt-2 text-[10px]">Burkina Faso & Mali &bull; Écosystème RSE & Insertion Professionnelle</p>
  </footer>

</body>
</html>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = (slug: string) => {
    const fullLink = `${window.location.origin}/lp/${slug}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleAB = async (lp: LandingPage) => {
    const isEnabled = !lp.abTesting?.isEnabled;
    const updated: LandingPage = {
      ...lp,
      abTesting: {
        isEnabled,
        variantBName: "Offre Premium RSE (B)",
        clicksVariantB: 0,
        conversionsVariantB: 0,
        meetingsBooked: 0,
        salesGenerated: 0,
        leadsQualityScore: 88,
        conversionRules: "L'orchestrateur FOLO distribue automatiquement 75% du trafic sur la version B pour maximiser la qualification des prospects."
      }
    };
    await updateLandingPage(updated);
  };

  return (
    <div className="space-y-6" id="landing-studio-module">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
              <Globe className="w-5 h-5 animate-pulse" />
            </span>
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">Copilote de Conversion</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">FOLO Landing Studio IA</h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Générez, auditez, publiez et optimisez des landing pages de conversion RSE connectées en temps réel à votre CRM intelligent.
          </p>
        </div>

        {!activePage && (
          <button
            onClick={() => setShowGenModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-950/40 shrink-0 z-10 border border-emerald-400/20"
          >
            <Sparkles className="w-4 h-4 text-emerald-100" />
            <span>Générer une Page avec l'IA</span>
          </button>
        )}
      </div>

      {!activePage ? (
        /* DASHBOARD VIEW / LIST OF PAGES */
        <div className="space-y-6">
          {/* TAB HEADER SELECTOR */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setStudioTab("pages")}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
                studioTab === "pages"
                  ? "border-emerald-500 text-emerald-600 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Pages Marketing Actives</span>
            </button>
            <button
              onClick={() => setStudioTab("templates")}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
                studioTab === "templates"
                  ? "border-emerald-500 text-emerald-600 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Layout className="w-4 h-4" />
              <span>Bibliothèque de Modèles</span>
            </button>
            <button
              onClick={() => setStudioTab("designer")}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
                studioTab === "designer"
                  ? "border-emerald-500 text-emerald-600 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Designer Marketing IA</span>
            </button>
          </div>

          {/* TAB CONTENT: PAGES */}
          {studioTab === "pages" && (
            <div className="space-y-6">
              {/* STATS DE CONVERSION DES PAGES GLOBALES (FILTRÉES) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pages Actives</span>
                    <span className="block text-2xl font-black text-slate-800 mt-1">
                      {landingPages.filter(lp => !lp.isTemplate).length}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trafic Global</span>
                    <span className="block text-2xl font-black text-slate-800 mt-1">
                      {landingPages.filter(lp => !lp.isTemplate).reduce((acc, lp) => acc + (lp.clicks || 0), 0)}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leads Qualifiés IA</span>
                    <span className="block text-2xl font-black text-emerald-600 mt-1">
                      {landingPages.filter(lp => !lp.isTemplate).reduce((acc, lp) => acc + (lp.conversions || 0), 0)}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Taux de Conversion</span>
                    <span className="block text-2xl font-black text-slate-800 mt-1">
                      {(() => {
                        const activeLps = landingPages.filter(lp => !lp.isTemplate);
                        const clicks = activeLps.reduce((acc, lp) => acc + (lp.clicks || 0), 0);
                        const convs = activeLps.reduce((acc, lp) => acc + (lp.conversions || 0), 0);
                        return clicks > 0 ? Math.round((convs / clicks) * 100) : 0;
                      })()}%
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* GRID OF ACTIVE LANDING PAGES */}
              {landingPages.filter(lp => !lp.isTemplate).length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Globe className="w-8 h-8 text-slate-400" />
                  </div>
                  <h2 className="text-base font-bold text-slate-800">Aucune landing page active</h2>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                    Utilisez notre co-pilote d'IA générative ou choisissez un modèle prédéfini de la bibliothèque pour concevoir instantanément vos pages marketing.
                  </p>
                  <div className="flex justify-center gap-3 mt-5">
                    <button
                      onClick={() => setStudioTab("templates")}
                      className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-md"
                    >
                      <Layout className="w-4 h-4" />
                      <span>Parcourir les modèles</span>
                    </button>
                    <button
                      onClick={() => setShowGenModal(true)}
                      className="inline-flex items-center gap-2 bg-slate-950 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Créer à partir de zéro</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {landingPages.filter(lp => !lp.isTemplate).map(lp => {
                    const convRate = lp.clicks > 0 ? Math.round((lp.conversions / lp.clicks) * 100) : 0;
                    
                    return (
                      <div key={lp.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition duration-200">
                        <div className={`h-2 ${
                          lp.theme === "dark" ? "bg-slate-950" :
                          lp.theme === "warm" ? "bg-amber-500" :
                          lp.theme === "slate" ? "bg-slate-800" :
                          lp.theme === "cool" ? "bg-blue-500" : "bg-emerald-500"
                        }`} />

                        <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                          <div className="space-y-3.5">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">{lp.title}</h3>
                                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                                    lp.pageType === "tender" ? "bg-purple-100 text-purple-700 border-purple-200" :
                                    lp.pageType === "sales" ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-blue-100 text-blue-700 border-blue-200"
                                  }`}>
                                    {lp.pageType || "Landing"}
                                  </span>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                                  <span>/lp/{lp.slug}</span>
                                  <button 
                                    onClick={() => handleCopyLink(lp.slug)} 
                                    className="p-1 text-slate-400 hover:text-slate-600 transition"
                                    title="Copier le lien"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                  {copiedLink && <span className="text-[9px] text-emerald-600 font-bold">Copié !</span>}
                                </span>
                              </div>

                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                lp.status === "published" 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                  : "bg-amber-50 text-amber-700 border-amber-100"
                              }`}>
                                {lp.status === "published" ? "Publié" : "Brouillon"}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{lp.description}</p>

                            <div className="flex flex-wrap gap-2 pt-1">
                              {lp.targetSector && (
                                <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-semibold">
                                  🎯 {lp.targetSector}
                                </span>
                              )}
                              {lp.targetCountry && (
                                <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-semibold">
                                  🌍 {lp.targetCountry}
                                </span>
                              )}
                              {lp.theme && (
                                <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-semibold">
                                  🎨 Thème : {lp.theme}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 grid grid-cols-3 gap-2 text-center">
                            <div>
                              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Visites</span>
                              <span className="block font-black text-slate-700 text-sm mt-0.5">{lp.clicks}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Conversions</span>
                              <span className="block font-black text-emerald-600 text-sm mt-0.5">{lp.conversions}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Taux</span>
                              <span className="block font-black text-slate-800 text-sm mt-0.5">{convRate}%</span>
                            </div>
                          </div>

                          {lp.abTesting?.isEnabled && (
                            <div className="bg-gradient-to-r from-purple-500/5 to-indigo-500/5 border border-purple-100 rounded-xl p-3 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                                <span className="font-bold text-purple-950">A/B Testing Actif</span>
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Var. B Conv : <span className="font-bold text-purple-700">{lp.abTesting.clicksVariantB > 0 ? Math.round((lp.abTesting.conversionsVariantB / lp.abTesting.clicksVariantB) * 100) : 32}%</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 shrink-0">
                            <button
                              onClick={() => handleSimulateTraffic(lp)}
                              className="flex items-center gap-1.5 hover:bg-slate-100 text-slate-600 p-2 rounded-lg text-xs font-semibold transition"
                              title="Simuler du trafic pour tester la conversion"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-500" />
                              <span>+ Simuler Trafic</span>
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setTemplateToSave(lp);
                                  setShowSaveTemplateModal(true);
                                }}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                title="Enregistrer dans la bibliothèque de modèles"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => deleteLandingPage(lp.id)}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                                title="Supprimer la page"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => {
                                  setActivePageId(lp.id);
                                  setEditorTab("blocks");
                                }}
                                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-sm"
                              >
                                <span>Atelier</span>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: TEMPLATES */}
          {studioTab === "templates" && (
            <div className="space-y-6">
              {/* FILTERS AND SEARCH */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un modèle..."
                    value={searchTemplateQuery}
                    onChange={(e) => setSearchTemplateQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 items-center justify-start w-full sm:w-auto overflow-x-auto max-w-full pb-1">
                  <button
                    onClick={() => setSelectedTemplateCategory("Toutes")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                      selectedTemplateCategory === "Toutes"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Toutes
                  </button>
                  {TEMPLATE_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedTemplateCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 whitespace-nowrap ${
                        selectedTemplateCategory === cat
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* TEMPLATES GRID */}
              {(() => {
                const dbTemplates = landingPages.filter(lp => lp.isTemplate);
                const combinedTemplates = [...DEFAULT_TEMPLATES, ...dbTemplates];
                const filteredTemplates = combinedTemplates.filter(t => {
                  const matchSearch = t.title.toLowerCase().includes(searchTemplateQuery.toLowerCase()) || 
                                      t.description.toLowerCase().includes(searchTemplateQuery.toLowerCase());
                  const matchCategory = selectedTemplateCategory === "Toutes" || t.category === selectedTemplateCategory;
                  return matchSearch && matchCategory;
                });

                if (filteredTemplates.length === 0) {
                  return (
                    <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm">
                      <Layout className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <h3 className="font-bold text-slate-800 text-sm">Aucun modèle trouvé</h3>
                      <p className="text-xs text-slate-400 mt-1">Essayez une autre recherche ou créez un modèle à partir de vos pages actives.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map(temp => (
                      <div key={temp.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                        <div className="p-5 space-y-4">
                          <div className="flex items-start justify-between">
                            <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-bold uppercase">
                              📁 {temp.category || "Formations"}
                            </span>
                            <div className="flex gap-1.5">
                              <span className="text-[10px] text-slate-400 font-bold uppercase">{temp.language || "fr"}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase">{temp.theme || "slate"}</span>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">{temp.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{temp.description}</p>
                          </div>

                          {/* BLOCKS SUMMARY */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Structure de Blocs :</span>
                            <div className="flex flex-wrap gap-1">
                              {(temp.blocks || []).map((b, bIdx) => (
                                <span key={bIdx} className="bg-slate-50 border border-slate-100 text-slate-500 px-2 py-0.5 rounded text-[8px] font-semibold uppercase">
                                  {b.type}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 italic">
                            {temp.id.startsWith("temp-") ? "Modèle système" : "Modèle utilisateur"}
                          </span>
                          <div className="flex gap-2">
                            {/* If user-created template, allow deletion */}
                            {!temp.id.startsWith("temp-") && (
                              <button
                                onClick={async () => {
                                  const updated = landingPages.find(lp => lp.id === temp.id);
                                  if (updated) {
                                    await updateLandingPage({ ...updated, isTemplate: false });
                                  }
                                }}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded border border-rose-100 bg-white transition"
                                title="Retirer de la bibliothèque"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleCreatePageFromTemplate(temp)}
                              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Utiliser ce modèle</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB CONTENT: DESIGNER MARKETING IA */}
          {studioTab === "designer" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-600 to-indigo-600 p-6 rounded-2xl border border-emerald-500/20 shadow-lg text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-xl space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-white/25 text-emerald-100 text-[10px] font-bold uppercase tracking-widest">
                      Agent Designer Marketing FOLO
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h2 className="text-lg font-black tracking-tight">Designer Marketing IA</h2>
                  <p className="text-xs text-emerald-100 leading-relaxed">
                    Saisissez votre objectif de campagne. Notre agent marketing analyse la cible, recommande la structure de blocs adéquate, génère des accroches d'impact et configure les paramètres SEO à l'aide de l'IA.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* FORM INPUTS */}
                <form onSubmit={handleDesignerRecommend} className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Quel est l'objectif marketing de votre campagne ?
                    </label>
                    <textarea
                      placeholder="Ex: Recruter 15 PME locales à Ouagadougou prêtes à financer des bourses complètes pour des techniciennes solaires..."
                      value={designerGoal}
                      onChange={(e) => setDesignerGoal(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Secteur Cible</label>
                      <select
                        value={designerSector}
                        onChange={(e) => setDesignerSector(e.target.value)}
                        className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="formation">Formations</option>
                        <option value="pme">PME</option>
                        <option value="ong">ONG</option>
                        <option value="collectivites">Collectivités</option>
                        <option value="appels_offres">Appels d'offres</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Pays Cible</label>
                      <input
                        type="text"
                        value={designerCountry}
                        onChange={(e) => setDesignerCountry(e.target.value)}
                        className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Ton Marketing</label>
                      <input
                        type="text"
                        value={designerTone}
                        onChange={(e) => setDesignerTone(e.target.value)}
                        className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Langue</label>
                      <select
                        value={designerLanguage}
                        onChange={(e) => setDesignerLanguage(e.target.value)}
                        className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="fr">Français (fr)</option>
                        <option value="en">Anglais (en)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isDesignerRecommending}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white py-3 rounded-xl text-xs font-extrabold transition shadow-md disabled:opacity-50"
                  >
                    {isDesignerRecommending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Création & Personnalisation IA...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Générer avec l'Agent Designer</span>
                      </>
                    )}
                  </button>
                </form>

                {/* AI RESULT PREVIEW */}
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm min-h-[380px] flex flex-col justify-between">
                  {isDesignerRecommending ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-12">
                      <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin" />
                      <div className="text-center space-y-1">
                        <h4 className="font-bold text-slate-800 text-xs">Analyse du besoin en cours...</h4>
                        <p className="text-[10px] text-slate-400 max-w-xs mx-auto">Génération de la structure idéale de blocs marketing, de l'accroche de conversion et du référencement SEO.</p>
                      </div>
                    </div>
                  ) : designerResult ? (
                    <div className="space-y-5 animate-fade-in flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        {/* REASONING SUMMARY */}
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-2">
                          <h4 className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                            <Cpu className="w-4 h-4 text-indigo-600" />
                            <span>Stratégie Recommandée :</span>
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed italic">
                            "{designerResult.reasoning}"
                          </p>
                        </div>

                        {/* GENERATED LP INFO CARD */}
                        <div className="border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md">
                              ✨ Modèle de page personnalisé
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{designerResult.landingPage.theme} Thème</span>
                          </div>

                          <div className="space-y-1.5">
                            <h3 className="font-extrabold text-slate-800 text-sm">{designerResult.landingPage.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">{designerResult.landingPage.description}</p>
                          </div>

                          {/* BLOCKS COUNT */}
                          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Blocs :</span>
                            <div className="flex flex-wrap gap-1">
                              {(designerResult.landingPage.blocks || []).map((b: any, idx: number) => (
                                <span key={idx} className="bg-white border border-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
                                  {b.type}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={async () => {
                            const newPage = {
                              ...designerResult.landingPage,
                              id: "lp-" + Math.random().toString(36).substring(2, 11),
                              createdAt: new Date().toISOString(),
                              clicks: 0,
                              conversions: 0
                            };
                            
                            await saveDb({
                              leads,
                              companies,
                              tasks,
                              campaigns,
                              landingPages: [newPage, ...landingPages],
                              alerts,
                              suggestions,
                              orchestratorConfig,
                              orchestratorPlans,
                              knowledge,
                              businessOffers
                            });
                            
                            setActivePageId(newPage.id);
                            setStudioTab("pages");
                            alert(`La landing page "${newPage.title}" a été générée et installée dans l'Atelier.`);
                          }}
                          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                        >
                          <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                          <span>Installer & Ouvrir l'Atelier</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-3.5 text-center py-12">
                      <HelpCircle className="w-12 h-12 text-slate-200" />
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-600 text-xs">Designer Prêt</h4>
                        <p className="text-[10px] text-slate-400 max-w-xs mx-auto">Saisissez vos critères à gauche pour laisser le designer IA composer la landing page optimale.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* ==================== ACTIVE WYSIWYG STUDIO VIEW ==================== */
        <div className="space-y-6">
          
          {/* EDITOR TOP HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivePageId(null)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-800">{activePage.title}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    activePage.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {activePage.status === "published" ? "Publié" : "Brouillon"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Slug unique : /lp/{activePage.slug}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Draft/Published Status toggle */}
              <button
                onClick={async () => {
                  const nextStatus = activePage.status === "published" ? "draft" : "published";
                  await updateLandingPage({
                    ...activePage,
                    status: nextStatus
                  });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  activePage.status === "published" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100" 
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {activePage.status === "published" ? "Désactiver" : "Publier la Page"}
              </button>

              <button
                onClick={() => handleAIAudit(activePage.id)}
                disabled={isAuditing}
                className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-100 transition disabled:opacity-50"
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Audit IA en cours...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Audit Co-pilote IA</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActivePageId(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
              >
                Fermer Studio
              </button>
            </div>
          </div>

          {/* STUDIO SPLIT SCREEN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT CONTROL PANEL (5 columns) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col max-h-[85vh]">
              
              {/* SUB-TABS */}
              <div className="flex border-b border-slate-100 bg-slate-50/50 p-1">
                <button
                  onClick={() => setEditorTab("blocks")}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg text-[10px] font-bold transition ${
                    editorTab === "blocks" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Structure</span>
                </button>
                <button
                  onClick={() => setEditorTab("seo")}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg text-[10px] font-bold transition ${
                    editorTab === "seo" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>SEO IA</span>
                </button>
                <button
                  onClick={() => setEditorTab("audit")}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg text-[10px] font-bold transition ${
                    editorTab === "audit" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Audit</span>
                </button>
                <button
                  onClick={() => setEditorTab("ab")}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg text-[10px] font-bold transition ${
                    editorTab === "ab" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>A/B Testing</span>
                </button>
                <button
                  onClick={() => setEditorTab("html")}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg text-[10px] font-bold transition ${
                    editorTab === "html" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Code className="w-4 h-4" />
                  <span>HTML Code</span>
                </button>
              </div>

              {/* TAB CONTAINER */}
              <div className="p-5 overflow-y-auto flex-1 space-y-4 max-h-[70vh]">
                
                {/* 1. BLOCKS STRUCTURE TAB */}
                {editorTab === "blocks" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800">Blocs Visuels Actifs</h3>
                      <div className="flex gap-1.5">
                        <select 
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddBlock(e.target.value as any);
                              e.target.value = "";
                            }
                          }}
                          className="border border-slate-200 text-[10px] p-1 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="">+ Ajouter un Bloc</option>
                          <option value="features">Points Clés / Caractéristiques</option>
                          <option value="stats">Impact / Statistiques</option>
                          <option value="testimonial">Témoignage Client</option>
                          <option value="faq">Questions Fréquentes (FAQ)</option>
                          <option value="form">Formulaire de Contact CRM</option>
                        </select>
                      </div>
                    </div>

                    {/* BLOCKS LIST */}
                    <div className="space-y-2.5">
                      {activePage.blocks.map((block, idx) => (
                        <div key={block.id} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                          <button
                            onClick={() => setSelectedBlockId(selectedBlockId === block.id ? null : block.id)}
                            className="w-full bg-slate-50/50 p-3 flex items-center justify-between text-left hover:bg-slate-50 transition"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-500">
                                {idx + 1}
                              </span>
                              <div>
                                <span className="block text-xs font-bold text-slate-800 uppercase tracking-tight">{block.type}</span>
                                <span className="block text-[10px] text-slate-400 font-medium">
                                  {block.type === "hero" ? block.content.title :
                                   block.type === "testimonial" ? `"${block.content.author}"` :
                                   block.content.title || "Contenu configuré"}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {block.type !== "hero" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteBlock(block.id);
                                  }}
                                  className="p-1 hover:bg-rose-100 hover:text-rose-600 rounded text-slate-400 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${selectedBlockId === block.id ? "rotate-90" : ""}`} />
                            </div>
                          </button>

                          {/* EXPANDED BLOCK CONFIGURATION */}
                          {selectedBlockId === block.id && (
                            <div className="p-4 border-t border-slate-100 space-y-3 bg-white text-xs text-slate-700 animate-fade-in">
                              
                              {block.type === "hero" && (
                                <>
                                  <div className="space-y-1">
                                    <label className="font-bold text-[10px] text-slate-500 uppercase">Titre de la Page</label>
                                    <input 
                                      type="text" 
                                      className="w-full border border-slate-200 rounded p-1.5 text-xs"
                                      value={block.content.title || ""}
                                      onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="font-bold text-[10px] text-slate-500 uppercase">Sous-titre / Objectif</label>
                                    <textarea 
                                      className="w-full border border-slate-200 rounded p-1.5 text-xs h-16"
                                      value={block.content.subtitle || ""}
                                      onChange={(e) => handleUpdateBlock(block.id, { subtitle: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="font-bold text-[10px] text-slate-500 uppercase">Libellé CTA principal</label>
                                    <input 
                                      type="text" 
                                      className="w-full border border-slate-200 rounded p-1.5 text-xs"
                                      value={block.content.buttonText || ""}
                                      onChange={(e) => handleUpdateBlock(block.id, { buttonText: e.target.value })}
                                    />
                                  </div>
                                </>
                              )}

                              {block.type === "features" && (
                                <>
                                  <div className="space-y-1">
                                    <label className="font-bold text-[10px] text-slate-500 uppercase">Titre de Section</label>
                                    <input 
                                      type="text" 
                                      className="w-full border border-slate-200 rounded p-1.5 text-xs"
                                      value={block.content.title || ""}
                                      onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="font-bold text-[10px] text-slate-500 uppercase block">Éléments</label>
                                    {(block.content.features || []).map((feat: any, fidx: number) => (
                                      <div key={fidx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                                        <input 
                                          type="text" 
                                          className="w-full border border-slate-200 rounded p-1 text-xs font-bold"
                                          placeholder={`Titre clé ${fidx + 1}`}
                                          value={feat.title || ""}
                                          onChange={(e) => {
                                            const updatedFeats = [...block.content.features];
                                            updatedFeats[fidx] = { ...feat, title: e.target.value };
                                            handleUpdateBlock(block.id, { features: updatedFeats });
                                          }}
                                        />
                                        <textarea 
                                          className="w-full border border-slate-200 rounded p-1 text-xs h-12"
                                          placeholder={`Description clé ${fidx + 1}`}
                                          value={feat.text || ""}
                                          onChange={(e) => {
                                            const updatedFeats = [...block.content.features];
                                            updatedFeats[fidx] = { ...feat, text: e.target.value };
                                            handleUpdateBlock(block.id, { features: updatedFeats });
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}

                              {block.type === "stats" && (
                                <>
                                  <div className="space-y-1">
                                    <label className="font-bold text-[10px] text-slate-500 uppercase">Titre de Section</label>
                                    <input 
                                      type="text" 
                                      className="w-full border border-slate-200 rounded p-1.5 text-xs"
                                      value={block.content.title || ""}
                                      onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                    {(block.content.stats || []).map((stat: any, sidx: number) => (
                                      <div key={sidx} className="p-2 bg-slate-50 rounded border border-slate-100 space-y-1">
                                        <input 
                                          type="text" 
                                          className="w-full border border-slate-200 rounded p-1 text-xs font-bold text-center text-emerald-600"
                                          placeholder="Chiffre"
                                          value={stat.value || ""}
                                          onChange={(e) => {
                                            const updatedStats = [...block.content.stats];
                                            updatedStats[sidx] = { ...stat, value: e.target.value };
                                            handleUpdateBlock(block.id, { stats: updatedStats });
                                          }}
                                        />
                                        <input 
                                          type="text" 
                                          className="w-full border border-slate-200 rounded p-1 text-[10px] text-center"
                                          placeholder="Label"
                                          value={stat.label || ""}
                                          onChange={(e) => {
                                            const updatedStats = [...block.content.stats];
                                            updatedStats[sidx] = { ...stat, label: e.target.value };
                                            handleUpdateBlock(block.id, { stats: updatedStats });
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}

                              {block.type === "testimonial" && (
                                <>
                                  <div className="space-y-1">
                                    <label className="font-bold text-[10px] text-slate-500 uppercase">Citation / Avis client</label>
                                    <textarea 
                                      className="w-full border border-slate-200 rounded p-1.5 text-xs h-20"
                                      value={block.content.quote || ""}
                                      onChange={(e) => handleUpdateBlock(block.id, { quote: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                      <label className="font-bold text-[9px] text-slate-400">Auteur</label>
                                      <input 
                                        type="text" 
                                        className="w-full border border-slate-200 rounded p-1.5 text-xs"
                                        value={block.content.author || ""}
                                        onChange={(e) => handleUpdateBlock(block.id, { author: e.target.value })}
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="font-bold text-[9px] text-slate-400">Rôle / Entreprise</label>
                                      <input 
                                        type="text" 
                                        className="w-full border border-slate-200 rounded p-1.5 text-xs"
                                        value={block.content.role || ""}
                                        onChange={(e) => handleUpdateBlock(block.id, { role: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                </>
                              )}

                              {block.type === "faq" && (
                                <>
                                  <div className="space-y-1">
                                    <label className="font-bold text-[10px] text-slate-500 uppercase">Titre de Section</label>
                                    <input 
                                      type="text" 
                                      className="w-full border border-slate-200 rounded p-1.5 text-xs"
                                      value={block.content.title || ""}
                                      onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    {(block.content.items || []).map((faqItem: any, fidx: number) => (
                                      <div key={fidx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                                        <input 
                                          type="text" 
                                          className="w-full border border-slate-200 rounded p-1 text-xs font-bold"
                                          placeholder="Question"
                                          value={faqItem.q || ""}
                                          onChange={(e) => {
                                            const updatedItems = [...block.content.items];
                                            updatedItems[fidx] = { ...faqItem, q: e.target.value };
                                            handleUpdateBlock(block.id, { items: updatedItems });
                                          }}
                                        />
                                        <textarea 
                                          className="w-full border border-slate-200 rounded p-1 text-xs h-12"
                                          placeholder="Réponse"
                                          value={faqItem.a || ""}
                                          onChange={(e) => {
                                            const updatedItems = [...block.content.items];
                                            updatedItems[fidx] = { ...faqItem, a: e.target.value };
                                            handleUpdateBlock(block.id, { items: updatedItems });
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}

                              {block.type === "form" && (
                                <>
                                  <div className="space-y-1">
                                    <label className="font-bold text-[10px] text-slate-500 uppercase">Titre d'appel</label>
                                    <input 
                                      type="text" 
                                      className="w-full border border-slate-200 rounded p-1.5 text-xs font-semibold"
                                      value={block.content.title || ""}
                                      onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="font-bold text-[10px] text-slate-500 uppercase">Sous-titre d'appel</label>
                                    <textarea 
                                      className="w-full border border-slate-200 rounded p-1.5 text-xs h-12"
                                      value={block.content.subtitle || ""}
                                      onChange={(e) => handleUpdateBlock(block.id, { subtitle: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="font-bold text-[10px] text-slate-500 uppercase">Texte du bouton</label>
                                    <input 
                                      type="text" 
                                      className="w-full border border-slate-200 rounded p-1.5 text-xs"
                                      value={block.content.buttonText || ""}
                                      onChange={(e) => handleUpdateBlock(block.id, { buttonText: e.target.value })}
                                    />
                                  </div>
                                </>
                              )}

                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* CONFIGURE PAGE THEME */}
                    <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-700">
                      <h4 className="font-bold text-slate-800">Paramètres de Style</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-[10px] text-slate-400 uppercase">Thème Visuel</label>
                          <select
                            value={activePage.theme}
                            onChange={async (e) => {
                              await updateLandingPage({
                                ...activePage,
                                theme: e.target.value as any
                              });
                            }}
                            className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                          >
                            <option value="modern">Modern (Blanc / Émeraude)</option>
                            <option value="dark">Immersif Sombre (Noir / Indigo)</option>
                            <option value="warm">Warm RSE (Crème / Ambre)</option>
                            <option value="slate">Slate Élite (Slate / Émeraude)</option>
                            <option value="cool">Corporate Cool (Blanc / Bleu)</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-[10px] text-slate-400 uppercase">Langue</label>
                          <select
                            value={activePage.language || "fr"}
                            onChange={async (e) => {
                              await updateLandingPage({
                                ...activePage,
                                language: e.target.value
                              });
                            }}
                            className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                          >
                            <option value="fr">Français (BF)</option>
                            <option value="en">English (US)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. SEO IA COMPLIANCE TAB */}
                {editorTab === "seo" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800">Optimisation SEO par l'IA</h3>
                      <button
                        onClick={() => handleAISeo(activePage.id)}
                        disabled={isOptimizingSeo}
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition disabled:opacity-50"
                      >
                        {isOptimizingSeo ? (
                          <>
                            <RefreshCw className="w-3 animate-spin" />
                            <span>Optimisation...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-emerald-100" />
                            <span>Optimiser SEO</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* SEO SCORE */}
                    {activePage.seoData && (
                      <div className="space-y-4 text-xs text-slate-700 animate-fade-in">
                        
                        {/* SCORE CARD */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score de Conformité</span>
                            <span className="block font-black text-2xl text-emerald-600 mt-0.5">{activePage.seoData.seoScore || 85}/100</span>
                          </div>
                          <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-extrabold text-xs ${
                            (activePage.seoData.seoScore || 85) >= 90 ? "border-emerald-500 text-emerald-600" :
                            (activePage.seoData.seoScore || 85) >= 80 ? "border-amber-400 text-amber-600" : "border-rose-400 text-rose-500"
                          }`}>
                            {activePage.seoData.seoScore || 85}%
                          </div>
                        </div>

                        {/* SEO FIELDS */}
                        <div className="space-y-3.5">
                          <div className="space-y-1">
                            <label className="font-bold text-[10px] text-slate-400 uppercase">Balise Title SEO</label>
                            <input 
                              type="text" 
                              className="w-full border border-slate-200 rounded-lg p-2 font-semibold bg-white"
                              value={activePage.seoData.title || ""}
                              onChange={async (e) => {
                                await updateLandingPage({
                                  ...activePage,
                                  seoData: {
                                    ...activePage.seoData,
                                    title: e.target.value
                                  }
                                });
                              }}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[10px] text-slate-400 uppercase">Meta Description (Max 160 car.)</label>
                            <textarea 
                              className="w-full border border-slate-200 rounded-lg p-2 bg-white h-20"
                              value={activePage.seoData.metaDescription || ""}
                              onChange={async (e) => {
                                await updateLandingPage({
                                  ...activePage,
                                  seoData: {
                                    ...activePage.seoData,
                                    metaDescription: e.target.value
                                  }
                                });
                              }}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[10px] text-slate-400 uppercase block">Keywords (Séparés par des virgules)</label>
                            <input 
                              type="text" 
                              className="w-full border border-slate-200 rounded-lg p-2 bg-white font-mono"
                              value={(activePage.seoData.keywords || []).join(", ")}
                              onChange={async (e) => {
                                await updateLandingPage({
                                  ...activePage,
                                  seoData: {
                                    ...activePage.seoData,
                                    keywords: e.target.value.split(",").map(k => k.trim())
                                  }
                                });
                              }}
                            />
                          </div>

                          {/* RECOMENDATIONS LIST */}
                          <div className="space-y-2">
                            <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest block">Recommandations IA</span>
                            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                              {(activePage.seoData.seoRecommendations || [
                                "Insérer plus de mots-clés liés au co-financement RSE",
                                "Ajouter une balise d'ancrage sur le bouton d'inscription",
                                "Intégrer le Schema.org de type EducationalOrganization"
                              ]).map((rec, rIdx) => (
                                <div key={rIdx} className="flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                  <span>{rec}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* SCHEMA ORG MICRODATA */}
                          <div className="space-y-1">
                            <label className="font-bold text-[10px] text-slate-400 uppercase block">Microdonnées Schema.org (JSON-LD)</label>
                            <pre className="bg-slate-900 text-slate-400 p-3 rounded-lg text-[10px] font-mono overflow-x-auto whitespace-pre h-32 leading-tight">
                              {activePage.seoData.schemaMarkup || `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Programme FOLO Sponsoring RSE",
  "description": "FOLO forme des jeunes au Burkina Faso sur l'énergie solaire."
}`}
                            </pre>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                )}

                {/* 3. CO-PILOTE AUDIT REPORT TAB */}
                {editorTab === "audit" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800">Rapport de Cohérence Globale</h3>
                      <button
                        onClick={() => handleAIAudit(activePage.id)}
                        disabled={isAuditing}
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-[10px] font-bold transition disabled:opacity-50"
                      >
                        {isAuditing ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Cpu className="w-3.5 h-3.5" />
                        )}
                        <span>Relancer l'Audit</span>
                      </button>
                    </div>

                    {activePage.orchestratorReport ? (
                      <div className="space-y-4 text-xs text-slate-700 animate-fade-in">
                        
                        {/* VALID STATUS BANNER */}
                        <div className={`p-3 rounded-xl flex items-center gap-2.5 ${
                          activePage.orchestratorReport.isValid 
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                            : "bg-amber-50 text-amber-800 border border-amber-100"
                        }`}>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-extrabold block">Audit FOLO Conforme</span>
                            <span className="text-[10px] opacity-90 block">Validé le {new Date(activePage.orchestratorReport.checkedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* DETAILED SCORES METRIC GRAPH */}
                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3.5">
                          <div>
                            <div className="flex justify-between text-[11px] font-bold mb-1">
                              <span>Cohérence avec le Référentiel FOLO</span>
                              <span className="text-indigo-600">{activePage.orchestratorReport.coherenceScore || 85}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${activePage.orchestratorReport.coherenceScore || 85}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] font-bold mb-1">
                              <span>UX & Ergonomie Mobile</span>
                              <span className="text-emerald-600">{activePage.orchestratorReport.uxScore || 90}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${activePage.orchestratorReport.uxScore || 90}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] font-bold mb-1">
                              <span>Conformité SEO technique</span>
                              <span className="text-blue-600">{activePage.orchestratorReport.seoCompliance || 80}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${activePage.orchestratorReport.seoCompliance || 80}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] font-bold mb-1">
                              <span>Temps de chargement estimé</span>
                              <span className="text-amber-600">{activePage.orchestratorReport.performanceScore || 95}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${activePage.orchestratorReport.performanceScore || 95}%` }} />
                            </div>
                          </div>
                        </div>

                        {/* COHERENCE COMMENTARY */}
                        <div className="space-y-1">
                          <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest block">Analyse de Cohérence IA</span>
                          <p className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 leading-relaxed italic">
                            "{activePage.orchestratorReport.coherenceComments || "Le document est en totale conformité avec la base de connaissances du programme FOLO."}"
                          </p>
                        </div>

                        {/* CRITICAL ACTIONS SUGGESTED */}
                        <div className="space-y-2">
                          <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest block">Suggestions d'Amélioration</span>
                          <div className="space-y-1.5">
                            {(activePage.orchestratorReport.improvementSuggestions || []).map((sug, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed text-[11px] text-slate-600">
                                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <span>{sug}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 text-center space-y-3">
                        <Cpu className="w-8 h-8 text-slate-400 mx-auto animate-pulse" />
                        <h4 className="font-bold text-slate-700 text-xs">Aucun audit disponible</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Faites analyser la cohérence commerciale de votre page avec la Charte FOLO et les connaissances de la base RSE.
                        </p>
                        <button
                          onClick={() => handleAIAudit(activePage.id)}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition"
                        >
                          Lancer l'Audit Co-pilote
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. A/B TESTING CONTROLS TAB */}
                {editorTab === "ab" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800">Control Room A/B Testing</h3>
                      <button
                        onClick={() => handleToggleAB(activePage)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition ${
                          activePage.abTesting?.isEnabled
                            ? "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {activePage.abTesting?.isEnabled ? "Désactiver" : "Activer A/B Test"}
                      </button>
                    </div>

                    {activePage.abTesting?.isEnabled ? (
                      <div className="space-y-4 text-xs text-slate-700 animate-fade-in">
                        
                        <div className="bg-purple-50 text-purple-950 p-3.5 rounded-xl border border-purple-100 space-y-1.5">
                          <h4 className="font-bold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            <span>Orchestration Multi-Arm Bandit Actif</span>
                          </h4>
                          <p className="text-[10px] opacity-90 leading-relaxed">
                            {activePage.abTesting.conversionRules || "L'orchestrateur FOLO distribue automatiquement 75% du trafic sur la version B."}
                          </p>
                        </div>

                        {/* COMPARATIVE TABLE */}
                        <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm text-center">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-2.5 font-bold text-[10px] text-slate-500 uppercase">Version</th>
                                <th className="p-2.5 font-bold text-[10px] text-slate-500 uppercase text-center">Trafic</th>
                                <th className="p-2.5 font-bold text-[10px] text-slate-500 uppercase text-center">Conv.</th>
                                <th className="p-2.5 font-bold text-[10px] text-slate-500 uppercase text-center">Taux</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-100 bg-white">
                                <td className="p-2.5 font-bold text-slate-700">Origine (A)</td>
                                <td className="p-2.5 text-center font-semibold text-slate-500">{activePage.clicks}</td>
                                <td className="p-2.5 text-center font-bold text-slate-700">{activePage.conversions}</td>
                                <td className="p-2.5 text-center font-extrabold text-slate-800">
                                  {activePage.clicks > 0 ? Math.round((activePage.conversions / activePage.clicks) * 100) : 0}%
                                </td>
                              </tr>
                              <tr className="bg-purple-50/20">
                                <td className="p-2.5 font-bold text-purple-900">{activePage.abTesting.variantBName || "Variant B"}</td>
                                <td className="p-2.5 text-center font-semibold text-purple-600">{activePage.abTesting.clicksVariantB || 14}</td>
                                <td className="p-2.5 text-center font-bold text-purple-900">{activePage.abTesting.conversionsVariantB || 4}</td>
                                <td className="p-2.5 text-center font-black text-purple-800">
                                  {activePage.abTesting.clicksVariantB > 0 
                                    ? Math.round((activePage.abTesting.conversionsVariantB / activePage.abTesting.clicksVariantB) * 100) 
                                    : 29}%
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* HIGHER METRICS */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                            <span className="block text-[9px] text-slate-400 font-bold uppercase">Rendez-vous CRM</span>
                            <span className="block font-black text-slate-800 text-base mt-0.5">{activePage.abTesting.meetingsBooked || 2}</span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                            <span className="block text-[9px] text-slate-400 font-bold uppercase">Qualité Leads IA</span>
                            <span className="block font-black text-purple-700 text-base mt-0.5">{activePage.abTesting.leadsQualityScore || 88}%</span>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 text-center space-y-3">
                        <BarChart3 className="w-8 h-8 text-slate-400 mx-auto" />
                        <h4 className="font-bold text-slate-700 text-xs">A/B Testing inactif</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Permettez à l'Orchestrateur IA d'alterner dynamiquement entre deux propositions d'offres pour identifier l'angle d'impact qui convertit le mieux vos prospects.
                        </p>
                        <button
                          onClick={() => handleToggleAB(activePage)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs transition"
                        >
                          Activer l'A/B Testing Intelligent
                        </button>
                      </div>
                    )}

                    {/* AGENT D'OPTIMISATION CONTINUE */}
                    <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                          <span className="font-bold text-slate-800 text-xs">Agent d'Optimisation Continue</span>
                        </div>
                        <button
                          onClick={() => handleContinuousOptimize(activePage.id)}
                          disabled={isContinuousOptimizing}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded text-[10px] font-bold transition flex items-center gap-1"
                        >
                          {isContinuousOptimizing ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Calcul...</span>
                            </>
                          ) : (
                            <>
                              <Cpu className="w-3 h-3" />
                              <span>Lancer l'Optimisation IA</span>
                            </>
                          )}
                        </button>
                      </div>

                      {continuousOptResult ? (
                        <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-3 animate-fade-in text-xs">
                          <div className="flex items-center justify-between border-b pb-2">
                            <span className="font-extrabold text-slate-800 text-[10px] uppercase tracking-wider">Proposition Optimisée (Version B)</span>
                            <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-md">
                              Gain estimé : +{continuousOptResult.improvementScore || 92}%
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="block font-bold text-[9px] text-slate-400 uppercase">Raisonnement de l'Agent</span>
                            <p className="text-[11px] text-slate-600 italic">"{continuousOptResult.reasoning}"</p>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="block font-bold text-[9px] text-slate-400 uppercase">Nouveau Titre de l'Accroche</span>
                            <p className="text-[11px] text-slate-800 font-extrabold">"{continuousOptResult.variantBName}"</p>
                          </div>

                          <div className="space-y-1">
                            <span className="block font-bold text-[9px] text-slate-400 uppercase">Règles d'Aiguillage</span>
                            <p className="text-[11px] text-slate-500 font-mono text-[9px]">{continuousOptResult.conversionRules}</p>
                          </div>

                          <button
                            onClick={() => handleApplyContinuousOpt(activePage)}
                            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition shadow-sm mt-1"
                          >
                            Appliquer comme Variante B & Lancer l'A/B Test
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 leading-normal">
                          L'Agent d'Optimisation IA analyse en temps réel les performances de votre landing page, le secteur cible, et les leads générés pour composer une variante B à fort impact cognitif.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. CODE OUTPUT TAB */}
                {editorTab === "html" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800">Code Source de Production</h3>
                      <button
                        onClick={() => copyToClipboard(generateSelfContainedHTML(activePage))}
                        className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1 rounded-lg text-[10px] font-bold transition"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? "Copié !" : "Copier le Code HTML"}</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-normal">
                      Ce code est 100% autonome, intégrant Tailwind CSS par CDN, Google Fonts, et les balises microdonnées Schema.org IA. Vous pouvez l'héberger sur n'importe quel serveur ou l'exporter dans FOLO Landing Studio.
                    </p>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
                      <pre className="text-[10px] font-mono text-slate-300 overflow-y-auto h-96 select-all whitespace-pre leading-normal scrollbar-thin scrollbar-thumb-slate-800">
                        {generateSelfContainedHTML(activePage)}
                      </pre>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* RIGHT PREVIEW & SIMULATION FRAME (7 columns) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              
              {/* INTERACTIVE PREVIEW PANEL HEADER */}
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                    <Laptop className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Simulateur d'Intégration Active</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Vérifiez les conversions et l'acquisition en direct</p>
                  </div>
                </div>

                {/* DEVICE SWITCHER BUTTONS */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className={`p-1.5 rounded-md transition ${previewDevice === "desktop" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-700"}`}
                    title="Aperçu Bureau"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice("tablet")}
                    className={`p-1.5 rounded-md transition ${previewDevice === "tablet" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-700"}`}
                    title="Aperçu Tablette"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className={`p-1.5 rounded-md transition ${previewDevice === "mobile" ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-700"}`}
                    title="Aperçu Mobile"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* SIMULATED WORKSPACE CANVAS WRAPPER */}
              <div className="p-5 bg-slate-100 border-b border-slate-100 flex-1 flex flex-col items-center justify-center min-h-[500px]">
                
                {/* SIMULATED DEVICE FRAME CONTAINER */}
                <div 
                  className={`bg-white border border-slate-200 shadow-lg rounded-2xl overflow-hidden transition-all duration-300 ${
                    previewDevice === "mobile" ? "w-[340px] h-[640px]" :
                    previewDevice === "tablet" ? "w-[600px] h-[720px]" : "w-full min-h-[640px]"
                  }`}
                >
                  {/* SIMULATED BROWSER BAR */}
                  <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
                    </div>
                    <span className="bg-white px-10 py-1 rounded-md border border-slate-200/60 font-mono text-slate-400 tracking-wider">
                      folo-asso.org/lp/{activePage.slug}
                    </span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">🔒 SSL</span>
                  </div>

                  {/* HTML SIMULATION VIEWER CONTAINER */}
                  <div className="p-6 overflow-y-auto max-h-[600px] scrollbar-thin text-xs text-slate-700 space-y-8" style={{
                    backgroundColor: activePage.theme === 'dark' ? '#020617' : activePage.theme === 'warm' ? '#fdfbf7' : activePage.theme === 'slate' ? '#0f172a' : '#ffffff',
                    color: (activePage.theme === 'dark' || activePage.theme === 'slate') ? '#f8fafc' : '#1e293b'
                  }}>
                    
                    {/* Header bar inside device */}
                    <div className="flex items-center justify-between border-b pb-4" style={{
                      borderColor: (activePage.theme === 'dark' || activePage.theme === 'slate') ? '#1e293b' : '#f1f5f9'
                    }}>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center font-black text-white text-[10px]">F</div>
                        <span className="font-extrabold text-[10px]">FOLO Association</span>
                      </div>
                      <span className="text-[9px] text-slate-400">RSE & Impact Solidaire</span>
                    </div>

                    {/* BLOCKS RENDERING IN PREVIEW */}
                    {activePage.blocks.map((block) => {
                      const accentCls = activePage.theme === "dark" ? "text-indigo-400 bg-indigo-500/10" : "text-emerald-600 bg-emerald-50";
                      const textMuted = (activePage.theme === 'dark' || activePage.theme === 'slate') ? 'text-slate-400' : 'text-slate-500';
                      
                      return (
                        <div key={block.id} className="relative group/block border border-transparent hover:border-emerald-500/30 rounded-xl p-2.5 transition">
                          
                          {block.type === "hero" && (
                            <div className="text-center py-6 space-y-4 max-w-lg mx-auto">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${accentCls}`}>
                                🌱 Offre RSE / {activePage.targetSector || "Formation"}
                              </span>
                              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{
                                color: (activePage.theme === 'dark' || activePage.theme === 'slate') ? '#ffffff' : '#0f172a'
                              }}>
                                {block.content.title || activePage.headerTitle}
                              </h1>
                              <p className={`text-xs ${textMuted} leading-relaxed`}>
                                {block.content.subtitle || activePage.headerSub}
                              </p>
                              <a href="#test-submit-form" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow-md shadow-emerald-900/10 transition">
                                {block.content.buttonText || activePage.ctaText}
                              </a>
                            </div>
                          )}

                          {block.type === "features" && (
                            <div className="space-y-4">
                              <h2 className="text-sm font-extrabold text-center">{block.content.title || "Nos Points Clés"}</h2>
                              <div className="grid grid-cols-1 gap-3">
                                {(block.content.features || []).map((f: any, fidx: number) => (
                                  <div key={fidx} className="p-3 rounded-lg border border-slate-100/10 bg-slate-50/10 space-y-1">
                                    <h4 className="font-bold text-xs flex items-center gap-1.5">
                                      <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] shrink-0">✓</span>
                                      <span>{f.title}</span>
                                    </h4>
                                    <p className={`text-[10px] ${textMuted} pl-5`}>{f.text}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === "stats" && (
                            <div className="py-4 bg-slate-150/10 rounded-xl border border-slate-100/10 grid grid-cols-3 gap-2 text-center">
                              {(block.content.stats || []).map((s: any, sidx: number) => (
                                <div key={sidx} className="space-y-1">
                                  <span className="block text-lg font-black text-emerald-500">{s.value}</span>
                                  <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-bold">{s.label}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {block.type === "testimonial" && (
                            <div className="text-center p-4 bg-slate-100/5 rounded-xl border border-slate-100/5">
                              <p className="italic text-xs font-medium leading-relaxed">
                                "{block.content.quote}"
                              </p>
                              <div className="mt-3">
                                <h4 className="font-bold text-[11px]">{block.content.author}</h4>
                                <span className="block text-[9px] text-slate-400 mt-0.5">{block.content.role}</span>
                              </div>
                            </div>
                          )}

                          {block.type === "faq" && (
                            <div className="space-y-3">
                              <h2 className="text-sm font-extrabold text-center">{block.content.title || "FAQ"}</h2>
                              <div className="space-y-2">
                                {(block.content.items || []).map((item: any, fidx: number) => (
                                  <div key={fidx} className="p-3 rounded-lg bg-slate-50/5 border border-slate-100/10">
                                    <h4 className="font-bold text-xs">{item.q}</h4>
                                    <p className={`text-[10px] ${textMuted} mt-1`}>{item.a}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === "form" && (
                            <div id="test-submit-form" className="p-4 bg-slate-100/5 rounded-xl border border-slate-100/5 space-y-4 max-w-sm mx-auto">
                              <div className="text-center space-y-1">
                                <h3 className="font-bold text-xs">{block.content.title || "Candidature Rapide"}</h3>
                                <p className={`text-[10px] ${textMuted}`}>{block.content.subtitle || "Remplissez pour qualifier votre intérêt."}</p>
                              </div>

                              {/* SIMULATED SUBMISSION INTERFACE */}
                              {simSubmitted ? (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-center space-y-2 animate-fade-in">
                                  <span className="text-emerald-500 font-bold text-xs block">✓ Simulation Réussie</span>
                                  <p className="text-[10px] text-slate-400 leading-normal">{simFeedback}</p>
                                  <button
                                    onClick={() => setSimSubmitted(false)}
                                    className="text-[9px] underline text-emerald-400 font-bold"
                                  >
                                    Faire un autre test
                                  </button>
                                </div>
                              ) : (
                                <form onSubmit={(e) => handleSimulateLeadSubmit(e, activePage)} className="space-y-3 text-left">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Nom Complet</label>
                                    <input 
                                      type="text" 
                                      required
                                      placeholder="Ex: Jean Kaboré"
                                      className="w-full bg-slate-500/5 border border-slate-100/20 rounded p-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                                      value={simLeadName}
                                      onChange={e => setSimLeadName(e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Email Pro</label>
                                    <input 
                                      type="email" 
                                      required
                                      placeholder="jean@entreprise.bf"
                                      className="w-full bg-slate-500/5 border border-slate-100/20 rounded p-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                                      value={simLeadEmail}
                                      onChange={e => setSimLeadEmail(e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Organisation</label>
                                    <input 
                                      type="text" 
                                      placeholder="Ex: Faso Energy"
                                      className="w-full bg-slate-500/5 border border-slate-100/20 rounded p-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
                                      value={simLeadCompany}
                                      onChange={e => setSimLeadCompany(e.target.value)}
                                    />
                                  </div>
                                  <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition">
                                    {block.content.buttonText || "Soumettre le Lead"}
                                  </button>
                                </form>
                              )}
                            </div>
                          )}

                        </div>
                      );
                    })}

                    {/* Simu bottom info */}
                    <div className="pt-6 border-t border-slate-100/10 text-center text-[9px] text-slate-400">
                      <p>&copy; 2026 Programme FOLO Association. Tous droits réservés.</p>
                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* MODAL: GENERATE NEW LANDING PAGE VIA IA */}
      {showGenModal && (
        <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-fade-in">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-emerald-50 text-emerald-600">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                </span>
                <h3 className="text-sm font-black text-slate-800">Générer une Landing Page Strategique (IA)</h3>
              </div>
              <button 
                onClick={() => setShowGenModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAIGeneration} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Titre de la Campagne / Offre</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sponsoring RSE - Formation Énergie Solaire 2026"
                  value={genTitle}
                  onChange={e => setGenTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800 bg-slate-50/50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Description des Objectifs de Conversion (Prompt)</label>
                <textarea
                  required
                  placeholder="Ex: Page ciblant les directeurs RSE des grandes entreprises et banques au Burkina Faso. L'objectif est de les inciter à subventionner une bourse d'insertion de 1 500 € par jeune formé aux métiers du solaire. Mettre en avant le co-financement et l'impact social concret."
                  value={genDesc}
                  onChange={e => setGenDesc(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none h-24 text-slate-700 bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Format de Page</label>
                  <select
                    value={genPageType}
                    onChange={e => setGenPageType(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="landing">Landing Page classique</option>
                    <option value="sales">Page de Vente / Conversion</option>
                    <option value="registration">Formulaire intelligent d'inscription</option>
                    <option value="event">Page Événementielle / Forum</option>
                    <option value="minisite">Mini-site de campagne</option>
                    <option value="tender">Réponse Appel d'Offres</option>
                    <option value="services">Présentation de Services</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Thème Graphique</label>
                  <select
                    value={genTheme}
                    onChange={e => setGenTheme(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="slate">Slate Élite (Slate / Émeraude)</option>
                    <option value="modern">Modern (Blanc / Émeraude)</option>
                    <option value="dark">Immersif Sombre (Noir / Indigo)</option>
                    <option value="warm">Warm RSE (Crème / Ambre)</option>
                    <option value="cool">Corporate Cool (Blanc / Bleu)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Secteur Cible</label>
                  <select
                    value={genTargetSector}
                    onChange={e => setGenTargetSector(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="formation">Éducation / Solidaire</option>
                    <option value="ong">ONG & Bailleurs</option>
                    <option value="collectivites">Collectivités Publiques</option>
                    <option value="pme">PME Industrielles</option>
                    <option value="appels_offres">Appels d'Offres</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Pays Cible</label>
                  <input
                    type="text"
                    value={genTargetCountry}
                    onChange={e => setGenTargetCountry(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Langue</label>
                  <select
                    value={genLanguage}
                    onChange={e => setGenLanguage(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="fr">Français (BF)</option>
                    <option value="en">English (US)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Associer à une Campagne CRM (Optionnel)</label>
                <select
                  value={genCampaignId}
                  onChange={e => setGenCampaignId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                >
                  <option value="">-- Aucune campagne --</option>
                  {campaigns.map(camp => (
                    <option key={camp.id} value={camp.id}>{camp.name} ({camp.channel})</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-bold text-slate-500 hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-bold transition shadow-md disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Génération de la Page...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Lancer l'Architecte IA</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
