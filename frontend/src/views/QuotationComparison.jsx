import React, { useState } from 'react';

export default function QuotationComparison({ onBack }) {
  const [selectedVendor, setSelectedVendor] = useState('Infra Supplies');

  const criteria = [
    { label: 'Grand Total (USD)', icon: 'payments', key: 'total' },
    { label: 'GST (%)', icon: 'account_balance', key: 'gst' },
    { label: 'Delivery (Days)', icon: 'local_shipping', key: 'delivery' },
    { label: 'Vendor Rating', icon: 'verified', key: 'rating' },
    { label: 'Payment Terms', icon: 'calendar_today', key: 'terms' },
    { label: 'Compliance', icon: 'settings_suggest', key: 'compliance' }
  ];

  const vendors = [
    {
      id: '#INF-882',
      name: 'Infra Supplies',
      total: '$185,000.00',
      gst: '18%',
      delivery: { text: '10 Days', tag: 'Fast', tagStyle: 'bg-tertiary-container/20 text-tertiary' },
      rating: '4.5/5',
      terms: '30 days',
      compliance: true,
      badge: 'Lowest Price',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwD8CFRfZ04oH-3CTRcen_6WT6yy1d7pztIIzmG70QvNcIt-_Mu_5rxIW25ZMsumWWQKpqRqdx9jtnQwHRcuqjdikpCl4xFRSARPGFGxI-hPaL_2-v4fhpIHMtRo3cOBnbt9r5w5jeVB14FKAeZixggjqyU-54IFEzXZ22DfG1xSOoY0HKrmqzYBhIE5QqV1tPpNGFFq2jzj04BAG_IakS-JIM01FcRVT0-GqAFiABIy6k_IM0JeOCYjqqFXQBj-8q9s5tS8aWonhO',
      location: 'San Francisco, CA',
      reliability: '98.2%',
      prevPOs: 124,
      desc: 'Long-standing partner with consistent delivery track record for office infrastructure components.'
    },
    {
      id: '#TC-441',
      name: 'TechCore LTD',
      total: '$200,010.00',
      gst: '18%',
      delivery: { text: '14 Days' },
      rating: '4.2/5',
      terms: '30 days',
      compliance: true,
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3HuPh7MIix3F9E2TELyypW2vkhZeZSeCIw31k_uxJf_36tA4wFl0ASDLNyNyAAAuBFMqgTyPItjFGYo1nbglci0Enj3kGTayumVeNx7quTLhHF0kFEZ99oLcIqOGgR1o2zggrOsHUqrAd_Pzvlqg9C1NUzK4WC44ih7Nzoxic-bnJ9mSMqCaKwam9Ax3lZ2HcFDOjlf69e5yj8umC0YTsw475rVKht50e4JqTiOOHUO4fUSXD3WU47ff54mihUzBwa8a8q1LUD4OD',
      location: 'Austin, TX',
      reliability: '94.0%',
      prevPOs: 42,
      desc: 'High-tech furniture specialists. Premium pricing with moderate delivery speed.'
    },
    {
      id: '#ONC-109',
      name: 'Office Need Co.',
      total: '$214,800.00',
      gst: '18%',
      delivery: { text: '7 Days', tag: 'Fastest', tagStyle: 'bg-primary-container text-on-primary-container' },
      rating: '3.8/5',
      terms: '15 days',
      compliance: false,
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFdiGXtUwR7ETw7ttl2m9iGFZP54sp-xuhyZ1RZE99kdZJ62cVU0BLCwjv0kmdzmiVyr-8X0e-19nZgyvbZOaRQZgUvR2JT1Uqk9N2JA7f6-AEhnMFlym5cypEyGXw7bhXa5Jcy8Bw0NBAPD3CMgm-uIsq-G5rKFOx3v78WoWwyFE01mwopRCJ-5_oC701ZyH7ykNQCTFghAhSHCly9NUzh7noC-PyHkOyTrEb9nulrsCuCu8bn5ILuMFErabIqKlYW05bH3ZQJ1m7',
      location: 'New York, NY',
      reliability: '89.5%',
      prevPOs: 18,
      desc: 'Economic supplier. Frequent technical non-compliances in past two RFQs.'
    }
  ];

  const handleApprove = (vendorName) => {
    setSelectedVendor(vendorName);
    alert(`${vendorName} has been selected and approved for Office Furniture procurement Q2!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
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
              onClick={() => alert('Exporting Comparison to PDF...')} 
              className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-body-sm text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export PDF
            </button>
            <button 
              onClick={() => alert('Opening Share Dialog...')} 
              className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-body-sm text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              Share Review
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Table (Bento Grid Inspired Layout) */}
      <div className="max-w-container-max mx-auto">
        <div className="grid grid-cols-4 gap-0 border border-outline-variant rounded-xl overflow-hidden bg-surface-container-low shadow-2xl">
          {/* Row 1: Header / Labels */}
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

          {/* Row 2: Grand Total */}
          <div className="p-cell-padding-v px-cell-padding-h border-b border-r border-outline-variant flex items-center text-on-surface-variant bg-surface-container-lowest/30">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
              <span className="font-body-md">Grand Total (USD)</span>
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

          {/* Row 3: GST */}
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

          {/* Row 4: Delivery */}
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

          {/* Row 5: Vendor Rating */}
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

          {/* Row 6: Payment Terms */}
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

          {/* Row 7: Compliance */}
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

          {/* Row 8: Action Buttons */}
          <div className="p-6 border-r border-outline-variant bg-surface-container-lowest/30">
            {/* Spacer for criteria label column */}
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

        {/* Footer Legend */}
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

      {/* Vendor Profile Preview Cards */}
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
    </div>
  );
}
