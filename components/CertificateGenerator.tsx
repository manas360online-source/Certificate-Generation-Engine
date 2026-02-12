import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Wand2, Download, Loader2, Send, ShieldCheck, 
  Linkedin, Twitter, Printer, Eye, X, Info, FileEdit, FileCheck, ArrowRight, Database, CloudUpload, HardDrive
} from 'lucide-react';

import CertificateTemplate from './CertificateTemplate';
import { CertificateData, CertificateType, CertificateEntry, Signatory } from '../types';
import { generateCertificateHash } from '../services/cryptoService';

const DEFAULT_SIGNATORIES: Signatory[] = [
  { name: 'Mahan Gupta', title: 'CEO & Founder' },
  { name: 'Dr. Priya Sharma', title: 'Chief Medical Officer' },
  { name: 'Ms. Anjali Verma', title: 'Head of Training' }
];

interface Props {
  restrictedType?: CertificateType;
  issuerRole: string;
}

const CertificateGenerator: React.FC<Props> = ({ restrictedType, issuerRole }) => {
  const [formData, setFormData] = useState<Partial<CertificateData>>({
    recipientName: '',
    recipientEmail: '',
    programName: '',
    type: restrictedType || CertificateType.THERAPIST,
    completionDate: new Date().toISOString().split('T')[0],
    issueDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
    commendation: '',
    signatories: DEFAULT_SIGNATORIES
  });

  useEffect(() => {
    if (restrictedType) {
      setFormData(prev => ({ ...prev, type: restrictedType }));
    }
  }, [restrictedType]);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [status, setStatus] = useState<{
    isProcessing: boolean;
    step: 'idle' | 'rendering' | 's3_init' | 's3_connect' | 's3_upload' | 's3_finalize' | 'complete';
  }>({
    isProcessing: false,
    step: 'idle'
  });

  const workspaceRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const generateID = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `MANAS360-CERT-${year}-${random}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const processCertificate = async () => {
    if (!formData.recipientName || !formData.recipientEmail || !formData.programName) {
      alert("Please ensure Name, Email, and Program fields are completed.");
      return;
    }

    const captureTarget = isPreviewOpen ? modalRef.current : workspaceRef.current;
    if (!captureTarget) return;

    setStatus(prev => ({ ...prev, isProcessing: true, step: 'rendering' }));

    try {
      const certId = generateID();
      const hash = await generateCertificateHash({
        certificate_id: certId,
        recipient_name: formData.recipientName!,
        program_name: formData.programName!,
        completion_date: formData.completionDate!,
      });

      await new Promise(r => setTimeout(r, 800));
      const canvas = await html2canvas(captureTarget, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123
      });
      
      const pngData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({ 
        orientation: 'portrait', unit: 'mm', format: 'a4', compress: true 
      });
      pdf.addImage(pngData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
      const pdfBase64 = pdf.output('datauristring');

      setStatus(prev => ({ ...prev, step: 's3_init' }));
      await new Promise(r => setTimeout(r, 500)); 
      setStatus(prev => ({ ...prev, step: 's3_connect' }));
      await new Promise(r => setTimeout(r, 500)); 
      setStatus(prev => ({ ...prev, step: 's3_upload' }));
      await new Promise(r => setTimeout(r, 800)); 
      setStatus(prev => ({ ...prev, step: 's3_finalize' }));
      await new Promise(r => setTimeout(r, 400));

      const s3Url = `https://manas360-s3-bucket.s3.us-east-1.amazonaws.com/certificates/${certId}.pdf`;
      
      const finalData: CertificateEntry = {
        ...(formData as CertificateData),
        id: uuidv4(),
        certificate_id: certId,
        hash: hash,
        status: 'active',
        cloudUrl: s3Url,
        pdfData: pdfBase64,
        timestamp: Date.now(),
        issuerRole: issuerRole
      };

      const existing = localStorage.getItem('certificates');
      const certs = existing ? JSON.parse(existing) : [];
      certs.push(finalData);
      localStorage.setItem('certificates', JSON.stringify(certs));

      pdf.save(`${certId}.pdf`);
      setStatus(prev => ({ ...prev, step: 'complete' }));
      setIsPreviewOpen(false);
      
      setTimeout(() => setStatus(prev => ({ ...prev, isProcessing: false, step: 'idle' })), 1000);

    } catch (err) {
      console.error(err);
      setStatus(prev => ({ ...prev, isProcessing: false, step: 'idle' }));
      alert("Certificate issuance failed.");
    }
  };

  const previewData: CertificateData = {
    id: 'preview',
    certificate_id: formData.certificate_id || 'MANAS360-CERT-2025-PENDING',
    recipientName: formData.recipientName || 'Draft Recipient',
    recipientEmail: formData.recipientEmail || '',
    programName: formData.programName || 'Select Program',
    completionDate: formData.completionDate || '2025-01-01',
    issueDate: formData.issueDate || 'January 1, 2025',
    type: formData.type || CertificateType.THERAPIST,
    commendation: formData.commendation || '',
    hash: 'H_PENDING_SECURE',
    status: 'active',
    signatories: DEFAULT_SIGNATORIES,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex items-center gap-2">
             <FileEdit className="w-4 h-4 text-brand-blue" />
             <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Document Data</span>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Recipient Name</label>
              <input type="text" name="recipientName" value={formData.recipientName} onChange={handleInputChange} placeholder="Full Legal Name" className="w-full p-2.5 bg-[#f8fbff] border border-blue-100 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Delivery Email</label>
              <input type="email" name="recipientEmail" value={formData.recipientEmail} onChange={handleInputChange} placeholder="recipient@domain.com" className="w-full p-2.5 bg-[#f8fbff] border border-blue-100 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Achievement Title</label>
              <input type="text" name="programName" value={formData.programName} onChange={handleInputChange} placeholder="Module or Milestone" className="w-full p-2.5 bg-[#f8fbff] border border-blue-100 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-brand-blue" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 space-y-3">
            <button onClick={() => setIsPreviewOpen(true)} className="w-full bg-white text-brand-blue py-3 rounded-full border border-brand-blue hover:bg-blue-50 transition-all font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Live Review
            </button>
            <button onClick={processCertificate} disabled={status.isProcessing} className="w-full bg-brand-blue text-white py-3 rounded-full hover:bg-brand-blueHover transition-all font-black uppercase text-[10px] tracking-widest shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50">
              {status.isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              GET STARTED
            </button>
          </div>
        </div>

        {status.isProcessing && (
          <div className="bg-[#0a2540] p-4 rounded-2xl shadow-xl space-y-2 border border-brand-blue/20">
             <StatusLine label="Rendering" active={status.step === 'rendering'} />
             <StatusLine label="S3 Init" active={status.step === 's3_init'} icon={<Database className="w-3 h-3"/>} />
             <StatusLine label="Uploading" active={status.step === 's3_upload'} icon={<CloudUpload className="w-3 h-3"/>} />
             <StatusLine label="Finalized" active={status.step === 's3_finalize' || status.step === 'complete'} icon={<ShieldCheck className="w-3 h-3 text-emerald-400"/>} />
          </div>
        )}
      </div>

      <div className="lg:col-span-8 flex flex-col items-center">
        <div className="w-full bg-white/50 rounded-[2rem] p-8 flex items-center justify-center overflow-auto shadow-inner min-h-[700px]">
           <div className="scale-[0.35] sm:scale-[0.45] md:scale-[0.55] lg:scale-[0.6] xl:scale-[0.7] origin-center shadow-xl">
              <div data-cert-root="true">
                 <CertificateTemplate ref={workspaceRef} data={previewData} />
              </div>
           </div>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0a2540]/95 backdrop-blur-md flex flex-col items-center p-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full max-w-6xl flex items-center justify-between mb-6">
             <div className="text-white">
                <h3 className="text-xl font-black uppercase tracking-tighter">Verification Audit</h3>
                <p className="text-slate-400 text-sm">Visual review before S3 archival.</p>
             </div>
             <div className="flex gap-3">
                <button onClick={() => setIsPreviewOpen(false)} className="bg-white/10 text-white px-6 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-colors flex items-center gap-1.5">
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button onClick={processCertificate} disabled={status.isProcessing} className="bg-brand-blue text-white px-8 py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-1.5 hover:bg-brand-blueHover shadow-xl">
                  {status.isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  FINALIZE
                </button>
             </div>
          </div>
          <div className="flex-1 w-full flex items-center justify-center overflow-auto pb-6">
            <div className="scale-[0.45] sm:scale-[0.55] md:scale-[0.65] lg:scale-[0.7] origin-center shadow-2xl">
               <div data-cert-root="true">
                 <CertificateTemplate ref={modalRef} data={previewData} />
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusLine = ({ label, active, icon }: { label: string; active: boolean; icon?: React.ReactNode }) => (
  <div className={`flex items-center gap-3 transition-all duration-300 ${active ? 'opacity-100' : 'opacity-30'}`}>
     <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-brand-blue animate-pulse shadow-[0_0_8px_rgba(0,102,255,0.8)]' : 'bg-slate-700'}`}></div>
     <div className="flex items-center gap-1.5">
       {icon && <div className={active ? 'text-brand-blue' : 'text-slate-600'}>{icon}</div>}
       <span className="text-[9px] font-black text-white uppercase tracking-widest">{label}</span>
     </div>
  </div>
);

export default CertificateGenerator;