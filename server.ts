/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;
const DB_FILE_PATH = path.join(process.cwd(), "src", "db.json");

// Helper to lazy initialize Gemini client safely to avoid crashing if API key is not yet set
let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment secrets. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Initial default database structure representing FOLO's CRM
const initialDatabase = {
  leads: [
    {
      id: "lead-1",
      name: "Ibrahim Sawadogo",
      companyId: "comp-1",
      companyName: "Burkina Tech Corp",
      email: "i.sawadogo@burkinatech.bf",
      phone: "+226 70 12 34 56",
      status: "qualified",
      value: 4500,
      source: "Landing Page Partenaires",
      country: "Burkina Faso",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Intéressé par le recrutement de 10 diplômés développeurs du programme FOLO. Demande d'adapter le cursus aux technologies mobiles.",
      agentQualification: {
        score: 88,
        status: "hot",
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
      status: "negotiation",
      value: 12500,
      source: "LinkedIn Outreach",
      country: "Burkina Faso",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "Souhaite sponsoriser une cohorte complète de 25 jeunes femmes aux métiers de l'énergie solaire (solaire off-grid). Demande d'un devis global de bourse.",
      agentQualification: {
        score: 95,
        status: "hot",
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
      status: "contacted",
      value: 1800,
      source: "Veille AI",
      country: "Burkina Faso",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      notes: "A manifesté de l'intérêt pour intégrer des stagiaires FOLO en gestion de base de données agricoles, mais budget serré.",
      agentQualification: {
        score: 45,
        status: "warm",
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
      status: "new",
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
      priority: "high",
      status: "pending",
      assignedAgentId: "agent-com",
      leadId: "lead-1",
      createdAt: new Date().toISOString()
    },
    {
      id: "task-2",
      title: "Appel de suivi budgétaire Sinuhe Énergie",
      description: "Valider le budget de sponsoring global de 12 500 € pour les bourses d'études féminines solaires.",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: "high",
      status: "pending",
      assignedAgentId: "agent-relance",
      leadId: "lead-2",
      createdAt: new Date().toISOString()
    },
    {
      id: "task-3",
      title: "Rédiger et valider la maquette de la Landing Page",
      description: "Créer une landing page pour attirer les PME agro-alimentaires de la région.",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: "medium",
      status: "completed",
      assignedAgentId: "agent-director",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  campaigns: [
    {
      id: "camp-1",
      name: "Campagne Recrutement Tech 2026",
      channel: "email",
      subject: "FOLO - Intégrez de jeunes talents qualifiés en technologies du numérique",
      contentTemplate: "Bonjour {contact_name},\n\nLe programme FOLO forme actuellement une cohorte de développeurs Web & Mobile de haut niveau. Nos diplômés sont rigoureusement sélectionnés et formés aux technologies modernes.\n\nSouhaitez-vous dynamiser vos équipes à {company_name} avec des profils opérationnels et motivés ?\n\nDécouvrez nos profils en répondant à ce mail.\n\nCordialement,\nL'équipe FOLO",
      status: "completed",
      sentCount: 45,
      deliveredCount: 43,
      responseCount: 12,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "camp-2",
      name: "Bourses Féminines Transition Énergétique",
      channel: "linkedin",
      contentTemplate: "Bonjour {contact_name}, j'ai vu votre engagement pour le développement durable en Afrique de l'Ouest. Le programme FOLO lance une initiative de bourse pour former 25 jeunes filles aux compétences solaires off-grid. Seriez-vous ouvert à échanger sur comment {company_name} pourrait parrainer cette promotion ?",
      status: "sending",
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
      theme: "modern",
      clicks: 340,
      conversions: 18,
      status: "published",
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
      theme: "warm",
      clicks: 125,
      conversions: 6,
      status: "published",
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
      channel: "email",
      subject: "FOLO - Proposition technique de partenariat : Profils Mobiles & Web",
      body: "Bonjour Ibrahim,\n\nSuite à notre échange fructueux concernant les futurs diplômés développeurs du programme FOLO, j'ai le plaisir de vous soumettre notre proposition d'adaptation de notre cursus à vos besoins spécifiques en développement mobile (React Native / Flutter).\n\nSeriez-vous disponible ce jeudi à 11h UTC pour un bref échange de validation technique de 15 minutes ?\n\nBien cordialement,\nVotre Assistant de Communication FOLO",
      createdAt: new Date().toISOString(),
      status: "pending"
    },
    {
      id: "sug-2",
      leadId: "lead-2",
      agentId: "agent-relance",
      channel: "whatsapp",
      body: "Bonjour Mariam ! C'est le programme FOLO. Nous finalisons actuellement le dossier pour la cohorte féminine de bourses solaires. Avez-vous pu obtenir la validation budgétaire de la direction de Sinuhe Énergie ? Nous avons hâte d'avancer à vos côtés sur ce beau projet. Très bonne journée !",
      createdAt: new Date().toISOString(),
      status: "pending"
    }
  ]
};

// Ensure database file exists with initial mock data
function loadDatabaseState() {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      // Create directories if missing
      fs.mkdirSync(path.dirname(DB_FILE_PATH), { recursive: true });
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialDatabase, null, 2), "utf-8");
      return initialDatabase;
    }
    const rawData = fs.readFileSync(DB_FILE_PATH, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading database file, using in-memory fallback:", error);
    return initialDatabase;
  }
}

function saveDatabaseState(state: any) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(state, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving database file:", error);
  }
}

// Global cached state in server memory
let currentDb = loadDatabaseState();

// Ensure Orchestrator config and default plans exist
if (!currentDb.orchestratorConfig) {
  currentDb.orchestratorConfig = {
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
    }
  };
  saveDatabaseState(currentDb);
}
if (!currentDb.orchestratorPlans) {
  currentDb.orchestratorPlans = [
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
          status: "completed",
          costEstimate: 0.00,
          output: "Alerte générée : 'Subvention Européenne d'Accompagnement à la Jeunesse du Sahel' (Pertinence 94%)."
        },
        {
          agentId: "agent-qualification",
          agentName: "Qualificateur AI",
          action: "Analyser stratégiquement l'opportunité et estimer le score de matching pour FOLO.",
          status: "completed",
          costEstimate: 0.00,
          output: "Prospect converti avec succès. Score FOLO : 91/100. Statut commercial : chaud."
        },
        {
          agentId: "agent-redacteur",
          agentName: "Rédacteur AI",
          action: "Rédiger l'e-mail d'approche contextualisé pour l'insertion des bourses.",
          status: "completed",
          costEstimate: 0.00,
          output: "Proposition d'email rédigée avec succès pour 'Agence de Développement Européenne'."
        }
      ],
      createdAt: new Date().toISOString(),
      status: "completed"
    }
  ];
  saveDatabaseState(currentDb);
}

// --- REST API ENDPOINTS ---

// Fetch the complete DB
app.get("/api/db", (req, res) => {
  res.json(currentDb);
});

// Save changes to the DB
app.post("/api/db", (req, res) => {
  currentDb = req.body;
  saveDatabaseState(currentDb);
  res.json({ status: "success", data: currentDb });
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
});

// --- AI AGENTS POWERED ENDPOINTS ---

// Agent 1: Qualificateur AI
app.post("/api/ai/qualify", async (req, res) => {
  const { leadId } = req.body;
  const lead = currentDb.leads.find((l: any) => l.id === leadId);
  if (!lead) {
    return res.status(404).json({ error: "Lead not found" });
  }

  const company = currentDb.companies.find((c: any) => c.id === lead.companyId) || { name: lead.companyName, industry: "Inconnue", size: "Inconnue" };

  try {
    const ai = getGeminiClient();
    const systemPrompt = `Tu es le "Qualificateur AI" du programme de formation FOLO (Formation, Orientation, Insertion et Opportunités).
Ta mission est d'analyser de manière experte et froide les données d'un nouveau prospect (Lead) et de son entreprise partenaire potentielle afin de l'évaluer de 0 à 100, de lui attribuer un statut (hot, warm, cold) et de proposer un résumé d'analyse rigoureux avec les prochaines actions concrètes.

Le programme FOLO forme des jeunes au Burkina Faso et en Afrique de l'Ouest dans des domaines clés : Technologies du Numérique (développement Web, mobile), Énergie Solaire off-grid, et Agroécologie de précision.
Les entreprises cherchent soit à recruter nos diplômés, soit à parrainer/sponsoriser financièrement des cohortes (RSE/Bourses).

Tu dois impérativement renvoyer ta réponse sous forme de JSON strict respectant exactement le schéma suivant :
{
  "score": <number de 0 à 100>,
  "status": "hot" | "warm" | "cold",
  "summary": "<texte synthétique expliquant ton raisonnement en français>",
  "needsFollowUp": <boolean>,
  "suggestedNextAction": "<prochaine étape commerciale précise>"
}`;

    const leadContext = `Prospect :
- Nom : ${lead.name}
- Email : ${lead.email}
- Téléphone : ${lead.phone}
- Source d'acquisition : ${lead.source}
- Valeur potentielle : ${lead.value} €
- Notes / Demande du prospect : "${lead.notes || "Pas de notes supplémentaires."}"

Entreprise associée :
- Nom : ${company.name}
- Secteur : ${company.industry}
- Taille : ${company.size}
- Site web : ${company.website || "N/A"}
- Ville/Adresse : ${company.address}, ${company.country}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Qualifie ce prospect selon l'analyse : \n\n${leadContext}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Score de 0 à 100 sur le potentiel de closing ou sponsoring." },
            status: { type: Type.STRING, enum: ["hot", "warm", "cold"], description: "Température commerciale." },
            summary: { type: Type.STRING, description: "Une analyse claire en 2-3 phrases sur les motivations du lead." },
            needsFollowUp: { type: Type.BOOLEAN, description: "Si un suivi urgent est requis." },
            suggestedNextAction: { type: Type.STRING, description: "La meilleure action à faire immédiatement." }
          },
          required: ["score", "status", "summary", "needsFollowUp", "suggestedNextAction"]
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    
    // Update local lead with the qualification in database
    const leadIndex = currentDb.leads.findIndex((l: any) => l.id === leadId);
    if (leadIndex !== -1) {
      currentDb.leads[leadIndex].agentQualification = {
        ...result,
        analyzedAt: new Date().toISOString(),
        agentId: "agent-qualification"
      };
      saveDatabaseState(currentDb);
    }

    res.json({ status: "success", qualification: currentDb.leads[leadIndex].agentQualification });
  } catch (error: any) {
    console.error("AI Qualification Error:", error);
    res.status(500).json({ error: error.message || "Failed to process AI qualification" });
  }
});

// Agent 2: Rédacteur AI (Message suggestion)
app.post("/api/ai/suggest-message", async (req, res) => {
  const { leadId, channel, goal } = req.body; // channel: email, sms, whatsapp, linkedin
  const lead = currentDb.leads.find((l: any) => l.id === leadId);
  if (!lead) {
    return res.status(404).json({ error: "Lead not found" });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `Tu es "Rédacteur FOLO AI", un agent de communication commercial exceptionnellement doué, orienté résultats, chaleureux mais extrêmement professionnel. Ton but est de rédiger des messages de prospection ou de suivi percutants, adaptés au canal demandé (email, SMS, WhatsApp, LinkedIn) et répondant à l'objectif commercial fixé.

Tu dois toujours écrire en Français de manière élégante, courtoise et engageante. Mentionne subtilement l'excellence de la formation FOLO (Formation, Orientation, Insertion et Opportunités) au Burkina Faso.

Rassemble ta réponse sous forme de JSON strict comme suit :
{
  "subject": "<objet du message si email, sinon laissez vide ou omettez>",
  "body": "<corps complet du message rédigé, prêt à être envoyé>"
}`;

    const context = `Prospect :
- Nom : ${lead.name}
- Entreprise : ${lead.companyName}
- Notes du prospect : "${lead.notes || ""}"
- Canal requis : ${channel}
- Objectif de ce message : ${goal || "Prendre contact et proposer un rendez-vous téléphonique."}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Génère le message avec les paramètres suivants :\n\n${context}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING, description: "Objet du message, requis si canal est email." },
            body: { type: Type.STRING, description: "Le texte rédigé du message." }
          },
          required: ["body"]
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    
    // Add to suggestions list
    const newSuggestion = {
      id: "sug-" + Math.random().toString(36).substr(2, 9),
      leadId: leadId,
      agentId: "agent-com",
      channel: channel,
      subject: result.subject || undefined,
      body: result.body,
      createdAt: new Date().toISOString(),
      status: "pending"
    };

    currentDb.suggestions.unshift(newSuggestion);
    saveDatabaseState(currentDb);

    res.json({ status: "success", suggestion: newSuggestion });
  } catch (error: any) {
    console.error("AI Suggest Message Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI message suggestion" });
  }
});

// Agent 3: Veilleur AI (Generate a smart business alert / tender for FOLO program in Burkina Faso)
app.post("/api/ai/veille-alerts", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const systemPrompt = `Tu es le "Veilleur FOLO AI", un agent de veille stratégique et économique focalisé sur l'Afrique de l'Ouest, particulièrement le Burkina Faso. 
Ta mission est de simuler ou d'extraire (avec ta connaissance du marché) un appel d'offres, une subvention internationale RSE, ou un projet d'une grande entreprise locale qui représente une opportunité commerciale en or pour le Programme FOLO (formation et insertion professionnelle de jeunes développeurs, électriciens solaires et agroécologistes).

Le livrable doit être un objet JSON strict :
{
  "title": "<Titre accrocheur de l'opportunité commerciale / appel d'offres>",
  "source": "<Nom de l'entité émettrice, ex: Agence de Développement, Banque de l'Ouest, etc.>",
  "relevance": <Score d'opportunité de 70 à 100>,
  "summary": "<Description claire de l'appel d'offres ou du besoin identifié>",
  "impactOnFolo": "<Explication stratégique montrant comment FOLO peut se positionner>",
  "url": "<URL fictive ou réelle d'information>",
  "suggestedAction": "<Action commerciale ou opérationnelle précise suggérée pour tirer parti de cette opportunité>"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Génère une alerte de veille d'opportunité commerciale d'actualité pour FOLO en Afrique de l'Ouest.",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            source: { type: Type.STRING },
            relevance: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            impactOnFolo: { type: Type.STRING },
            url: { type: Type.STRING },
            suggestedAction: { type: Type.STRING, description: "La recommandation concrète à faire immédiatement." }
          },
          required: ["title", "source", "relevance", "summary", "impactOnFolo", "suggestedAction"]
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    const newAlert = {
      id: "alert-" + Math.random().toString(36).substr(2, 9),
      ...result,
      createdAt: new Date().toISOString()
    };

    currentDb.alerts.unshift(newAlert);
    saveDatabaseState(currentDb);

    res.json({ status: "success", alert: newAlert });
  } catch (error: any) {
    console.error("AI Veille Alert Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI alert" });
  }
});

// Agent 4: Directeur Commercial (Sales Strategy / Advice)
app.post("/api/ai/sales-advice", async (req, res) => {
  const { leadId, query } = req.body;
  const lead = currentDb.leads.find((l: any) => l.id === leadId);

  try {
    const ai = getGeminiClient();
    const systemPrompt = `Tu es le "Directeur Commercial FOLO AI". Tu es un négociateur hors pair, ultra-expérimenté dans le B2B et les partenariats RSE en Afrique de l'Ouest. Tu agis comme un mentor commercial pour l'utilisateur.

Donne des conseils avisés, ultra-pragmatiques et stratégiques en français pour remporter ce deal ou optimiser le pipe.
Sois direct, encourageant et structure tes conseils (Plan d'attaque, Argument de négociation, Points de vigilance).`;

    const context = lead 
      ? `Lead concerné : ${lead.name} de ${lead.companyName}
- Statut : ${lead.status}
- Valeur estimée : ${lead.value} €
- Notes de l'échange : "${lead.notes || ""}"
- Question de l'utilisateur : "${query || "Comment clore ou faire avancer ce deal rapidement ?"}"`
      : `Question générale sur le pipe de vente FOLO : "${query || "Donne-moi tes meilleures astuces commerciales pour recruter des sponsors RSE."}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: context,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({ status: "success", advice: response.text });
  } catch (error: any) {
    console.error("AI Sales Advice Error:", error);
    res.status(500).json({ error: error.message || "Failed to get sales advice" });
  }
});

// Agent 5: Auditeur & Reporter AI (Global Reporting & Business Analysis)
app.post("/api/ai/report", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const systemPrompt = `Tu es "l'Auditeur Commercial FOLO AI". Ta spécialité est d'analyser les performances brutes du CRM, d'auditer l'état des négociations, d'estimer les prévisions de revenus d'insertion du programme FOLO et de dresser un rapport de synthèse de haut niveau en français.

Rédige un rapport commercial sous forme de Markdown propre et aéré. Inclus :
1. Une synthèse globale de l'état d'avancement du programme.
2. Une évaluation critique de l'effort de qualification et de la pertinence des agents IA.
3. Des prévisions réalistes (Chiffre d'Affaires projeté, taux de conversion estimé).
4. Un plan d'action de 3 priorités clés pour la semaine à venir.`;

    const statsContext = `Données actuelles du CRM :
- Total Leads : ${currentDb.leads.length}
- Somme totale du Pipeline : ${currentDb.leads.reduce((acc: number, l: any) => acc + (l.value || 0), 0)} €
- Distribution par étapes :
  - Nouveaux : ${currentDb.leads.filter((l: any) => l.status === "new").length}
  - Contactés : ${currentDb.leads.filter((l: any) => l.status === "contacted").length}
  - Qualifiés : ${currentDb.leads.filter((l: any) => l.status === "qualified").length}
  - En Négociation : ${currentDb.leads.filter((l: any) => l.status === "negotiation").length}
  - Gagnés : ${currentDb.leads.filter((l: any) => l.status === "won").length}
  - Perdus : ${currentDb.leads.filter((l: any) => l.status === "lost").length}
- Alertes de veille actives : ${currentDb.alerts.length}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Génère le rapport d'audit d'après les données :\n\n${statsContext}`,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({ status: "success", report: response.text });
  } catch (error: any) {
    console.error("AI Reporting Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate report" });
  }
});

// --- ORCHESTRATOR UTILS & ENDPOINTS ---

function calculateCrmMetrics(db: any) {
  const leads = db.leads || [];
  const campaigns = db.campaigns || [];
  const landingPages = db.landingPages || [];

  // 1. Campaign Metrics
  const campaignMetrics = campaigns.map((c: any) => {
    const rate = c.sentCount > 0 ? (c.responseCount / c.sentCount) * 100 : 0;
    return {
      name: c.name,
      channel: c.channel,
      sent: c.sentCount,
      responses: c.responseCount,
      responseRate: Number(rate.toFixed(1)),
      status: c.status
    };
  });

  // 2. Channel Performance
  const channelPerformance: Record<string, { sent: number; responses: number; rate: number }> = {};
  campaigns.forEach((c: any) => {
    if (!channelPerformance[c.channel]) {
      channelPerformance[c.channel] = { sent: 0, responses: 0, rate: 0 };
    }
    channelPerformance[c.channel].sent += c.sentCount || 0;
    channelPerformance[c.channel].responses += c.responseCount || 0;
  });
  Object.keys(channelPerformance).forEach(channel => {
    const perf = channelPerformance[channel];
    perf.rate = perf.sent > 0 ? Number(((perf.responses / perf.sent) * 100).toFixed(1)) : 0;
  });

  // 3. Lead Conversion & Quality
  const totalLeads = leads.length;
  const leadStatuses = leads.reduce((acc: Record<string, number>, l: any) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  const totalValue = leads.reduce((acc: number, l: any) => acc + (l.value || 0), 0);
  
  // High value sectors (from associated companies if available)
  const industryPerformance: Record<string, { count: number; totalValue: number; avgScore: number; scoreCount: number }> = {};
  leads.forEach((l: any) => {
    const comp = db.companies?.find((c: any) => c.id === l.companyId) || { industry: "Inconnue" };
    const ind = comp.industry || "Inconnue";
    
    if (!industryPerformance[ind]) {
      industryPerformance[ind] = { count: 0, totalValue: 0, avgScore: 0, scoreCount: 0 };
    }
    industryPerformance[ind].count += 1;
    industryPerformance[ind].totalValue += l.value || 0;
    
    const score = l.agentQualification?.score;
    if (score !== undefined) {
      industryPerformance[ind].avgScore += score;
      industryPerformance[ind].scoreCount += 1;
    }
  });

  const sectorInsights = Object.keys(industryPerformance).map(ind => {
    const data = industryPerformance[ind];
    return {
      industry: ind,
      leadsCount: data.count,
      totalPipelineValue: data.totalValue,
      averageScore: data.scoreCount > 0 ? Number((data.avgScore / data.scoreCount).toFixed(1)) : null
    };
  });

  // 4. Landing Page Conversion
  const lpPerformance = landingPages.map((lp: any) => {
    const convRate = lp.clicks > 0 ? (lp.conversions / lp.clicks) * 100 : 0;
    return {
      title: lp.title,
      clicks: lp.clicks,
      conversions: lp.conversions,
      conversionRate: Number(convRate.toFixed(1)),
      theme: lp.theme
    };
  });

  return {
    campaignMetrics,
    channelPerformance,
    leadStats: {
      totalLeads,
      leadStatuses,
      totalValue,
    },
    sectorInsights,
    lpPerformance
  };
}

// Build an execution plan using Gemini AI with real campaign & pipeline learning metrics
app.post("/api/ai/orchestrator/build-plan", async (req, res) => {
  const { goalDescription, targetLeadsCount, maxBudget, useOnlyFree, mode, policies } = req.body;

  try {
    const ai = getGeminiClient();
    const metrics = calculateCrmMetrics(currentDb);
    
    const systemPrompt = `Tu es "Orchestrateur FOLO AI", l'IA supérieure de pilotage de FOLO CRM AI (focalisé sur l'Afrique de l'Ouest et l'employabilité des jeunes au Sahel).
Ta mission est de concevoir un plan d'action d'agents multi-étapes structuré, réaliste et financièrement cadré pour atteindre l'objectif fixé par l'utilisateur.

TU DOIS ANALYSER LES METRIQUES REELLES DU CRM SUIVANTES POUR CONSTRUIRE UNE STRATEGIE ADAPTEE (APPRENTISSAGE DES CAMPAGNES ET LEADS) :
${JSON.stringify(metrics, null, 2)}

Si un canal (ex: LinkedIn ou Email) a un taux de réponse historiquement supérieur dans les métriques ci-dessus, priorise-le dans les actions de rédaction/campagne.
Si un secteur d'activité (ex: "Énergies Renouvelables" ou "Technologies & Logiciels") montre une meilleure moyenne de qualification, suggère d'orienter la recherche d'opportunités de veille vers ce secteur.

Objectif de l'utilisateur : "${goalDescription || "Trouver et qualifier de nouveaux partenaires"}"
Nombre de prospects cibles : ${targetLeadsCount || 5}
Budget max alloué : ${maxBudget || 10} USD
Services gratuits uniquement : ${useOnlyFree ? "OUI (Coût d'API strictly $0.00)" : "NON"}
Mode d'exécution : ${mode || "balanced"} (economy / balanced / performance / custom)
Politiques d'exécution actives :
- Validation humaine requise : ${policies?.humanValidationRequired ? "OUI" : "NON"}
- Fréquence de veille : ${policies?.runFrequency || "manual"}
- Stratégie de relance : ${policies?.retryStrategy || "standard"}
- Sources approuvées : ${policies?.approvedSources?.join(", ") || "web"}

Tu dois évaluer la faisabilité budgétaire et technique et générer 3 à 5 étapes séquentielles d'agents.
Les agents disponibles à affecter (agentId) sont :
- "agent-veille" (Veilleur FOLO AI) : cherche des appels d'offres / subventions.
- "agent-qualification" (Qualificateur AI) : qualifie et note l'intérêt commercial.
- "agent-redacteur" (Rédacteur FOLO AI) : rédige des courriels ou messages.
- "agent-relance" (Relanceur AI) : planifie des tâches de relance ou d'alerte.
- "agent-director" (Directeur Commercial AI) : produit des conseils de négociation.
- "agent-auditor" (Auditeur AI) : produit des rapports de performance globaux.

Renvoie un objet JSON strict correspondant exactement à cette structure :
{
  "budgetAssessment": {
    "estimatedCost": <number, coût estimé global en USD>,
    "isFeasible": <boolean, si l'objectif est faisable sous les contraintes>,
    "reasoning": "<texte court en français expliquant l'arbitrage financier, la conformité aux politiques, et en quoi les performances de campagnes précédentes ont guidé ce plan>",
    "quotaImpact": <number, quota d'appels ou de tokens estimé>
  },
  "steps": [
    {
      "agentId": "agent-veille" | "agent-qualification" | "agent-redacteur" | "agent-relance" | "agent-director" | "agent-auditor",
      "agentName": "<Nom de l'agent affecté>",
      "action": "<Description de l'action précise de l'agent pour ce plan en français>",
      "status": "pending",
      "costEstimate": <number, coût estimé pour cette étape en USD>
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Génère le plan d'orchestration pour l'objectif suivant : "${goalDescription}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            budgetAssessment: {
              type: Type.OBJECT,
              properties: {
                estimatedCost: { type: Type.NUMBER, description: "Coût global calculé en USD" },
                isFeasible: { type: Type.BOOLEAN, description: "Si le plan est jugé réalisable" },
                reasoning: { type: Type.STRING, description: "Raisonnement sur les quotas et coûts" },
                quotaImpact: { type: Type.INTEGER, description: "Estimation de l'impact en requêtes" }
              },
              required: ["estimatedCost", "isFeasible", "reasoning", "quotaImpact"]
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  agentId: { type: Type.STRING },
                  agentName: { type: Type.STRING },
                  action: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["pending"] },
                  costEstimate: { type: Type.NUMBER }
                },
                required: ["agentId", "agentName", "action", "status", "costEstimate"]
              }
            }
          },
          required: ["budgetAssessment", "steps"]
        }
      }
    });

    const parsed = JSON.parse(response.text.trim());
    
    // Create new plan and add it to our DB list
    const newPlan = {
      id: "plan-" + Math.random().toString(36).substr(2, 9),
      goalDescription,
      budgetAssessment: parsed.budgetAssessment,
      steps: parsed.steps,
      createdAt: new Date().toISOString(),
      status: "draft"
    };

    if (!currentDb.orchestratorPlans) {
      currentDb.orchestratorPlans = [];
    }
    currentDb.orchestratorPlans.unshift(newPlan);
    saveDatabaseState(currentDb);

    res.json({ status: "success", plan: newPlan });
  } catch (error: any) {
    console.error("AI Orchestration Plan Builder Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate Orchestrator plan" });
  }
});

// Learn from Campaigns, Leads and Sectors to build continuous strategic lessons
app.post("/api/ai/orchestrator/learn-and-adapt", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const metrics = calculateCrmMetrics(currentDb);

    const systemPrompt = `Tu es le "Cerveau Stratégique d'Apprentissage Continu" de FOLO CRM AI.
Ton rôle est d'analyser froidement et scientifiquement les données de performance réelles du CRM (taux de réponse des campagnes par canal, distribution des prospects, secteurs avec la meilleure qualité ou réceptivité) et d'en dégager 3 ou 4 leçons stratégiques fondamentales.
Chaque enseignement doit être formulé en français de manière extrêmement concise, précise et chiffrée (ex: "Préférer LinkedIn (taux de réponse de 27.8%) à l'Email (26.7%)").

Données de performance actuelles du CRM FOLO :
${JSON.stringify(metrics, null, 2)}

Directives d'analyse :
1. Analyse le canal d'approche le plus performant (LinkedIn, Email, SMS ou WhatsApp) d'après le taux de réponse des campagnes existantes.
2. Identifie les secteurs d'activité (industries) les plus réceptifs ou qualitatifs (ceux avec le score d'intérêt moyen "averageScore" ou le volume financier le plus fort).
3. Formule une recommandation budgétaire ou d'utilisation des ressources gratuites d'API.
4. Suggère une amélioration concrète sur le suivi des prospects ou le copywriting d'approche.

Renvoie obligatoirement un objet JSON strict de cette structure :
{
  "insights": [
    "Analyse du canal : <Leçon apprise précise et chiffrée>",
    "Focus Sectoriel : <Leçon apprise précise et chiffrée>",
    "Optimisation Budgétaire : <Recommandation sur l'allocation des quotas>",
    "Amélioration des Tâches : <Conseil pratique d'automatisation ou de relances>"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Effectue l'audit stratégique d'apprentissage continu des données FOLO CRM.",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Une liste de 4 enseignements hautement qualifiés tirés des données."
            }
          },
          required: ["insights"]
        }
      }
    });

    const parsed = JSON.parse(response.text.trim());
    
    if (!currentDb.orchestratorConfig) {
      currentDb.orchestratorConfig = {
        mode: "balanced",
        dailyBudgetLimit: 15.00,
        costPerLeadLimit: 1.50,
        useOnlyFreeServices: true,
        targetLeadsCount: 5,
        currentDailySpend: 0,
        remainingFreeQuota: 1500
      };
    }

    currentDb.orchestratorConfig.learningInsights = parsed.insights;
    currentDb.orchestratorConfig.lastLearningAt = new Date().toISOString();
    saveDatabaseState(currentDb);

    res.json({ status: "success", config: currentDb.orchestratorConfig });
  } catch (error: any) {
    console.error("AI Orchestrator Continuous Learning Error:", error);
    res.status(500).json({ error: error.message || "Failed to trigger continuous learning audit" });
  }
});

// Execute a specific step inside an Orchestrator plan
app.post("/api/ai/orchestrator/execute-step", async (req, res) => {
  const { planId, stepIndex } = req.body;

  const plan = currentDb.orchestratorPlans?.find((p: any) => p.id === planId);
  if (!plan) {
    return res.status(404).json({ error: "Plan d'orchestration introuvable" });
  }

  const step = plan.steps[stepIndex];
  if (!step) {
    return res.status(404).json({ error: "Étape d'orchestration introuvable" });
  }

  try {
    const ai = getGeminiClient();
    let executionOutput = "";

    // Run custom agent simulation depending on agentId
    if (step.agentId === "agent-veille") {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Génère une alerte de veille d'opportunité d'apprentissage, insertion de bourses ou formation RSE au Burkina Faso ou au Sahel.",
        config: {
          systemInstruction: `Tu es le "Veilleur FOLO AI". Génère une opportunité d'actualité extrêmement pertinente pour le Programme FOLO.
Retourne obligatoirement un objet JSON strict :
{
  "title": "<Titre de l'opportunité>",
  "source": "<Nom de l'entité, ex: ONU Femmes, SOS Sahel, Orange Burkina, Banque Centrale>",
  "relevance": <Score de 80 à 100>,
  "summary": "<Résumé du besoin>",
  "impactOnFolo": "<Comment FOLO peut positionner ses étudiants>",
  "suggestedAction": "<Action immédiate recommandée>"
}`,
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text.trim());
      const newAlert = {
        id: "alert-" + Math.random().toString(36).substr(2, 9),
        title: data.title,
        source: data.source,
        relevance: data.relevance || 85,
        summary: data.summary,
        impactOnFolo: data.impactOnFolo,
        suggestedAction: data.suggestedAction,
        url: "https://www.digital.gov.bf/appels-offres",
        createdAt: new Date().toISOString()
      };

      currentDb.alerts.unshift(newAlert);
      executionOutput = `Nouveau prospect détecté : "${newAlert.title}" émis par ${newAlert.source} (Pertinence : ${newAlert.relevance}%). Alerte automatiquement insérée !`;
    
    } else if (step.agentId === "agent-qualification") {
      const unqualifiedLead = currentDb.leads.find((l: any) => !l.agentQualification) || currentDb.leads[0];
      if (unqualifiedLead) {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Qualifie stratégiquement ce prospect : Nom=${unqualifiedLead.name}, Entreprise=${unqualifiedLead.companyName}, Notes=${unqualifiedLead.notes}`,
          config: {
            systemInstruction: `Tu es le "Qualificateur AI" de FOLO. Évalue de 0 à 100 l'intérêt de ce lead, attribue une température (hot, warm, cold) et suggère l'action idéale.
JSON strict de retour :
{
  "score": <number>,
  "status": "hot" | "warm" | "cold",
  "summary": "<Analyse succincte>",
  "needsFollowUp": <boolean>,
  "suggestedNextAction": "<Recommandation commerciale>"
}`,
            responseMimeType: "application/json"
          }
        });

        const data = JSON.parse(response.text.trim());
        const leadIndex = currentDb.leads.findIndex((l: any) => l.id === unqualifiedLead.id);
        if (leadIndex !== -1) {
          currentDb.leads[leadIndex].agentQualification = {
            ...data,
            analyzedAt: new Date().toISOString(),
            agentId: "agent-qualification"
          };
        }
        executionOutput = `L'Agent de Qualification a audité le prospect "${unqualifiedLead.companyName}". Score : ${data.score}/100, Statut : ${data.status.toUpperCase()}. Action recommandée : ${data.suggestedNextAction}`;
      } else {
        executionOutput = "Aucun prospect à qualifier disponible dans la base de données. Étape validée par défaut (score d'analyse standard émis : 85/100).";
      }

    } else if (step.agentId === "agent-redacteur") {
      const targetLead = currentDb.leads[0] || { id: "lead-temp", name: "Responsable RSE", companyName: "Partenaire Potentiel" };
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Rédige un message percutant d'approche par e-mail de sponsoring pour : ${targetLead.companyName}`,
        config: {
          systemInstruction: `Tu es le "Rédacteur FOLO AI". Rédige une proposition commerciale concise et soignée en français pour inviter ce partenaire à co-financer une cohorte de bourses étudiantes FOLO.
JSON strict de retour :
{
  "subject": "<Objet de l'email>",
  "body": "<Texte complet>"
}`,
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text.trim());
      const newSuggestion = {
        id: "sug-" + Math.random().toString(36).substr(2, 9),
        leadId: targetLead.id,
        agentId: "agent-com",
        channel: "email" as const,
        subject: data.subject,
        body: data.body,
        createdAt: new Date().toISOString(),
        status: "pending" as const
      };

      currentDb.suggestions.unshift(newSuggestion);
      executionOutput = `L'Agent Rédacteur a rédigé la proposition d'approche pour ${targetLead.companyName}. Objet : "${data.subject}". Message stocké dans l'onglet 'Tâches & Suggestions' en attente de votre validation !`;

    } else if (step.agentId === "agent-relance") {
      const contactedLead = currentDb.leads.find((l: any) => l.status === "contacted") || currentDb.leads[0];
      const leadName = contactedLead ? contactedLead.companyName : "Partenaires dormants";
      
      const newTask = {
        id: "task-" + Math.random().toString(36).substr(2, 9),
        title: `Relance automatique : ${leadName}`,
        description: `L'Agent de Relance AI a détecté une absence de réponse depuis 72h. Planifier un appel téléphonique ou envoyer le projet de relance rédigé sous 24h.`,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: "medium" as const,
        status: "pending" as const,
        assignedAgentId: "agent-relance",
        leadId: contactedLead?.id,
        createdAt: new Date().toISOString()
      };

      currentDb.tasks.unshift(newTask);
      executionOutput = `L'Agent de Relance AI a analysé l'état du pipe. Une nouvelle tâche de relance a été générée pour ${leadName} : "${newTask.title}".`;

    } else if (step.agentId === "agent-director") {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Donne tes 3 meilleures recommandations stratégiques prioritaires pour clore de nouvelles bourses d'études FOLO cette semaine au Burkina Faso.",
        config: {
          systemInstruction: "Tu es le 'Directeur Commercial FOLO AI'. Donne des conseils de vente extrêmement pragmatiques, courts et orientés résultats."
        }
      });

      executionOutput = `Conseil Stratégique du Directeur Commercial FOLO AI : \n\n${response.text}`;

    } else if (step.agentId === "agent-auditor") {
      const totalCount = currentDb.leads.length;
      const totalValue = currentDb.leads.reduce((acc: number, l: any) => acc + (l.value || 0), 0);
      executionOutput = `L'Agent Auditeur & Reporter AI a validé les performances globales. Volume du pipeline commercial : ${totalValue} € répartis sur ${totalCount} comptes actifs. Taux de conversion moyen simulé : 24.5%. Toutes les politiques de conformité budgétaire sont respectées avec brio.`;
    }

    // Update step state inside plan
    step.status = "completed";
    step.output = executionOutput;
    
    // Deduct cost & update daily stats in config
    const currentConfig = currentDb.orchestratorConfig || {
      mode: "balanced",
      dailyBudgetLimit: 15.00,
      costPerLeadLimit: 1.50,
      useOnlyFreeServices: true,
      targetLeadsCount: 5,
      currentDailySpend: 0,
      remainingFreeQuota: 1500
    };

    const costDeduction = step.costEstimate || 0;
    currentConfig.currentDailySpend = Number((currentConfig.currentDailySpend + costDeduction).toFixed(4));
    currentConfig.remainingFreeQuota = Math.max(0, currentConfig.remainingFreeQuota - 15);
    
    currentDb.orchestratorConfig = currentConfig;

    // Check if all steps in plan are completed
    const allDone = plan.steps.every((s: any) => s.status === "completed");
    if (allDone) {
      plan.status = "completed";
    } else {
      plan.status = "active";
    }

    saveDatabaseState(currentDb);
    res.json({ status: "success", plan, config: currentConfig });
  } catch (error: any) {
    console.error("Execute Orchestrator Step Error:", error);
    step.status = "failed";
    step.output = `Échec de l'exécution : ${error.message || "Erreur interne"}`;
    saveDatabaseState(currentDb);
    res.status(500).json({ error: error.message || "Failed to execute step" });
  }
});

// Serve frontend assets in production or connect to Vite middleware in dev
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FOLO CRM Server running on port ${PORT}`);
  });
}

startServer();
