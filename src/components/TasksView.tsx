/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useCRM } from "../CRMContext";
import { Check, Clipboard, ClipboardCheck, Trash, AlertTriangle, Play, Sparkles, CheckSquare, MessageSquare } from "lucide-react";

export const TasksView: React.FC = () => {
  const { tasks, suggestions, toggleTaskStatus, addTask, leads, approveSuggestion } = useCRM();

  // Active sub-section within tasks view
  const [tasksTab, setTasksTab] = useState<"pending" | "suggestions">("pending");

  // Form state
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [taskLeadId, setTaskLeadId] = useState("");

  // Copy indicator states
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    await addTask({
      title: taskTitle,
      description: taskDesc,
      dueDate: taskDueDate || new Date().toISOString().split('T')[0],
      priority: taskPriority,
      status: "pending",
      assignedAgentId: "user",
      leadId: taskLeadId || undefined
    });

    setTaskTitle("");
    setTaskDesc("");
    setTaskDueDate("");
    setTaskPriority("medium");
    setTaskLeadId("");
    setShowAddTask(false);
  };

  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApprove = async (sugId: string) => {
    await approveSuggestion(sugId);
  };

  return (
    <div className="space-y-6" id="tasks-module">
      {/* Navigation Sub-tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex border-b border-slate-100 p-0.5 bg-slate-50 rounded-lg">
          <button
            onClick={() => setTasksTab("pending")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition ${
              tasksTab === "pending" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Tâches & Actions ({tasks.filter(t => t.status === "pending").length})</span>
          </button>
          <button
            onClick={() => setTasksTab("suggestions")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition ${
              tasksTab === "suggestions" ? "bg-white text-slate-800 shadow-sm animate-pulse" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Suggestions de Messages AI ({suggestions.filter(s => s.status === "pending").length})</span>
          </button>
        </div>

        {tasksTab === "pending" && (
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-medium transition shadow-sm shrink-0"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Créer une Tâche</span>
          </button>
        )}
      </div>

      {/* Main Panel views */}
      {tasksTab === "pending" ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Suivi des relances commerciales</h3>

          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Aucune tâche enregistrée dans votre CRM.
              </div>
            ) : (
              tasks.map(task => {
                const lead = leads.find(l => l.id === task.leadId);

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition flex items-start gap-4 hover:shadow-xs ${
                      task.status === "completed"
                        ? "bg-slate-50/50 border-slate-100 opacity-60"
                        : "bg-white border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      onChange={() => toggleTaskStatus(task.id)}
                      className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 border-slate-300"
                    />

                    <div className="flex-1 space-y-1 text-xs">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className={`font-bold text-slate-800 text-sm ${task.status === "completed" ? "line-through text-slate-400" : ""}`}>
                          {task.title}
                        </h4>
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
                          task.priority === "high" ? "bg-red-50 text-red-600 border border-red-100" :
                          task.priority === "medium" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-slate-100 text-slate-600"
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      <p className="text-slate-500 leading-relaxed text-[11px]">{task.description}</p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1.5 text-[10px] text-slate-400">
                        {lead && (
                          <div className="flex items-center gap-1 font-medium text-slate-500">
                            <span className="text-slate-400 font-normal">Prospect :</span>
                            <span className="underline">{lead.name} ({lead.companyName})</span>
                          </div>
                        )}
                        <div>
                          Échéance : <span className="font-semibold text-slate-600">{new Date(task.dueDate).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Suggestions View from Rédacteur AI */
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Ces messages ont été rédigés par votre <span className="font-bold">Rédacteur FOLO AI</span> sur la base des échanges passés et des objectifs commerciaux. Vous pouvez les copier pour les envoyer directement par WhatsApp, Email ou LinkedIn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.length === 0 ? (
              <div className="col-span-2 text-center bg-white border border-slate-100 shadow-sm rounded-xl py-16 text-slate-400 text-xs">
                Aucune suggestion de message générée pour le moment. Allez sur l'onglet "Prospects", sélectionnez un prospect et cliquez sur "Rédiger le projet (AI)".
              </div>
            ) : (
              suggestions.map(sug => {
                const lead = leads.find(l => l.id === sug.leadId);
                const isCopied = copiedId === sug.id;

                return (
                  <div key={sug.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3 text-xs">
                      {/* Header of card */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            sug.channel === "whatsapp" ? "bg-green-100 text-green-800 border border-green-200" :
                            sug.channel === "email" ? "bg-blue-100 text-blue-800 border border-blue-200" : "bg-purple-100 text-purple-800"
                          }`}>
                            {sug.channel}
                          </span>
                          {lead && (
                            <span className="text-[10px] text-slate-500 font-semibold">
                              Pour : {lead.name} ({lead.companyName})
                            </span>
                          )}
                        </div>
                        
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                          sug.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          {sug.status === "approved" ? "Approuvé" : "Brouillon"}
                        </span>
                      </div>

                      {sug.subject && (
                        <div className="font-semibold text-slate-800 bg-slate-50/50 p-2 rounded-md border border-slate-100">
                          <span className="text-slate-400 font-normal">Objet :</span> {sug.subject}
                        </div>
                      )}

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 font-sans whitespace-pre-wrap leading-relaxed max-h-[180px] overflow-y-auto">
                        {sug.body}
                      </div>
                    </div>

                    {/* Footer with copy & approve button */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleCopyToClipboard(sug.body, sug.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                          isCopied ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                            <span>Copié !</span>
                          </>
                        ) : (
                          <>
                            <Clipboard className="w-4 h-4 text-slate-400" />
                            <span>Copier le texte</span>
                          </>
                        )}
                      </button>

                      {sug.status === "pending" && (
                        <button
                          onClick={() => handleApprove(sug.id)}
                          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg text-xs font-semibold transition shadow-sm"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approuver</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD TASK */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800">Planifier une Tâche Commerciale</h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Libellé de la Tâche</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Envoyer la proposition de sponsoring solaires..."
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Description / Renseignements</label>
                <textarea
                  rows={2}
                  placeholder="Détails sur ce que vous devez accomplir ou préparer..."
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Associer à un Prospect</label>
                <select
                  value={taskLeadId}
                  onChange={e => setTaskLeadId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">-- Aucun prospect associé --</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.companyName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Échéance de Rappel</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 block">Priorité Commerciale</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute / Urgente</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Planifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal minimal svg icons for nice layouts
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
