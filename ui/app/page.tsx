"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Activity, 
  Database, 
  Globe, 
  Cpu, 
  Search, 
  ChevronRight,
  Zap,
  BarChart3,
  FileText
} from 'lucide-react';

interface Evidence {
  source: string;
  type: string;
  value: string;
  confidence: number;
}

interface AuditRecord {
  audit_id: string;
  company_name: string;
  truth_score: number;
  status: string;
  audit_summary: string;
  evidence_found: Evidence[];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState("Veridion_Global");
  const [agentLogs, setAgentLogs] = useState<string[]>([]);

  const startAudit = async () => {
    setLoading(true);
    setAgentLogs(["[System] Initializing LangGraph Environment...", "[Researcher] Connecting to Sentinel-5P Satellite API..."]);
    
    try {
      const res = await fetch('http://localhost:8000/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: company,
          claims: ["Net Zero by 2030", "Ethical Sourcing"]
        })
      });
      const data = await res.json();
      
      const pollInterval = setInterval(async () => {
        const statusRes = await fetch(`http://localhost:8000/audit/${data.audit_id}`);
        const statusData = await statusRes.json();
        
        // Append logs
        if (statusData.messages) {
          setAgentLogs(prev => [...prev, ...statusData.messages]);
        }

        if (statusData.status === 'complete') {
          setAudits(prev => [statusData, ...prev]);
          setLoading(false);
          clearInterval(pollInterval);
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950/50 backdrop-blur-xl p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-black" />
          </div>
          <span className="text-xl font-bold tracking-tighter">VERIDION</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          {[
            { id: 'dashboard', icon: Activity, label: 'Audit Monitor' },
            { id: 'network', icon: Globe, label: 'Supply Chain Map' },
            { id: 'ledger', icon: Database, label: 'Blockchain Ledger' },
            { id: 'config', icon: Cpu, label: 'Agent Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 glass-card text-[10px] text-zinc-500 font-mono">
          NODE: v1.0.4-INDUSTRIAL<br/>
          LEDGER: ACTIVE<br/>
          AUTH: VERIFIED
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">ESG Command Center</h1>
            <p className="text-zinc-500">Autonomous verification of corporate sustainability claims.</p>
          </div>
          <div className="flex gap-4">
            <div className="glass-card px-6 py-3 text-right">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Platform Accuracy</div>
              <div className="text-xl font-bold text-sky-400">99.8%</div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Left Column: Initiation & Logs */}
              <div className="lg:col-span-1 flex flex-col gap-8">
                <section className="glass-card p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Search size={18} className="text-emerald-500" />
                    New Audit
                  </h3>
                  <div className="flex flex-col gap-4">
                    <input 
                      type="text" 
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 focus:ring-1 ring-emerald-500 outline-none"
                    />
                    <button 
                      onClick={startAudit}
                      disabled={loading}
                      className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? <Zap className="animate-spin" size={18} /> : "Start Deep Audit"}
                    </button>
                  </div>
                </section>

                <section className="glass-card p-6 flex-1 h-[400px] flex flex-col overflow-hidden">
                  <h3 className="text-sm font-semibold mb-4 text-zinc-400 uppercase font-mono">Agent Thought Stream</h3>
                  <div className="flex-1 overflow-y-auto font-mono text-[11px] text-emerald-500/80 space-y-2">
                    {agentLogs.map((log, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-zinc-700">[{new Date().toLocaleTimeString()}]</span>
                        <span>{log}</span>
                      </div>
                    ))}
                    {loading && <div className="animate-pulse">_</div>}
                  </div>
                </section>
              </div>

              {/* Right Column: Results Feed */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                <section className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-6">
                    <div className="text-zinc-500 text-xs mb-1">Total Verified</div>
                    <div className="text-3xl font-bold">{audits.length}</div>
                  </div>
                  <div className="glass-card p-6">
                    <div className="text-zinc-500 text-xs mb-1">Average Truth Score</div>
                    <div className="text-3xl font-bold text-emerald-400">
                      {audits.length > 0 ? (audits.reduce((a, b) => a + b.truth_score, 0) / audits.length).toFixed(1) : "0.0"}
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BarChart3 size={18} />
                    Audit Intelligence Feed
                  </h3>
                  {audits.map((audit) => (
                    <motion.div 
                      key={audit.audit_id}
                      initial={{ scale: 0.9, opacity: 0, y: 30 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className="glass-card p-8 border-l-4 border-l-emerald-500 overflow-hidden relative group"
                    >
                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-2xl font-bold">{audit.company_name}</h4>
                            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-widest border border-emerald-500/20">VERIFIED</span>
                          </div>
                          <p className="text-zinc-400 text-sm italic">"{audit.audit_summary}"</p>
                        </div>
                        <div className="text-right">
                          <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-5xl font-black text-emerald-400 leading-none drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                          >
                            {Math.round(audit.truth_score)}
                          </motion.div>
                          <div className="text-[9px] text-zinc-500 font-mono mt-2 tracking-[0.2em] uppercase">Trust Index</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Verification Evidence (RAG Verified)</div>
                        <div className="grid md:grid-cols-2 gap-3">
                          {audit.evidence_found.map((e, idx) => (
                            <motion.div 
                              key={idx}
                              whileHover={{ scale: 1.02 }}
                              className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50 hover:border-emerald-500/30 transition-colors flex items-start gap-4"
                            >
                              <div className="w-10 h-10 rounded-lg bg-emerald-500/5 flex items-center justify-center flex-shrink-0 border border-emerald-500/10">
                                <FileText size={16} className="text-emerald-500/60" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                  <div className="text-xs font-bold text-zinc-300 truncate">{e.source}</div>
                                  <div className="text-[9px] text-emerald-400 font-mono">{(e.confidence * 100).toFixed(0)}% CONF</div>
                                </div>
                                <div className="text-[11px] text-zinc-500 font-mono truncate mb-2">{e.type}</div>
                                <div className="text-[12px] text-zinc-100 bg-zinc-950/50 px-2 py-1 rounded border border-zinc-800 font-mono truncate">
                                  {e.value}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'network' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="glass-card h-[650px] relative overflow-hidden group p-12"
            >
               <div className="relative z-20 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Supply Chain Topography</h3>
                      <p className="text-zinc-500 text-sm max-w-sm">Global relationship map with real-time ESG leakage detection.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-[10px] font-bold text-emerald-400">NODE STATUS: OPTIMAL</div>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center relative">
                    {/* SVG Graph Visualization */}
                    <svg width="800" height="400" viewBox="0 0 800 400" className="opacity-80 group-hover:opacity-100 transition-opacity">
                      <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
                        </linearGradient>
                      </defs>
                      
                      {/* Connections */}
                      <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} d="M 400 200 L 200 100" stroke="url(#lineGrad)" strokeWidth="2" fill="none" />
                      <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.2 }} d="M 400 200 L 600 100" stroke="url(#lineGrad)" strokeWidth="2" fill="none" />
                      <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.4 }} d="M 400 200 L 400 350" stroke="url(#lineGrad)" strokeWidth="2" fill="none" />

                      {/* Nodes */}
                      <g className="cursor-pointer group/node">
                        <circle cx="400" cy="200" r="12" fill="#10b981" className="animate-pulse" />
                        <text x="420" y="205" fill="white" className="text-[14px] font-bold">Veridion Global</text>
                        <text x="420" y="220" fill="#10b981" className="text-[10px] font-mono">TRUTH SCORE: 92</text>
                      </g>
                      
                      <g className="cursor-pointer group/node">
                        <circle cx="200" cy="100" r="8" fill="#10b981" />
                        <text x="140" y="80" fill="white" className="text-[12px]">EcoLogic Corp</text>
                      </g>

                      <g className="cursor-pointer group/node">
                        <circle cx="600" cy="100" r="8" fill="#10b981" />
                        <text x="615" y="105" fill="white" className="text-[12px]">BioGrid Energy</text>
                      </g>

                      <g className="cursor-pointer group/node">
                        <circle cx="400" cy="350" r="8" fill="#f59e0b" />
                        <text x="415" y="355" fill="white" className="text-[12px]">Titan Logistics</text>
                        <text x="415" y="370" fill="#f59e0b" className="text-[9px]">WARNING: LEAKAGE</text>
                      </g>
                    </svg>
                  </div>
               </div>

               {/* Background Grid */}
               <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-world Impact Section */}
        <section className="mt-16 border-t border-zinc-800 pt-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Globe className="text-emerald-500" />
                The Problem: Greenwashing & Lack of Transparency
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                Currently, ESG (Environmental, Social, and Governance) claims are often self-reported and unverifiable. 
                Companies can "Greenwash" their image by claiming sustainability while their supply chains continue to 
                emit high levels of carbon or engage in unethical practices. Traditional audits are infrequent, manual, and prone to human error.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <ShieldCheck className="text-sky-500" />
                The Veridion Solution
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                Veridion automates the auditing process using **Autonomous AI Agents**. By cross-referencing real-time 
                satellite emissions data with private supply chain invoices and energy bills, we generate an immutable 
                **Truth Score**. This score is logged on a blockchain, creating a permanent, tamper-proof record of 
                genuine sustainability, helping investors and consumers make ethical decisions based on data, not PR.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 py-10 border-t border-zinc-900 flex justify-between items-center text-[11px] text-zinc-600 font-mono">
          <div>© 2026 VERIDION CORE. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-6">
            <span className="text-emerald-500/50">SYSTEM STATUS: NOMINAL</span>
            <span>DEVELOPED BY PUNEET DIVEDI</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

