export enum CertificateType {
  THERAPIST = 'therapist_training',
  COACH = 'coach_training',
  PATIENT = 'patient_completion'
}

export interface Signatory {
  name: string;
  title: string;
}

export interface CertificateData {
  id: string;
  certificate_id: string; // The specific MANS360 format
  recipientName: string;
  recipientEmail: string;
  programName: string;
  completionDate: string;
  issueDate: string;
  type: CertificateType;
  commendation: string;
  hash: string;
  status: 'active' | 'revoked';
  signatories: Signatory[];
  cloudUrl?: string;
  pdfData?: string; // Base64 encoded PDF for retrieval simulation
}

export interface CertificateEntry extends CertificateData {
  timestamp: number;
  issuerRole?: string; // Added to track the role that generated this entry
}