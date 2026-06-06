import React, { useState } from 'react';

export default function Approvals() {
  const [status, setStatus] = useState('L2 Pending'); // 'L2 Pending', 'Approved', 'Rejected'
  const [remarks, setRemarks] = useState('');
  const [approvalChain, setApprovalChain] = useState([]);

  const handleApprove = () => {
    setStatus('Approved');
    setApprovalChain(approvalChain.map(person => {
      if (person.name === 'Priya Shah') {
        return { ...person, status: 'Approved', info: 'Approved just now' };
      }
      if (person.name === 'David Chen') {
        return { ...person, status: 'Awaiting', info: 'Assigned just now' };
      }
      return person;
    }));
    alert('Quotation L2 approved successfully! Forwarded to David Chen for final review.');
  };

  const handleReject = () => {
    setStatus('Rejected');
    setApprovalChain(approvalChain.map(person => {
      if (person.name === 'Priya Shah') {
        return { ...person, status: 'Rejected', info: 'Rejected just now' };
      }
      return person;
    }));
    alert('Quotation has been rejected with comments: "' + remarks + '"');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-label-caps mb-1">
            <span className="material-symbols-outlined text-[16px]">fact_check</span>
            <span>Workflow Engine</span>
          </div>
          <h2 className="font-headline-md text-headline-md">Approval Workflow</h2>
          <p className="text-on-surface-variant text-body-md mt-1">
            RFQ: <span className="text-on-surface font-semibold">Office Furniture Q2</span> • Vendor: <span class="text-on-surface font-semibold">Infra Supplies</span> • Ref ID: <span class="text-on-surface font-semibold">185400</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {status === 'L2 Pending' && (
            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-body-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              L2 Pending
            </span>
          )}
          {status === 'Approved' && (
            <span className="px-3 py-1 bg-primary text-on-primary border border-primary/20 rounded-full text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Approved
            </span>
          )}
          {status === 'Rejected' && (
            <span className="px-3 py-1 bg-error-container/20 text-error border border-error/20 rounded-full text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">cancel</span>
              Rejected
            </span>
          )}
        </div>
      </section>

      {/* Progress Stepper */}
      <div className="glass-panel rounded-xl p-8">
        <div className="relative flex items-center justify-between">
          {/* Line */}
          <div className="absolute top-5 left-0 w-full h-[2px] bg-surface-container-highest"></div>
          <div 
            className="absolute top-5 left-0 h-[2px] bg-primary transition-all duration-1000" 
            style={{ width: status === 'Approved' ? '100%' : '66%' }}
          ></div>
          
          {/* Steps */}
          <div className="relative flex flex-col items-center group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary z-10 shadow-[0_0_15px_rgba(78,222,163,0.3)]">
              <span className="material-symbols-outlined text-[20px]">check</span>
            </div>
            <p className="mt-3 font-label-caps text-on-surface text-[10px]">Submitted</p>
          </div>

          <div className="relative flex flex-col items-center group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary z-10 shadow-[0_0_15px_rgba(78,222,163,0.3)]">
              <span className="material-symbols-outlined text-[20px]">check</span>
            </div>
            <p className="mt-3 font-label-caps text-on-surface text-[10px]">L1 Review</p>
          </div>

          <div className="relative flex flex-col items-center group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-all ${status === 'Approved' ? 'bg-primary text-on-primary' : 'bg-primary-container border-4 border-surface ring-2 ring-primary/50 text-on-primary'}`}>
              {status === 'Approved' ? <span className="material-symbols-outlined text-[20px]">check</span> : '3'}
            </div>
            <p className={`mt-3 font-label-caps text-[10px] ${status === 'Approved' ? 'text-on-surface' : 'text-primary'}`}>L2 Approval</p>
          </div>

          <div className="relative flex flex-col items-center group">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold z-10 ${status === 'Approved' ? 'bg-primary-container border-primary ring-2 ring-primary/50 text-on-primary' : 'bg-surface-container-highest border-outline-variant text-on-surface-variant'}`}>
              {status === 'Approved' ? '4' : '4'}
            </div>
            <p className={`mt-3 font-label-caps text-[10px] ${status === 'Approved' ? 'text-primary' : 'text-on-surface-variant'}`}>Generate PO</p>
          </div>
        </div>
      </div>

      {/* Content Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left: Approval Chain */}
        <div className="lg:col-span-5 space-y-gutter">
          <div className="glass-panel rounded-xl p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="font-label-caps text-on-surface-variant mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">account_tree</span>
                APPROVAL CHAIN
              </h3>
              
              <div className="space-y-8 relative">
                {/* Connector Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-[1px] bg-outline-variant/30"></div>
                
                {approvalChain.length === 0 && (
                  <p className="text-on-surface-variant text-sm opacity-60">No approval chain configured.</p>
                )}
                {approvalChain.map((person, idx) => {
                  let badgeIcon = 'person';
                  let iconStyle = 'bg-surface-container-highest border border-outline-variant text-on-surface-variant';
                  let statusText = '';
                  let textColor = 'text-on-surface-variant';

                  if (person.status === 'Approved') {
                    badgeIcon = 'check_circle';
                    iconStyle = 'bg-primary/10 border border-primary/40 text-primary';
                    statusText = 'Approved';
                    textColor = 'text-primary';
                  } else if (person.status === 'Awaiting') {
                    badgeIcon = 'schedule';
                    iconStyle = 'bg-secondary-container/20 border border-secondary/40 text-secondary animate-pulse';
                    statusText = 'Awaiting';
                    textColor = 'text-secondary';
                  } else if (person.status === 'Rejected') {
                    badgeIcon = 'cancel';
                    iconStyle = 'bg-error-container/20 border border-error/40 text-error';
                    statusText = 'Rejected';
                    textColor = 'text-error';
                  }

                  return (
                    <div key={person.id} className={`flex gap-4 relative ${person.status === 'Future' ? 'opacity-40' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${iconStyle}`}>
                        <span className="material-symbols-outlined text-[20px]">{badgeIcon}</span>
                      </div>
                      <div className="flex-1 pb-4 border-b border-outline-variant/30 last:border-none">
                        <p className="font-bold text-body-md text-on-surface">{person.name}</p>
                        <p className="text-body-sm text-on-surface-variant">{person.role}</p>
                        
                        {person.info && (
                          <div className="mt-2 flex flex-col gap-1">
                            <div className={`flex items-center gap-2 text-[12px] ${textColor}`}>
                              <span className="material-symbols-outlined text-[14px]">event_available</span>
                              {person.info}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Approval Remarks Input */}
            <div className="mt-10 pt-6 border-t border-outline-variant">
              <label className="font-label-caps text-on-surface-variant mb-3 block">APPROVAL REMARKS</label>
              <textarea
                className="w-full h-32 bg-background border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-4 text-body-sm text-on-surface placeholder:text-on-surface-variant/40 resize-none transition-all outline-none"
                placeholder="Add your comments or conditions...."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right: Quotation Summary */}
        <div className="lg:col-span-7 flex flex-col gap-gutter justify-between">
          <div className="glass-panel rounded-xl p-6 flex-grow">
            <h3 className="font-label-caps text-on-surface-variant mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">summarize</span>
              QUOTATIONS SUMMARY
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-6">
                <div>
                  <p className="text-on-surface-variant text-body-sm mb-1 uppercase tracking-wider font-label-caps">Vendor</p>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-surface-container-highest rounded border border-outline-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">corporate_fare</span>
                    </span>
                    <p className="text-title-sm font-bold text-on-surface">Infra Supplies PVT LTD</p>
                  </div>
                </div>
                <div>
                  <p className="text-on-surface-variant text-body-sm mb-1 uppercase tracking-wider font-label-caps">Total Value</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-primary text-[28px] font-display-lg">1,85,400</p>
                    <p className="text-on-surface-variant font-label-caps">USD</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-on-surface-variant text-body-sm mb-1 uppercase tracking-wider font-label-caps">Delivery Timeline</p>
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-[20px] text-secondary">local_shipping</span>
                    <p className="text-title-sm font-bold">10 days</p>
                  </div>
                </div>
                <div>
                  <p className="text-on-surface-variant text-body-sm mb-1 uppercase tracking-wider font-label-caps">Vendor Rating</p>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <p className="text-title-sm font-bold">4.5<span className="text-on-surface-variant font-normal">/5</span></p>
                    <div className="flex -space-x-1 ml-2">
                      <div className="w-6 h-6 rounded-full border border-surface bg-surface-container-high"></div>
                      <div className="w-6 h-6 rounded-full border border-surface bg-surface-container-highest"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Preview */}
            <div className="bg-surface-container-low/50 border border-outline-variant/30 rounded-lg p-4 flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                </div>
                <div>
                  <p className="text-body-sm font-bold text-on-surface">quotation_v2_final.pdf</p>
                  <p className="text-[10px] text-on-surface-variant">Uploaded by Vendor • 2.4 MB</p>
                </div>
              </div>
              <button 
                onClick={() => alert('Opening Detailed Document Viewer...')}
                className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded transition-colors text-body-sm font-semibold"
              >
                View Detail
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button 
              onClick={handleApprove}
              disabled={status !== 'L2 Pending'}
              className="flex-1 bg-primary disabled:opacity-50 text-on-primary h-14 rounded-lg font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(78,222,163,0.2)]"
            >
              <span className="material-symbols-outlined">check</span>
              Approve Quotation
            </button>
            <button 
              onClick={handleReject}
              disabled={status !== 'L2 Pending'}
              className="flex-1 border border-error disabled:opacity-50 text-error h-14 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-error/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined">close</span>
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
