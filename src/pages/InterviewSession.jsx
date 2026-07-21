import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Volume2, Mic, MicOff, Send, Clock, Play, ArrowRight, Award, User, RefreshCw } from 'lucide-react';

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authFetch } = useAuth();

  const [session, setSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  
  // Audio state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(90);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Load session metadata
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await authFetch(`/api/interview/${id}`);
        if (!res.ok) throw new Error('Session not found');
        const data = await res.json();
        
        // Find current un-answered question index
        let activeIdx = 0;
        for (let i = 0; i < data.questions.length; i++) {
          if (!data.questions[i].userAnswer) {
            activeIdx = i;
            break;
          }
        }
        
        // If all questions are already answered, redirect to report
        if (data.status === 'completed') {
          navigate(`/interview/report/${id}`);
          return;
        }

        setSession(data);
        setCurrentIndex(activeIdx);
        
        // Set timer based on difficulty
        const diff = data.difficulty;
        const timeLimit = diff === 'Beginner' ? 120 : diff === 'Advanced' ? 60 : 90;
        setTimeLeft(timeLimit);
      } catch (err) {
        console.error(err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  // Handle countdown timer
  useEffect(() => {
    if (loading || evaluating || currentFeedback || !session) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, evaluating, currentFeedback, currentIndex, session]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setAnswer((prev) => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Text to Speech voice generation
  const handleSpeakQuestion = () => {
    if (!session || isSpeaking) return;
    
    const questionText = session.questions[currentIndex].questionText;
    const utterance = new SpeechSynthesisUtterance(questionText);
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Mic listen toggle
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Auto-submit answer when timer reaches zero
  const handleAutoSubmit = () => {
    handleSubmitAnswer(answer || 'No answer provided within the time limit.');
  };

  const handleSubmitAnswer = async (answerContent = answer) => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setEvaluating(true);
    try {
      const res = await authFetch(`/api/interview/${id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionIndex: currentIndex, answer: answerContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submit failed');

      setCurrentFeedback(data.feedback);
      setSession(data.session);
    } catch (err) {
      alert(err.message);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNext = () => {
    setCurrentFeedback(null);
    setAnswer('');
    
    const nextIdx = currentIndex + 1;
    if (nextIdx < session.questions.length) {
      setCurrentIndex(nextIdx);
      const diff = session.difficulty;
      const timeLimit = diff === 'Beginner' ? 120 : diff === 'Advanced' ? 60 : 90;
      setTimeLeft(timeLimit);
    } else {
      // Completed, redirect to report screen
      navigate(`/interview/report/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
      </div>
    );
  }

  const currentQuestion = session.questions[currentIndex];

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center max-w-5xl mx-auto w-full gap-6">
      
      {/* Top Session Details Header */}
      <div className="w-full flex justify-between items-center glass px-6 py-4 rounded-2xl border border-slate-200/15">
        <div>
          <span className="text-xs text-brand-500 font-bold uppercase tracking-wider">{session.type}</span>
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400">{session.role} ({session.difficulty})</h2>
        </div>
        <div className="flex items-center gap-2 text-brand-500 font-black text-sm">
          <Clock size={16} className="animate-pulse" />
          <span>{timeLeft}s remaining</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-brand-500 to-accent-500 h-full rounded-full transition-all duration-500" 
          style={{ width: `${((currentIndex + (currentFeedback ? 1 : 0)) / session.questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card Box */}
      <div className="w-full glass p-6 md:p-8 rounded-3xl border border-slate-200/15 shadow-xl relative overflow-hidden flex flex-col gap-5">
        <div className="absolute top-0 right-0 p-4 font-black text-2xl text-brand-500/10">
          Q{currentIndex + 1}/{session.questions.length}
        </div>

        <div className="flex gap-4 items-start pr-12">
          <button 
            onClick={handleSpeakQuestion}
            disabled={isSpeaking}
            className={`p-3 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 rounded-2xl transition-all ${isSpeaking ? 'animate-bounce' : ''}`}
            title="Read Question Out Loud"
          >
            <Volume2 size={20} />
          </button>
          <div>
            <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">Question</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 leading-snug">
              {currentQuestion.questionText}
            </p>
          </div>
        </div>
      </div>

      {/* Answer Workspace Panel */}
      {!currentFeedback ? (
        <div className="w-full flex flex-col gap-4">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={evaluating}
            placeholder="Type your structured answer here, or click the mic button below to record your response verbally..."
            className="w-full h-48 px-5 py-4 bg-white/40 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-semibold resize-none shadow-inner"
          />

          <div className="flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={toggleListening}
              className={`px-5 py-3 rounded-2xl border text-sm font-bold flex items-center gap-2 transition-all ${
                isListening
                  ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/10 animate-pulse'
                  : 'glass text-slate-700 dark:text-slate-200 border-slate-200/20 hover:bg-slate-100/50 dark:hover:bg-brand-800/40'
              }`}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              <span>{isListening ? 'Stop Recording' : 'Voice Input'}</span>
            </button>

            <button
              onClick={() => handleSubmitAnswer()}
              disabled={evaluating}
              className="px-6 py-3 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/10 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {evaluating ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  AI Grading...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Answer
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        // Question Feedback drawer
        <div className="w-full glass p-6 md:p-8 rounded-3xl border border-green-500/20 shadow-xl flex flex-col gap-6 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200/10 pb-4">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-green-500" />
              <h3 className="font-extrabold text-lg text-green-500">AI Question Review</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Score</span>
              <span className="font-black text-2xl text-slate-900 dark:text-white">{currentFeedback.score}/100</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="flex flex-col gap-3">
              <div>
                <strong className="text-green-500 font-bold">Strengths:</strong>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{currentFeedback.strengths}</p>
              </div>
              <div>
                <strong className="text-red-500 font-bold">Weaknesses:</strong>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{currentFeedback.weaknesses}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <strong className="text-brand-500 font-bold">Suggested Improvements:</strong>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{currentFeedback.improvements}</p>
              </div>
              <div>
                <strong className="text-accent-500 font-bold">Communication Analysis:</strong>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{currentFeedback.communication}</p>
              </div>
            </div>
          </div>

          <div className="bg-brand-500/5 border border-brand-500/10 p-4 rounded-2xl text-xs flex flex-col gap-2">
            <strong className="text-brand-500 font-bold uppercase tracking-wider">Better Sample Answer:</strong>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">"{currentFeedback.sampleAnswer}"</p>
          </div>

          <button
            onClick={handleNext}
            className="self-end px-6 py-3 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/10 flex items-center gap-2 transition-all"
          >
            <span>{currentIndex === session.questions.length - 1 ? 'Finish & View Report' : 'Next Question'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewSession;
