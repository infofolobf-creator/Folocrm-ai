/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useCRM } from "../CRMContext";
import { FileText, Loader2, Sparkles, AlertTriangle, Printer, Copy, Check } from "lucide-react";

export const ReportingView: React.FC = () => {
  const { leads } = useCRM();
  const [report, setReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const generateReport = async () => {
    try {
      setIsGenerating(true);
      setErrorMsg(null);
      const res = await fetch("/api/ai/report", { method: "POST" });
      if (!res.ok) throw new Error("Impossible d'obtenir l'audit.");
      const data = await res.json();
      setReport(data.report);
    } catch (err: any) {
      setErrorMsg(err.message || "La génération du rapport a échoué.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Proactively generate on-load if leads are present
    if (leads.length > 0 && !report) {
      generateReport();
    }
  }, [leads]);

  const handleCopyToClipboard = () => {
    if (!report) return;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Safe basic regex parser to translate Gemini markdown into gorgeous styled HTML
  const parseMarkdownToHtml = (markdownText: string) => {
    if (!markdownText) return "";
    
    let html = markdownText;
    
    // Replace escape chars
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h4 class="text-xs uppercase font-extrabold text-indigo-700 tracking-wide mt-4 mb-2">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-1 mt-6 mb-3">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 class="text-lg font-black text-slate-950 mt-8 mb-4">$1</h2>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
    
    // Italics
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-600">$1</em>');

    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-400 pl-4 py-1 italic my-4 text-slate-600 bg-slate-50/50 rounded-r-lg">$1</blockquote>');

    // Unordered lists
    html = html.replace(/^\s*\-\s+(.*$)/gim, '<li class="ml-4 list-disc text-slate-600 pl-1 py-0.5">$1</li>');
    html = html.replace(/^\s*\*\s+(.*$)/gim, '<li class="ml-4 list-disc text-slate-600 pl-1 py-0.5">$1</li>');

    // Paragraph breaks
    html = html.replace(/\n\n/g, '<p class="mb-3"></p>');

    return html;
  };

  return (
    <div className="space-y-6" id="reporting-module">
      {/* Overview Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Rapport d'Audit Stratégique (Auditeur AI)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            L'Auditeur FOLO AI examine votre tunnel de vente actuel pour en extraire des recommandations.
          </p>
        </div>

        <div className="flex gap-2">
          {report && (
            <>
              <button
                onClick={handleCopyToClipboard}
                className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copié !" : "Copier"}</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>
            </>
          )}

          <button
            onClick={generateReport}
            disabled={isGenerating}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Audit en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Régénérer l'Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl border border-red-100 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Audit Print/Render Container */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6 min-h-[450px] relative overflow-hidden" id="printable-area">
        {isGenerating ? (
          <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            <div className="text-center">
              <p className="font-bold text-slate-800 text-sm">Compilation de l'Audit commercial FOLO...</p>
              <p className="text-xs text-slate-400 mt-1">L'Auditeur AI calcule les KPI et formule les plans de closing à l'aide de Gemini.</p>
            </div>
          </div>
        ) : null}

        {report ? (
          <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-4">
            {/* Header watermarks */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4 text-slate-400 text-[10px] uppercase font-bold">
              <span>Programme d'excellence FOLO</span>
              <span>Propulsé par Gemini AI Studio</span>
            </div>

            <div
              className="text-slate-700 space-y-3"
              dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(report) }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 text-slate-400 space-y-4">
            <FileText className="w-12 h-12 text-slate-200" />
            <div>
              <p className="font-bold text-slate-700 text-xs uppercase tracking-wider">Aucun audit disponible</p>
              <p className="text-xs max-w-sm mt-1 leading-relaxed">
                Cliquez sur "Régénérer l'Audit" pour demander à l'Auditeur AI d'extraire les métriques et générer son plan de recommandation commerciale.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
