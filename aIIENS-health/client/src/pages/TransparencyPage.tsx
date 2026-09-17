import { ShieldCheck, PieChart, FileText, CheckCircle, Search, Heart, Shield, Lock, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function TransparencyPage() {
  return (
    <div className="bg-surface-950 min-h-screen pb-24">
      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden border-b border-surface-800">
        <div className="absolute inset-0 bg-surface-900">
          <div className="absolute inset-0 bg-brand-500/5 mix-blend-screen" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 font-medium text-sm mb-6 animate-fade-in-up">
            <ShieldCheck className="w-4 h-4" />
            100% Transparency Promise
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Zero Platform Fees.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">Maximum Impact.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed animate-fade-in-up max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
            We believe that every penny you donate should go directly to those in need. Our operational costs are covered entirely by private philanthropic partners.
          </p>
        </div>
      </section>

      {/* ── The AIIENS Promise ── */}
      <section className="py-20 bg-surface-950">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-surface-900/50 border-surface-800 backdrop-blur-sm shadow-xl p-8 text-center hover:border-brand-500/30 transition-colors">
              <div className="w-16 h-16 mx-auto bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6">
                <PieChart className="w-8 h-8 text-brand-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">100% to the Cause</h3>
              <p className="text-slate-400">
                Unlike other platforms, we don't take a cut of your donation. 100% of your money goes directly to the verified medical cause.
              </p>
            </Card>

            <Card className="bg-surface-900/50 border-surface-800 backdrop-blur-sm shadow-xl p-8 text-center hover:border-brand-500/30 transition-colors">
              <div className="w-16 h-16 mx-auto bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-brand-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Rigorous Verification</h3>
              <p className="text-slate-400">
                Every case is vetted by our medical review board and cross-checked with partnered hospitals before going live.
              </p>
            </Card>

            <Card className="bg-surface-900/50 border-surface-800 backdrop-blur-sm shadow-xl p-8 text-center hover:border-brand-500/30 transition-colors">
              <div className="w-16 h-16 mx-auto bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-brand-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Transactions</h3>
              <p className="text-slate-400">
                All donations are securely processed and deposited directly into the hospital's verified account, never to intermediaries.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Financial Allocation ── */}
      <section className="py-20 border-y border-surface-800 bg-surface-900/30 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Where Does The Money Go?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We operate with complete financial clarity. Here is how funds flow through the AIIENS Health platform.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 w-full relative">
              {/* Infographic visual */}
              <div className="aspect-square max-w-md mx-auto rounded-full border-[16px] border-surface-800 flex items-center justify-center relative shadow-2xl shadow-brand-500/5">
                <div className="absolute inset-0 rounded-full border-[16px] border-brand-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }} />
                <div className="text-center">
                  <span className="text-5xl font-black text-white block">100%</span>
                  <span className="text-brand-400 font-medium tracking-wide uppercase text-sm">To Patients</span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="p-6 rounded-2xl bg-surface-900 border border-surface-800">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Public Donations</h4>
                    <p className="text-sm text-slate-400">100% of all public donations are routed directly to partnered hospitals for the specific patient's medical care.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl bg-surface-900 border border-surface-800">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Operating Costs</h4>
                    <p className="text-sm text-slate-400">Salaries, server costs, and marketing are covered entirely by our founding partners and private philanthropists.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface-900 border border-surface-800">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Payment Gateway Fees</h4>
                    <p className="text-sm text-slate-400">Transaction fees (approx 1.5-2%) are either optionally covered by the donor at checkout or subsidized by our operations fund.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Verification Timeline ── */}
      <section className="py-24 bg-surface-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Verification Process</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We don't just accept any fundraiser. Every case undergoes a strict 4-step verification process to prevent fraud.</p>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-500/20 before:via-brand-500/50 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-950 bg-brand-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl shadow-brand-500/20 z-10">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-surface-900 border border-surface-800 shadow-lg">
                <h3 className="font-bold text-white text-lg mb-2">Initial Review</h3>
                <p className="text-slate-400 text-sm">The patient or guardian submits medical documents, identity proofs, and cost estimates from the hospital.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-950 bg-brand-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl shadow-brand-500/20 z-10">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-surface-900 border border-surface-800 shadow-lg">
                <h3 className="font-bold text-white text-lg mb-2">Hospital Verification</h3>
                <p className="text-slate-400 text-sm">Our team directly contacts the treating doctor and the hospital's billing department to verify the condition and the estimated cost.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-950 bg-brand-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl shadow-brand-500/20 z-10">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-surface-900 border border-surface-800 shadow-lg">
                <h3 className="font-bold text-white text-lg mb-2">Medical Board Approval</h3>
                <p className="text-slate-400 text-sm">An independent panel of doctors reviews the case to ensure the requested treatment is standard and the cost is justified.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-950 bg-brand-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl shadow-brand-500/20 z-10">
                4
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-surface-900 border border-surface-800 shadow-lg">
                <h3 className="font-bold text-white text-lg mb-2">Campaign Goes Live</h3>
                <p className="text-slate-400 text-sm">Only after passing all checks, the fundraiser is published. Funds are later transferred directly to the hospital, not the patient.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Audit Reports ── */}
      <section className="py-20 border-t border-surface-800 bg-surface-900/50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="w-16 h-16 mx-auto bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6">
            <FileCheck className="w-8 h-8 text-brand-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Annual Audit Reports</h2>
          <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
            We are audited annually by independent, top-tier financial firms. You can download our historical financial reports below.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <a href="#" className="flex items-center justify-between p-4 rounded-xl bg-surface-900 border border-surface-800 hover:border-brand-500/50 transition-colors group">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-400 group-hover:text-brand-400 transition-colors" />
                <span className="text-slate-200 font-medium">FY 2024-2025 Audit Report</span>
              </div>
              <span className="text-xs text-brand-400 font-medium">PDF</span>
            </a>
            
            <a href="#" className="flex items-center justify-between p-4 rounded-xl bg-surface-900 border border-surface-800 hover:border-brand-500/50 transition-colors group">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-400 group-hover:text-brand-400 transition-colors" />
                <span className="text-slate-200 font-medium">FY 2023-2024 Audit Report</span>
              </div>
              <span className="text-xs text-brand-400 font-medium">PDF</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
