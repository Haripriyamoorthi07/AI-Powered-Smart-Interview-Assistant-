import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Upload, AlertCircle, CheckCircle, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';

const ResumeAnalyzer = () => {
  const { authFetch } = useAuth();
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    fetchResumeHistory();
  }, []);

  const fetchResumeHistory = async () => {
    try {
      const res = await authFetch('/api/resume/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please drop a valid PDF document.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid PDF document.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await authFetch('/api/resume/analyze', {
        method: 'POST',
        body: formData, // Multer expects multipart/form-data
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to analyze resume');
      }

      setResult(data);
      setFile(null);
      fetchResumeHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">ATS Resume Reviewer</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Audit your resume keywords to match applicant tracking system scoreboards.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Upload form and history panel */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="glass p-6 rounded-3xl border border-slate-200/15 shadow-xl flex flex-col gap-4">
            <h2 className="text-base font-bold">Upload Resume</h2>
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  dragging
                    ? 'border-brand-500 bg-brand-500/5'
                    : 'border-slate-300 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500'
                }`}
                onClick={() => document.getElementById('resume-file').click()}
              >
                <input
                  type="file"
                  id="resume-file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload size={32} className="text-slate-400" />
                  <span className="text-xs font-bold">
                    {file ? file.name : 'Drag & Drop PDF or Browse'}
                  </span>
                  <span className="text-[10px] text-slate-500">Only PDF formats supported (max 5MB)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!file || loading}
                className="w-full py-3 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white rounded-xl font-bold shadow-lg shadow-brand-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Analyzing Keywords...
                  </>
                ) : (
                  <>
                    <BarChart2 size={16} />
                    Run ATS Audit
                  </>
                )}
              </button>
            </form>
          </div>

          {/* History Lists */}
          <div className="glass p-6 rounded-3xl border border-slate-200/15 shadow-xl flex flex-col gap-4">
            <h2 className="text-base font-bold">Scan History</h2>
            {history.length > 0 ? (
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {history.map((h) => (
                  <button
                    key={h._id}
                    onClick={() => setResult(h)}
                    className={`p-3 border rounded-xl text-left text-xs font-semibold flex justify-between items-center transition-all ${
                      result && result._id === h._id
                        ? 'border-brand-500 bg-brand-500/5 text-brand-500 dark:text-brand-300'
                        : 'border-slate-200/10 hover:bg-slate-50/50 dark:hover:bg-brand-800/10'
                    }`}
                  >
                    <div className="truncate pr-3">
                      <p className="font-bold truncate">{h.fileName}</p>
                      <span className="text-[10px] text-slate-400">{new Date(h.analyzedAt).toLocaleDateString()}</span>
                    </div>
                    <span className="font-black">{h.score}%</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No previous resume uploads found.</p>
            )}
          </div>
        </div>

        {/* Results Showcase Panel */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="glass p-6 md:p-8 rounded-3xl border border-slate-200/15 shadow-xl flex flex-col gap-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200/10 pb-5 gap-4">
                <div>
                  <span className="text-[10px] text-brand-500 font-bold uppercase tracking-wider">ATS Scorecard</span>
                  <h2 className="text-xl font-bold truncate max-w-sm mt-0.5">{result.fileName}</h2>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">ATS MATCH RATE</span>
                    <span className="font-black text-2xl text-slate-900 dark:text-white">{result.score}%</span>
                  </div>
                  <div className={`p-3 bg-gradient-to-tr rounded-2xl text-white font-black text-xl shadow-md ${
                    result.score >= 80 ? 'from-green-500 to-emerald-500' : result.score >= 60 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500'
                  }`}>
                    {result.score >= 80 ? 'Good' : result.score >= 60 ? 'Fair' : 'Poor'}
                  </div>
                </div>
              </div>

              {/* Skills vectors */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-500" />
                  Identified Competencies ({result.skills.length})
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-green-500/10 text-green-500 dark:text-green-400 text-xs font-bold rounded-lg border border-green-500/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gaps / Missing Keywords */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-red-500" />
                  Recommended Gaps / Missing Keywords ({result.missingKeywords.length})
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.missingKeywords.map((mk, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-red-500/10 text-red-500 dark:text-red-400 text-xs font-bold rounded-lg border border-red-500/20">
                      {mk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions bullets list */}
              <div className="flex flex-col gap-3 border-t border-slate-200/10 pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Actionable Suggestions for Resume Overhaul</h3>
                <ul className="flex flex-col gap-2 mt-1">
                  {result.suggestions.map((s, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2 items-start">
                      <span className="text-brand-500 mt-1 shrink-0 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="glass p-12 rounded-3xl border border-slate-200/15 shadow-xl text-center flex flex-col items-center gap-3 h-full justify-center min-h-[400px]">
              <FileText size={48} className="text-slate-300 dark:text-slate-700 animate-pulse" />
              <h3 className="font-extrabold text-lg">No Audit Results Selected</h3>
              <p className="text-slate-400 text-sm max-w-sm">
                Drop your PDF resume file on the upload card to run an instant keyword analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
