import React, { useState, useEffect } from 'react';
import { interviewApi } from '../api/client';
import { MessageSquareCode, CheckCircle2, AlertTriangle, Send, BookOpen } from 'lucide-react';

export const InterviewPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      interviewApi.getQuestions(),
      interviewApi.getHistory()
    ])
      .then(([qRes, hRes]: any[]) => {
        if (qRes.data && qRes.data.length > 0) {
          setQuestions(qRes.data);
          setSelectedQuestion(qRes.data[0]);
        }
        if (hRes.data) setHistory(hRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !answer.trim()) return;
    setSubmitting(true);
    try {
      const res: any = await interviewApi.submitAnswer({
        questionId: selectedQuestion.id,
        answer: answer.trim(),
      });
      if (res.data) {
        setEvaluationResult(res.data);
        fetchData();
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center space-x-2 text-[#4b5563]">
        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Loading interview simulator & question banks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header */}
      <div className="bg-white border border-[#e5e7eb] rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-black">
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span>INTERVIEW ASSESSMENT ENGINE</span>
          </div>
          <h1 className="text-base font-bold text-[#111827] mt-0.5">Mock Technical Assessments & Diagnostics</h1>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Role-specific technical, algorithmic, and architectural challenges. Weaknesses automatically route into adaptive roadmap replanning.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Questions List (LeetCode Problem List Style) */}
        <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden flex flex-col h-[680px] shadow-sm">
          <div className="px-4 py-2.5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f9fafb]">
            <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-black" />
              Assessment Bank
            </span>
            <span className="text-[11px] font-mono text-[#6b7280]">{questions.length} problems</span>
          </div>

          <div className="divide-y divide-[#e5e7eb] overflow-y-auto flex-1">
            {questions.map((q, idx) => {
              const isSelected = selectedQuestion?.id === q.id;
              const diffText = q.difficulty <= 2 ? 'Easy' : q.difficulty === 3 ? 'Medium' : 'Hard';
              const diffColor =
                q.difficulty <= 2 ? 'text-[#059669]' : q.difficulty === 3 ? 'text-[#d97706]' : 'text-[#dc2626]';

              return (
                <div
                  key={q.id}
                  onClick={() => {
                    setSelectedQuestion(q);
                    setEvaluationResult(null);
                    setAnswer('');
                  }}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#f3f4f6] border-l-2 border-black' : 'hover:bg-[#f9fafb]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-[#6b7280] font-semibold">{q.targetSkillName}</span>
                    <span className={`${diffColor} font-bold`}>{diffText}</span>
                  </div>
                  <div className="text-xs font-semibold text-[#111827] line-clamp-2">{q.questionText}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Problem & Submission Area (LeetCode Style) */}
        <div className="lg:col-span-2 space-y-4">
          {selectedQuestion && (
            <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
              {/* Problem Title & Meta Header */}
              <div className="p-4 border-b border-[#e5e7eb] space-y-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      selectedQuestion.difficulty <= 2
                        ? 'text-[#059669] bg-[#ecfdf5] border border-[#a7f3d0]'
                        : selectedQuestion.difficulty === 3
                        ? 'text-[#d97706] bg-[#fffbeb] border border-[#fde68a]'
                        : 'text-[#dc2626] bg-[#fef2f2] border border-[#fecaca]'
                    }`}
                  >
                    {selectedQuestion.difficulty <= 2 ? 'Easy' : selectedQuestion.difficulty === 3 ? 'Medium' : 'Hard'}
                  </span>
                  <span className="text-[11px] font-mono text-[#374151] bg-[#f3f4f6] px-2 py-0.5 rounded border border-[#e5e7eb] font-semibold">
                    {selectedQuestion.type}
                  </span>
                  <span className="text-[11px] font-mono text-[#6b7280]">
                    Skill: <span className="text-[#111827] font-semibold">{selectedQuestion.targetSkillName}</span>
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#111827] leading-relaxed">
                  {selectedQuestion.questionText}
                </h3>
              </div>

              {/* Evaluation criteria guideline */}
              {selectedQuestion.sampleAnswerGuideline && (
                <div className="px-4 py-2.5 bg-[#f9fafb] border-b border-[#e5e7eb] text-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-black">Evaluation Criteria:</span>
                  <p className="text-[11px] text-[#6b7280] leading-relaxed">{selectedQuestion.sampleAnswerGuideline}</p>
                </div>
              )}

              {/* Solution Editor Form */}
              <form onSubmit={handleSubmitAnswer} className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#6b7280]">
                  <label className="font-mono text-[11px] font-bold">Technical Solution / Architecture</label>
                  <span className="font-mono text-[10px] text-[#9ca3af]">Markdown / Code Supported</span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="// Provide reasoning, design tradeoffs, edge cases, and code snippet..."
                  className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded p-3 text-xs text-[#111827] font-mono placeholder-[#9ca3af] focus:outline-none focus:border-black leading-relaxed"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-[#6b7280]">
                    Evaluated by LLM Diagnostic Pipeline
                  </span>
                  <button
                    type="submit"
                    disabled={submitting || !answer.trim()}
                    className="px-4 py-1.5 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold rounded flex items-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Running Assessment...' : 'Submit Solution'}</span>
                  </button>
                </div>
              </form>

              {/* Evaluation Feedback Panel */}
              {evaluationResult && (
                <div className="p-4 border-t border-[#e5e7eb] bg-[#f9fafb] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      Submission Result
                    </span>
                    <span
                      className={`text-sm font-mono font-bold ${
                        evaluationResult.score >= 70 ? 'text-[#059669]' : 'text-[#dc2626]'
                      }`}
                    >
                      {evaluationResult.score >= 70 ? 'Accepted' : 'Remediation Needed'} • {evaluationResult.score}%
                    </span>
                  </div>

                  <p className="text-xs text-[#111827] leading-relaxed font-mono bg-white p-3 rounded border border-[#e5e7eb]">
                    {evaluationResult.feedback}
                  </p>

                  {evaluationResult.detectedWeakness && (
                    <div className="p-2.5 rounded bg-[#fef2f2] border border-[#fecaca] text-xs text-[#dc2626] flex items-center gap-2 font-mono">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>
                        Weakness Detected: <strong>{evaluationResult.detectedWeakness}</strong> (Telemetry relayed to Adaptive Replanner)
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Submissions History Table */}
          {history.length > 0 && (
            <div className="bg-white border border-[#e5e7eb] rounded overflow-hidden shadow-sm">
              <div className="px-4 py-2.5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f9fafb]">
                <span className="text-xs font-bold text-[#111827]">Recent Practice Submissions</span>
                <span className="text-[11px] font-mono text-[#6b7280]">{history.length} attempts</span>
              </div>
              <div className="divide-y divide-[#e5e7eb]">
                {history.slice(0, 4).map((h) => (
                  <div key={h.id} className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-[#f9fafb] transition-colors">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-[#111827] line-clamp-1">{h.questionText}</div>
                      <div className="text-[11px] font-mono text-[#6b7280]">
                        {new Date(h.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`font-mono text-xs font-bold ${
                        h.score >= 70 ? 'text-[#059669]' : 'text-[#d97706]'
                      }`}
                    >
                      {h.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
