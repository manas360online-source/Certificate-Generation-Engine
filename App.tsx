import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, Database, LogOut, Users, HeartPulse, Zap, LayoutDashboard, ChevronRight, Activity, Clock } from 'lucide-react';
import CertificateGenerator from './components/CertificateGenerator';
import VerificationPortal from './components/VerificationPortal';
import { CertificateEntry, CertificateType } from './types';

enum Role {
  NONE = 'none',
  ADMIN = 'admin',
  THERAPIST = 'therapist',
  COACH = 'coach'
}

enum Tab {
  GENERATE = 'generate',
  MONITOR = 'monitor',
  VERIFY = 'verify',
  VAULT = 'vault'
}

const App: React.FC = () => {
  const [role, setRole] = useState<Role>(Role.NONE);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.MONITOR);
  const [issuedCerts, setIssuedCerts] = useState<CertificateEntry[]>([]);

  useEffect(() => {
    if (role === Role.ADMIN) {
      setActiveTab(Tab.MONITOR);
    } else if (role !== Role.NONE) {
      setActiveTab(Tab.GENERATE);
    }
  }, [role]);

  useEffect(() => {
    const stored = localStorage.getItem('certificates');
    if (stored) {
      setIssuedCerts(JSON.parse(stored));
    }
  }, [role]);

  if (role === Role.NONE) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="bg-brand-blue p-1.5 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900">MANAS360 <span className="text-brand-blue italic">Certify</span></h1>
            </div>
            <h2 className="text-4xl font-extrabold text-[#0a2540] mb-2">Let's Start with You</h2>
            <p className="text-slate-500 text-base">Select your workspace role to begin.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RoleCard 
              title="Administrator"
              description="Full system oversight and monitoring."
              icon={<LayoutDashboard className="w-6 h-6" />}
              color="bg-slate-900"
              onClick={() => setRole(Role.ADMIN)}
            />
            <RoleCard 
              title="Therapist"
              description="Clinical certification issuance."
              icon={<HeartPulse className="w-6 h-6" />}
              color="bg-emerald-600"
              onClick={() => setRole(Role.THERAPIST)}
            />
            <RoleCard 
              title="Executive Coach"
              description="Coach achievement credentials."
              icon={<Zap className="w-6 h-6" />}
              color="bg-amber-600"
              onClick={() => setRole(Role.COACH)}
            />
          </div>
        </div>
      </div>
    );
  }

  const theme = {
    [Role.ADMIN]: { primary: 'bg-slate-900', text: 'text-slate-900' },
    [Role.THERAPIST]: { primary: 'bg-emerald-600', text: 'text-emerald-600' },
    [Role.COACH]: { primary: 'bg-amber-600', text: 'text-amber-600' },
  }[role] || { primary: 'bg-brand-blue', text: 'text-brand-blue' };

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-brand-bg`}>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRole(Role.NONE)}>
              <div className="bg-brand-blue p-1 rounded-md">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                {role === Role.ADMIN ? 'Admin' : role === Role.THERAPIST ? 'Therapy' : 'Coach'}
              </h1>
            </div>
            
            <nav className="flex items-center gap-1">
               {(role === Role.THERAPIST || role === Role.COACH) && (
                 <NavButton active={activeTab === Tab.GENERATE} onClick={() => setActiveTab(Tab.GENERATE)} label="Issuance" />
               )}
               
               {role === Role.ADMIN && (
                 <>
                   <NavButton active={activeTab === Tab.MONITOR} onClick={() => setActiveTab(Tab.MONITOR)} label="Activity Monitor" />
                   <NavButton active={activeTab === Tab.VERIFY} onClick={() => setActiveTab(Tab.VERIFY)} label="Verification" />
                   <NavButton active={activeTab === Tab.VAULT} onClick={() => setActiveTab(Tab.VAULT)} label="Global Vault" />
                 </>
               )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end border-r pr-4 border-slate-200">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Role</span>
                <span className={`text-[10px] font-bold text-brand-blue flex items-center gap-1 uppercase`}>
                   {role === Role.ADMIN ? <LayoutDashboard className="w-2.5 h-2.5" /> : role === Role.THERAPIST ? <HeartPulse className="w-2.5 h-2.5" /> : <Zap className="w-2.5 h-2.5" />}
                   {role}
                </span>
             </div>
             <button onClick={() => setRole(Role.NONE)} className="text-slate-400 hover:text-red-500 transition-colors">
                <LogOut className="w-4 h-4" />
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-6 py-6">
        {activeTab === Tab.MONITOR && role === Role.ADMIN && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Activity Monitor</h2>
                <p className="text-slate-500 text-sm mt-1">Real-time oversight of professional activity.</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                 <div className="text-center px-3 border-r border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Total Items</p>
                    <p className="text-lg font-black text-slate-900">{issuedCerts.length}</p>
                 </div>
                 <Activity className="w-6 h-6 text-brand-blue" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col h-[500px]">
                <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Therapist Issuance</h3>
                   </div>
                   <span className="bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full">LIVE</span>
                </div>
                <div className="flex-1 overflow-y-auto p-1">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-white z-10 shadow-sm text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3">Recipient</th>
                        <th className="px-4 py-3">Program</th>
                        <th className="px-4 py-3 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {issuedCerts.filter(c => c.issuerRole === Role.THERAPIST).length > 0 ? (
                        issuedCerts.filter(c => c.issuerRole === Role.THERAPIST).map((cert) => (
                          <tr key={cert.id} className="hover:bg-emerald-50/30 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-bold text-slate-900 text-xs">{cert.recipientName}</p>
                              <p className="text-[9px] font-mono text-emerald-600">{cert.certificate_id}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-[10px] font-semibold text-slate-600">{cert.programName}</p>
                            </td>
                            <td className="px-4 py-3 text-right">
                               <div className="flex flex-col items-end">
                                 <Clock className="w-2.5 h-2.5 text-slate-300" />
                                 <span className="text-[8px] text-slate-400">{new Date(cert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                               </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={3} className="px-4 py-10 text-center text-slate-400 italic text-xs">No clinical activity.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col h-[500px]">
                <div className="px-6 py-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-600" />
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Coach Issuance</h3>
                   </div>
                   <span className="bg-amber-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full">LIVE</span>
                </div>
                <div className="flex-1 overflow-y-auto p-1">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-white z-10 shadow-sm text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3">Recipient</th>
                        <th className="px-4 py-3">Program</th>
                        <th className="px-4 py-3 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {issuedCerts.filter(c => c.issuerRole === Role.COACH).length > 0 ? (
                        issuedCerts.filter(c => c.issuerRole === Role.COACH).map((cert) => (
                          <tr key={cert.id} className="hover:bg-amber-50/30 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-bold text-slate-900 text-xs">{cert.recipientName}</p>
                              <p className="text-[9px] font-mono text-amber-600">{cert.certificate_id}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-[10px] font-semibold text-slate-600">{cert.programName}</p>
                            </td>
                            <td className="px-4 py-3 text-right">
                               <div className="flex flex-col items-end">
                                 <Clock className="w-2.5 h-2.5 text-slate-300" />
                                 <span className="text-[8px] text-slate-400">{new Date(cert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                               </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={3} className="px-4 py-10 text-center text-slate-400 italic text-xs">No coaching activity.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === Tab.GENERATE && (role === Role.THERAPIST || role === Role.COACH) && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {role === Role.THERAPIST ? 'Professional Certification' : 'Coaching Achievement'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {role === Role.THERAPIST ? 'Validate clinical excellence and advanced training.' : 'Certify leadership expertise and coaching mastery.'}
              </p>
            </div>
            <CertificateGenerator 
              issuerRole={role}
              restrictedType={role === Role.THERAPIST ? CertificateType.THERAPIST : CertificateType.COACH} 
            />
          </div>
        )}

        {activeTab === Tab.VERIFY && role === Role.ADMIN && <VerificationPortal />}

        {activeTab === Tab.VAULT && role === Role.ADMIN && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Database className={`w-4 h-4 text-brand-blue`} /> 
                  Enterprise Cloud Vault
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-6 py-3">Recipient</th>
                      <th className="px-6 py-3">Program / ID</th>
                      <th className="px-6 py-3">Issuer</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {issuedCerts.length > 0 ? (
                      issuedCerts.map((cert) => (
                        <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900 text-sm">{cert.recipientName}</p>
                            <p className="text-[10px] text-slate-500">{cert.recipientEmail}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs font-semibold text-slate-700">{cert.programName}</p>
                            <span className="text-[9px] font-mono text-brand-blue bg-blue-50 px-1.5 py-0.5 rounded uppercase">{cert.certificate_id}</span>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${cert.issuerRole === Role.THERAPIST ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {cert.issuerRole}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">
                               Verified
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button className={`text-[10px] font-bold uppercase tracking-widest text-brand-blue hover:opacity-80`}>Details</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic text-sm">No credentials found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const RoleCard = ({ title, description, icon, color, onClick }: any) => (
  <div 
    onClick={onClick}
    className="group relative bg-white rounded-3xl p-6 shadow-xl border border-slate-100 hover:border-brand-blue transition-all cursor-pointer overflow-hidden hover:-translate-y-1"
  >
    <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-lg font-black text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed mb-6">{description}</p>
    <div className="bg-brand-blue text-white py-2.5 rounded-full font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-1.5 hover:bg-brand-blueHover shadow-lg transition-colors">
      Get Started <ChevronRight className="w-3.5 h-3.5" />
    </div>
  </div>
);

const NavButton = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${active ? `bg-brand-blue text-white shadow-md` : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
  >
    {label}
  </button>
);

export default App;