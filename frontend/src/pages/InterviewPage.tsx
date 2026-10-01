import React, { useState, useEffect } from 'react';
import { interviewApi } from '../api/client';
import { MessageSquareCode, CheckCircle2, AlertTriangle, Send, Sparkles, BookOpen } from 'lucide-react';

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
      <div className="flex h-96 items-center justify-center space-x-3 text-slate-400">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Loading interview simulator & question banks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <MessageSquareCode className="w-4 h-4" />
          <span>Interview Assessment Engine</span>
        </div>
        <h1 className="text-xl font-extrabold text-white">Mock Technical Assessments & Weakness Detection</h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Practice role-specific technical, architectural, and behavioral challenges. Answers are evaluated for conceptual depth, and detected weaknesses automatically feedback into your active learning roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Question Selector */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Question Bank</span>
          </h3>

          <div className="space-y-2">
            {questions.map((q) => (
              <div
                key={q.id}
                onClick={() => {
                  setSelectedQuestion(q);
                  setEvaluationResult(null);
                  setAnswer('');
                }}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedQuestion?.id === q.id
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-400">
                    {q.type} • {q.targetSkillName}
                  </span>
                  <span className="text-[10px] text-slate-500">Diff: {q.difficulty}/5</span>
                </div>
                <p className="line-clamp-2">{q.questionText}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Active Workbench */}
        <div className="lg:col-span-2 space-y-4">
          {selectedQuestion && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="space-y-2 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {selectedQuestion.type}
                  </span>
                  <span className="text-xs text-slate-400">
                    Target Competency: <strong className="text-white">{selectedQuestion.targetSkillName}</strong>
                  </span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">{selectedQuestion.questionText}</h3>
              </div>

              {selectedQuestion.sampleAnswerGuideline && (
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Evaluation Criteria:</span>
                  <p className="text-[11px] leading-relaxed">{selectedQuestion.sampleAnswerGuideline}</p>
                </div>
              )}

              <form onSubmit={handleSubmitAnswer} className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">Your Technical Solution / Explanation</label>
                <textarea
                  rows={6}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Provide structured reasoning, discuss architecture, edge cases, and algorithmic complexity..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
                />

                <button
                  type="submit"
                  disabled={submitting || !answer.trim()}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Evaluating Depth...' : 'Submit Response for Evaluation'}</span>
                </button>
              </form>

              {/* Evaluation Feedback */}
              {evaluationResult && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2.5 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Assessment Diagnostic Feedback
                    </span>
                    <span className={`text-sm font-extrabold ${evaluationResult.score >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      Score: {evaluationResult.score}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{evaluationResult.feedback}</p>

                  {evaluationResult.detectedWeakness && (
                    <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>
                        <strong>Weakness Detected:</strong> {evaluationResult.detectedWeakness}. Telemetry relayed to Adaptive Replanning Engine.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Past History */}
          {history.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Past Practice Submissions</h3>
              <div className="space-y-2">
                {history.slice(0, 3).map((h) => (
                  <div key={h.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-200 line-clamp-1">{h.questionText}</div>
                      <div className="text-[10px] text-slate-500">{new Date(h.timestamp).toLocaleDateString()}</div>
                    </div>
                    <span className={`font-bold ${h.score >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
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
