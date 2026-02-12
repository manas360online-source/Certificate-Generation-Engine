import React, { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, Award, ExternalLink, CheckCircle, Fingerprint } from 'lucide-react';
import { CertificateEntry } from '../types';

const VerificationPortal: React.FC = () => {
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<{ found: boolean; data?: CertificateEntry } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;

    setIsSearching(true);
    await new Promise(r => setTimeout(r, 1000));

    const stored = localStorage.getItem('certificates');
    const certs: CertificateEntry[] = stored ? JSON.parse(stored) : [];
    
    const foundCert = certs.find(c => c.certificate_id.toUpperCase() === searchId.toUpperCase());

    if (foundCert) {
      setResult({ found: true, data: foundCert });
    } else {
      setResult({ found: false });
    }
    setIsSearching(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-6 bg-blue-50 rounded-full mb-6">
          <ShieldCheck className="w-16 h-16 text-brand-blue" />
        </div>
        <h1 className="text-4xl font-black text-[#0a2540] tracking-tight">Public Verification Registry</h1>
        <p className="text-slate-500 mt-4 text-lg">Cross-check credential authenticity against secure records.</p>
      </div>

      <form onSubmit={handleVerify} className="relative mb-16">
        <input 
          type="text" 
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter ID (e.g. MANAS360-CERT-...)"
          className="w-full p-6 pl-10 pr-40 text-xl bg-white border border-blue-100 rounded-3xl shadow-xl focus:border-brand-blue outline-none transition-all font-mono uppercase tracking-widest"
        />
        <button 
          type="submit"
          disabled={isSearching}
          className="absolute right-3 top-3 bottom-3 bg-brand-blue text-white px-10 rounded-full font-bold uppercase tracking-widest hover:bg-brand-blueHover transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSearching ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search className="w-5 h-5" />}
          Verify
        </button>
      </form>

      {result && !isSearching && (
        <div className={`rounded-3xl p-10 border-2 animate-in fade-in zoom-in-95 duration-500 ${result.found ? 'border-emerald-100 bg-white' : 'border-red-100 bg-white'}`}>
          {result.found && result.data ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-6 border-b border-emerald-100">
                <div className="flex items-center gap-5">
                  <div className="bg-emerald-100 p-4 rounded-2xl">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase">Valid Credential</h3>
                    <p className="text-emerald-700 font-bold">Identity Confirmed</p>
                  </div>
                </div>
                <span className="bg-white px-4 py-2 rounded-full text-xs font-black text-emerald-600 border border-emerald-200 shadow-sm uppercase tracking-widest">Active</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <RegistryField label="Recipient" value={result.data.recipientName} icon={<Fingerprint className="w-5 h-5" />} />
                 <RegistryField label="Program" value={result.data.programName} icon={<Award className="w-5 h-5" />} />
                 <RegistryField label="Issued On" value={result.data.issueDate} icon={<ShieldCheck className="w-5 h-5" />} />
                 <RegistryField label="Unique Key" value={result.data.certificate_id} subValue="Immutable Identifier" icon={<Fingerprint className="w-5 h-5" />} />
              </div>

              <div className="mt-6 p-6 bg-[#0a2540] rounded-2xl">
                <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-2">Tamper-Proof Hash</p>
                <p className="text-xs font-mono text-white break-all opacity-80">{result.data.hash}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-8 py-4">
               <div className="bg-red-100 p-6 rounded-3xl">
                <ShieldAlert className="w-12 h-12 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Certificate Not Found</h3>
                <p className="text-red-700 text-lg mt-2">The unique identifier provided does not match any records.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RegistryField = ({ label, value, subValue, icon }: { label: string; value: string; subValue?: string; icon: React.ReactNode }) => (
  <div className="flex gap-4">
    <div className="mt-1 text-slate-300">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-900 leading-tight">{value}</p>
      {subValue && <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{subValue}</p>}
    </div>
  </div>
);

export default VerificationPortal;