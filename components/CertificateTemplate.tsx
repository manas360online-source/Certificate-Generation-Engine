import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CertificateData, CertificateType } from '../types';

interface Props {
  data: CertificateData;
}

const CertificateTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  // AC3 Requirement: Unique verification URL format: manas360.in/verify/{cert_id}
  const verificationUrl = `https://manas360.in/verify/${data.certificate_id}`;

  const getTitle = () => {
    switch(data.type) {
      case CertificateType.THERAPIST: return "Therapist Professional Certification";
      case CertificateType.COACH: return "Professional Coaching Achievement";
      case CertificateType.PATIENT: return "Certificate of Milestone Completion";
      default: return "Certificate of Completion";
    }
  };

  const getSubText = () => {
    switch(data.type) {
      case CertificateType.THERAPIST: 
        return "and has demonstrated exceptional mastery in clinical mental health protocols, evidence-based therapeutic practices, and ethical standards of patient care.";
      case CertificateType.COACH: 
        return "and has shown proficiency in professional coaching methodologies, high-performance leadership strategies, and transformative client engagement.";
      case CertificateType.PATIENT: 
        return "and has shown remarkable resilience, dedication, and progress in their personal mental wellness journey.";
      default: 
        return "and has successfully met all the requirements for this program with excellence and dedication.";
    }
  };

  return (
    <div 
      ref={ref}
      style={{ 
        width: '21cm',
        height: '29.7cm',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Main Certificate Body */}
      <div 
        style={{
          width: '19cm',
          height: '27.7cm',
          backgroundColor: 'white',
          margin: '1cm',
          padding: '1.5cm 2cm',
          position: 'relative',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          boxSizing: 'border-box',
          fontFamily: "'Georgia', serif"
        }}
      >
        {/* Watermark */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            fontSize: '90px',
            color: 'rgba(102, 126, 234, 0.04)',
            fontWeight: 'bold',
            zIndex: 1,
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          VERIFIED
        </div>

        {/* Outer Border */}
        <div style={{
          position: 'absolute',
          top: '1.2cm',
          left: '1.2cm',
          right: '1.2cm',
          bottom: '1.2cm',
          border: '2px solid #667eea',
          borderRadius: '8px',
          zIndex: 2,
          pointerEvents: 'none'
        }}></div>

        {/* Verified Badge */}
        <div style={{
          position: 'absolute',
          top: '1.8cm',
          right: '1.8cm',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '10px',
          fontWeight: 'bold',
          letterSpacing: '1.5px',
          zIndex: 3,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          ✓ CERTIFIED
        </div>

        {/* Header */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', paddingTop: '1cm' }}>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '6px'
          }}>
            MANAS360
          </div>
          <div style={{ fontSize: '11px', color: '#888', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Digital Mental Health Platform
          </div>
        </div>

        {/* Dynamic Certificate Title */}
        <div style={{ 
          position: 'relative', 
          zIndex: 2, 
          fontSize: '24px', 
          color: '#667eea', 
          margin: '25px 0', 
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: '1.2'
        }}>
          {getTitle()}
        </div>

        {/* Content Section */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '15px 40px' }}>
          <div style={{ fontSize: '14px', color: '#888', letterSpacing: '1px', marginBottom: '12px' }}>
            This is to certify that
          </div>
          
          <div style={{ 
            fontSize: '28px', 
            color: '#333', 
            fontWeight: 'bold', 
            margin: '15px 0', 
            borderBottom: '1.5px solid #667eea',
            display: 'inline-block',
            paddingBottom: '8px'
          }}>
            {data.recipientName || 'Recipient Name'}
          </div>

          <div style={{ fontSize: '16px', color: '#666', margin: '15px 0' }}>
            has successfully completed the 
          </div>
          
          <div style={{ fontSize: '20px', color: '#667eea', fontWeight: 'bold', margin: '8px 0' }}>
            {data.programName || 'Training Program Name'}
          </div>

          <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', margin: '20px 0', padding: '0 15px' }}>
            {getSubText()}
          </div>
        </div>

        {/* Signatures Area - REDUCED SIZE AS REQUESTED */}
        <div style={{ 
          position: 'absolute', 
          bottom: '4cm', 
          left: '2cm', 
          right: '2cm', 
          display: 'flex', 
          justifyContent: 'space-around', 
          zIndex: 2 
        }}>
          {data.signatories.slice(0, 3).map((sig, idx) => (
            <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ height: '45px', marginBottom: '6px', display: 'flex', alignItems: 'end', justifyContent: 'center' }}>
                 <span style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '18px', color: '#333' }}>
                   {sig.name}
                 </span>
              </div>
              <div style={{ borderTop: '1px solid #333', width: '160px', margin: '0 auto 4px' }}></div>
              <div style={{ fontSize: '11px', color: '#333', fontWeight: 'bold' }}>{sig.name}</div>
              <div style={{ fontSize: '10px', color: '#888', fontStyle: 'italic' }}>{sig.title}</div>
            </div>
          ))}
        </div>

        {/* Footer Area */}
        <div style={{ 
          position: 'absolute', 
          bottom: '2cm', 
          left: '2cm', 
          right: '2cm', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'end',
          zIndex: 2
        }}>
          <div style={{ textAlign: 'left', color: '#888' }}>
            <div style={{ fontSize: '9px', marginBottom: '4px', lineHeight: '1.4' }}>
              Completion: {data.completionDate}<br />
              Issued: {data.issueDate}
            </div>
            <div style={{ 
              fontSize: '10px', 
              display: 'flex', 
              gap: '4px', 
              alignItems: 'baseline'
            }}>
              <strong style={{ color: '#555' }}>ID:</strong>
              <span style={{ fontFamily: 'monospace', fontSize: '9px' }}>
                {data.certificate_id}
              </span>
            </div>
          </div>
          
          <div style={{ textAlign: 'right', transform: 'translateY(5px)' }}>
            <div style={{ display: 'inline-block', background: 'white', padding: '4px', border: '1px solid #f0f0f0' }}>
              <QRCodeSVG value={verificationUrl} size={60} level="H" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CertificateTemplate.displayName = 'CertificateTemplate';

export default CertificateTemplate;