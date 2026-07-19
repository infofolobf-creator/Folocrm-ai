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
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "alert-2",
      title: "Fonds vert pour le climat : Subventions aux formations solaires décentralisées",
      source: "Banque Africaine de Développement (BAD)",
      relevance: 85,
      summary: "Nouveau guichet de subvention pour financer les instituts de formation technique ciblant l'énergie solaire rurale en zone UEMOA.",
      impactOnFolo: "Correspond exactement à notre programme FOLO Solaire. Nous pouvons postuler pour sécuriser un financement pluriannuel de 100% des bourses de formation.",
      url: "https://www.afdb.org/fr/news-and-events",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
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
  "url": "<URL fictive ou réelle d'information>"
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
            url: { type: Type.STRING }
          },
          required: ["title", "source", "relevance", "summary", "impactOnFolo"]
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
