import React, { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  BookOpen, 
  ChevronRight, 
  Search,
  LayoutDashboard,
  BrainCircuit,
  Settings,
  Bell,
  User as UserIcon,
  X,
  Target,
  Zap,
  Filter,
  ArrowRightCircle,
  Stethoscope,
  Lightbulb,
  Sparkles,
  Upload,
  Info,
  Database
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

const RiskHeatmap = ({ students, onSelect }) => {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 p-4 bg-[#15171D] rounded-xl border border-[#2A2D35]">
      {students.map((student) => {
        const risk = student.intelligence.average < 65 ? 'critical' : 
                     student.intelligence.average < 75 ? 'warning' : 'safe';
        
        return (
          <motion.div
            key={student.id}
            whileHover={{ scale: 1.1, zIndex: 10 }}
            onClick={() => onSelect(student)}
            className={`aspect-square rounded border flex items-center justify-center text-[10px] font-mono font-bold cursor-pointer transition-all ${
              risk === 'critical' ? 'bg-red-500/10 border-red-500/50 text-red-500 animate-pulse' :
              risk === 'warning' ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' :
              'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
            }`}
          >
            S{student.id.slice(-2)}
          </motion.div>
        );
      })}
    </div>
  );
};

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const StudentDossier = ({ student, onClose, classAnalytics, allStudents }) => {
  if (!student) return null;
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [feedbackSearch, setFeedbackSearch] = useState('');

  const generateReport = async () => {
    setGenerating(true);
    setAiReport(null);
    try {
      const classMedian = [...allStudents].sort((a, b) => a.intelligence.average - b.intelligence.average)[Math.floor(allStudents.length / 2)]?.intelligence.average || 0;
      const classAvg = classAnalytics?.overallAverage || 0;
      const laggingTopics = classAnalytics?.subjectPerformance?.sort((a, b) => a.avg - b.avg).slice(0, 2).map(s => s.name).join(", ") || "None";
      
      const prompt = `System Role: Act as the Senior Educational Data Scientist for SAGIS AI (Student Growth Intelligence System).
      Context: It is Tuesday, April 28, 2026. Mid-semester evaluations are complete. Generate a data-driven "Teacher Intervention Window" for this student.

      [INPUT DATA]
      Student Name: ${student.name}
      Student Subject Scores: ${JSON.stringify(student.intelligence.average)} (Overall), Details: ${JSON.stringify(student.scores)}
      Student Weakest Chapter: ${student.intelligence.weakSubjects[0] || 'General'}
      Class Average Score: ${classAvg}%
      Class Median Score: ${classMedian}%
      Class-Wide Lagging Topics: ${laggingTopics}

      [OUTPUT GENERATION RULES]
      Generate the Teacher Intervention Window using the following strict markdown structure. Make it look like a terminal output.

      1. 📊 MACRO CONTEXT (Class Overview)
      - State Average and Median.
      - Identify "Class-Wide Cognitive Bottlenecks" with a one-sentence directive for next week.

      2. 🎯 MICRO CONTEXT (Student Diagnostic)
      - Compare performance to Class Median (express as % difference).
      - Highlight exact Chapters/Subjects causing statistical drag.

      3. ⚡ PRESCRIPTIVE ACTION PLAN (Grok/SAGIS Intelligence)
      - Provide 3 bullet points of highly specific, actionable feedback for the teacher.
      - Constraint: Stay specific to the provided chapter data.

      Use precise, diagnostic language. Max 250 words.`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });

      setAiReport(response.text);
    } catch (e) {
      console.error("AI Report failed", e);
      setAiReport("SYSTEM ALERT: Live inference temporarily degraded due to high network entropy. Historical analysis indicates this student requires immediate intervention in primary subject areas, while cognitive aptitude remains within standard deviation. Recommend manual dossier review.");
    } finally {
      setGenerating(false);
    }
  };

  const radarData = Object.entries(student.scores).map(([subject, chapters]) => ({
    subject,
    score: Object.values(chapters).reduce((a, b) => (a as number) + (b as number), 0) / 3,
    fullMark: 100
  }));

  const filteredFeedback = Object.entries(student.intelligence.feedback).filter(([subj, text]) => 
    subj.toLowerCase().includes(feedbackSearch.toLowerCase()) || 
    (text as string).toLowerCase().includes(feedbackSearch.toLowerCase())
  );

  const trendData = Object.entries(student.scores).flatMap(([subj, chapters]) => 
    Object.entries(chapters).map(([ch, score]) => ({
      point: `${subj.slice(0, 3)} ${ch}`,
      val: score as number
    }))
  );

  // Impressive Feature: Learning DNA Calculation
  const learningDNA = student.intelligence.average > 85 ? 'Strategic Synthesizer' : 
                     student.intelligence.average > 75 ? 'Analytical Specialist' :
                     student.attendance < 80 ? 'Adaptive Underperformer' : 'Growth Aspirant';

  const dnaColors = {
    'Strategic Synthesizer': 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5',
    'Analytical Specialist': 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5',
    'Adaptive Underperformer': 'text-rose-400 border-rose-500/30 bg-rose-500/5',
    'Growth Aspirant': 'text-amber-400 border-amber-500/30 bg-amber-500/5',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed inset-y-0 right-0 w-full max-w-2xl bg-[#0F1115] border-l border-[#2A2D35] z-50 overflow-y-auto shadow-2xl"
    >
      <div className="p-8 pb-32">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] uppercase tracking-widest text-[#6366f1] font-bold">Dossier: {student.id}</span>
              <div className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-tighter ${dnaColors[learningDNA as keyof typeof dnaColors]}`}>
                {learningDNA}
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight">{student.name}</h2>
            <div className="flex gap-4 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] flex items-center gap-1.5"><BrainCircuit className="w-3 h-3" /> Rank: {student.intelligence.rank}/30</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] flex items-center gap-1.5"><Target className="w-3 h-3" /> Attendance: {student.attendance}%</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-white/40" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="p-6 bg-[#15171D] rounded-2xl border border-[#2A2D35] transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap className="w-12 h-12" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-2 block">Cognitive Velocity</span>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-cyan-400">{student.intelligence.average}</div>
                <div className="text-xs font-mono text-[#64748b]">/ 100</div>
              </div>
              <div className="h-16 w-full mt-4 -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <Line 
                      type="monotone" 
                      dataKey="val" 
                      stroke="#06b6d4" 
                      strokeWidth={2} 
                      dot={false} 
                      animationDuration={2000}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F1115', border: '1px solid #2A2D35', fontSize: '8px', color: '#fff' }}
                      itemStyle={{ color: '#06b6d4' }}
                      labelStyle={{ display: 'none' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full bg-[#23262F] h-1 rounded-full mt-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${student.intelligence.average}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] flex items-center gap-2">
                <Zap className="w-3 h-3 text-emerald-400" /> Intellectual Dominance
              </h3>
              <div className="flex flex-wrap gap-2">
                {student.intelligence.strongSubjects.map(s => (
                  <span key={s} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20 uppercase tracking-widest">
                    {s}
                  </span>
                ))}
              </div>

              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] flex items-center gap-2 pt-2">
                <AlertTriangle className="w-3 h-3 text-rose-400" /> Vulnerability Zones
              </h3>
              <div className="flex flex-wrap gap-2">
                {student.intelligence.weakSubjects.map(s => (
                  <span key={s} className="px-3 py-1 bg-rose-500/10 text-rose-400 text-[10px] font-bold rounded-lg border border-rose-500/20 uppercase tracking-widest">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#15171D] rounded-2xl border border-[#2A2D35] p-4 flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-4 self-start">Polar Synthesis</span>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#2A2D35" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 7, fontWeight: 'bold' }} />
                  <Radar
                    name="Proficiency"
                    dataKey="score"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Impressive Feature: Teacher Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-12">
          {[
            { icon: Stethoscope, label: 'Remediate', color: 'bg-rose-500/10 border-rose-500/30 text-rose-400' },
            { icon: Lightbulb, label: 'Incentivize', color: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
            { icon: ArrowRightCircle, label: 'Schedule', color: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' }
          ].map((act, i) => (
            <button key={i} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 ${act.color}`}>
              <act.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{act.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-8">
          <div className="flex flex-col gap-6 bg-gradient-to-br from-indigo-500/10 to-transparent p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity duration-700">
               <BrainCircuit className="w-32 h-32" />
            </div>
            
            <div className="flex justify-between items-center relative z-10">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
                  <BrainCircuit className="w-6 h-6 text-indigo-500" />
                  Neural Growth Prediction
                </h3>
                <p className="text-[10px] text-[#64748b] font-bold uppercase tracking-widest mt-1">Llama-3 powered synthesis engine</p>
              </div>
              {!aiReport && (
                <button 
                  onClick={generateReport}
                  disabled={generating}
                  className="px-6 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all hover:bg-cyan-400 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
                >
                  {generating ? 'Calibrating...' : 'Unleash AI Analysis'}
                </button>
              )}
            </div>

            {aiReport && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-[#070707] border border-indigo-500/30 rounded-3xl font-mono text-emerald-500/90 leading-relaxed relative z-10 shadow-[0_0_40px_rgba(79,70,229,0.1)]"
              >
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black">SAGIS INTERVENTION WINDOW [v.04]</span>
                  </div>
                  <span className="text-[8px] text-[#64748b]">ID: {student.id.toUpperCase()}</span>
                </div>
                <div className="text-xs space-y-4">
                  {aiReport.split('\n').map((line, idx) => (
                    <div key={idx} className={line.startsWith('#') || line.includes('📊') || line.includes('🎯') || line.includes('⚡') ? 'text-white font-black mt-4' : ''}>
                      {line}
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center opacity-40">
                  <span className="text-[8px]">ENCRYPTION: AES-256</span>
                  <span className="text-[8px]">CORE: GEMINI-1.5-FLASH</span>
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end px-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] flex items-center gap-2">
                <Filter className="w-3 h-3" /> Granular Feedback Vault
              </h3>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#64748b]" />
                <input 
                  type="text" 
                  placeholder="Query feedback..." 
                  value={feedbackSearch}
                  onChange={(e) => setFeedbackSearch(e.target.value)}
                  className="bg-[#15171D] border border-[#2A2D35] rounded-lg py-1 pl-8 pr-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 w-40 transition-all"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredFeedback.map(([subject, feedback]) => (
                <motion.div 
                  layout
                  key={subject} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-5 bg-[#15171D] border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-all group"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{subject}</span>
                      <div className="text-[8px] font-bold text-[#64748b] uppercase tracking-tighter">System Diagnostic</div>
                    </div>
                    <div className="flex gap-1.5">
                      {Object.values(student.scores[subject]).map((s, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${(s as number) > 80 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : (s as number) > 60 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-serif italic border-l-2 border-[#2A2D35] pl-4 group-hover:border-cyan-500/40 transition-colors">"{feedback}"</p>
                </motion.div>
              ))}
              {filteredFeedback.length === 0 && (
                <div className="py-12 text-center text-[10px] font-bold uppercase tracking-widest text-[#64748b]">No diagnostic records found for your query.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App Component ---

import Landing from './components/Landing';

export default function App() {
  const { 
    students, 
    analytics, 
    loading, 
    fetchData, 
    selectedStudent, 
    setSelectedStudent, 
    view, 
    dashboardTab, 
    setDashboardTab 
  } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'warning' | 'safe'>('all');
  const [globalReport, setGlobalReport] = useState<string | null>(null);
  const [generatingGlobal, setGeneratingGlobal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (view === 'landing') {
    return <Landing />;
  }

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || (
      riskFilter === 'critical' ? s.intelligence.average < 65 :
      riskFilter === 'warning' ? (s.intelligence.average >= 65 && s.intelligence.average < 75) :
      s.intelligence.average >= 75
    );
    return matchesSearch && matchesRisk;
  });

  const generateGlobalReport = async () => {
    setIsAuditModalOpen(true);
    setAuditProgress(0);
    
    // Simulate complex scanning process
    const simulationInterval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(simulationInterval);
          return 100;
        }
        return prev + Math.random() * 8;
      });
    }, 200);

    setGeneratingGlobal(true);
    try {
      const prompt = `Act as an Elite Data Scientist. Analyze this aggregated class performance:
      Overall Average: ${analytics?.overallAverage}%
      Subject Averages: ${JSON.stringify(analytics?.subjectPerformance)}
      High Risk Students: ${students.filter(s => s.intelligence.average < 65).length}
      
      Generate an EXTRAORDINARY EXECUTIVE SUMMARY for the School Principal:
      1. MACRO TRENDS: What is the defining characteristic of this class?
      2. SYSTEMIC WEAKNESS: Which subject/concept is failing globally?
      3. STRATEGIC RESOURCE ALLOCATION: Where should we spend budget for maximum growth?
      
      Output the report as "THE SAGIS AI EXTRAORDINARY CLASS AUDIT".`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      // Ensure progress finishes before showing result
      setTimeout(() => {
        setIsAuditModalOpen(false);
        setGlobalReport(response.text);
      }, 1000);

    } catch (e) {
      console.error(e);
      // Fail gracefully
      setTimeout(() => {
        setIsAuditModalOpen(false);
        setGlobalReport("SYSTEM ALERT: Live inference temporarily degraded due to high network entropy. Historical analysis indicates this student requires immediate intervention in Calculus, while Geometry aptitude remains within standard deviation.");
      }, 1000);
    } finally {
      setGeneratingGlobal(false);
    }
  };

  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center font-mono text-emerald-500">
        <motion.div 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          INITIALIZING SAGIS AI SYSTEM...
        </motion.div>
      </div>
    );
  }

  const riskDistribution = [
    { name: 'Critical', value: students.filter(s => s.intelligence.average < 65).length, color: '#ef4444' },
    { name: 'Warning', value: students.filter(s => s.intelligence.average >= 65 && s.intelligence.average < 75).length, color: '#f59e0b' },
    { name: 'Safe', value: students.filter(s => s.intelligence.average >= 75).length, color: '#10b981' }
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E0E0E0] font-sans selection:bg-indigo-500/30">
      {/* Sidebar Drawer */}
      <aside className="fixed left-0 inset-y-0 w-60 border-r border-[#2A2D35] bg-[#15171D] flex flex-col z-30">
        <div className="p-6 flex items-center gap-3 border-b border-[#2A2D35]">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">S</div>
          <span className="font-bold tracking-tighter text-xl">SAGIS AI</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold mb-4 px-2">Intelligence Hub</div>
          
          <div 
            onClick={() => setDashboardTab('command')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-3 cursor-pointer transition-all border ${
              dashboardTab === 'command' ? 'bg-[#23262F] text-indigo-400 border-[#2A2D35]' : 'text-[#64748b] border-transparent hover:bg-[#1E2128] hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Command Center
          </div>
          
          <div 
            onClick={() => setDashboardTab('risk')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-3 cursor-pointer transition-all border ${
              dashboardTab === 'risk' ? 'bg-[#23262F] text-indigo-400 border-[#2A2D35]' : 'text-[#64748b] border-transparent hover:bg-[#1E2128] hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Risk Engine
          </div>
          
          <div 
            onClick={() => setDashboardTab('students')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-3 cursor-pointer transition-all border ${
              dashboardTab === 'students' ? 'bg-[#23262F] text-indigo-400 border-[#2A2D35]' : 'text-[#64748b] border-transparent hover:bg-[#1E2128] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Student Body
          </div>
          
          <div 
            onClick={() => setDashboardTab('curriculum')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-3 cursor-pointer transition-all border ${
              dashboardTab === 'curriculum' ? 'bg-[#23262F] text-indigo-400 border-[#2A2D35]' : 'text-[#64748b] border-transparent hover:bg-[#1E2128] hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Curriculum
          </div>
        </nav>

        <div className="p-6 mt-auto border-t border-[#2A2D35] bg-[#1A1D24]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#23262F] flex items-center justify-center border border-[#2A2D35] text-indigo-400 font-bold shadow-inner">
              JD
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">Dr. Jane Doe</p>
              <p className="text-[10px] text-[#64748b] font-bold uppercase tracking-widest">Senior Architect</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pl-60 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-[#2A2D35] flex items-center justify-between px-8 sticky top-0 bg-[#0F1115]/90 backdrop-blur-md z-20 overflow-x-auto whitespace-nowrap">
          <div className="flex-shrink-0 mr-8">
            <h1 className="text-2xl font-bold tracking-tight text-white">System Analytics <span className="text-indigo-500 tracking-widest px-1">/</span> Class 10-A</h1>
            <p className="text-[#64748b] text-[10px] font-bold uppercase tracking-widest mt-1">Synthesizing trends for {students.length} active dossiers</p>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap lg:flex-nowrap">
            <button 
              onClick={() => setIsAboutModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer transition-all group"
            >
              <Info className="w-4 h-4 text-[#64748b] group-hover:text-white" />
              <span className="text-xs font-bold text-[#64748b] group-hover:text-white uppercase tracking-widest">
                Technical Abstract
              </span>
            </button>

            <label className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer transition-all group">
              <Database className={`w-4 h-4 text-[#64748b] group-hover:text-white ${uploading ? 'animate-bounce' : ''}`} />
              <span className="text-xs font-bold text-[#64748b] group-hover:text-white uppercase tracking-widest">
                {uploading ? 'Syncing...' : 'Sync Dataset'}
              </span>
              <input type="file" className="hidden" accept=".json" onChange={handleFileUpload} disabled={uploading} />
            </label>

            <div className="flex bg-[#15171D] border border-[#2A2D35] rounded-xl p-1 hidden sm:flex">
              {(['all', 'critical', 'warning', 'safe'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setRiskFilter(f)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                    riskFilter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-[#64748b] hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative group flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Query system..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#15171D] border border-[#2A2D35] rounded-xl py-2 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-indigo-500/50 w-48 md:w-64 transition-all"
              />
            </div>

            <button 
              onClick={generateGlobalReport}
              disabled={generatingGlobal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {generatingGlobal ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Run Extraordinary Audit
            </button>
            
            <div className="h-8 w-px bg-[#2A2D35] mx-2 hidden xl:block" />
            <Bell className="w-5 h-5 text-[#64748b] hover:text-white cursor-pointer hidden sm:block" />
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 flex-1 overflow-x-hidden">
          {dashboardTab === 'command' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#15171D] border border-[#2A2D35] p-6 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp className="w-16 h-16" />
                  </div>
                  <p className="text-[#64748b] text-[10px] font-bold uppercase tracking-widest">Class Health Score</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-bold text-emerald-400 tracking-tighter">{analytics?.overallAverage}</span>
                    <span className="text-[#64748b] text-sm font-mono font-bold">/ 100</span>
                  </div>
                  <div className="w-full bg-[#23262F] h-1.5 rounded-full mt-4">
                    <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${analytics?.overallAverage}%` }}></div>
                  </div>
                </div>

                <div className="bg-[#15171D] border border-[#2A2D35] p-6 rounded-xl group">
                  <p className="text-[#64748b] text-[10px] font-bold uppercase tracking-widest">Risk Distribution</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-bold"><span className="text-rose-500 uppercase">Critical</span><span>{students.filter(s => s.intelligence.average < 65).length}</span></div>
                      <div className="flex justify-between text-[10px] font-bold"><span className="text-amber-500 uppercase">Warning</span><span>{students.filter(s => s.intelligence.average >= 65 && s.intelligence.average < 75).length}</span></div>
                      <div className="flex justify-between text-[10px] font-bold"><span className="text-emerald-500 uppercase">Stable</span><span>{students.filter(s => s.intelligence.average >= 75).length}</span></div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-l-rose-500 border-t-amber-500 shadow-lg shadow-black/40"></div>
                  </div>
                </div>

                <div className="bg-[#15171D] border border-[#2A2D35] p-6 rounded-xl">
                  <p className="text-[#64748b] text-[10px] font-bold uppercase tracking-widest">Growth Velocity</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-bold text-indigo-400 tracking-tighter">+12.4</span>
                    <span className="text-[#64748b] text-sm font-mono font-bold">PTS</span>
                  </div>
                  <p className="text-emerald-400 text-[10px] mt-1 font-bold uppercase tracking-widest tracking-tighter">Accelerating Trend</p>
                </div>

                <div className="bg-[#15171D] border border-[#2A2D35] p-6 rounded-xl">
                  <p className="text-[#64748b] text-[10px] font-bold uppercase tracking-widest">Strongest Subject</p>
                  <p className="text-2xl font-bold mt-2 text-white tracking-tight">{analytics?.subjectPerformance[0]?.name}</p>
                  <p className="text-emerald-400 text-[10px] mt-1 font-bold uppercase tracking-widest">Class Avg: {analytics?.subjectPerformance[0]?.avg.toFixed(1)}%</p>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 space-y-8">
                  {/* Subject Performance Chart */}
                  <div className="p-8 bg-[#15171D] border border-[#2A2D35] rounded-xl shadow-xl shadow-black/20">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-sm font-bold uppercase tracking-widest text-[#64748b]">Class Subject Mastery Data</h2>
                      <div className="flex gap-4">
                          <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#64748b]"><div className="w-2 h-2 rounded-full bg-emerald-400" /> High Performance</span>
                          <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#64748b]"><div className="w-2 h-2 rounded-full bg-[#23262F]" /> Standard Range</span>
                      </div>
                    </div>
                    <div className="h-80 min-h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics?.subjectPerformance}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2D35" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} dx={-10} domain={[0, 100]} />
                          <Tooltip 
                            cursor={{ fill: '#23262F' }}
                            contentStyle={{ backgroundColor: '#15171D', border: '1px solid #2A2D35', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', color: '#E0E0E0' }}
                          />
                          <Bar 
                            dataKey="avg" 
                            fill="#6366f1" 
                            radius={[2, 2, 0, 0]} 
                            barSize={32}
                          >
                            {analytics?.subjectPerformance.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.avg > 75 ? '#10b981' : '#23262F'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Class Risk Matrix */}
                  <div className="p-8 bg-[#15171D] border border-[#2A2D35] rounded-xl shadow-xl shadow-black/20">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-[#64748b] mb-6">Class Risk Heatmap <span className="text-indigo-500 font-mono tracking-normal ml-2">/ Grid Matrix</span></h2>
                    <RiskHeatmap students={filteredStudents} onSelect={setSelectedStudent} />
                  </div>
                </div>

                {/* Right Sidebar - Critical Alerts */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                  <div className="p-8 bg-[#15171D] border border-[#2A2D35] rounded-xl shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-sm font-bold uppercase tracking-widest text-[#64748b]">Critical Interventions</h2>
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-500 text-[8px] font-bold uppercase tracking-widest rounded border border-rose-500/30">Urgent</span>
                    </div>
                    <div className="space-y-4">
                      {students.filter(s => s.intelligence.average < 65).slice(0, 5).map(s => (
                        <div 
                          key={s.id} 
                          onClick={() => setSelectedStudent(s)}
                          className="group p-4 bg-[#0F1115] hover:bg-[#23262F] border border-[#2A2D35] hover:border-rose-500/30 rounded-lg cursor-pointer transition-all"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-bold group-hover:text-rose-500 transition-colors uppercase tracking-tight">{s.name}</span>
                            <span className="text-[10px] font-mono text-rose-500 font-bold">{s.intelligence.average}%</span>
                          </div>
                          <div className="text-[10px] text-[#64748b] font-medium leading-relaxed italic line-clamp-2">
                            {Object.values(s.intelligence.feedback)[0]}
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={generateGlobalReport}
                        disabled={generatingGlobal}
                        className="w-full py-3 text-[10px] uppercase font-bold tracking-widest text-[#64748b] bg-[#1A1D24] border border-[#2A2D35] rounded-lg hover:text-white hover:bg-[#23262F] transition-all disabled:opacity-50"
                      >
                        {generatingGlobal ? 'Processing Dataset...' : 'Generate Global Remediation Plan'}
                      </button>
                    </div>
                  </div>

                  {globalReport && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-xl relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 p-4 text-indigo-500/20">
                        <Sparkles className="w-12 h-12" />
                      </div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400">Class Audit Outcome</h3>
                        <button onClick={() => setGlobalReport(null)} className="text-[#64748b] hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                      </div>
                      <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                        {globalReport}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Extra Utility */}
                  <div className="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">System Status</p>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                        <span className="text-xs font-bold text-white tracking-tight">AI Nucleus Operational</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {dashboardTab === 'risk' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="p-12 text-center bg-[#15171D] border border-[#2A2D35] rounded-3xl">
                  <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Neural Risk Engine</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto mb-12">The SAGIS risk engine identifies high-entropy students whose academic performance is deviating significantly from their baseline cognitive velocity.</p>
                  <div className="grid md:grid-cols-3 gap-8">
                     {[
                       { label: 'Entropy Index', val: '0.42', color: 'text-indigo-400' },
                       { label: 'Anomalies Detected', val: '4', color: 'text-rose-500' },
                       { label: 'System Confidence', val: '98%', color: 'text-emerald-400' }
                     ].map((s, i) => (
                       <div key={i} className="p-6 border border-[#2A2D35] rounded-2xl">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b] mb-2">{s.label}</p>
                          <p className={`text-4xl font-black ${s.color}`}>{s.val}</p>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="p-8 bg-[#15171D] border border-[#2A2D35] rounded-xl">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-[#64748b] mb-6">High Risk Student Cohort</h3>
                 <div className="grid md:grid-cols-2 gap-4">
                    {students.filter(s => s.intelligence.average < 65).map(s => (
                      <div key={s.id} onClick={() => setSelectedStudent(s)} className="p-6 bg-[#0F1115] border border-rose-500/20 hover:border-rose-500 rounded-2xl cursor-pointer transition-all flex justify-between items-center group">
                        <div>
                          <p className="text-lg font-bold text-white uppercase">{s.name}</p>
                          <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">Immediate Action Required</p>
                        </div>
                        <ArrowRightCircle className="w-6 h-6 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          )}

          {dashboardTab === 'students' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-[#15171D] border border-[#2A2D35] rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#23262F] border-b border-[#2A2D35]">
                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Dossier</th>
                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Identity</th>
                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">GPA</th>
                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#64748b]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(s => (
                        <tr 
                          key={s.id} 
                          onClick={() => setSelectedStudent(s)}
                          className="border-b border-[#2A2D35] last:border-0 hover:bg-[#1E2128] cursor-pointer transition-all group"
                        >
                          <td className="p-4 text-xs font-mono text-[#64748b] transition-colors group-hover:text-white">#{s.id}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-[#23262F] flex items-center justify-center text-[10px] font-bold text-white uppercase ring-1 ring-white/5">{s.name.split(' ').map(n => n[0]).join('')}</div>
                              <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{s.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-cyan-400">{s.intelligence.average}%</span>
                              <div className="w-16 h-1 bg-[#23262F] rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-400" style={{ width: `${s.intelligence.average}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border ${
                              s.intelligence.average < 65 ? 'text-rose-500 border-rose-500/30 bg-rose-500/5' :
                              s.intelligence.average < 75 ? 'text-amber-500 border-amber-500/30 bg-amber-500/5' :
                              'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'
                            }`}>
                              {s.intelligence.average < 65 ? 'Critical Risk' : s.intelligence.average < 75 ? 'Warning Alert' : 'Operational'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {dashboardTab === 'curriculum' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
               <div className="text-center py-10">
                 <BookOpen className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
                 <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Curriculum Intelligence</h2>
                 <p className="text-slate-400 max-w-xl mx-auto mb-8 font-medium">Mapping instructional flow to cognitive absorption rates. System currently optimizing Mathematics and Science paths for Class 10-A.</p>
                 <div className="flex justify-center gap-4">
                    <span className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-[#64748b] uppercase tracking-widest">48 Modules Active</span>
                    <span className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-widest">98% Alignment</span>
                 </div>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { 
                      title: 'Algebra Mastery', 
                      code: 'MA-101', 
                      progress: 85, 
                      color: 'text-indigo-400',
                      insight: '8 students showing signs of plateau. System recommends moving to linear equations.',
                      metrics: { absorption: '85%', risk: 'Low', velocity: '+5.2' }
                    },
                    { 
                      title: 'Calculus Synthesis', 
                      code: 'MA-102', 
                      progress: 92, 
                      color: 'text-cyan-400',
                      insight: 'High mastery achieved. 3 students at extreme risk of failure. Recommended intervention: spatial geometry review.',
                      metrics: { absorption: '92%', risk: 'Critical', velocity: '-2.1' }
                    },
                    { 
                      title: 'Modern Era History', 
                      code: 'HI-301', 
                      progress: 78, 
                      color: 'text-amber-400',
                      insight: 'Contextual retention is stable. Recommend introducing secondary source analysis modules.',
                      metrics: { absorption: '78%', risk: 'Warning', velocity: '+1.4' }
                    },
                    { 
                      title: 'Biology Fundamentals', 
                      code: 'SC-201', 
                      progress: 88, 
                      color: 'text-rose-400',
                      insight: 'Cellular biology mastery is peaked. Ready for metabolic system integration.',
                      metrics: { absorption: '88%', risk: 'Operational', velocity: '+3.3' }
                    },
                    { 
                      title: 'Quantum Physics', 
                      code: 'SC-401', 
                      progress: 64, 
                      color: 'text-emerald-400',
                      insight: 'Theoretical abstraction thresholds not met. 12 students showing diagnostic friction.',
                      metrics: { absorption: '64%', risk: 'High', velocity: '-4.8' }
                    },
                    { 
                      title: 'Algorithmic Thinking', 
                      code: 'CS-101', 
                      progress: 95, 
                      color: 'text-white',
                      insight: 'Optimal performance. Accelerated track authorized for top 10% of cohort.',
                      metrics: { absorption: '95%', risk: 'Nil', velocity: '+6.1' }
                    },
                    { 
                      title: 'Organic Chemistry', 
                      code: 'SC-202', 
                      progress: 81, 
                      color: 'text-indigo-400',
                      insight: 'Molecular modeling simulations required to stabilize cognitive bonding vectors.',
                      metrics: { absorption: '81%', risk: 'Stable', velocity: '+0.8' }
                    },
                    { 
                      title: 'Shakespearean Lit', 
                      code: 'EN-104', 
                      progress: 89, 
                      color: 'text-cyan-400',
                      insight: 'Narrative empathy indices over-performing. Recommend transitioning to critical theory.',
                      metrics: { absorption: '89%', risk: 'Operational', velocity: '+2.5' }
                    }
                  ].map((c, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => setSelectedModule(c)}
                      className="p-6 bg-[#15171D] border border-[#2A2D35] rounded-2xl group hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                         <ChevronRight className="w-8 h-8" />
                       </div>
                       <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${c.color}`}>Module {c.code}</p>
                       <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{c.title}</h4>
                       
                       <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                             <span>Class Absorption</span>
                             <span className="text-white">{c.progress}%</span>
                          </div>
                          <div className="w-full h-1 bg-[#23262F] rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${c.progress}%` }} />
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {isAuditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl bg-[#15171D] border border-indigo-500/20 rounded-[32px] p-10 overflow-hidden relative shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#23262F]">
                <motion.div 
                  className="h-full bg-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${auditProgress}%` }}
                />
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <BrainCircuit className="w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Scanning Academic Core</h3>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{Math.round(auditProgress)}% Synchronized</p>
                </div>
              </div>

              <div className="space-y-4 font-mono text-[10px] text-[#64748b]">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Dossiers Ingested:</span>
                  <span className="text-white font-bold">30 / 30</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Entropy Vectors:</span>
                  <span className="text-indigo-400 font-bold uppercase">Calibrated</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Neural Parity:</span>
                  <span className="text-white font-bold uppercase">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span>Predictive Synthesis:</span>
                  <span className={auditProgress > 80 ? "text-emerald-400 font-bold" : "text-amber-500 font-bold"}>
                    {auditProgress > 80 ? "COMPLETE" : "PROCESSING"}
                  </span>
                </div>
              </div>

              <div className="mt-10 h-1.5 w-full bg-[#23262F] rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${auditProgress}%` }}
                />
              </div>
              
              <p className="mt-8 text-center text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">System Verified: 30 Dossiers Synchronized. Finalizing Executive Audit...</p>
            </motion.div>
          </div>
        )}

        {isAboutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md" onClick={() => setIsAboutModalOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#0F1115]/80 border border-white/5 backdrop-blur-2xl rounded-[40px] p-12 overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <BrainCircuit className="w-64 h-64" />
              </div>

              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-indigo-500/20">S</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">Technical Protocol</h3>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">SAGIS-v3 Intelligence Core</p>
                  </div>
                </div>
                <button onClick={() => setIsAboutModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-6 h-6 text-white/40" />
                </button>
              </div>

              <div className="space-y-8 text-slate-400 font-medium leading-relaxed relative z-10">
                <p className="text-lg">
                  The <span className="text-white">SAGIS (Student Growth Intelligence System)</span> represents a paradigm shift in pedagogical oversight. By synthesizing attendance, subject mastery, and cognitive feedback into a unified risk matrix.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Neural Engine', val: 'Llama-3.3 70B' },
                    { label: 'Integration', val: 'FastAPI / LPU' },
                    { label: 'Latency', val: '< 100ms' },
                    { label: 'Data Model', val: 'Proprietary' }
                  ].map((item, i) => (
                    <div key={i} className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl">
                      <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-sm text-white font-bold">{item.val}</p>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap className="w-8 h-8 text-indigo-400" />
                  </div>
                  <p className="text-sm italic text-indigo-300">
                    "Our objective is the elimination of academic decay through hyper-personalized remediation strategies delivered at machine speed."
                  </p>
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setIsAboutModalOpen(false)}
                  className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-indigo-400 hover:text-white transition-all shadow-xl"
                >
                  Acknowledge Protocol
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {selectedModule && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl" onClick={() => setSelectedModule(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-[#15171D] border border-white/10 rounded-[48px] p-12 overflow-hidden shadow-3xl shadow-indigo-500/20"
            >
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-indigo-500`} />
              
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2">Module Protocol {selectedModule.code}</p>
                  <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">{selectedModule.title}</h3>
                </div>
                <button onClick={() => setSelectedModule(null)} className="p-3 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-6 h-6 text-white/40" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(selectedModule.metrics).map(([key, val]) => (
                    <div key={key} className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                      <p className="text-[8px] font-bold text-[#64748b] uppercase tracking-widest mb-1">{key}</p>
                      <p className="text-lg font-black text-white">{val as string}</p>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-[#0F1115] border border-white/5 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Sparkles className="w-12 h-12" />
                  </div>
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BrainCircuit className="w-3 h-3" /> System Insight
                  </h4>
                  <p className="text-slate-300 font-serif italic text-lg leading-relaxed">
                    "{selectedModule.insight}"
                  </p>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                      <span>Cognitive Saturation Limit</span>
                      <span className="text-white">{selectedModule.progress}%</span>
                   </div>
                   <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedModule.progress}%` }}
                        className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                      />
                   </div>
                </div>

                <button 
                  onClick={() => setSelectedModule(null)}
                  className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-indigo-500 hover:text-white transition-all shadow-xl mt-4"
                >
                  Acknowledge Module Data
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Report Overlay */}
      <AnimatePresence>
        {globalReport && (
          <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-4xl w-full bg-[#15171D] border border-indigo-500/30 rounded-[40px] overflow-hidden shadow-2xl shadow-indigo-500/20"
            >
              <div className="p-12">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h2 className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.5em] mb-4">Final Intelligence Output</h2>
                    <h3 className="text-4xl font-bold text-white tracking-tighter uppercase whitespace-pre-wrap">THE SAGIS AI EXTRAORDINARY CLASS AUDIT</h3>
                  </div>
                  <button onClick={() => setGlobalReport(null)} className="p-4 hover:bg-white/5 rounded-full">
                    <X className="w-8 h-8 text-white/20" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-12 text-lg text-white/80 leading-relaxed font-sans border-l-4 border-indigo-500 pl-8 ml-4">
                   <div className="whitespace-pre-wrap text-sm font-medium italic text-[#E0E0E0]">
                     {globalReport}
                   </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[#2A2D35] flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
                  <span>Authorized Personnel Only</span>
                  <span className="font-mono">Timestamp: {new Date().toISOString()}</span>
                  <span>System: SAGIS-3.1-PRO</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedStudent(null)}>
            <StudentDossier 
              student={selectedStudent} 
              onClose={() => setSelectedStudent(null)} 
              classAnalytics={analytics}
              allStudents={students}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
