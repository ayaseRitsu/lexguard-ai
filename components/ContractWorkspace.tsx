
import React from 'react';
import { AnalysisResult } from '../types';
import { AlertCircle, Target, FileSearch } from 'lucide-react';

interface ContractWorkspaceProps {
  inputText: string;
  setInputText: (text: string) => void;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  onRunAnalysis: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const ContractWorkspace: React.FC<ContractWorkspaceProps> = ({
  inputText,
  setInputText,
  isAnalyzing,
  result,
  onRunAnalysis,
  textareaRef,
  buttonRef
}) => {
  return (
    <div className="flex-1 max-w-[1400px] mx-auto w-full p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left Column: Input */}
      <div className="flex flex-col h-[700px]">
        <div className="flex items-center justify-between mb-3 px-1">
          <label className="text-sm font-semibold text-slate-700 uppercase tracking-tight">Contract Input</label>
          <span className="text-xs text-slate-400 font-mono">{inputText.length} chars</span>
        </div>
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm focus-within:ring-1 focus-within:ring-slate-300 transition-all overflow-hidden flex flex-col">
          <textarea
            ref={textareaRef}
            className="w-full h-full p-6 text-slate-700 placeholder-slate-300 resize-none outline-none leading-relaxed text-[15px]"
            placeholder="Paste your contract text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
        <button
          ref={buttonRef}
          disabled={isAnalyzing || !inputText.trim()}
          onClick={onRunAnalysis}
          className={`mt-6 w-full py-3.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-[15px] transition-all
            ${isAnalyzing || !inputText.trim() 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-800 text-white hover:bg-slate-900 shadow-md hover:shadow-lg active:scale-[0.99]'}`}
        >
          <FileSearch size={18} />
          {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>

      {/* Right Column: Results */}
      <div className="flex flex-col h-[700px]">
        <div className="mb-3 px-1">
          <label className="text-sm font-semibold text-slate-700 uppercase tracking-tight">Analysis Results</label>
        </div>
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-y-auto p-8 relative">
          {!result && !isAnalyzing && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-medium">
              Analysis results will appear here
            </div>
          )}
          
          {isAnalyzing && (
            <div className="space-y-6">
              <div className="h-6 bg-slate-50 animate-pulse rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-50 animate-pulse rounded w-full"></div>
                <div className="h-4 bg-slate-50 animate-pulse rounded w-5/6"></div>
              </div>
              <div className="h-6 bg-slate-50 animate-pulse rounded w-1/4 pt-4"></div>
              <div className="space-y-4">
                <div className="h-12 bg-slate-50 animate-pulse rounded w-full"></div>
                <div className="h-12 bg-slate-50 animate-pulse rounded w-full"></div>
                <div className="h-12 bg-slate-50 animate-pulse rounded w-full"></div>
              </div>
            </div>
          )}

          {result && !isAnalyzing && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-700 space-y-10">
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  Summary
                </h3>
                <p className="text-slate-600 leading-relaxed text-[15px]">
                  {result.summary}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-500" />
                  High Risks
                </h3>
                <ul className="space-y-3">
                  {result.risks.map((risk, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-600 text-[15px]">
                      <span className="text-red-400 font-bold">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Target size={18} className="text-blue-500" />
                  Negotiation Points
                </h3>
                <ul className="space-y-3">
                  {result.negotiations.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-600 text-[15px] bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                      <span className="text-blue-500 font-bold">#</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractWorkspace;
