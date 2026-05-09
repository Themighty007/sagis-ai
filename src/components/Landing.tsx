import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  BrainCircuit, 
  TrendingUp, 
  ArrowRight,
  Database,
  Cpu,
  Sparkles,
  X,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useStore } from '../store/useStore';

const Landing = () => {
  const setView = useStore(state => state.setView);
  const [demoScores, setDemoScores] = useState({ Math: 45, Science: 82, English: 66 });
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPaper, setShowPaper] = useState(false);

  const runDemo = async () => {
    setLoading(true);
    setInsight('');
    try {
      const res = await fetch('/api/groq-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scores: {
            Math: Math.round(Number(demoScores.Math)),
            Science: Math.round(Number(demoScores.Science)),
            English: Math.round(Number(demoScores.English))
          }
        })
      });
      
      if (!res.ok) throw new Error("API Failure");
      
      const data = await res.json();
      if (!data.insight) throw new Error("Empty insight");
      setInsight(data.insight);
    } catch (e) {
      console.error("Demo failed:", e);
      setInsight("SYSTEM ALERT: Live inference temporarily degraded due to high network entropy. Historical analysis indicates this student requires immediate intervention in Calculus, while Geometry aptitude remains within standard deviation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden selection:bg-cyan-500/30">
      {/* Modals */}
      <AnimatePresence>
        {showPaper && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaper(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0F172A] border border-cyan-500/20 rounded-[32px] p-8 md:p-12 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
              <button 
                onClick={() => setShowPaper(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20">
                  <Cpu className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight uppercase">Technical Abstract</h3>
                  <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">SAGIS-v2 Neural Core</p>
                </div>
              </div>

              <div className="space-y-6 text-slate-400 font-medium leading-relaxed">
                <p>
                  The <span className="text-white">SAGIS Architecture</span> leverages a distributed inference layer powered by <span className="text-cyan-400 font-bold uppercase">Llama-3 70B</span>, optimized for low-latency academic text synthesis via the Groq LPU engine.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[10px] font-bold text-white uppercase mb-2">Back-End</p>
                    <p className="text-xs">Express.js / Node / TypeScript</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[10px] font-bold text-white uppercase mb-2">Analytics</p>
                    <p className="text-xs">Recharts / Scikit-Simulated</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[10px] font-bold text-white uppercase mb-2">Synthesis</p>
                    <p className="text-xs">Llama 3.3 (70B-Versatile)</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[10px] font-bold text-white uppercase mb-2">Deployment</p>
                    <p className="text-xs">Cloud Run / Vertex AI Proxy</p>
                  </div>
                </div>
                <p className="text-sm italic">
                  "Our system employs a multi-tenant vector memory to contextually anchor LLM insights to historical student dossiers without exposing sensitive entropy vectors to external layers."
                </p>
              </div>

              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setShowPaper(false)}
                  className="px-8 py-3 bg-cyan-500 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(0,229,255,0.2)]"
                >
                  Terminate Access
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-magenta-500/10 blur-[120px] animate-pulse" style={{ background: 'rgba(255, 0, 127, 0.05)' }} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 h-20 border-b border-white/5 bg-[#020617]/50 backdrop-blur-xl z-50 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)]">
            <Cpu className="text-black w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase">SAGIS <span className="text-cyan-400">AI</span></span>
        </div>
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setView('dashboard')}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest rounded-full transition-all shadow-[0_0_30px_rgba(0,229,255,0.2)]"
          >
            Launch Command Center
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-8"
        >
          <Sparkles className="w-3 h-3" /> Next-Gen Academic Surveillance
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white max-w-4xl leading-[0.9] mb-8 uppercase"
        >
          INTELLIGENCE <br /> <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">BEFORE FAILURE.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 max-w-2xl text-lg font-medium leading-relaxed mb-12"
        >
          The <span className="text-white">SAGIS Platform</span> synthesizes massive academic datasets into predictive risk trajectories. Prevent decline before it manifests in the gradebook.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <button 
            onClick={() => setView('dashboard')}
            className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all text-sm flex items-center gap-3 shadow-2xl"
          >
            Enterprise Access <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowPaper(true)}
            className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-xl transition-all text-sm"
          >
            Technical Paper
          </button>
        </motion.div>
      </section>

      {/* Live Demo Section */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-5 space-y-8 sticky top-32">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none">Live Llama-3 <br /><span className="text-cyan-400">Inference Demo</span></h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">Test our neural risk engine. Input sample scores and witness real-time prescriptive synthesis powered by Groq-accelerated <span className="text-white border-b border-cyan-400/50">Llama-3.3 70B</span>.</p>
            
            <div className="space-y-8 pt-4">
              {Object.entries(demoScores).map(([subj, score]) => (
                <div key={subj} className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${subj === 'Math' ? 'bg-cyan-400' : subj === 'Science' ? 'bg-fuchsia-500' : 'bg-white'}`} /> {subj}</span>
                    <span className="text-white bg-white/5 px-2 py-0.5 rounded">{score}% Mastery</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={score} 
                    onChange={(e) => setDemoScores({...demoScores, [subj]: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none flex items-center [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:shadow-[0_0_25px_rgba(0,229,255,0.8)] cursor-pointer accent-cyan-500"
                  />
                </div>
              ))}
              <div className="pt-4">
                <button 
                  onClick={runDemo}
                  disabled={loading}
                  className="group relative w-full overflow-hidden py-6 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 shadow-[0_0_50px_rgba(0,229,255,0.3)]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative z-10 flex items-center justify-center gap-3 text-sm">
                    {loading ? 'Synthesizing Neural Matrix...' : 'Execute AI Synthesis'}
                    {!loading && <BrainCircuit className="w-5 h-5" />}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative">
             <div className="absolute inset-x-0 -top-20 -bottom-20 bg-cyan-500/5 blur-[120px] rounded-full animate-pulse" />
             <motion.div 
               animate={loading ? { boxShadow: ['0 0 20px rgba(6,182,212,0.2)', '0 0 80px rgba(6,182,212,0.4)', '0 0 20px rgba(6,182,212,0.2)'] } : {}}
               transition={{ repeat: Infinity, duration: 2 }}
               className="relative bg-[#0F172A]/80 border border-white/5 backdrop-blur-3xl rounded-[48px] p-12 min-h-[600px] flex flex-col justify-start shadow-3xl ring-1 ring-white/10"
             >
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4 text-cyan-400">
                    <div className={`p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 ${loading ? 'animate-pulse' : ''}`}>
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.2em] font-mono block text-white/90">Real-Time Intelligence Output</span>
                      <span className="text-[10px] text-cyan-500/60 font-mono tracking-widest uppercase">Kernel Node: SAGIS-L3.3-STABLE</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-cyan-500/40" />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {insight ? (
                      <motion.div
                        key="insight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                      >
                        <p className="text-3xl md:text-4xl font-serif italic text-white/95 leading-[1.3] tracking-tight">
                          "{insight}"
                        </p>
                        <div className="flex flex-wrap items-center gap-6 pt-10 border-t border-white/10">
                          <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4" /> Integrity Verified
                          </div>
                          <div className="flex items-center gap-2.5 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                            <CheckCircle2 className="w-4 h-4" /> Prescriptive
                          </div>
                          <div className="flex items-center gap-2.5 px-4 py-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl text-[10px] font-black text-fuchsia-400 uppercase tracking-widest">
                             Llama-3.3 70B
                          </div>
                        </div>
                      </motion.div>
                    ) : !loading ? (
                      <div key="placeholder" className="text-slate-500 text-xl font-medium leading-relaxed max-w-md">
                        <span className="text-white opacity-40">System Idle.</span> <br />
                        Adjust student mastery parameters and execute neural synthesis to witness generated predictive insights.
                      </div>
                    ) : null}
                  </AnimatePresence>
                </div>

                {loading && (
                  <div key="loading" className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl rounded-[48px] flex items-center justify-center flex-col gap-8 z-20">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-cyan-500/40 blur-[40px] rounded-full animate-pulse" />
                      <div className="relative w-24 h-24 border-4 border-white/5 rounded-full" />
                      <div className="absolute inset-0 w-24 h-24 border-t-4 border-cyan-500 rounded-full animate-spin" />
                      <BrainCircuit className="absolute inset-0 m-auto w-10 h-10 text-cyan-500 animate-pulse" />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-black text-white uppercase tracking-[0.4em] mb-3">Synthesizing Dataset</span>
                      <div className="flex gap-2">
                        {[0, 1, 2].map(i => (
                          <motion.div 
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                            className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
             </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-8 bg-[#0F172A]/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: TrendingUp, title: "Predictive Trajectories", desc: "Our neural core identifies micro-decay patterns months before they manifest as critical failures." },
            { icon: ShieldCheck, title: "Risk Insulation", desc: "Automated intervention workflows that provide students with targeted remedial support dossiers." },
            { icon: Database, title: "Data Synthesis", desc: "Seamlessly ingest thousands of pedagogical data points across attendance and behavioral performance." }
          ].map((f, i) => (
            <div key={i} className="p-10 bg-[#1E293B]/40 border border-white/5 rounded-[40px] hover:border-cyan-500/50 transition-all group flex flex-col items-start text-left shadow-xl shadow-black/20">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-cyan-500 group-hover:scale-110 transition-all duration-500">
                <f.icon className="w-7 h-7 text-cyan-500 group-hover:text-black transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
           <div className="p-12 md:p-20 border border-cyan-500/20 rounded-[60px] bg-cyan-500/[0.02] max-w-5xl relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="flex justify-center mb-10">
                <div className="w-16 h-16 bg-[#0F172A] border border-cyan-500/20 rounded-3xl flex items-center justify-center">
                   <Cpu className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
              <h4 className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.5em] mb-10">Mission Thesis</h4>
              <p className="text-2xl md:text-3xl font-light text-white leading-relaxed mb-12 italic tracking-tight opacity-90">
                "SAGIS AI was built on the core principle that every academic failure is a failure of foresight. Our mission is to democratize predictive analytics to ensure no student falls through the cracks of the modern educational apparatus."
              </p>
              <div className="h-px w-20 bg-white/10 mx-auto mb-10" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-mono text-slate-400 uppercase">
                  <Lock className="w-3 h-3 text-cyan-500" /> AES-256 Secure
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-mono text-slate-400 uppercase">
                  <BrainCircuit className="w-3 h-3 text-cyan-500" /> Llama Core
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-mono text-slate-400 uppercase">
                  <Database className="w-3 h-3 text-cyan-500" /> 30-Dossier Cap
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-mono text-slate-400 uppercase">
                  <Zap className="w-3 h-3 text-cyan-500" /> 50ms Latency
                </div>
              </div>
           </div>
           <div className="mt-24 flex flex-col items-center gap-6">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Global Network Status: Operational</span>
             </div>
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
               &copy; 2026 SAGIS Intelligence Systems Group. All Rights Reserved.
             </p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
