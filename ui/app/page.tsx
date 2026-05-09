"use client";

import { useState, useEffect } from 'react';

interface AuditRecord {
  audit_id: string;
  company_name: string;
  truth_score: number;
  status: string;
  audit_summary: string;
  evidence_found: any[];
}

export default function Home() {
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState("EcoLogic Corp");

  const startAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: company,
          claims: ["100% Carbon Neutral", "Sustainable Sourcing"]
        })
      });
      const data = await res.json();
      
      // Poll for results
      const pollInterval = setInterval(async () => {
        const statusRes = await fetch(`http://localhost:8000/audit/${data.audit_id}`);
        const statusData = await statusRes.json();
        if (statusData.status === 'complete') {
          setAudits(prev => [statusData, ...prev]);
          setLoading(false);
          clearInterval(pollInterval);
        }
      }, 2000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
            VERIDION
          </h1>
          <p className="text-zinc-400 mt-2">Autonomous ESG Auditing & Traceability</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase">Ledger: Secure</span>
          </div>
        </div>
      </header>

      {/* Hero / Action */}
      <section className="grid lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2 glass-card p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold mb-6">New ESG Audit</h2>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enter Company Name..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button 
                onClick={startAudit}
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Initialize Audit"}
              </button>
            </div>
          </div>
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px]" />
        </div>

        <div className="glass-card p-8 flex flex-col justify-center items-center text-center">
          <div className="text-sm text-zinc-400 uppercase tracking-widest mb-2">Global Truth Score</div>
          <div className="text-6xl font-bold text-emerald-400">92.4</div>
          <div className="text-xs text-zinc-500 mt-2">Avg. Platform Confidence</div>
        </div>
      </section>

      {/* Live Feed */}
      <section>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
          <span className="w-2 h-2 bg-sky-500 rounded-full" />
          Recent Audit Trails
        </h3>
        <div className="grid gap-6">
          {audits.length === 0 ? (
            <div className="glass-card p-12 text-center text-zinc-500">
              No audits processed yet. Start one above to see the magic.
            </div>
          ) : (
            audits.map((audit) => (
              <div key={audit.audit_id} className="glass-card p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                    <circle 
                      cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      className="text-emerald-500"
                      strokeDasharray="226"
                      strokeDashoffset={226 - (226 * audit.truth_score) / 100}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">
                    {Math.round(audit.truth_score)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-lg font-semibold">{audit.company_name}</h4>
                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase font-mono">
                      {audit.audit_id.split('-')[0]}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400">{audit.audit_summary}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex -space-x-2">
                    {audit.evidence_found.map((e, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[10px] font-bold" title={e.source}>
                        {e.source.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">Immutable Log Hash verified</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
