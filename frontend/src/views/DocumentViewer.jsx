import React, { useState } from 'react';

export default function DocumentViewer() {
  const [paymentStatus, setPaymentStatus] = useState('Pending Payment'); // 'Pending Payment', 'Paid', 'Cancelled'
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const [timeline, setTimeline] = useState([
    { id: 1, title: 'PO Generated', time: 'Today, 4:15 PM', completed: true },
    { id: 2, title: 'Approved by Priya Shah', time: 'Today, 2:30 PM', completed: true },
    { id: 3, title: 'Approved by Rahul Mehta', time: 'Today, 10:45 AM', completed: true },
    { id: 4, title: 'Awaiting Payment Confirmation', time: 'Estimate: June 21, 2025', completed: false }
  ]);

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleMarkAsPaid = () => {
    if (paymentStatus === 'Paid') return;
    setPaymentStatus('Paid');
    
    // Update timeline
    const updatedTimeline = [
      { id: 5, title: 'Paid by Alex Thompson', time: 'Just now', completed: true },
      ...timeline.map(t => {
        if (t.title === 'Awaiting Payment Confirmation') {
          return { ...t, title: 'Payment Confirmed', time: 'Just now', completed: true };
        }
        return t;
      })
    ];
    setTimeline(updatedTimeline);
    triggerToast('Invoice marked as Paid successfully.');
  };

  const handleCancelPO = () => {
    if (paymentStatus === 'Cancelled') return;
    setPaymentStatus('Cancelled');
    
    const updatedTimeline = [
      { id: 6, title: 'PO Cancelled by Alex Thompson', time: 'Just now', completed: true, isError: true },
      ...timeline
    ];
    setTimeline(updatedTimeline);
    triggerToast('Purchase Order has been Cancelled.');
  };

  return (
    <div className="space-y-6 relative">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <nav className="flex gap-2 text-xs font-label-caps text-on-surface-variant mb-2">
            <span className="hover:text-primary cursor-pointer transition-colors">HOME</span>
            <span>/</span>
            <span className="hover:text-primary cursor-pointer transition-colors">INVOICES</span>
            <span>/</span>
            <span className="text-primary">PO-2024-0068</span>
          </nav>
          <h2 className="font-display-lg text-display-lg text-on-surface">PO &amp; Invoice Details</h2>
          <p className="text-on-surface-variant font-body-md">Auto-generated after approval of RFQ: Office Furniture Q2</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => triggerToast('The invoice has been downloaded as PDF.')}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface border border-outline-variant rounded-lg hover:border-primary hover:text-primary transition-all text-body-sm"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span className="font-label-caps text-label-caps">Download PDF</span>
          </button>
          <button 
            onClick={() => { triggerToast('Preparing document for printing...'); window.print(); }}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface border border-outline-variant rounded-lg hover:border-primary hover:text-primary transition-all text-body-sm"
          >
            <span className="material-symbols-outlined text-[20px]">print</span>
            <span className="font-label-caps text-label-caps">Print</span>
          </button>
          <button 
            onClick={() => triggerToast('Invoice sent to vendor email successfully.')}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface border border-outline-variant rounded-lg hover:border-primary hover:text-primary transition-all text-body-sm"
          >
            <span className="material-symbols-outlined text-[20px]">mail</span>
            <span className="font-label-caps text-label-caps">Email Invoice</span>
          </button>
        </div>
      </div>

      {/* Document Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
        {/* Main Document */}
        <div className="xl:col-span-8">
          <div className="invoice-canvas rounded-xl p-10 overflow-hidden relative">
            {/* Glassmorphism Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>
            
            {/* Header */}
            <div className="flex justify-between items-start relative z-10 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-on-primary">business</span>
                  </div>
                  <span className="text-title-sm font-headline-md font-bold text-on-surface">VendorBridge</span>
                </div>
                <div className="space-y-1 text-on-surface-variant font-body-sm">
                  <p className="font-bold text-on-surface">Bill to:</p>
                  <p>VendorBridge Corp HQ</p>
                  <p>123 Business Park, Ahmedabad</p>
                  <p>GSTIN: 243394394ZAFB</p>
                </div>
              </div>
              <div className="text-right space-y-4">
                <div>
                  <h3 className="font-label-caps text-label-caps text-primary mb-1">PURCHASE ORDER</h3>
                  <p className="font-display-lg text-title-sm text-on-surface">#PO-2024-0068</p>
                </div>
                <div className="space-y-1 text-on-surface-variant font-body-sm">
                  <p className="font-bold text-on-surface">Vendor:</p>
                  <p>Infra Supplies Pvt Ltd</p>
                  <p>456 Industrial Estate, Surat</p>
                  <p>GSTIN: 243940424GSZ3</p>
                </div>
              </div>
            </div>

            {/* Meta Data */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-outline-variant mb-8 bg-surface-container/30 px-6 rounded-lg">
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">PO Date</p>
                <p className="font-table-data text-body-md text-on-surface">22 May, 2025</p>
              </div>
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">Invoice Date</p>
                <p className="font-table-data text-body-md text-on-surface">22 May, 2025</p>
              </div>
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">Due Date</p>
                <p className="font-table-data text-body-md text-on-surface">21 June, 2025</p>
              </div>
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">Payment Status</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    paymentStatus === 'Paid' ? 'bg-primary' :
                    paymentStatus === 'Cancelled' ? 'bg-error' :
                    'bg-orange-400'
                  }`}></span>
                  <p className="font-table-data text-body-md text-on-surface">{paymentStatus}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-12 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant text-on-surface-variant font-label-caps text-[11px] uppercase">
                    <th className="py-cell-padding-v px-cell-padding-h">Item Description</th>
                    <th className="py-cell-padding-v px-cell-padding-h text-right">Qty</th>
                    <th className="py-cell-padding-v px-cell-padding-h text-right">Unit Price</th>
                    <th className="py-cell-padding-v px-cell-padding-h text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="text-on-surface font-table-data text-body-md">
                  <tr className="border-b border-outline-variant/50 hover:bg-surface-container-high transition-colors">
                    <td className="py-cell-padding-v px-cell-padding-h">
                      <p className="font-bold">Ergonomic Office Chair - Model Elite</p>
                      <p className="text-xs text-on-surface-variant">Black mesh, adjustable lumbar support</p>
                    </td>
                    <td className="py-cell-padding-v px-cell-padding-h text-right font-mono">25</td>
                    <td className="py-cell-padding-v px-cell-padding-h text-right font-mono">₹ 3,500</td>
                    <td className="py-cell-padding-v px-cell-padding-h text-right font-mono">₹ 87,500</td>
                  </tr>
                  <tr className="border-b border-outline-variant/50 hover:bg-surface-container-high transition-colors">
                    <td className="py-cell-padding-v px-cell-padding-h">
                      <p className="font-bold">Standing Desk - Motorized</p>
                      <p className="text-xs text-on-surface-variant">Dual motor, 4 memory presets</p>
                    </td>
                    <td className="py-cell-padding-v px-cell-padding-h text-right font-mono">10</td>
                    <td className="py-cell-padding-v px-cell-padding-h text-right font-mono">₹ 8,200</td>
                    <td className="py-cell-padding-v px-cell-padding-h text-right font-mono">₹ 82,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-80 space-y-3 font-body-md">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="text-on-surface font-mono">₹ 1,69,500</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>CGST (9%)</span>
                  <span className="text-on-surface font-mono">₹ 15,255</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>SGST (9%)</span>
                  <span className="text-on-surface font-mono">₹ 15,255</span>
                </div>
                <div className="flex justify-between items-center py-3 border-t border-outline-variant mt-2">
                  <span className="font-bold text-title-sm text-on-surface">Grand Total</span>
                  <span className="font-display-lg text-title-sm text-primary font-mono">₹ 2,00,010</span>
                </div>
                <div className="text-[10px] text-right font-label-caps text-on-surface-variant mt-2 italic">
                  Amount in words: Two Lakhs and Ten Rupees Only.
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-20 pt-8 border-t border-outline-variant flex justify-between items-end">
              <div className="space-y-1 text-on-surface-variant font-body-sm italic">
                <p>Terms &amp; Conditions:</p>
                <p>1. Payment terms: Net 30 days.</p>
                <p>2. Goods once sold will not be taken back.</p>
              </div>
              <div className="text-center">
                <div className="w-48 h-12 border-b border-outline-variant mb-2"></div>
                <p class="font-label-caps text-label-caps text-on-surface">Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info/Timeline */}
        <div className="xl:col-span-4 space-y-gutter">
          {/* Status Card */}
          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase">Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={handleMarkAsPaid}
                disabled={paymentStatus === 'Paid' || paymentStatus === 'Cancelled'}
                className="w-full bg-primary disabled:opacity-50 text-on-primary font-headline-md text-body-md py-3 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">payments</span>
                Mark as Paid
              </button>
              <button 
                onClick={handleCancelPO}
                disabled={paymentStatus === 'Paid' || paymentStatus === 'Cancelled'}
                className="w-full bg-error-container disabled:opacity-50 text-on-error-container font-headline-md text-body-md py-3 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">cancel</span>
                Cancel PO
              </button>
            </div>
          </div>

          {/* Vendor Snapshot */}
          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase">Vendor Profile</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">store</span>
              </div>
              <div>
                <h4 className="font-title-sm text-body-md text-on-surface">Infra Supplies Pvt Ltd</h4>
                <p className="font-body-sm text-xs text-on-surface-variant">Top-tier supplier since 2021</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container/50 p-3 rounded-lg">
                <p className="text-[10px] text-on-surface-variant font-label-caps uppercase">Vendor Rating</p>
                <p className="text-primary font-bold">4.8 / 5.0</p>
              </div>
              <div className="bg-surface-container/50 p-3 rounded-lg">
                <p className="text-[10px] text-on-surface-variant font-label-caps uppercase">Open POs</p>
                <p className="text-on-surface font-bold">12</p>
              </div>
            </div>
          </div>

          {/* Audit Log */}
          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-6 uppercase">PO Timeline</h3>
            <div className="relative space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant">
              {timeline.map((event) => (
                <div key={event.id} className="relative pl-10">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                    event.isError ? 'bg-error text-on-error shadow-lg shadow-error/20' :
                    event.completed ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' :
                    'bg-outline-variant border-4 border-surface'
                  }`}>
                    {event.completed ? (
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {event.isError ? 'close' : 'check'}
                      </span>
                    ) : null}
                  </div>
                  <p className={`text-body-sm font-bold ${event.completed ? 'text-on-surface' : 'text-on-surface-variant'}`}>{event.title}</p>
                  <p className="text-xs text-on-surface-variant">{event.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast Notification */}
      <div 
        className={`fixed bottom-8 right-8 bg-surface-container-highest border border-primary text-on-surface px-6 py-4 rounded-xl flex items-center gap-4 transition-all duration-500 z-[100] shadow-2xl ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">check_circle</span>
        </div>
        <div>
          <p className="font-bold text-body-md">Action Successful</p>
          <p className="text-xs text-on-surface-variant">{toastMessage}</p>
        </div>
      </div>
    </div>
  );
}
