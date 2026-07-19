/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useCRM } from "../CRMContext";
import { Brain, Send, HelpCircle, Loader2, MessageSquare, ShieldCheck, Zap, AlertCircle } from "lucide-react";

interface ChatMessage {
  sender: "user" | "agent";
  text: string;
  timestamp: Date;
}

export const AgentsView: React.FC = () => {
  const { leads, triggerVeilleAlertAI } = useCRM();

  // Selected agent for direct chat
  const [selectedAgentIdx, setSelectedAgentIdx] = useState<number>(4); // Default to Directeur Commercial

  // Chat message logs per agent (simplifying with state)
  const [chatLogs, setChatLogs] = useState<{ [key: number]: ChatMessage[] }>({
    4: [
      { sender: "agent", text: "Bonjour ! Je suis votre Directeur Commercial AI. Je suis là pour vous coacher, peaufiner vos arguments de vente et analyser l'état de notre pipe commercial FOLO. Posez-moi vos questions stratégiques !", timestamp: new Date() }
    ],
    0: [
      { sender: "agent", text: "Bonjour ! Je suis l'agent de Veille Stratégique. Je scanne en permanence les appels d'offres de l'UEMOA et les fonds RSE. Cliquez sur le bouton 'Scanner le marché' ci-dessous pour que je génère une nouvelle alerte !", timestamp: new Date() }
    ],
    2: [
      { sender: "agent", text: "Bonjour ! Je suis votre Rédacteur Commercial. Pour rédiger un message ciblé, sélectionnez plutôt un prospect dans l'onglet 'Prospects' et cliquez sur 'Rédiger le projet (AI)'. Je formulerai une suggestion sur-mesure !", timestamp: new Date() }
    ]
  });

  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const agents = [
    { name: "Veilleur FOLO AI", role: "Veille & Opportunités", status: "Prêt", avatar: "🤖", color: "border-emerald-500 text-emerald-600 bg-emerald-50", desc: "Recherche en continu des appels d'offres au Sahel, des subventions RSE et des bourses de la transition écologique." },
    { name: "Qualificateur AI", role: "Audit de prospects", status: "Surveillance", avatar: "🧠", color: "border-indigo-500 text-indigo-600 bg-indigo-50", desc: "Analyse les profils d'entreprises pour évaluer l'intérêt financier et l'alignement éthique avec le programme FOLO." },
    { name: "Rédacteur AI", role: "Copywriter d'Impact", status: "Prêt", avatar: "✍️", color: "border-blue-500 text-blue-600 bg-blue-50", desc: "Génère des arguments commerciaux et des messages ultra-ciblés pour WhatsApp, emails de masse, LinkedIn et SMS." },
    { name: "Relanceur AI", role: "Suivi temporel", status: "Surveillance", avatar: "⏳", color: "border-amber-500 text-amber-700 bg-amber-50", desc: "Identifie les prospects dormants, suggère des relances et prévient la déperdition des opportunités du pipe." },
    { name: "Directeur Commercial AI", role: "Stratège & Coach", status: "Actif", avatar: "👔", color: "border-purple-500 text-purple-600 bg-purple-50", desc: "Coache vos négociations, analyse l'évolution de vos cycles d'insertion et définit les plans d'actions par promotion." },
    { name: "Auditeur AI", role: "Analyste & Reporter", status: "Prêt", avatar: "📊", color: "border-rose-500 text-rose-600 bg-rose-50", desc: "Audite les taux de closing, dresse des synthèses de performance et produit des rapports d'audit prêts pour la direction." }
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isSending) return;

    const currentIdx = selectedAgentIdx;
    const textToSend = userInput.trim();
    setUserInput("");
    setErrorMessage(null);

    // Append user message
    const updatedUserMsg: ChatMessage = { sender: "user", text: textToSend, timestamp: new Date() };
    const currentLogs = chatLogs[currentIdx] || [];
    setChatLogs(prev => ({
      ...prev,
      [currentIdx]: [...currentLogs, updatedUserMsg]
    }));

    setIsSending(true);

    try {
      // Hit endpoint depending on which agent.
      // Currently, Directeur Commercial is the primary interactive chat advisor.
      if (currentIdx === 4) {
        const res = await fetch("/api/ai/sales-advice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: textToSend })
        });
        if (!res.ok) throw new Error("L'agent n'a pas répondu.");
        const data = await res.json();

        const agentReply: ChatMessage = { sender: "agent", text: data.advice, timestamp: new Date() };
        setChatLogs(prev => ({
          ...prev,
          [currentIdx]: [...(prev[currentIdx] || []), agentReply]
        }));
      } else if (currentIdx === 0) {
        // Veilleur AI
        const res = await fetch("/api/ai/sales-advice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: `En tant qu'agent de veille stratégique au Sahel : ${textToSend}` })
        });
        if (!res.ok) throw new Error("L'agent n'a pas répondu.");
        const data = await res.json();

        const agentReply: ChatMessage = { sender: "agent", text: data.advice, timestamp: new Date() };
        setChatLogs(prev => ({
          ...prev,
          [currentIdx]: [...(prev[currentIdx] || []), agentReply]
        }));
      } else {
        // Other agents general interactive advice
        const res = await fetch("/api/ai/sales-advice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: `Agis en tant que ${agents[currentIdx].name} (${agents[currentIdx].role}) pour FOLO et réponds de manière brève et experte : ${textToSend}` })
        });
        if (!res.ok) throw new Error("L'agent n'a pas répondu.");
        const data = await res.json();

        const agentReply: ChatMessage = { sender: "agent", text: data.advice, timestamp: new Date() };
        setChatLogs(prev => ({
          ...prev,
          [currentIdx]: [...(prev[currentIdx] || []), agentReply]
        }));
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur de connexion avec l'agent.");
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickVeille = async () => {
    setIsSending(true);
    setErrorMessage(null);
    try {
      await triggerVeilleAlertAI();
      const updatedLogs = chatLogs[0] || [];
      setChatLogs(prev => ({
        ...prev,
        [0]: [
          ...updatedLogs,
          { sender: "agent", text: "Fait ! J'ai effectué un scan approfondi du Web et des publications d'appels d'offres au Burkina. J'ai généré et inséré une nouvelle alerte de marché de haute pertinence dans notre Tableau de Bord. Allez y jeter un œil !", timestamp: new Date() }
        ]
      }));
    } catch (err: any) {
      setErrorMessage(err.message || "La veille a échoué.");
    } finally {
      setIsSending(false);
    }
  };

  const selectedAgent = agents[selectedAgentIdx];
  const activeLogs = chatLogs[selectedAgentIdx] || [
    { sender: "agent", text: `Bonjour ! Je suis le ${selectedAgent.name}. Je suis à votre entière disposition commerciale pour parfaire notre mission FOLO.`, timestamp: new Date() }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="agents-module">
      {/* Left Column: Agents Grid list */}
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Brain className="w-5 h-5 text-indigo-600" />
            <span>Staff Digital FOLO AI</span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Cliquez sur un conseiller pour ouvrir une ligne de communication directe cryptée et propulsée par le modèle Gemini.
          </p>
        </div>

        <div className="space-y-3">
          {agents.map((agent, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedAgentIdx(idx);
                setErrorMessage(null);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3.5 hover:shadow-xs ${
                selectedAgentIdx === idx
                  ? "bg-indigo-50/10 border-indigo-200 ring-2 ring-indigo-500/15"
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <span className="text-2xl p-1.5 bg-slate-50 border border-slate-100 rounded-lg block shrink-0">{agent.avatar}</span>
              <div className="space-y-1 flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">{agent.name}</h3>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {agent.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">{agent.role}</p>
                <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">{agent.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right 2 Columns: Conversational Console */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col h-[650px] justify-between overflow-hidden">
        {/* Console Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedAgent.avatar}</span>
            <div>
              <h3 className="font-bold text-sm">{selectedAgent.name}</h3>
              <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">{selectedAgent.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-full text-[10px] text-emerald-400 border border-slate-700/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptage SSL AI</span>
          </div>
        </div>

        {/* Chat History Box */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-50/50 space-y-4" id="chat-history-box">
          {activeLogs.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs shadow-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-slate-900 text-white rounded-tr-none"
                    : "bg-white text-slate-800 rounded-tl-none border border-slate-100 font-medium"
                }`}
              >
                {/* Clean multiline printing */}
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className="block text-[8px] text-right mt-1.5 opacity-40">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl p-4 text-xs border border-slate-100 flex items-center gap-2 text-slate-500 shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>{selectedAgent.name} est en train de formuler sa réponse...</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Action Tray & Input Form */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-3">
          {/* Quick interactive action buttons per agent context */}
          {selectedAgentIdx === 0 && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleQuickVeille}
                disabled={isSending}
                className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-4 py-1.5 rounded-lg text-xs font-semibold transition"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-500 animate-bounce" />
                <span>Demander à scanner le marché maintenant (Générer une Alerte)</span>
              </button>
            </div>
          )}

          {selectedAgentIdx === 4 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Comment convaincre un grand groupe de financer 20 bourses ?",
                "Simule une relance pour un client froid dans le numérique.",
                "Quelle stratégie adopter face à un budget RSE serré ?"
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUserInput(suggestion)}
                  disabled={isSending}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 text-[10px] text-slate-600 transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              disabled={isSending}
              placeholder={`Écrire au ${selectedAgent.name}...`}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={isSending || !userInput.trim()}
              className="bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-xl transition duration-200 disabled:opacity-40 shrink-0 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
