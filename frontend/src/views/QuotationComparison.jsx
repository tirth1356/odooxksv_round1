import React, { useState, useEffect } from 'react';
import { useDialog } from '../context/DialogContext';
import html2pdf from 'html2pdf.js';

export default function QuotationComparison({ onBack }) {
  const { showAlert, showToast } = useDialog();
  const [selectedVendor, setSelectedVendor] = useState('Infra Supplies Pvt Ltd');
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://localhost:8000/api/rfqs/compare/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setVendors(data);
          if (data.length > 0) {
            setSelectedVendor(data[0].name);
          }
        }
      } catch (err) {
        console.error('Error fetching comparison data:', err);
      }
    };
    fetchComparisonData();
  }, []);

  const criteria = [
    { label: 'Grand Total (INR)', icon: 'payments', key: 'total' },
    { label: 'GST (%)', icon: 'account_balance', key: 'gst' },
    { label: 'Delivery (Days)', icon: 'local_shipping', key: 'delivery' },
    { label: 'Vendor Rating', icon: 'verified', key: 'rating' },
    { label: 'Payment Terms', icon: 'calendar_today', key: 'terms' },
    { label: 'Compliance', icon: 'settings_suggest', key: 'compliance' }
  ];

  const handleApprove = (vendorName) => {
    setSelectedVendor(vendorName);
    showToast(`${vendorName} has been selected and approved for Office Furniture procurement Q2!`);
  };

  return (
    <div className="space-y-6">

      <div className="max-w-container-max mx-auto">
        <nav className="flex items-center gap-2 text-on-surface-variant text-label-caps font-label-caps mb-4">
          <button onClick={onBack} className="hover:text-primary transition-colors">QUOTATIONS</button>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-bold">COMPARISON</span>
        </nav>

        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-display-lg text-display-lg text-on-surface">Quotation Comparison</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-on-surface-variant font-body-md">RFQ:</span>
              <span className="text-primary font-bold text-body-md">office furniture procurement q2</span>
              <span className="h-4 w-[1px] bg-outline-variant"></span>
              <span className="text-on-surface-variant text-body-md">3 quotations received</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                showToast('Preparing PDF download...');
                const element = document.getElementById('comparison-canvas');
                if(!element) return;
                const opt = {
                  margin:       0.5,
                  filename:     'Quotation_Comparison.pdf',
                  image:        { type: 'jpeg', quality: 0.98 },
                  html2canvas:  { scale: 2 },
                  jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
                };
                html2pdf().set(opt).from(element).save();
              }} 
              className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-body-sm text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export PDF
            </button>
            <button 
              onClick={() => showToast('Share link copied to clipboard!')} 
              className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-body-sm text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              Share Review
            </button>
          </div>
        </div>
      </div>

      {vendors.length === 0 ? (
        <div className="max-w-container-max mx-auto p-12 text-center bg-surface-container-low border border-outline-variant rounded-xl shadow-2xl text-on-surface-variant">
          No quotations available for comparison yet.
        </div>
      ) : (
      <>
      <div id="comparison-canvas" className="max-w-container-max mx-auto">
        <div className="grid grid-cols-4 gap-0 border border-outline-variant rounded-xl overflow-hidden bg-surface-container-low shadow-2xl">

          <div className="bg-surface-container-high/50 p-6 border-b border-r border-outline-variant flex items-center">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Comparison Criteria</span>
          </div>

          {vendors.map(v => {
            const isHighlighted = selectedVendor === v.name;
            return (
              <div 
                key={v.name} 
                className={`p-6 border-b border-r border-outline-variant transition-all duration-300 ${
                  isHighlighted ? 'bg-secondary-container/10 comparison-col-highlight' : 'bg-surface-container-high/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-title-sm text-title-sm ${isHighlighted ? 'text-primary' : 'text-on-surface'}`}>{v.name}</h3>
                  {v.badge && (
                    <span className="bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {v.badge}
                    </span>
                  )}
                </div>
                <p className="text-label-caps text-on-surface-variant">Vendor ID: {v.id}</p>
              </div>
            );
          })}

          <div className="p-cell-padding-v px-cell-padding-h border-b border-r border-outline-variant flex items-center text-on-surface-variant bg-surface-container-lowest/30">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
              <span className="font-body-md">Grand Total (INR)</span>
            </div>
          </div>
          {vendors.map(v => {
            const isHighlighted = selectedVendor === v.name;
            return (
              <div 
                key={v.name} 
                className={`p-cell-padding-v px-cell-padding-h border-b border-r border-outline-variant transition-all duration-300 ${
                  isHighlighted ? 'bg-secondary-container/5 text-primary' : 'text-on-surface opacity-80'
                }`}
              >
                <span className="font-headline-md text-headline-md">{v.total}</span>
              </div>
            );
          })}

          <div className="p-cell-padding-v px-cell-padding-h border-b border-r border-outline-variant flex items-center text-on-surface-variant bg-surface-container-lowest/30">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">account_balance</span>
              <span className="font-body-md">GST (%)</span>
            </div>
          </div>
          {vendors.map(v => {
            const isHighlighted = selectedVendor === v.name;
            return (
              <div 
                key={v.name} 
                className={`p-cell-padding-v px-cell-padding-h border-b border-r border-outline-variant transition-all duration-300 font-medium ${
                  isHighlighted ? 'bg-secondary-container/5 text-primary' : 'text-on-surface opacity-80'
                }`}
              >
                {v.gst}
              </div>
            );
          })}

          <div className="p-cell-padding-v px-cell-padding-h border-b border-r border-outline-variant flex items-center text-on-surface-variant bg-surface-container-lowest/30">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              <span className="font-body-md">Delivery (Days)</span>
            </div>
          </div>
          {vendors.map(v => {
            const isHighlighted = selectedVendor === v.name;
            return (
              <div 
                key={v.name} 
                className={`p-cell-padding-v px-cell-padding-h border-b border-r border-outline-variant transition-all duration-300 ${
                  isHighlighted ? 'bg-secondary-container/5' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${isHighlighted ? 'text-primary' : 'text-on-surface'}`}>{v.delivery.text}</span>
                  {v.delivery.tag && (
                    <span className={`text-[10px] px-1.5 rounded ${v.delivery.tagStyle || 'bg-surface-container-highest text-on-surface-variant'}`}>
                      {v.delivery.tag}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          <div className="p-cell-padding-v px-cell-padding-h border-b border-r border-outline-variant flex items-center text-on-surface-variant bg-surface-container-lowest/30">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span className="font-body-md">Vendor Rating</span>
            </div>
          </div>
          {vendors.map(v => {
            const isHighlighted = selectedVendor === v.name;
            return (
              <div 
                key={v.name} 
                className={`p-cell-padding-v px-cell-padding-h border-b border-r border-outline-variant transition-all duration-300 ${
                  isHighlighted ? 'bg-secondary-container/5' : ''
                }`}
              >
                <div className={`flex items-center gap-1 ${isHighlighted ? 'text-primary' : 'text-on-surface opacity-80'}`}>
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-bold">{v.rating}</span>
                </div>
              </div>
            );
          })}

          <div className="p-cell-padding-v px-cell-padding-h border-b border-r border-outline-variant flex items-center text-on-surface-variant bg-surface-container-lowest/30">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              <span className="font-body-md">Payment Terms</span>
            </div>
          </div>
          {vendors.map(v => {
            const isHighlighted = selectedVendor === v.name;
            return (
              <div 
                key={v.name} 
                className={`p-cell-padding-v px-cell-padding-h border-b border-r border-outline-variant transition-all duration-300 font-medium ${
                  isHighlighted ? 'bg-secondary-container/5 text-primary' : 'text-on-surface opacity-80'
                }`}
              >
                {v.terms}
              </div>
            );
          })}

          <div className="p-cell-padding-v px-cell-padding-h border-b border-r border-outline-variant flex items-center text-on-surface-variant bg-surface-container-lowest/30">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">settings_suggest</span>
              <span className="font-body-md">Compliance</span>
            </div>
          </div>
          {vendors.map(v => {
            const isHighlighted = selectedVendor === v.name;
            return (
              <div 
                key={v.name} 
                className={`p-cell-padding-v px-cell-padding-h border-b border-r border-outline-variant transition-all duration-300 ${
                  isHighlighted ? 'bg-secondary-container/5' : ''
                }`}
              >
                {v.compliance ? (
                  <span className="text-primary material-symbols-outlined">check_circle</span>
                ) : (
                  <span className="text-error material-symbols-outlined">cancel</span>
                )}
              </div>
            );
          })}

          <div className="p-6 border-r border-outline-variant bg-surface-container-lowest/30">

          </div>
          {vendors.map(v => {
            const isHighlighted = selectedVendor === v.name;
            return (
              <div 
                key={v.name} 
                className={`p-6 border-r border-outline-variant flex flex-col justify-center items-center transition-all duration-300 ${
                  isHighlighted ? 'bg-secondary-container/5 comparison-col-highlight' : 'bg-surface-container-high/10'
                }`}
              >
                <button 
                  onClick={() => handleApprove(v.name)}
                  className={`w-full py-3 font-bold rounded-lg transition-all transform active:scale-95 ${
                    isHighlighted 
                      ? 'bg-primary text-on-primary shadow-xl shadow-primary/10 hover:brightness-110' 
                      : 'border border-outline-variant text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {isHighlighted ? 'Select & Approve' : 'Select'}
                </button>
                {isHighlighted && v.badge && (
                  <p className="text-[10px] text-primary/70 text-center mt-3 uppercase font-label-caps">{v.badge} match</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-sm"></div>
              <span className="text-body-sm text-on-surface-variant italic">Highlighted vendor is the approved bidder.</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-error rounded-sm"></div>
              <span className="text-body-sm text-on-surface-variant italic">Red icons indicate non-compliance with technical RFQ specs.</span>
            </div>
          </div>
          <p className="text-body-sm text-on-surface-variant">Selecting a vendor initiates the multi-stage approval workflow.</p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto mt-12 grid grid-cols-3 gap-6">
        {vendors.map(v => {
          const isHighlighted = selectedVendor === v.name;
          return (
            <div 
              key={v.name} 
              onClick={() => setSelectedVendor(v.name)}
              className={`glass-panel p-6 rounded-xl cursor-pointer hover:border-primary/30 transition-all duration-300 ${
                isHighlighted ? 'border-primary/40 ring-1 ring-primary/25' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <img alt={`${v.name} Logo`} className="w-12 h-12 rounded-lg" src={v.logo}/>
                <div>
                  <h4 className={`font-title-sm text-title-sm ${isHighlighted ? 'text-primary font-bold' : 'text-on-surface'}`}>{v.name}</h4>
                  <p className="text-body-sm text-on-surface-variant">{v.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-body-sm">
                <div className="bg-surface-container p-3 rounded-lg">
                  <p className="text-on-surface-variant text-[10px] uppercase">Reliability</p>
                  <p className="text-on-surface font-medium">{v.reliability}</p>
                </div>
                <div className="bg-surface-container p-3 rounded-lg">
                  <p className="text-on-surface-variant text-[10px] uppercase">Prev. POs</p>
                  <p className="text-on-surface font-medium">{v.prevPOs}</p>
                </div>
              </div>
              <p className="mt-4 text-body-sm text-on-surface-variant line-clamp-2">"{v.desc}"</p>
            </div>
          );
        })}
      </div>
      </>
      )}
    </div>
  );
}
