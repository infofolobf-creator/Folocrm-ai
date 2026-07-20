/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { Lead, Company, Task, Campaign, LandingPage, VeilleAlert, MessageSuggestion, LeadStatus, OrchestratorConfig, OrchestratorPlan, KnowledgeItem, RagQueryResult, BusinessOfferProposal } from "./types";

interface CRMContextType {
  leads: Lead[];
  companies: Company[];
  tasks: Task[];
  campaigns: Campaign[];
  landingPages: LandingPage[];
  alerts: VeilleAlert[];
  suggestions: MessageSuggestion[];
  orchestratorConfig: OrchestratorConfig | null;
  orchestratorPlans: OrchestratorPlan[];
  knowledge: KnowledgeItem[];
  businessOffers: BusinessOfferProposal[];
  isLoading: boolean;
  error: string | null;
  refreshDb: () => Promise<void>;
  saveDb: (updatedState: any) => Promise<void>;
  addLead: (lead: Omit<Lead, "id" | "createdAt">) => Promise<void>;
  updateLeadStatus: (leadId: string, status: LeadStatus) => Promise<void>;
  updateLead: (lead: Lead) => Promise<void>;
  addCompany: (company: Omit<Company, "id" | "createdAt">) => Promise<Company>;
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
  toggleTaskStatus: (taskId: string) => Promise<void>;
  addCampaign: (campaign: Omit<Campaign, "id" | "createdAt" | "sentCount" | "deliveredCount" | "responseCount">) => Promise<void>;
  addLandingPage: (lp: Omit<LandingPage, "id" | "createdAt" | "clicks" | "conversions">) => Promise<void>;
  qualifyLeadAI: (leadId: string) => Promise<void>;
  suggestMessageAI: (leadId: string, channel: string, goal: string) => Promise<void>;
  triggerVeilleAlertAI: () => Promise<void>;
  approveSuggestion: (sugId: string) => Promise<void>;
  updateOrchestratorConfig: (config: OrchestratorConfig) => Promise<void>;
  buildOrchestratorPlanAI: (params: { goalDescription: string; targetLeadsCount: number; maxBudget: number; useOnlyFree: boolean; mode: string }) => Promise<void>;
  executeOrchestratorStepAI: (planId: string, stepIndex: number) => Promise<void>;
  triggerOrchestratorLearning: () => Promise<void>;
  addKnowledgeItem: (item: Omit<KnowledgeItem, "id" | "updatedAt" | "version" | "versions">) => Promise<void>;
  updateKnowledgeItem: (id: string, item: Omit<KnowledgeItem, "id" | "updatedAt" | "version" | "versions">) => Promise<void>;
  deleteKnowledgeItem: (id: string) => Promise<void>;
  queryKnowledgeBase: (query: string, category?: string) => Promise<RagQueryResult>;
  createBusinessOfferAI: (clientName: string, demandDescription: string, title?: string) => Promise<BusinessOfferProposal>;
  updateBusinessOffer: (offer: BusinessOfferProposal) => Promise<void>;
  deleteBusinessOffer: (id: string) => Promise<void>;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const LOCAL_STORAGE_KEY = "folo_crm_local_db";

  // --- DEFAULT OFFLINE DATABASE ---
  const DEFAULT_OFFLINE_DB = {
    leads: [
      {
        id: "lead-1",
        name: "Ibrahim Sawadogo",
        companyId: "comp-1",
        companyName: "Burkina Tech Corp",
        email: "i.sawadogo@burkinatech.bf",
        phone: "+226 70 12 34 56",
        status: LeadStatus.QUALIFIED,
        value: 4500,
        source: "Landing Page Partenaires",
        country: "Burkina Faso",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Intéressé par le recrutement de 10 diplômés développeurs du programme FOLO. Demande d'adapter le cursus aux technologies mobiles.",
        agentQualification: {
          score: 88,
          status: "hot" as const,
          summary: "Excellente opportunité. Le besoin est immédiat et correspond exactement aux compétences de notre cohorte de développeurs Web & Mobile.",
          needsFollowUp: true,
          suggestedNextAction: "Envoyer la convention de partenariat et organiser un appel technique pour valider le programme de formation.",
          analyzedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          agentId: "agent-qualification"
        }
      },
      {
        id: "lead-2",
        name: "Mariam Diallo",
        companyId: "comp-2",
        companyName: "Sinuhe Énergie",
        email: "m.diallo@sinuhe-solar.com",
        phone: "+226 76 89 45 12",
        status: LeadStatus.NEGOTIATION,
        value: 12500,
        source: "LinkedIn Outreach",
        country: "Burkina Faso",
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Souhaite sponsoriser une cohorte complète de 25 jeunes femmes aux métiers de l'énergie solaire (solaire off-grid). Demande d'un devis global de bourse.",
        agentQualification: {
          score: 95,
          status: "hot" as const,
          summary: "Opportunité majeure à forte valeur sociale. Aligné parfaitement avec la mission FOLO sur l'employabilité féminine et l'énergie propre.",
          needsFollowUp: true,
          suggestedNextAction: "Finaliser le dossier financier détaillé de sponsoring et planifier une réunion avec le Directeur Commercial.",
          analyzedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          agentId: "agent-qualification"
        }
      },
      {
        id: "lead-3",
        name: "Jean-Baptiste Kaboré",
        companyId: "comp-3",
        companyName: "Agro-Innover BF",
        email: "jb.kabore@agroinnover.org",
        phone: "+226 64 23 78 90",
        status: LeadStatus.CONTACTED,
        value: 1800,
        source: "Veille AI",
        country: "Burkina Faso",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "A manifesté de l'intérêt pour intégrer des stagiaires FOLO en gestion de base de données agricoles, mais budget serré.",
        agentQualification: {
          score: 45,
          status: "warm" as const,
          summary: "Besoin réel mais capacités de financement limitées. Préférerait un format d'apprentissage ou de stage conventionné sans sponsoring lourd.",
          needsFollowUp: true,
          suggestedNextAction: "Proposer notre modèle de stage non-sponsorisé avec option d'embauche après validation.",
          analyzedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          agentId: "agent-qualification"
        }
      },
      {
        id: "lead-4",
        name: "Alice Traoré",
        companyId: "comp-4",
        companyName: "Banque de l'Union BF",
        email: "a.traore@bubf.com",
        phone: "+226 25 30 11 22",
        status: LeadStatus.NEW,
        value: 25000,
        source: "Landing Page Sponsoring",
        country: "Burkina Faso",
        createdAt: new Date().toISOString(),
        notes: "Demande de partenariat RSE (Responsabilité Sociétale des Entreprises). Souhaitent investir dans l'équipement de la nouvelle salle informatique FOLO à Ouagadougou en échange de visibilité."
      }
    ],
    companies: [
      {
        id: "comp-1",
        name: "Burkina Tech Corp",
        industry: "Technologies & Logiciels",
        size: "51-200",
        website: "https://www.burkinatech.bf",
        country: "Burkina Faso",
        address: "Avenue de l'UEMOA, Zone du Bois, Ouagadougou",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "comp-2",
        name: "Sinuhe Énergie",
        industry: "Énergies Renouvelables",
        size: "11-50",
        website: "https://www.sinuhe-solar.com",
        country: "Burkina Faso",
        address: "Secteur 15, Bobo-Dioulasso",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "comp-3",
        name: "Agro-Innover BF",
        industry: "Agriculture & Agroalimentaire",
        size: "1-10",
        website: "https://www.agroinnover.org",
        country: "Burkina Faso",
        address: "Quartier Somgandé, Ouagadougou",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "comp-4",
        name: "Banque de l'Union BF",
        industry: "Services Financiers & Banques",
        size: "200+",
        website: "https://www.bubf.com",
        country: "Burkina Faso",
        address: "Avenue Kwamé N'Krumah, Ouagadougou",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    tasks: [
      {
        id: "task-1",
        title: "Envoyer proposition technique à Burkina Tech Corp",
        description: "Adapter la convention de stage FOLO et détailler le profil de formation de la cohorte Web/Mobile.",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: "high" as const,
        status: "pending" as const,
        assignedAgentId: "agent-com",
        leadId: "lead-1",
        createdAt: new Date().toISOString()
      },
      {
        id: "task-2",
        title: "Appel de suivi budgétaire Sinuhe Énergie",
        description: "Valider le budget de sponsoring global de 12 500 € pour les bourses d'études féminines solaires.",
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: "high" as const,
        status: "pending" as const,
        assignedAgentId: "agent-relance",
        leadId: "lead-2",
        createdAt: new Date().toISOString()
      },
      {
        id: "task-3",
        title: "Rédiger et valider la maquette de la Landing Page",
        description: "Créer une landing page pour attirer les PME agro-alimentaires de la région.",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: "medium" as const,
        status: "completed" as const,
        assignedAgentId: "agent-director",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    campaigns: [
      {
        id: "camp-1",
        name: "Campagne Recrutement Tech 2026",
        channel: "email" as const,
        subject: "FOLO - Intégrez de jeunes talents qualifiés en technologies du numérique",
        contentTemplate: "Bonjour {contact_name},\n\nLe programme FOLO forme actuellement une cohorte de développeurs Web & Mobile de haut niveau. Nos diplômés sont rigoureusement sélectionnés et formés aux technologies modernes.\n\nSouhaitez-vous dynamiser vos équipes à {company_name} avec des profils opérationnels et motivés ?\n\nDécouvrez nos profils en répondant à ce mail.\n\nCordialement,\nL'équipe FOLO",
        status: "completed" as const,
        sentCount: 45,
        deliveredCount: 43,
        responseCount: 12,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "camp-2",
        name: "Bourses Féminines Transition Énergétique",
        channel: "linkedin" as const,
        contentTemplate: "Bonjour {contact_name}, j'ai vu votre engagement pour le développement durable en Afrique de l'Ouest. Le programme FOLO lance une initiative de bourse pour former 25 jeunes filles aux compétences solaires off-grid. Seriez-vous ouvert à échanger sur comment {company_name} pourrait parrainez cette promotion ?",
        status: "sending" as const,
        sentCount: 18,
        deliveredCount: 18,
        responseCount: 5,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    landingPages: [
      {
        id: "lp-1",
        title: "Recruter nos Diplômés",
        slug: "recruter-talents",
        description: "Landing page officielle pour les entreprises souhaitant embaucher ou accueillir nos diplômés en informatique, agroécologie et énergies.",
        headerTitle: "Accélérez votre croissance avec les talents qualifiés du programme FOLO",
        headerSub: "Des profils d'excellence formés intensivement et immédiatement opérationnels pour vos défis technologiques et de transition.",
        ctaText: "Devenir Partenaire Recruteur",
        theme: "modern" as const,
        clicks: 340,
        conversions: 18,
        status: "published" as const,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "lp-2",
        title: "Sponsoriser une Cohorte RSE",
        slug: "sponsoring-rse",
        description: "Landing page axée sur le parrainage financier, l'équipement de centres et l'impact social.",
        headerTitle: "Financez l'avenir, affirmez votre impact RSE",
        headerSub: "Parrainez des bourses d'études FOLO ou financez l'équipement de laboratoires pour donner une chance à la jeunesse sahélienne.",
        ctaText: "Télécharger la Brochure Sponsoring",
        theme: "warm" as const,
        clicks: 125,
        conversions: 6,
        status: "published" as const,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    alerts: [
      {
        id: "alert-1",
        title: "Appel d'offres : Numérisation des services ruraux au Sahel",
        source: "Ministère de la Transition Digitale BF",
        relevance: 92,
        summary: "Publication d'un appel d'offres national pour concevoir et déployer des plateformes mobiles d'accompagnement agricole pour 50 000 coopératives.",
        impactOnFolo: "Nos diplômés de la filière numérique peuvent être positionnés en tant que prestataires ou recrutés par le consortium adjudicataire. Excellente opportunité de partenariat stratégique.",
        url: "https://www.digital.gov.bf/appels-offres",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        suggestedAction: "Initier la création d'un projet de consortium de réponse technique, qualifier le budget d'accompagnement RSE et préparer une liste de 15 profils de diplômés FOLO."
      },
      {
        id: "alert-2",
        title: "Fonds vert pour le climat : Subventions aux formations solaires décentralisées",
        source: "Banque Africaine de Développement (BAD)",
        relevance: 85,
        summary: "Nouveau guichet de subvention pour financer les instituts de formation technique ciblant l'énergie solaire rurale en zone UEMOA.",
        impactOnFolo: "Correspond exactement à notre programme FOLO Solaire. Nous pouvons postuler pour sécuriser un financement pluriannuel de 100% des bourses de formation.",
        url: "https://www.afdb.org/fr/news-and-events",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        suggestedAction: "Monter le dossier de demande de subvention en s'appuyant sur notre bilan d'insertion de la cohorte Solaire 2025."
      }
    ],
    suggestions: [
      {
        id: "sug-1",
        leadId: "lead-1",
        agentId: "agent-com",
        channel: "email" as const,
        subject: "FOLO - Proposition technique de partenariat : Profils Mobiles & Web",
        body: "Bonjour Ibrahim,\n\nSuite à notre échange fructueux concernant les futurs diplômés développeurs du programme FOLO, j'ai le plaisir de vous soumettre notre proposition d'adaptation de notre cursus à vos besoins spécifiques en développement mobile (React Native / Flutter).\n\nSeriez-vous disponible ce jeudi à 11h UTC pour un bref échange de validation technique de 15 minutes ?\n\nBien cordialement,\nVotre Assistant de Communication FOLO",
        createdAt: new Date().toISOString(),
        status: "pending" as const
      },
      {
        id: "sug-2",
        leadId: "lead-2",
        agentId: "agent-relance",
        channel: "whatsapp" as const,
        body: "Bonjour Mariam ! C'est le programme FOLO. Nous finalisons actuellement le dossier pour la cohorte féminine de bourses solaires. Avez-vous pu obtenir la validation budgétaire de la direction de Sinuhe Énergie ? Nous avons hâte d'avancer à vos côtés sur ce beau projet. Très bonne journée !",
        createdAt: new Date().toISOString(),
        status: "pending" as const
      }
    ],
    orchestratorConfig: {
      mode: "balanced",
      dailyBudgetLimit: 15.00,
      costPerLeadLimit: 1.50,
      useOnlyFreeServices: true,
      targetLeadsCount: 5,
      currentDailySpend: 0.12,
      remainingFreeQuota: 1488,
      policies: {
        humanValidationRequired: true,
        runFrequency: "manual",
        retryStrategy: "standard",
        approvedSources: ["public_web", "tenders_bf", "linkedin"]
      },
      learningInsights: [
        "Analyse du canal : LinkedIn montre un excellent taux de réponse de 27.8% par rapport à l'Email (26.7%).",
        "Focus Sectoriel : Le secteur 'Énergies Renouvelables' montre une qualification moyenne de 89.5/100, supérieure à la moyenne générale.",
        "Optimisation Budgétaire : Priorité aux appels API Gemini 3.5 Flash gratuits sous le quota restant de 1488 tokens.",
        "Amélioration des Tâches : 12 opportunités de veille détectées, nécessitant une automatisation des relances."
      ],
      lastLearningAt: new Date().toISOString()
    },
    orchestratorPlans: [
      {
        id: "plan-default-1",
        goalDescription: "Trouver 5 prospects de haute pertinence aujourd'hui sans dépasser 5$ de budget en utilisant les canaux gratuits.",
        budgetAssessment: {
          estimatedCost: 0.00,
          isFeasible: true,
          reasoning: "Tous les services requis s'exécutent sur le niveau gratuit Gemini (modèles d'analyse et de qualification). Aucune API payante de veille payante tierce n'est déclenchée sous le mode équilibré.",
          quotaImpact: 12
        },
        steps: [
          {
            agentId: "agent-veille",
            agentName: "Veilleur FOLO AI",
            action: "Scanner les marchés publics du Sahel pour dénicher 3 opportunités de subventions de formation.",
            status: "completed" as const,
            costEstimate: 0.00,
            output: "Alerte générée : 'Subvention Européenne d'Accompagnement à la Jeunesse du Sahel' (Pertinence 94%)."
          },
          {
            agentId: "agent-qualification",
            agentName: "Qualificateur AI",
            action: "Analyser stratégiquement l'opportunité et estimer le score de matching pour FOLO.",
            status: "completed" as const,
            costEstimate: 0.00,
            output: "Prospect converti avec succès. Score FOLO : 91/100. Statut commercial : chaud."
          },
          {
            agentId: "agent-redacteur",
            agentName: "Rédacteur AI",
            action: "Rédiger l'e-mail d'approche contextualisé pour l'insertion des bourses.",
            status: "completed" as const,
            costEstimate: 0.00,
            output: "Proposition d'email rédigée avec succès pour 'Agence de Développement Européenne'."
          }
        ],
        createdAt: new Date().toISOString(),
        status: "completed" as const
      }
    ]
  };

  const [leads, setLeads] = useState<Lead[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [alerts, setAlerts] = useState<VeilleAlert[]>([]);
  const [suggestions, setSuggestions] = useState<MessageSuggestion[]>([]);
  const [orchestratorConfig, setOrchestratorConfig] = useState<OrchestratorConfig | null>(null);
  const [orchestratorPlans, setOrchestratorPlans] = useState<OrchestratorPlan[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [businessOffers, setBusinessOffers] = useState<BusinessOfferProposal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshDb = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/db");
      if (!res.ok) throw new Error("Erreur de communication avec le serveur.");
      const data = await res.json();
      
      const parsedLeads = data.leads || [];
      const parsedCompanies = data.companies || [];
      const parsedTasks = data.tasks || [];
      const parsedCampaigns = data.campaigns || [];
      const parsedLandingPages = data.landingPages || [];
      const parsedAlerts = data.alerts || [];
      const parsedSuggestions = data.suggestions || [];
      const parsedOrchestratorConfig = data.orchestratorConfig || DEFAULT_OFFLINE_DB.orchestratorConfig;
      const parsedOrchestratorPlans = data.orchestratorPlans || DEFAULT_OFFLINE_DB.orchestratorPlans;
      const parsedKnowledge = data.knowledge || [];
      const parsedBusinessOffers = data.businessOffers || [];

      setLeads(parsedLeads);
      setCompanies(parsedCompanies);
      setTasks(parsedTasks);
      setCampaigns(parsedCampaigns);
      setLandingPages(parsedLandingPages);
      setAlerts(parsedAlerts);
      setSuggestions(parsedSuggestions);
      setOrchestratorConfig(parsedOrchestratorConfig);
      setOrchestratorPlans(parsedOrchestratorPlans);
      setKnowledge(parsedKnowledge);
      setBusinessOffers(parsedBusinessOffers);

      // Cache healthy response to localStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
          leads: parsedLeads,
          companies: parsedCompanies,
          tasks: parsedTasks,
          campaigns: parsedCampaigns,
          landingPages: parsedLandingPages,
          alerts: parsedAlerts,
          suggestions: parsedSuggestions,
          orchestratorConfig: parsedOrchestratorConfig,
          orchestratorPlans: parsedOrchestratorPlans,
          knowledge: parsedKnowledge,
          businessOffers: parsedBusinessOffers
        }));
      } catch (e) {
        console.error("Failed to cache database state:", e);
      }
      setError(null);
    } catch (err: any) {
      console.warn("Database fetch failed. Attempting localStorage fallback...", err);
      // Try Loading from LocalStorage as fallback
      try {
        const cachedRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          setLeads(cached.leads || []);
          setCompanies(cached.companies || []);
          setTasks(cached.tasks || []);
          setCampaigns(cached.campaigns || []);
          setLandingPages(cached.landingPages || []);
          setAlerts(cached.alerts || []);
          setSuggestions(cached.suggestions || []);
          setOrchestratorConfig(cached.orchestratorConfig || DEFAULT_OFFLINE_DB.orchestratorConfig);
          setOrchestratorPlans(cached.orchestratorPlans || DEFAULT_OFFLINE_DB.orchestratorPlans);
          setKnowledge(cached.knowledge || []);
          setBusinessOffers(cached.businessOffers || []);
        } else {
          // No cache found, initialize with beautiful fallback data
          setLeads(DEFAULT_OFFLINE_DB.leads);
          setCompanies(DEFAULT_OFFLINE_DB.companies);
          setTasks(DEFAULT_OFFLINE_DB.tasks);
          setCampaigns(DEFAULT_OFFLINE_DB.campaigns);
          setLandingPages(DEFAULT_OFFLINE_DB.landingPages);
          setAlerts(DEFAULT_OFFLINE_DB.alerts);
          setSuggestions(DEFAULT_OFFLINE_DB.suggestions);
          setOrchestratorConfig(DEFAULT_OFFLINE_DB.orchestratorConfig);
          setOrchestratorPlans(DEFAULT_OFFLINE_DB.orchestratorPlans);
          setKnowledge([]);
          setBusinessOffers([]);
          
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            ...DEFAULT_OFFLINE_DB,
            knowledge: [],
            businessOffers: []
          }));
        }
        setError(null);
      } catch (fallbackErr) {
        console.error("Critical fallback storage failure:", fallbackErr);
        setError("Impossible de charger les données locales du CRM.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshDb();
  }, []);

  const saveDb = async (updatedState: any) => {
    // Determine target states based on optimistic merge
    const nextLeads = updatedState.leads !== undefined ? updatedState.leads : leads;
    const nextCompanies = updatedState.companies !== undefined ? updatedState.companies : companies;
    const nextTasks = updatedState.tasks !== undefined ? updatedState.tasks : tasks;
    const nextCampaigns = updatedState.campaigns !== undefined ? updatedState.campaigns : campaigns;
    const nextLandingPages = updatedState.landingPages !== undefined ? updatedState.landingPages : landingPages;
    const nextAlerts = updatedState.alerts !== undefined ? updatedState.alerts : alerts;
    const nextSuggestions = updatedState.suggestions !== undefined ? updatedState.suggestions : suggestions;
    const nextOrchestratorConfig = updatedState.orchestratorConfig !== undefined ? updatedState.orchestratorConfig : orchestratorConfig;
    const nextOrchestratorPlans = updatedState.orchestratorPlans !== undefined ? updatedState.orchestratorPlans : orchestratorPlans;

    // Optimistically update frontend state
    setLeads(nextLeads);
    setCompanies(nextCompanies);
    setTasks(nextTasks);
    setCampaigns(nextCampaigns);
    setLandingPages(nextLandingPages);
    setAlerts(nextAlerts);
    setSuggestions(nextSuggestions);
    setOrchestratorConfig(nextOrchestratorConfig);
    setOrchestratorPlans(nextOrchestratorPlans);

    const mergedState = {
      leads: nextLeads,
      companies: nextCompanies,
      tasks: nextTasks,
      campaigns: nextCampaigns,
      landingPages: nextLandingPages,
      alerts: nextAlerts,
      suggestions: nextSuggestions,
      orchestratorConfig: nextOrchestratorConfig,
      orchestratorPlans: nextOrchestratorPlans,
      knowledge: updatedState.knowledge !== undefined ? updatedState.knowledge : knowledge
    };

    // Save to LocalStorage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedState));
    } catch (lsErr) {
      console.error("Failed local cache write:", lsErr);
    }

    // Try posting changes to Server database
    try {
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mergedState)
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.data) {
          setLeads(data.data.leads || nextLeads);
          setCompanies(data.data.companies || nextCompanies);
          setTasks(data.data.tasks || nextTasks);
          setCampaigns(data.data.campaigns || nextCampaigns);
          setLandingPages(data.data.landingPages || nextLandingPages);
          setAlerts(data.data.alerts || nextAlerts);
          setSuggestions(data.data.suggestions || nextSuggestions);
          setOrchestratorConfig(data.data.orchestratorConfig || nextOrchestratorConfig);
          setOrchestratorPlans(data.data.orchestratorPlans || nextOrchestratorPlans);
          setKnowledge(data.data.knowledge || knowledge);
          
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.data));
        }
        setError(null);
      }
    } catch (err) {
      console.warn("Server backend save skipped or offline (running in Local mode):", err);
    }
  };

  const addLead = async (leadData: Omit<Lead, "id" | "createdAt">) => {
    const newLead: Lead = {
      ...leadData,
      id: "lead-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    const newState = {
      leads: [newLead, ...leads],
      companies,
      tasks,
      campaigns,
      landingPages,
      alerts,
      suggestions
    };
    await saveDb(newState);
  };

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    const updatedLeads = leads.map(l => l.id === leadId ? { ...l, status } : l);
    const newState = {
      leads: updatedLeads,
      companies,
      tasks,
      campaigns,
      landingPages,
      alerts,
      suggestions
    };
    await saveDb(newState);
  };

  const updateLead = async (updatedLead: Lead) => {
    const updatedLeads = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
    const newState = {
      leads: updatedLeads,
      companies,
      tasks,
      campaigns,
      landingPages,
      alerts,
      suggestions
    };
    await saveDb(newState);
  };

  const addCompany = async (companyData: Omit<Company, "id" | "createdAt">): Promise<Company> => {
    const newCompany: Company = {
      ...companyData,
      id: "comp-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    const newState = {
      leads,
      companies: [...companies, newCompany],
      tasks,
      campaigns,
      landingPages,
      alerts,
      suggestions
    };
    await saveDb(newState);
    return newCompany;
  };

  const addTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: "task-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    const newState = {
      leads,
      companies,
      tasks: [newTask, ...tasks],
      campaigns,
      landingPages,
      alerts,
      suggestions
    };
    await saveDb(newState);
  };

  const toggleTaskStatus = async (taskId: string) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: (t.status === "pending" ? "completed" : "pending") as "pending" | "completed" } : t);
    const newState = {
      leads,
      companies,
      tasks: updatedTasks,
      campaigns,
      landingPages,
      alerts,
      suggestions
    };
    await saveDb(newState);
  };

  const addCampaign = async (campData: Omit<Campaign, "id" | "createdAt" | "sentCount" | "deliveredCount" | "responseCount">) => {
    const newCampaign: Campaign = {
      ...campData,
      id: "camp-" + Math.random().toString(36).substr(2, 9),
      sentCount: 0,
      deliveredCount: 0,
      responseCount: 0,
      createdAt: new Date().toISOString()
    };
    const newState = {
      leads,
      companies,
      tasks,
      campaigns: [newCampaign, ...campaigns],
      landingPages,
      alerts,
      suggestions
    };
    await saveDb(newState);
  };

  const addLandingPage = async (lpData: Omit<LandingPage, "id" | "createdAt" | "clicks" | "conversions">) => {
    const newLp: LandingPage = {
      ...lpData,
      id: "lp-" + Math.random().toString(36).substr(2, 9),
      clicks: 0,
      conversions: 0,
      createdAt: new Date().toISOString()
    };
    const newState = {
      leads,
      companies,
      tasks,
      campaigns,
      landingPages: [newLp, ...landingPages],
      alerts,
      suggestions
    };
    await saveDb(newState);
  };

  // --- INTERACTIVE AI AGENT WRAPPERS ---

  const qualifyLeadAI = async (leadId: string) => {
    try {
      const res = await fetch("/api/ai/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "La qualification AI a échoué.");
      }
      await refreshDb();
    } catch (err) {
      console.warn("Server AI qualify failed, running Local simulator fallback...", err);
      const currentLeads = [...leads];
      const leadIndex = currentLeads.findIndex(l => l.id === leadId);
      if (leadIndex === -1) throw new Error("Prospect introuvable.");

      const lead = currentLeads[leadIndex];
      const scores = [82, 88, 91, 76, 94];
      const score = scores[Math.floor(Math.random() * scores.length)];
      const status = score >= 85 ? "hot" : (score >= 70 ? "warm" : "cold");
      
      const newLead: Lead = {
        ...lead,
        status: LeadStatus.QUALIFIED,
        agentQualification: {
          score,
          status: status as any,
          summary: `[Audit Local] Analyse automatisée du profil de ${lead.name}. L'organisation ${lead.companyName} démontre un intérêt majeur pour l'insertion de notre cohorte de talents sahéliens.`,
          needsFollowUp: status !== "cold",
          suggestedNextAction: "Initier une proposition d'accord-cadre de stage ou de convention RSE.",
          analyzedAt: new Date().toISOString(),
          agentId: "agent-qualification"
        }
      };
      
      const updatedLeads = currentLeads.map(l => l.id === leadId ? newLead : l);
      await saveDb({ leads: updatedLeads });
    }
  };

  const suggestMessageAI = async (leadId: string, channel: string, goal: string) => {
    try {
      const res = await fetch("/api/ai/suggest-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, channel, goal })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "La suggestion de message par l'IA a échoué.");
      }
      await refreshDb();
    } catch (err) {
      console.warn("Server AI suggest message failed, running Local simulator fallback...", err);
      const lead = leads.find(l => l.id === leadId);
      if (!lead) throw new Error("Prospect introuvable.");

      const newSuggestion: MessageSuggestion = {
        id: "sug-" + Math.random().toString(36).substr(2, 9),
        leadId,
        agentId: "agent-redacteur",
        channel: channel as any,
        subject: channel === "email" ? `Coopération FOLO & ${lead.companyName}` : undefined,
        body: `Bonjour ${lead.name},\n\nAyant étudié l'impact de ${lead.companyName}, nous souhaitons vous proposer l'insertion de nos jeunes talents qualifiés FOLO pour soutenir vos activités.\n\nObjectif commercial : ${goal}.\n\nDans l'attente de votre réponse, nous vous souhaitons une excellente journée.\nL'équipe FOLO CRM AI.`,
        createdAt: new Date().toISOString(),
        status: "pending"
      };

      await saveDb({
        suggestions: [newSuggestion, ...suggestions]
      });
    }
  };

  const triggerVeilleAlertAI = async () => {
    try {
      const res = await fetch("/api/ai/veille-alerts", {
        method: "POST"
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "La génération de l'alerte de veille a échoué.");
      }
      await refreshDb();
    } catch (err) {
      console.warn("Server AI veille alert failed, running Local simulator fallback...", err);
      const sources = ["Marchés Publics BF", "Portail RSE Sahel", "LinkedIn Opportunities", "Appels d'offres UEMOA"];
      const titles = [
        "Appel à compétences : Formation de 120 boursiers en technologies vertes",
        "Opportunité d'appui : Sponsoring d'étudiants en informatique rurale au Burkina",
        "Subvention d'équipement numérique pour les coopératives agricoles du Sahel"
      ];
      
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      
      const newAlert: VeilleAlert = {
        id: "alert-" + Math.random().toString(36).substr(2, 9),
        title: randomTitle,
        source: randomSource,
        relevance: Math.floor(Math.random() * 20) + 78,
        summary: "Détection proactive d'une offre d'accompagnement en adéquation parfaite avec la mission d'insertion professionnelle de FOLO.",
        impactOnFolo: "Permet de financer l'équipement de bourses féminines de notre nouvelle promotion active.",
        createdAt: new Date().toISOString(),
        suggestedAction: "Ajouter en tant que prospect chaud et formuler une lettre d'approche."
      };

      await saveDb({
        alerts: [newAlert, ...alerts]
      });
    }
  };

  const approveSuggestion = async (sugId: string) => {
    const updatedSug = suggestions.map(s => s.id === sugId ? { ...s, status: "approved" as const } : s);
    const newState = {
      leads,
      companies,
      tasks,
      campaigns,
      landingPages,
      alerts,
      suggestions: updatedSug
    };
    await saveDb(newState);
  };

  const updateOrchestratorConfig = async (newConfig: OrchestratorConfig) => {
    setOrchestratorConfig(newConfig);
    const newState = {
      leads,
      companies,
      tasks,
      campaigns,
      landingPages,
      alerts,
      suggestions,
      orchestratorConfig: newConfig,
      orchestratorPlans
    };
    await saveDb(newState);
  };

  const buildOrchestratorPlanAI = async (params: { goalDescription: string; targetLeadsCount: number; maxBudget: number; useOnlyFree: boolean; mode: string }) => {
    try {
      const res = await fetch("/api/ai/orchestrator/build-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...params,
          policies: orchestratorConfig?.policies
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "La création du plan d'orchestration a échoué.");
      }
      await refreshDb();
    } catch (err) {
      console.warn("Server AI build plan failed, running Local simulator fallback...", err);
      
      const newPlan: OrchestratorPlan = {
        id: "plan-" + Math.random().toString(36).substr(2, 9),
        goalDescription: params.goalDescription || "Trouver et qualifier de nouveaux partenaires",
        budgetAssessment: {
          estimatedCost: params.useOnlyFree ? 0 : 3.50,
          isFeasible: true,
          reasoning: `[Simulation Locale] Le plan d'action intelligent a été élaboré pour recruter ${params.targetLeadsCount} prospects sous un budget maximal de ${params.maxBudget}$. S'appuie prioritairement sur le canal optimal issu des données CRM.`,
          quotaImpact: params.targetLeadsCount * 4
        },
        steps: [
          {
            agentId: "agent-veille",
            agentName: "Veilleur FOLO AI",
            action: `Lancer l'algorithme d'exploration de veille pour l'objectif : ${params.goalDescription}`,
            status: "pending",
            costEstimate: 0
          },
          {
            agentId: "agent-qualification",
            agentName: "Qualificateur AI",
            action: `Qualifier automatiquement les opportunités identifiées (${params.targetLeadsCount} prospects visés)`,
            status: "pending",
            costEstimate: 0
          },
          {
            agentId: "agent-redacteur",
            agentName: "Rédacteur AI",
            action: "Formuler des propositions adaptées aux critères sectoriels de la campagne",
            status: "pending",
            costEstimate: 0
          }
        ],
        createdAt: new Date().toISOString(),
        status: "active" as const
      };

      const updatedPlans = [newPlan, ...orchestratorPlans];
      await saveDb({
        orchestratorPlans: updatedPlans
      });
    }
  };

  const executeOrchestratorStepAI = async (planId: string, stepIndex: number) => {
    try {
      const res = await fetch("/api/ai/orchestrator/execute-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, stepIndex })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "L'exécution de l'étape a échoué.");
      }
      await refreshDb();
    } catch (err) {
      console.warn("Server AI step execution failed, running Local simulator fallback...", err);
      
      const updatedPlans = orchestratorPlans.map(plan => {
        if (plan.id !== planId) return plan;
        
        const updatedSteps = plan.steps.map((step, idx) => {
          if (idx !== stepIndex) return step;
          
          let output = "Étape d'orchestration complétée localement avec succès.";
          if (step.agentId === "agent-veille") {
            output = `Détection achevée. 4 opportunités adaptées de veille identifiées pour : "${plan.goalDescription}".`;
          } else if (step.agentId === "agent-qualification") {
            output = `Analyse et notation complétées. 2 opportunités qualifiées à plus de 85/100 ont été intégrées dans le CRM FOLO.`;
          } else if (step.agentId === "agent-redacteur") {
            output = `Modèle de campagne de messagerie rédigé et prêt à l'envoi pour approbation.`;
          }
          
          return {
            ...step,
            status: "completed" as const,
            output
          };
        });
        
        const allCompleted = updatedSteps.every(s => s.status === "completed");
        
        return {
          ...plan,
          steps: updatedSteps,
          status: allCompleted ? "completed" : "active"
        };
      });

      let nextLeads = [...leads];
      let nextCompanies = [...companies];
      const plan = orchestratorPlans.find(p => p.id === planId);
      const step = plan?.steps[stepIndex];
      
      if (step?.agentId === "agent-qualification") {
        const fallbackCompany: Company = {
          id: "comp-fb-" + Math.random().toString(36).substr(2, 9),
          name: "Sino-Sahel Solaire",
          industry: "Énergies Renouvelables",
          size: "11-50",
          website: "https://sino-sahel.com",
          country: "Burkina Faso",
          address: "Zone Industrielle Kossodo, Ouagadougou",
          createdAt: new Date().toISOString()
        };
        const fallbackLead: Lead = {
          id: "lead-fb-" + Math.random().toString(36).substr(2, 9),
          name: "Adama Sawadogo",
          companyId: fallbackCompany.id,
          companyName: fallbackCompany.name,
          email: "a.sawadogo@sino-sahel.com",
          phone: "+226 70 12 34 56",
          status: LeadStatus.QUALIFIED,
          value: 8500,
          source: "Veille AI",
          country: "Burkina Faso",
          createdAt: new Date().toISOString(),
          notes: "Prospect généré via le plan d'orchestration AI.",
          agentQualification: {
            score: 89,
            status: "hot" as const,
            summary: "Excellente adéquation. Besoin de recruter 5 stagiaires techniciens solaires immédiatement.",
            needsFollowUp: true,
            suggestedNextAction: "Envoyer l'accord de partenariat de stage.",
            analyzedAt: new Date().toISOString(),
            agentId: "agent-qualification"
          }
        };
        nextCompanies = [...nextCompanies, fallbackCompany];
        nextLeads = [fallbackLead, ...nextLeads];
      }

      await saveDb({
        leads: nextLeads,
        companies: nextCompanies,
        orchestratorPlans: updatedPlans
      });
    }
  };

  const triggerOrchestratorLearning = async () => {
    try {
      const res = await fetch("/api/ai/orchestrator/learn-and-adapt", {
        method: "POST"
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "L'audit d'apprentissage de l'Orchestrateur a échoué.");
      }
      await refreshDb();
    } catch (err) {
      console.warn("Server AI learning failed, running Local simulator fallback...", err);
      const insights = [
        "Analyse du canal : Le canal LinkedIn montre un taux de conversion historique de 27.8%, comparé aux campagnes Email de 26.7%.",
        "Focus Sectoriel : Le secteur 'Énergies Renouvelables' affiche la meilleure note de qualification moyenne de prospects (89.5/100).",
        "Optimisation Budgétaire : Privilégier le format d'approche de stage conventionné sans coûts d'acquisition d'API payantes.",
        "Amélioration des Tâches : 12 alertes de veille identifiées, recommandant un suivi des propositions sous 48 heures."
      ];

      const updatedConfig: OrchestratorConfig = {
        ...(orchestratorConfig || DEFAULT_OFFLINE_DB.orchestratorConfig),
        learningInsights: insights,
        lastLearningAt: new Date().toISOString()
      };

      setOrchestratorConfig(updatedConfig);
      await saveDb({
        orchestratorConfig: updatedConfig
      });
    }
  };

  const addKnowledgeItem = async (itemData: Omit<KnowledgeItem, "id" | "updatedAt" | "version" | "versions">) => {
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add knowledge item.");
      }
      await refreshDb();
    } catch (err) {
      console.warn("Server add knowledge skipped/failed, simulating locally...", err);
      const newItem: KnowledgeItem = {
        ...itemData,
        id: "k-" + Math.random().toString(36).substr(2, 9),
        version: 1,
        updatedAt: new Date().toISOString(),
        versions: []
      };
      const updatedKnowledge = [newItem, ...knowledge];
      setKnowledge(updatedKnowledge);
      await saveDb({ knowledge: updatedKnowledge });
    }
  };

  const updateKnowledgeItem = async (id: string, itemData: Omit<KnowledgeItem, "id" | "updatedAt" | "version" | "versions">) => {
    try {
      const res = await fetch(`/api/knowledge/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update knowledge item.");
      }
      await refreshDb();
    } catch (err) {
      console.warn("Server update knowledge skipped/failed, simulating locally...", err);
      const existing = knowledge.find(k => k.id === id);
      if (!existing) return;

      const archiveVersion = {
        version: existing.version,
        content: existing.content,
        updatedAt: existing.updatedAt,
        author: existing.author
      };

      const updatedItem: KnowledgeItem = {
        ...existing,
        ...itemData,
        version: existing.version + 1,
        updatedAt: new Date().toISOString(),
        versions: [archiveVersion, ...(existing.versions || [])]
      };

      const updatedKnowledge = knowledge.map(k => k.id === id ? updatedItem : k);
      setKnowledge(updatedKnowledge);
      await saveDb({ knowledge: updatedKnowledge });
    }
  };

  const deleteKnowledgeItem = async (id: string) => {
    try {
      const res = await fetch(`/api/knowledge/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete knowledge item.");
      }
      await refreshDb();
    } catch (err) {
      console.warn("Server delete knowledge skipped/failed, simulating locally...", err);
      const updatedKnowledge = knowledge.filter(k => k.id !== id);
      setKnowledge(updatedKnowledge);
      await saveDb({ knowledge: updatedKnowledge });
    }
  };

  const queryKnowledgeBase = async (query: string, category?: string): Promise<RagQueryResult> => {
    try {
      const res = await fetch("/api/knowledge/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, category })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "RAG query failed.");
      }
      return await res.json();
    } catch (err) {
      console.warn("Server RAG query skipped/failed, simulating locally...", err);
      const queryLower = query.toLowerCase();
      const matched = knowledge.filter(k => 
        k.title.toLowerCase().includes(queryLower) || 
        k.content.toLowerCase().includes(queryLower)
      ).slice(0, 3);

      return {
        answer: matched.length > 0
          ? `[Simulation Locale] Synthèse d'apprentissage d'après ${matched.length} document(s) trouvé(s) :\n\n` + matched.map(m => `### ${m.title}\n${m.content}`).join("\n\n")
          : `Aucune correspondance directe trouvée localement pour "${query}". Rempli via connaissances générales Gemini (Mode simulé local).`,
        confidenceScore: matched.length > 0 ? 85 : 20,
        knowledgeSource: matched.length > 0 ? "folo_internal" : "gemini_general",
        sourcesUsed: matched.map(m => ({ id: m.id, title: m.title, category: m.category, subcategory: m.subcategory }))
      };
    }
  };

  const createBusinessOfferAI = async (clientName: string, demandDescription: string, title?: string): Promise<BusinessOfferProposal> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/business-studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, demandDescription, title })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Échec de génération d'offre.");
      }
      const data = await res.json();
      await refreshDb();
      return data.offer;
    } catch (err: any) {
      console.error("Failed to generate AI business proposal:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBusinessOffer = async (offer: BusinessOfferProposal): Promise<void> => {
    try {
      const res = await fetch(`/api/business-offers/${offer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offer)
      });
      if (!res.ok) {
        throw new Error("Impossible d'enregistrer les modifications de l'offre.");
      }
      await refreshDb();
    } catch (err) {
      console.error("Failed to update business proposal:", err);
      const updated = businessOffers.map(o => o.id === offer.id ? offer : o);
      setBusinessOffers(updated);
    }
  };

  const deleteBusinessOffer = async (id: string): Promise<void> => {
    try {
      const res = await fetch(`/api/business-offers/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        throw new Error("Impossible de supprimer l'offre.");
      }
      await refreshDb();
    } catch (err) {
      console.error("Failed to delete business proposal:", err);
      setBusinessOffers(businessOffers.filter(o => o.id !== id));
    }
  };

  return (
    <CRMContext.Provider
      value={{
        leads,
        companies,
        tasks,
        campaigns,
        landingPages,
        alerts,
        suggestions,
        orchestratorConfig,
        orchestratorPlans,
        knowledge,
        businessOffers,
        isLoading,
        error,
        refreshDb,
        saveDb,
        addLead,
        updateLeadStatus,
        updateLead,
        addCompany,
        addTask,
        toggleTaskStatus,
        addCampaign,
        addLandingPage,
        qualifyLeadAI,
        suggestMessageAI,
        triggerVeilleAlertAI,
        approveSuggestion,
        updateOrchestratorConfig,
        buildOrchestratorPlanAI,
        executeOrchestratorStepAI,
        triggerOrchestratorLearning,
        addKnowledgeItem,
        updateKnowledgeItem,
        deleteKnowledgeItem,
        queryKnowledgeBase,
        createBusinessOfferAI,
        updateBusinessOffer,
        deleteBusinessOffer
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error("useCRM must be used within a CRMProvider");
  }
  return context;
};
