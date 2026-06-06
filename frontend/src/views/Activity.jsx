import React, { useState, useEffect } from 'react';

export default function Activity() {
  const [filter, setFilter] = useState('All');
  const [alerts, setAlerts] = useState([
    { id: 1, title: 'RFQ Deadline Approaching', desc: 'Office Supplies Q2 expires in 4 hours.', type: 'error' },
    { id: 2, title: 'Payment Processed', desc: 'Invoice #INV-990 paid successfully.', type: 'primary' },
    { id: 3, title: 'Quotation Received', desc: '3 new quotes for IT Support RFP.', type: 'tertiary' }
  ]);
  const [toast, setToast] = useState(null);

  const initialLogs = [
    {
      id: 1,
      title: 'Quotation Final Approval',
      desc: 'PO-2024-0068 approved by Priya Shah (Finance)',
      category: 'Approvals',
      time: '4:12 PM',
      doc: { name: 'Purchase_Order_2024_068.pdf', type: 'Purchase Order' }
    },
    {
      id: 2,
      title: 'New Vendor Onboarded',
      desc: 'TechCore Ltd has successfully completed the registration process.',
      category: 'Vendors',
      time: '2:45 PM',
      tags: ['Category: IT Hardware', 'Status: KYC Verified']
    },
    {
      id: 3,
      title: 'RFQ Revision',
      desc: 'RFQ-2024-Q2-Office furniture updated by Rahul Mehta.',
      category: 'RFQs',
      time: '10:30 AM',
      note: 'Updated line items to include 5 additional ergonomic chairs as per latest headcount.'
    },
    {
      id: 4,
      title: 'Invoice Uploaded',
      desc: 'Vendor FastLog Logistics uploaded Invoice #INV-8892.',
      category: 'Invoices',
      time: 'Yesterday, 11:15 PM'
    }
  ];

  const [logs, setLogs] = useState(initialLogs);

  // Simulation of incoming real-time activity log
  useEffect(() => {
    const timer = setTimeout(() => {
      setToast({
        title: 'New Activity Logged',
        desc: 'Quotation submission by VendorBridge Partner.'
      });
      
      // Add a new log to the list
      const newLog = {
        id: Date.now(),
        title: 'Quotation Submission',
        desc: 'Vendor Infra Supplies Pvt Ltd submitted Quote #Q-99321.',
        category: 'Quotations',
        time: 'Just now'
      };
      setLogs(prev => [newLog, ...prev]);

      // Hide toast after 5s
      setTimeout(() => setToast(null), 5000);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismissAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const handleExportCSV = () => {
    alert('Exporting immutable audit trail to CSV file...');
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'All') return true;
    // Map tag filters
    if (filter === 'RFQs') return log.category === 'RFQs' || log.category === 'Quotations';
    return log.category === filter;
  });

  return (
    <div className="space-y-6 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-label-caps text-on-surface-variant mb-2">
            <span className="hover:text-primary cursor-pointer uppercase">Main Dashboard</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary uppercase">Activity Logs</span>
          </nav>
          <h2 className="font-display-lg text-display-lg text-on-surface">Procurement Audit Trail</h2>
          <p className="text-on-surface-variant mt-1 font-body-md">Real-time immutable history of all platform operations and decisions.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-surface-container border border-outline-variant p-1.5 rounded-xl flex-wrap">
          {['All', 'RFQs', 'Approvals', 'Invoices', 'Vendors'].map((tab) => {
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg text-body-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-primary-container text-on-primary-container shadow-sm' 
                    : 'hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {tab === 'All' ? 'All Activity' : tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dashboard Widgets for Activity Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <span className="text-[10px] font-label-caps text-primary bg-primary/10 px-2 py-0.5 rounded-full">+12% vs last week</span>
          </div>
          <p className="text-[11px] font-label-caps text-on-surface-variant uppercase mb-1">Total Logs Today</p>
          <h3 className="text-display-lg font-display-lg text-on-surface">1,402</h3>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <span className="material-symbols-outlined">priority_high</span>
            </div>
            <span className="text-[10px] font-label-caps text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">{alerts.length} Warnings</span>
          </div>
          <p className="text-[11px] font-label-caps text-on-surface-variant uppercase mb-1">Approval Latency</p>
          <h3 className="text-display-lg font-display-lg text-on-surface">4.2h</h3>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined">person_search</span>
            </div>
          </div>
          <p className="text-[11px] font-label-caps text-on-surface-variant uppercase mb-1">Active Users</p>
          <h3 className="text-display-lg font-display-lg text-on-surface">28</h3>
        </div>

        <div className="glass-card p-5 rounded-2xl overflow-hidden relative">
          <div className="absolute bottom-0 right-0 w-32 h-16 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 100 30">
              <path d="M0,25 Q10,15 20,20 T40,10 T60,18 T80,5 T100,22" fill="none" stroke="#4edea3" strokeWidth="2"></path>
            </svg>
          </div>
          <p className="text-[11px] font-label-caps text-on-surface-variant uppercase mb-1">System Health</p>
          <h3 className="text-display-lg font-display-lg text-primary">99.9%</h3>
        </div>
      </div>

      {/* Main Timeline & Filters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Timeline Column */}
        <div className="lg:col-span-8 flex flex-col gap-4 relative timeline-line">
          {/* Day Divider */}
          <div className="flex items-center gap-4 mb-2">
            <span className="text-label-caps text-[12px] text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">Today — May 23, 2025</span>
            <div className="h-px bg-outline-variant flex-1 opacity-30"></div>
          </div>

          {filteredLogs.map((log) => {
            let catIcon = 'description';
            if (log.category === 'Approvals') catIcon = 'fact_check';
            else if (log.category === 'Vendors') catIcon = 'person_add';
            else if (log.category === 'RFQs') catIcon = 'edit_square';
            else if (log.category === 'Quotations') catIcon = 'sync';
            else if (log.category === 'Invoices') catIcon = 'cloud_upload';

            return (
              <div key={log.id} className="flex gap-6 group hover:translate-x-1 transition-transform cursor-default relative">
                <div className="z-10 mt-1">
                  <div className="w-12 h-12 rounded-full bg-primary-container border-4 border-background flex items-center justify-center text-on-primary-container shadow-lg group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                    <span className="material-symbols-outlined text-xl">{catIcon}</span>
                  </div>
                </div>
                
                <div className="flex-1 glass-card p-5 rounded-2xl group-hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-title-sm text-title-sm text-on-surface">{log.title}</h4>
                      <p className="text-body-sm text-on-surface-variant">{log.desc}</p>
                    </div>
                    <span className="text-[11px] font-label-caps text-on-surface-variant">{log.time}</span>
                  </div>

                  {log.doc && (
                    <div className="mt-4 flex gap-4">
                      <div className="bg-surface-container-high/50 p-3 rounded-xl border border-outline-variant flex-1 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">description</span>
                        <div>
                          <p className="text-[10px] font-label-caps text-on-surface-variant uppercase">Document</p>
                          <p className="text-body-sm font-medium text-on-surface">{log.doc.name}</p>
                        </div>
                      </div>
                      <button onClick={() => alert(`Reviewing Details for ${log.title}...`)} className="px-4 py-2 bg-surface-container-highest/50 hover:bg-primary/20 hover:text-primary rounded-lg text-body-sm font-bold transition-all border border-outline-variant text-on-surface">
                        View Details
                      </button>
                    </div>
                  )}

                  {log.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {log.tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-label-caps rounded uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {log.note && (
                    <div className="bg-error-container/10 border-l-2 border-error p-3 rounded-r-lg mt-2">
                      <p className="text-[12px] italic text-on-surface-variant">"{log.note}"</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <p className="text-center text-on-surface-variant opacity-60 py-8">
              No activity logs matched the selected filter.
            </p>
          )}
        </div>

        {/* Side Panels */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          {/* Recent Notifications Card */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-title-sm text-title-sm text-on-surface">Active Alerts</h4>
              {alerts.length > 0 && (
                <span className="w-6 h-6 bg-error text-on-error rounded-full text-[10px] flex items-center justify-center font-bold">
                  {alerts.length}
                </span>
              )}
            </div>
            
            <div className="space-y-4">
              {alerts.map(a => {
                let alertColor = 'text-error bg-error-container/20';
                let alertIcon = 'warning';
                if (a.type === 'primary') {
                  alertColor = 'text-primary bg-primary/10';
                  alertIcon = 'currency_exchange';
                } else if (a.type === 'tertiary') {
                  alertColor = 'text-tertiary bg-tertiary/10';
                  alertIcon = 'assignment_turned_in';
                }

                return (
                  <div 
                    key={a.id} 
                    onClick={() => handleDismissAlert(a.id)}
                    className="flex gap-3 p-3 rounded-xl hover:bg-surface-container-high/50 transition-colors cursor-pointer border border-transparent hover:border-outline-variant group"
                    title="Click to dismiss alert"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${alertColor}`}>
                      <span className="material-symbols-outlined text-[20px]">{alertIcon}</span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-body-sm font-bold text-on-surface group-hover:text-primary transition-colors">{a.title}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">{a.desc}</p>
                    </div>
                  </div>
                );
              })}
              {alerts.length === 0 && (
                <p className="text-center text-xs text-on-surface-variant opacity-60 py-4">All alerts resolved!</p>
              )}
            </div>
            {alerts.length > 0 && (
              <button onClick={() => setAlerts([])} className="w-full mt-6 py-2 rounded-xl text-primary font-bold text-body-sm hover:bg-primary/10 transition-colors border border-primary/20">
                Mark All as Read
              </button>
            )}
          </div>

          {/* Audit Log Integrity Card */}
          <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-surface-container-high/50 to-primary/5 border-primary/20 border">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">verified_user</span>
              <h4 className="font-title-sm text-title-sm text-on-surface">Integrity Check</h4>
            </div>
            <p className="text-body-sm text-on-surface-variant mb-6 font-body-sm">
              All logs in this system are hashed and immutable. Any modification attempt will trigger a global security alert.
            </p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-outline-variant">
              <div className="w-2 h-2 rounded-full bg-primary status-dot"></div>
              <span className="text-[10px] font-label-caps uppercase text-primary tracking-widest font-mono">Chain Validated</span>
            </div>
          </div>

          {/* Visual Asset / Chart Placeholder */}
          <div className="rounded-2xl overflow-hidden glass-card h-48 relative border border-outline-variant/30">
            <img 
              className="w-full h-full object-cover grayscale brightness-50 contrast-125 opacity-40" 
              alt="Data Analytics Visual"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYkRDc_cfPuuUg-5rhrQXoLzhOwpseZaPLJoguLqfh5xz9sMDp3N_X6nGQVw4YMYlv-F2f8MCh4xLgyIwWsrRKCGuU_r_g3mXCY7cMa4lFk45goYOd3jo_TBcHJj6Bl24hfgGSn9DeDaMwwis1OHZ_2OqTV_vJWs4IKivMNI0dgAp0wLVKvL6o-rzywk81Ku6w5FHEQ7xPBtdmO5bxzv-oXW3k2b9hiBVx3GVNIcO70pfBMyJQSZ5VbTgRXYLXlBQr-DuvL9XBQTMl"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-background to-transparent">
              <p className="text-label-caps text-on-surface-variant uppercase text-[10px] mb-1">Monthly Trend</p>
              <h5 className="text-title-sm font-bold text-on-surface">Audit Volume Analysis</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={handleExportCSV}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-[0_8px_32px_rgba(16,185,129,0.3)] flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group z-50"
      >
        <span className="material-symbols-outlined text-[28px]">file_download</span>
        <div className="absolute right-full mr-4 bg-surface-container-highest px-3 py-1.5 rounded-lg border border-outline-variant opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
          <span className="text-body-sm font-bold text-on-surface">Export Audit Trail (CSV)</span>
        </div>
      </button>

      {/* Real-time Simulated Notification Toast */}
      {toast && (
        <div className="fixed bottom-24 left-[280px] bg-primary-container text-on-primary-container p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-bounce z-50 border border-primary">
          <span className="material-symbols-outlined animate-spin">sync</span>
          <div>
            <p className="font-bold text-sm">{toast.title}</p>
            <p className="text-xs opacity-80">{toast.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}
