import React, { useState, useEffect } from 'react';
import { interviewApi } from '../api/client';
import { MessageSquareCode, CheckCircle2, AlertTriangle, Send, BookOpen, Clock } from 'lucide-react';

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
      <div className="flex h-96 items-center justify-center space-x-2 text-[#9ca3af]">
        <div className="w-4 h-4 border-2 border-[#ffa116] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-mono">Loading interview simulator & question banks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#262626] border border-[#333333] rounded px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#ffa116]">
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span>INTERVIEW ASSESSMENT ENGINE</span>
          </div>
          <h1 className="text-base font-semibold text-[#eff1f6] mt-0.5">Mock Technical Assessments & Diagnostics</h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Role-specific technical, algorithmic, and architectural challenges. Weaknesses automatically route into adaptive roadmap replanning.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Questions List (LeetCode Problem List Style) */}
        <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden flex flex-col h-[680px]">
          <div className="px-4 py-2.5 border-b border-[#333333] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#eff1f6] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#ffa116]" />
              Assessment Bank
            </span>
            <span className="text-[11px] font-mono text-[#9ca3af]">{questions.length} problems</span>
          </div>

          <div className="divide-y divide-[#333333] overflow-y-auto flex-1">
            {questions.map((q, idx) => {
              const isSelected = selectedQuestion?.id === q.id;
              const diffText = q.difficulty <= 2 ? 'Easy' : q.difficulty === 3 ? 'Medium' : 'Hard';
              const diffColor =
                q.difficulty <= 2 ? 'text-[#2cbb5d]' : q.difficulty === 3 ? 'text-[#ffc01e]' : 'text-[#ef4743]';

              return (
                <div
                  key={q.id}
                  onClick={() => {
                    setSelectedQuestion(q);
                    setEvaluationResult(null);
                    setAnswer('');
                  }}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#2e2e2e] border-l-2 border-[#ffa116]' : 'hover:bg-[#2a2a2a]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-[#9ca3af] font-semibold">{q.targetSkillName}</span>
                    <span className={diffColor}>{diffText}</span>
                  </div>
                  <div className="text-xs font-medium text-[#eff1f6] line-clamp-2">{q.questionText}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Problem & Submission Area (LeetCode Style) */}
        <div className="lg:col-span-2 space-y-4">
          {selectedQuestion && (
            <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden">
              {/* Problem Title & Meta Header */}
              <div className="p-4 border-b border-[#333333] space-y-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      selectedQuestion.difficulty <= 2
                        ? 'text-[#2cbb5d] bg-[#2cbb5d]/10'
                        : selectedQuestion.difficulty === 3
                        ? 'text-[#ffc01e] bg-[#ffc01e]/10'
                        : 'text-[#ef4743] bg-[#ef4743]/10'
                    }`}
                  >
                    {selectedQuestion.difficulty <= 2 ? 'Easy' : selectedQuestion.difficulty === 3 ? 'Medium' : 'Hard'}
                  </span>
                  <span className="text-[11px] font-mono text-[#9ca3af] bg-[#333333] px-2 py-0.5 rounded">
                    {selectedQuestion.type}
                  </span>
                  <span className="text-[11px] font-mono text-[#9ca3af]">
                    Skill: <span className="text-[#eff1f6]">{selectedQuestion.targetSkillName}</span>
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[#eff1f6] leading-relaxed">
                  {selectedQuestion.questionText}
                </h3>
              </div>

              {/* Evaluation criteria guideline */}
              {selectedQuestion.sampleAnswerGuideline && (
                <div className="px-4 py-2.5 bg-[#202020] border-b border-[#333333] text-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#ffa116]">Evaluation Criteria:</span>
                  <p className="text-[11px] text-[#9ca3af] leading-relaxed">{selectedQuestion.sampleAnswerGuideline}</p>
                </div>
              )}

              {/* Solution Editor Form */}
              <form onSubmit={handleSubmitAnswer} className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#9ca3af]">
                  <label className="font-mono text-[11px]">Technical Solution / Architecture</label>
                  <span className="font-mono text-[10px] text-[#9ca3af]">Markdown / Code Supported</span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="// Provide reasoning, design tradeoffs, edge cases, and code snippet..."
                  className="w-full bg-[#1a1a1a] border border-[#333333] rounded p-3 text-xs text-[#eff1f6] font-mono placeholder-[#6b7280] focus:outline-none focus:border-[#ffa116] leading-relaxed"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-[#9ca3af]">
                    Evaluated by LLM Diagnostic Pipeline
                  </span>
                  <button
                    type="submit"
                    disabled={submitting || !answer.trim()}
                    className="px-4 py-1.5 bg-[#ffa116] hover:bg-[#ffb03a] disabled:opacity-50 text-black text-xs font-semibold rounded flex items-center space-x-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Running Assessment...' : 'Submit Solution'}</span>
                  </button>
                </div>
              </form>

              {/* Evaluation Feedback Panel */}
              {evaluationResult && (
                <div className="p-4 border-t border-[#333333] bg-[#202020] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#eff1f6] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2cbb5d]" />
                      Submission Result
                    </span>
                    <span
                      className={`text-sm font-mono font-bold ${
                        evaluationResult.score >= 70 ? 'text-[#2cbb5d]' : 'text-[#ef4743]'
                      }`}
                    >
                      {evaluationResult.score >= 70 ? 'Accepted' : 'Remediation Needed'} • {evaluationResult.score}%
                    </span>
                  </div>

                  <p className="text-xs text-[#eff1f6] leading-relaxed font-mono bg-[#1a1a1a] p-3 rounded border border-[#333333]">
                    {evaluationResult.feedback}
                  </p>

                  {evaluationResult.detectedWeakness && (
                    <div className="p-2.5 rounded bg-[#ef4743]/10 border border-[#ef4743]/30 text-xs text-[#ef4743] flex items-center gap-2 font-mono">
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
            <div className="bg-[#262626] border border-[#333333] rounded overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#333333] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#eff1f6]">Recent Practice Submissions</span>
                <span className="text-[11px] font-mono text-[#9ca3af]">{history.length} attempts</span>
              </div>
              <div className="divide-y divide-[#333333]">
                {history.slice(0, 4).map((h) => (
                  <div key={h.id} className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-[#2e2e2e] transition-colors">
                    <div className="space-y-0.5">
                      <div className="font-medium text-[#eff1f6] line-clamp-1">{h.questionText}</div>
                      <div className="text-[11px] font-mono text-[#9ca3af]">
                        {new Date(h.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`font-mono text-xs font-bold ${
                        h.score >= 70 ? 'text-[#2cbb5d]' : 'text-[#ffc01e]'
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
