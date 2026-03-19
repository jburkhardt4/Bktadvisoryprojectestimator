import { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Icon components to avoid lucide-react import issue
const FileCheckIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <polyline points="9 15 11 17 15 13" />
  </svg>
);

const RocketIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const ZapIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ArrowRightIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const XIcon = ({ size }: { size?: number }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Loader2Icon = ({ size }: { size?: number }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const CheckCircleIcon = ({ size }: { size?: number }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export function SelectedWork() {
  const [modalCase, setModalCase] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const handleRequestCaseStudy = async () => {
    if (!formData.email.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-07a007e1/request-case-study`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            caseStudy: modalCase,
          }),
        }
      );
      if (!response.ok) throw new Error('Request failed');
      setSubmitted(modalCase);
      setModalCase(null);
      setFormData({ name: '', email: '' });
    } catch (error) {
      console.error('Case study request failed:', error);
      alert('Unable to send request. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const cases = [
    {
      icon: FileCheckIcon,
      label: 'Underwriting Automation',
      summary: 'Designed AI-driven underwriting system for InsurTech client, integrating Salesforce FSC with intelligent agents to streamline risk assessment and approval workflows.',
      outcomes: [
        'Cut underwriting times materially',
        'Reduced vendor R&D spend',
        'Improved data quality and compliance tracking'
      ]
    },
    {
      icon: RocketIcon,
      label: 'Pipeline Acceleration',
      summary: 'Built end-to-end RevOps system for B2B FinTech startup, connecting Salesforce with AI agents and marketing automation to optimize lead flow and conversion.',
      outcomes: [
        'Doubled qualified pipeline',
        'Cut campaign time-to-market from days to hours',
        'Increased sales team productivity by 40%'
      ]
    },
    {
      icon: ZapIcon,
      label: 'Reimbursement Ops',
      summary: 'Transformed reimbursement and approval operations for healthcare startup by architecting automated workflows on Salesforce Service Cloud with RPA integration.',
      outcomes: [
        'Compressed reimbursement/approval cycles from weeks to days',
        'Reduced manual data entry by 75%',
        'Improved customer satisfaction scores significantly'
      ]
    }
  ];

  return (
    <section id="work" className="bg-neutral-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-neutral-900 text-[24px] font-bold">Selected Work</h2>
          <p className="text-neutral-600">
            Real results from Salesforce and AI transformations across FinTech, InsurTech, and high-growth startups.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((caseStudy, index) => {
            const Icon = caseStudy.icon;
            return (
              <div 
                key={index}
                className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className="p-6 border-b border-neutral-200 bg-gradient-to-br from-blue-50 to-neutral-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Icon className="text-white" size={20} />
                    </div>
                    <span className="text-sm text-neutral-900 text-[16px] font-bold">{caseStudy.label}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  <p className="text-neutral-600">{caseStudy.summary}</p>

                  {/* Outcomes */}
                  <div className="space-y-3">
                    <p className="text-sm text-neutral-500 uppercase tracking-wide">Key Outcomes</p>
                    <ul className="space-y-2">
                      {caseStudy.outcomes.map((outcome, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  {submitted === caseStudy.label ? (
                    <div className="w-full py-3 px-4 bg-green-50 text-green-700 rounded-lg flex items-center justify-center gap-2 border border-green-200">
                      <CheckCircleIcon size={16} />
                      <span className="text-sm font-medium">Request Sent</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setModalCase(caseStudy.label)}
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group"
                    >
                      Request Case Study
                      <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Case Study Request Modal */}
      {modalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Request Case Study</h3>
              <button
                onClick={() => setModalCase(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XIcon size={20} />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Enter your details to receive the <span className="font-medium">{modalCase}</span> case study.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="email"
                placeholder="Work email *"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
            <button
              onClick={handleRequestCaseStudy}
              disabled={submitting || !formData.email.trim()}
              className="mt-4 w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              {submitting ? (
                <>
                  <Loader2Icon size={16} />
                  Sending...
                </>
              ) : (
                'Send Request'
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
