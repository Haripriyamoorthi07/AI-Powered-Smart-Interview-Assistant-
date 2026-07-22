import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { Award, FileText, ArrowLeft, Download, CheckCircle, ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react';

const InterviewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authFetch } = useAuth();
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await authFetch(`/api/interview/${id}`);
        if (!res.ok) throw new Error('Session not found');
        const data = await res.json();
        setSession(data);
        
        // Run celebration confetti if score is high!
        if (data.status === 'completed') {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      } catch (err) {
        console.error(err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  const toggleQuestion = (idx) => {
    setOpenQuestionIndex(openQuestionIndex === idx ? null : idx);
  };

  const handleDownloadPDF = () => {
    if (!session) return;

    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    let y = 20;

    // Report Title Header
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241); // Indigo
    doc.text('AI Smart Interview Assistant', 14, y);
    y += 8;

    doc.setFontSize(14);
    doc.setTextColor(147, 51, 234); // Purple
    doc.text('Mock Interview Evaluation Certificate', 14, y);
    y += 15;

    // Metadata details
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Interview ID: ${session._id}`, 14, y);
    doc.text(`Completed At: ${new Date(session.completedAt || session.startedAt).toLocaleString()}`, width - 85, y);
    y += 8;

    // Horizontal Separator Line
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y, width - 14, y);
    y += 10;

    // Core Metrics Summary Card
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('SESSION DETAILS', 14, y);
    y += 8;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Role: ${session.role}`, 14, y);
    doc.text(`Category: ${session.type}`, 14, y + 6);
    doc.text(`Difficulty: ${session.difficulty}`, 14, y + 12);
    
    // Score visual badge inside PDF
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(99, 102, 241);
    doc.text(`${session.overallFeedback.overallScore}%`, width - 50, y + 8);
    doc.setFontSize(8);
    doc.setTextColor(147, 51, 234);
    doc.text('OVERALL SCORE', width - 50, y + 14);
    y += 24;

    // Competency vectors
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('COMPETENCY ANALYSIS', 14, y);
    y += 8;

    doc.setFont('Helvetica', 'normal');
    doc.text(`Technical Knowledge: ${session.overallFeedback.categoryScores.technical}%`, 14, y);
    doc.text(`Communication Quality: ${session.overallFeedback.categoryScores.communication}%`, width / 2, y);
    y += 10;

    // Divider
    doc.line(14, y, width - 14, y);
    y += 10;

    // Overall Summary Feedback Text
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('AI RECRUITER COMMENTS', 14, y);
    y += 6;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    
    // Split long feedback comments text
    const textLines = doc.splitTextToSize(session.overallFeedback.feedbackText, width - 28);
    doc.text(textLines, 14, y);
    y += (textLines.length * 5) + 12;

    // Questions list
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('QUESTION & RESPONSE LOG', 14, y);
    y += 10;

    session.questions.forEach((q, idx) => {
      // Check pagination limits
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`Q${idx + 1}: ${q.questionText}`, 14, y);
      y += 6;

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const answerLines = doc.splitTextToSize(`Candidate: "${q.userAnswer || 'No response recorded'}"`, width - 28);
      doc.text(answerLines, 14, y);
      y += (answerLines.length * 4.5) + 4;

      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(99, 102, 241);
      doc.text(`Score: ${q.feedback.score}/100`, 14, y);
      y += 5;

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      const improvementLines = doc.splitTextToSize(`Feedback: ${q.feedback.improvements}`, width - 28);
      doc.text(improvementLines, 14, y);
      y += (improvementLines.length * 4.5) + 10;
    });

    // Save compiled file
    doc.save(`Interview_Report_${session.role.replace(/\s+/g, '_')}_${session._id.substring(0, 6)}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto w-full">
      {/* Back button header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-500 font-bold transition-all">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <button
          onClick={handleDownloadPDF}
          className="px-5 py-3 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white rounded-xl shadow-lg shadow-brand-500/10 font-bold transition-all flex items-center gap-2 text-sm"
        >
          <Download size={16} />
          Download PDF Report
        </button>
      </div>

      {/* Main score details layout */}
      <div className="glass p-6 md:p-8 rounded-3xl border border-slate-200/15 shadow-xl flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 font-black text-6xl text-brand-500/5 select-none uppercase">
          Score
        </div>

        {/* Ring score visualizer */}
        <div className="relative shrink-0 w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="8" fill="transparent" />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#indigoPurpleGradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * session.overallFeedback.overallScore) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="indigoPurpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-black">{session.overallFeedback.overallScore}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</span>
          </div>
        </div>

        {/* Category levels and text */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs font-bold border border-green-500/20">
              <Sparkles size={12} />
              <span>AI Analysis Complete</span>
            </div>
            <h1 className="text-2xl font-black mt-2 leading-none">Evaluation Certificate</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {session.overallFeedback.feedbackText}
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 border-t border-slate-200/10 pt-4 mt-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Technical Knowledge</span>
              <span className="text-lg font-extrabold text-brand-500">{session.overallFeedback.categoryScores.technical}%</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Communication style</span>
              <span className="text-lg font-extrabold text-accent-500">{session.overallFeedback.categoryScores.communication}%</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confidence & general</span>
              <span className="text-lg font-extrabold text-green-500">{session.overallFeedback.categoryScores.general}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Questions Response Logs */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FileText size={18} className="text-slate-400" />
          Question and Response Log
        </h2>

        <div className="flex flex-col gap-3">
          {session.questions.map((q, idx) => {
            const isOpen = openQuestionIndex === idx;
            return (
              <div
                key={idx}
                className={`glass rounded-2xl border transition-all overflow-hidden ${
                  isOpen ? 'border-brand-500/30' : 'border-slate-200/15'
                }`}
              >
                {/* Header Toggle */}
                <button
                  onClick={() => toggleQuestion(idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50/50 dark:hover:bg-brand-800/10"
                >
                  <div className="flex items-start gap-4 pr-6">
                    <span className="font-black text-brand-500">Q{idx + 1}</span>
                    <span className="font-bold text-sm leading-snug">{q.questionText}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs font-bold bg-brand-500/10 text-brand-500 px-2 py-0.5 rounded">
                      {q.feedback.score}/100
                    </span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Collapsible Details Body */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-4 border-t border-slate-200/10 flex flex-col gap-5 text-sm">
                    {/* User answer */}
                    <div className="bg-slate-500/5 p-4 rounded-xl border border-slate-200/5">
                      <strong className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Your Response:</strong>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                        "{q.userAnswer || 'No answer recorded.'}"
                      </p>
                    </div>

                    {/* AI Feedback metrics */}
                    <div className="grid md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <strong className="text-green-500 font-bold uppercase tracking-wider block mb-1">Key Strengths:</strong>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{q.feedback.strengths}</p>
                      </div>
                      <div>
                        <strong className="text-red-500 font-bold uppercase tracking-wider block mb-1">Areas of improvement:</strong>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{q.feedback.improvements}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200/10 pt-4 text-xs flex flex-col gap-1.5">
                      <strong className="text-brand-500 font-bold uppercase tracking-wider">Better Sample Answer Reference:</strong>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        "{q.feedback.sampleAnswer}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InterviewReport;
