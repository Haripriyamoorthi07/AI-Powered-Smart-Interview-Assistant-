import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Mic, ShieldCheck, FileSpreadsheet, BarChart3, Users, ChevronDown, MessageSquare, Award, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: Brain,
      title: 'AI Question Generator',
      description: 'Generates role-specific behavioral, HR, and advanced technical questions dynamically tailored to your difficulty tier.',
    },
    {
      icon: Award,
      title: 'Instant Scoring & Audits',
      description: 'Get immediate analytical scoring out of 100 with distinct breakdowns of strengths, gaps, and exemplary sample answers.',
    },
    {
      icon: Mic,
      title: 'Voice Transcription',
      description: 'Practice real-life responses using Speech-to-Text inputs. Our engine transcribes your answers in real-time.',
    },
    {
      icon: FileSpreadsheet,
      title: 'ATS Resume Reviewer',
      description: 'Upload your PDF resume to parse missing keywords, scan matching competencies, and optimize your overall ATS scoring.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track your mock interview progress, watch weekly performance metrics rise, and zoom in on communication style insights.',
    },
    {
      icon: ShieldCheck,
      title: 'Admin Verification',
      description: 'Global control modules allow recruiters or system admins to audit active logs and configure job difficulty templates.',
    },
  ];

  const steps = [
    { num: '01', title: 'Upload Resume & Define Goals', desc: 'Select your target job role (e.g. Software Engineer, AI/ML Specialist) and desired difficulty tier.' },
    { num: '02', title: 'Simulate Mock Session', desc: 'Answer dynamically generated questions via text or voice. Watch the timer and practice under realistic pressure.' },
    { num: '03', title: 'Review Deep AI Evaluation', desc: 'Obtain granular scores, communications analysis, missing technical terminology points, and model answers.' },
    { num: '04', title: 'Download PDF & Iterate', desc: 'Save your complete transcript reports locally. Track your metrics dashboard and practice again to level up.' },
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Full Stack Engineer at Microsoft',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128',
      text: 'This assistant completely cured my technical interview anxiety. The feedback on my communication style made me realize I was rambling. Highly recommended!',
    },
    {
      name: 'Rohan Sharma',
      role: 'Graduate Data Analyst',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128',
      text: 'The resume review identified crucial missing keywords for SQL and Python databases. I updated it, scored 90%, and landed three recruiter callbacks in a week!',
    },
    {
      name: 'David K.',
      role: 'Junior Web Developer',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128',
      text: 'The speech-to-text option is a game-changer. It felt exactly like talking to a real technical recruiter, and the sample answers taught me how to structure my solutions.',
    },
  ];

  const faqs = [
    { q: 'How does the AI evaluate my answers?', a: 'Our system analyzes both the semantic content and articulation of your answers. It compares your input against expert criteria for the chosen role, calculating a performance score (0-100), spotting core strengths/gaps, and generating optimized sample responses.' },
    { q: 'Is my uploaded resume secure?', a: 'Yes. We process PDF documents using local server parsers in memory. We do not distribute or share your resumes, maintaining complete privacy.' },
    { q: 'What interview formats are supported?', a: 'We support HR Interviews, Technical Interviews, Behavioral Interviews, and live Coding Interviews across key software, web, and data analytics job roles.' },
    { q: 'Can I export my interview results?', a: 'Yes! Upon completing any session, you can download a beautifully structured PDF certificate and detailed report containing all questions, answers, and AI grading summaries.' },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-69px)] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-500/10 dark:bg-brand-500/5 blur-[120px] rounded-full -z-10 animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-[300px] h-[300px] bg-accent-500/10 dark:bg-accent-500/5 blur-[100px] rounded-full -z-10 animate-blob" />

      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-16 pb-20 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 text-xs font-bold mb-6 border border-brand-500/20 shadow-inner"
        >
          <Award size={14} />
          <span>No.1 Portfolio project candidate for final year review</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl"
        >
          Ace Your Next Job Interview with{' '}
          <span className="text-gradient font-black">AI Smart Preparation</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-600 dark:text-slate-300 text-lg md:text-xl max-w-2xl mt-6 leading-relaxed"
        >
          Practice role-specific mock interviews, record verbal answers, parse resume gaps, and receive detailed scoring reports generated by Gemini AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto"
        >
          {user ? (
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white rounded-2xl shadow-xl shadow-brand-500/20 font-bold transition-all text-center flex items-center justify-center gap-2 group"
            >
              Go to Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="px-8 py-4 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white rounded-2xl shadow-xl shadow-brand-500/20 font-bold transition-all text-center flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 glass text-slate-800 dark:text-white rounded-2xl font-bold hover:bg-slate-100/50 dark:hover:bg-brand-800/40 transition-all text-center border border-slate-200/30"
              >
                Log In
              </Link>
            </>
          )}
        </motion.div>

        {/* Hero mockup preview card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 w-full max-w-5xl rounded-3xl overflow-hidden glass p-4 shadow-2xl border border-slate-200/20"
        >
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-inner flex flex-col">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-950 border-b border-slate-800">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="mx-auto text-xs text-slate-500 font-mono">interview_dashboard_mockup.js</div>
            </div>
            <div className="p-4 md:p-8 flex flex-col md:flex-row gap-6 text-left">
              <div className="flex-1 flex flex-col gap-4 text-slate-300">
                <span className="text-xs text-brand-400 font-bold tracking-wider uppercase">Active Evaluation</span>
                <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">Technical Question: How do closures work in JavaScript?</h3>
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl font-mono text-sm text-slate-400">
                  "A closure is the combination of a function bundled together with references to its surrounding state..."
                </div>
              </div>
              <div className="w-full md:w-80 p-5 bg-gradient-to-br from-brand-900/40 to-slate-900 border border-brand-500/20 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400 text-sm font-semibold">AI Grading Report</span>
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs font-bold rounded">Completed</span>
                  </div>
                  <div className="text-4xl font-black text-white flex items-baseline gap-1">
                    88<span className="text-slate-400 text-sm font-normal">/100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                    <div className="bg-gradient-to-r from-brand-500 to-accent-500 h-full rounded-full" style={{ width: '88%' }} />
                  </div>
                  <div className="mt-4 space-y-2 text-xs text-slate-400">
                    <div><strong className="text-white">Strength:</strong> Explains scope and lexical context accurately.</div>
                    <div><strong className="text-white">Suggestion:</strong> Provide code syntax details for memory usage.</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-800 mt-4 flex justify-between text-xs text-slate-500">
                  <span>Confidence: 90%</span>
                  <span>Audio Speech: Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 md:px-12 py-20 bg-slate-100/50 dark:bg-slate-950/20 border-y border-slate-200/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold">Packed with Professional Features</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-4">
              Our full-stack solution leverages advanced algorithms to mock real recruiter behavior and give constructive coaching feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="glass p-6 md:p-8 rounded-3xl hover:-translate-y-1 transition-all duration-300 border border-slate-200/15 flex flex-col gap-4 group"
                >
                  <div className="p-3 bg-gradient-to-tr from-brand-500 to-accent-500 rounded-2xl w-fit text-white shadow-lg shadow-brand-500/10 group-hover:scale-105 transition-transform">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="px-6 md:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-4">
              Follow these simple steps to build your confidence and land your dream role.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col gap-4">
                <span className="text-6xl font-black text-brand-500/15 dark:text-brand-500/10 absolute -top-8 -left-4">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold z-10">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-12 py-20 bg-slate-100/50 dark:bg-slate-950/20 border-t border-slate-200/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold">Approved by Job Seekers</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-4">
              Here is what successful candidates say about our system.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <div key={idx} className="glass p-6 md:p-8 rounded-3xl flex flex-col justify-between border border-slate-200/15">
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                  "{test.text}"
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <img src={test.img} alt={test.name} className="w-10 h-10 rounded-full border border-slate-200/30 object-cover" />
                  <div>
                    <h4 className="text-sm font-bold">{test.name}</h4>
                    <span className="text-xs text-slate-400">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="px-6 md:px-12 py-20 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold">Frequently Asked Questions</h2>
          <p className="text-slate-600 dark:text-slate-300 mt-4">Everything you need to know about using our prep assistant.</p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass rounded-2xl overflow-hidden border border-slate-200/15 transition-all">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 text-left flex justify-between items-center font-bold text-sm md:text-base hover:bg-slate-50/50 dark:hover:bg-brand-800/20"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform duration-200 ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-200/10 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 md:px-12 py-16 text-center max-w-4xl mx-auto w-full bg-gradient-to-br from-brand-600/10 to-accent-600/10 rounded-3xl mb-20 border border-brand-500/20 p-6 flex flex-col items-center">
        <MessageSquare size={36} className="text-brand-500 mb-4" />
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Have Questions or Feedback?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mb-6">
          Send us a message and our development team will respond as quickly as possible.
        </p>
        <form onSubmit={(e) => { e.preventDefault(); alert('Message simulation sent! Thank you for your feedback.'); }} className="w-full max-w-md flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Enter your email address"
            required
            className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-brand-500/10"
          >
            Submit
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-slate-200/15 py-10 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-tr from-brand-500 to-accent-500 rounded-lg text-white">
              <Brain size={18} />
            </div>
            <span className="font-bold text-sm tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-accent-600 dark:from-brand-300 dark:to-accent-300">
              Smart Interview Assistant
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <a href="#features" className="hover:text-slate-700 dark:hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-700 dark:hover:text-white transition-colors">How it Works</a>
            <span>&copy; {new Date().getFullYear()} AI Prep Assistant. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
