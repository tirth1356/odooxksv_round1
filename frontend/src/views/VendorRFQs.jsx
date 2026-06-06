import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function VendorRFQs({ setActiveTab }) {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_BASE_URL}/api/rfqs/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Assuming vendors can see open RFQs or RFQs assigned to them
          setRfqs(data.filter(r => r.status !== 'Draft'));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRFQs();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in">
      <header className="mb-8">
        <h2 className="font-headline-md text-headline-md text-on-surface">Available RFQs</h2>
        <p className="text-on-surface-variant font-body-md">Review requests and submit your quotations.</p>
      </header>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading RFQs...</div>
      ) : rfqs.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-xl">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">inbox</span>
          <p className="text-on-surface-variant">No RFQs available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rfqs.map(rfq => (
            <div key={rfq.id} className="glass-card p-6 rounded-xl flex flex-col gap-4 border border-outline-variant hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-[11px] font-bold uppercase">{rfq.category || 'General'}</span>
                <span className="text-body-sm text-on-surface-variant">ID: #{rfq.id}</span>
              </div>
              <div>
                <h3 className="font-title-sm text-title-sm text-on-surface mb-1">{rfq.title}</h3>
                <p className="text-body-sm text-on-surface-variant line-clamp-2">{rfq.description || 'No description provided.'}</p>
              </div>
              <div className="mt-auto pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                <span className="text-[12px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">event</span>
                  {rfq.deadline || 'No Deadline'}
                </span>
                <button 
                  onClick={() => setActiveTab('Quotations')}
                  className="bg-primary text-on-primary px-4 py-2 rounded-lg text-body-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  View & Submit Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
