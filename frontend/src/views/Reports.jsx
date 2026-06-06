import React, { useState, useEffect } from 'react';

export default function Reports() {
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [selectedRange, setSelectedRange] = useState('May 1, 2025 - May 31, 2025');

  const categories = [
    { name: 'IT Hardware', spend: 4.8, percentage: 78, color: 'bg-primary' },
    { name: 'Furniture', spend: 3.2, percentage: 52, color: 'bg-primary/70' },
    { name: 'Stationery', spend: 2.1, percentage: 34, color: 'bg-primary/40' },
    { name: 'Logistics', spend: 2.3, percentage: 38, color: 'bg-primary/50' }
  ];

  const topVendors = [
    { init: 'TC', name: 'TechCore Ltd', pos: 6, spend: '$4.2M', rating: '4.8 Rating' },
    { init: 'IS', name: 'Infra Supplies', pos: 4, spend: '$3.1M', rating: '4.2 Rating' },
    { init: 'FL', name: 'FastLog', pos: 3, spend: '$1.9M', rating: '3.9 Rating' },
    { init: 'SV', name: 'Star Vendors', pos: 2, spend: '$0.9M', rating: '4.5 Rating' }
  ];

  const monthlyTrend = [
    { month: 'Jan', height: 'h-20', spend: '$5.4M' },
    { month: 'Feb', height: 'h-28', spend: '$7.8M' },
    { month: 'Mar', height: 'h-32', spend: '$9.2M' },
    { month: 'Apr', height: 'h-36', spend: '$10.5M' },
    { month: 'May', height: 'h-44', spend: '$12.4M', active: true }
  ];

  const tickers = [
    "LIVE: Purchase Order PO-2025-0068 approved by Priya Shah",
    "LIVE: New Quotation submitted by TechCore Ltd for IT Support RFQ",
    "LIVE: Onboarding process completed for Star Vendors",
    "LIVE: Invoice #INV-990 marked as Paid by Alex Thompson"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickers.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    alert(`Exporting analytical report for range: ${selectedRange}`);
  };

  const handleSelectRange = () => {
    const range = prompt("Enter Custom Date Range (e.g., Q1 2025, May 1 - May 31):", selectedRange);
    if (range) setSelectedRange(range);
  };

  return (
    <div className="space-y-6 relative">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Reports &amp; Analytics</h2>
          <p className="text-body-md text-on-surface-variant">Procurement Insights Overview for May 2025</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleSelectRange}
            className="flex items-center gap-2 bg-surface-container border border-outline-variant px-3 py-2 rounded text-body-sm text-on-surface hover:border-primary transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            <span>{selectedRange}</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-primary text-primary hover:bg-primary/10 rounded transition-all text-body-sm font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">ios_share</span>
            Export
          </button>
        </div>
      </div>

      {/* KPI Row (The 4 Anchors) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bento-card p-5 rounded-xl relative overflow-hidden group hover:translate-y-[-2px]">
          <div className="relative z-10">
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">Total Spend</p>
            <h3 className="font-display-lg text-display-lg text-primary">$12.4M</h3>
            <div className="flex items-center gap-1 text-primary-fixed text-[11px] mt-2">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+14.2% from last month</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          </div>
        </div>

        <div className="bento-card p-5 rounded-xl relative overflow-hidden group hover:translate-y-[-2px]">
          <div className="relative z-10">
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">Active Vendors</p>
            <h3 className="font-display-lg text-display-lg text-on-surface">28</h3>
            <div className="flex items-center gap-1 text-on-surface-variant text-[11px] mt-2">
              <span className="material-symbols-outlined text-[14px]">horizontal_rule</span>
              <span>Stable supply network</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          </div>
        </div>

        <div className="bento-card p-5 rounded-xl relative overflow-hidden group hover:translate-y-[-2px]">
          <div className="relative z-10">
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">PO Fulfillment Rate</p>
            <h3 className="font-display-lg text-display-lg text-tertiary">94%</h3>
            <div className="flex items-center gap-1 text-primary-fixed text-[11px] mt-2">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>High efficiency target reached</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
        </div>

        <div className="bento-card p-5 rounded-xl relative overflow-hidden group hover:translate-y-[-2px]">
          <div className="relative z-10">
            <p className="text-label-caps font-label-caps text-on-surface-variant mb-1">Overdue Invoices</p>
            <h3 className="font-display-lg text-display-lg text-error">3</h3>
            <div className="flex items-center gap-1 text-error text-[11px] mt-2">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              <span>Immediate attention required</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>running_with_errors</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending by Category (Bar Chart Area) */}
        <div className="lg:col-span-2 bento-card p-6 rounded-xl flex flex-col hover:translate-y-[-2px]">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-title-sm text-title-sm text-on-surface">Spending by Category</h4>
            <button onClick={() => alert('Category options')} className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
          
          <div className="flex-1 flex flex-col justify-around gap-6">
            {categories.map((c) => (
              <div key={c.name} className="space-y-2 group cursor-pointer">
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface group-hover:text-primary transition-colors">{c.name}</span>
                  <span className="font-bold text-on-surface">${c.spend}M</span>
                </div>
                <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${c.color}`} 
                    style={{ width: `${c.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-outline-variant/30">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                <span className="text-[11px] text-on-surface-variant uppercase font-label-caps">Major Capex</span>
              </div>
              <a 
                className="text-primary text-body-sm hover:underline" 
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Opening breakdown details...'); }}
              >
                View Detailed Breakdown
              </a>
            </div>
          </div>
        </div>

        {/* Top Vendors by Spend */}
        <div className="bento-card p-6 rounded-xl hover:translate-y-[-2px] flex flex-col justify-between">
          <div>
            <h4 className="font-title-sm text-title-sm text-on-surface mb-6">Top Vendors by Spend</h4>
            <div className="space-y-4">
              {topVendors.map((v) => (
                <div key={v.name} className="flex items-center justify-between p-3 rounded hover:bg-surface-container-highest/30 transition-colors border-b border-outline-variant/10 group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center text-primary-fixed font-bold text-xs">
                      {v.init}
                    </div>
                    <div>
                      <p className="text-body-sm font-bold text-on-surface group-hover:text-primary transition-colors">{v.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{v.pos} Purchase Orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-body-sm font-bold text-primary">{v.spend}</p>
                    <p className="text-[10px] text-on-surface-variant">{v.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => alert('Navigating to full Vendors list...')}
            className="w-full mt-6 py-2 rounded border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/40 transition-all text-[12px] font-bold uppercase tracking-wider"
          >
            View All Vendors
          </button>
        </div>
      </div>

      {/* Bottom Trend Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Spending Trend */}
        <div className="bento-card p-6 rounded-xl hover:translate-y-[-2px] relative">
          <h4 className="font-title-sm text-title-sm text-on-surface mb-6">Monthly Spending Trend</h4>
          
          {hoveredMonth && (
            <div className="absolute top-4 right-6 bg-primary-container text-on-primary-container px-3 py-1 rounded text-xs font-bold shadow-lg">
              {hoveredMonth.month} Spend: {hoveredMonth.spend}
            </div>
          )}

          <div className="h-48 flex items-end justify-between gap-4 px-2">
            {monthlyTrend.map((m) => (
              <div 
                key={m.month} 
                className="flex flex-col items-center flex-1"
                onMouseEnter={() => setHoveredMonth(m)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                <div className={`w-full rounded-t transition-all duration-300 relative group cursor-pointer ${
                  m.active 
                    ? 'bg-primary/80 h-44 shadow-[0_0_15px_rgba(78,222,163,0.3)]' 
                    : `bg-surface-container-highest/50 ${m.height}`
                }`}>
                  {!m.active && (
                    <div className="absolute inset-0 bg-primary/20 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom rounded-t duration-300"></div>
                  )}
                </div>
                <span className={`text-[10px] mt-2 font-label-caps uppercase ${m.active ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Summary / Actionable Items */}
        <div className="bento-card p-6 bg-gradient-to-br from-surface-container to-surface rounded-xl hover:translate-y-[-2px] flex flex-col justify-between">
          <div>
            <h4 className="font-title-sm text-title-sm text-on-surface mb-4">Strategic Forecast</h4>
            <div className="space-y-4">
              <div className="p-3 bg-primary-container/10 border-l-4 border-primary rounded-r">
                <p className="text-body-sm text-primary font-bold">Optimization Opportunity</p>
                <p className="text-[12px] text-on-surface-variant leading-relaxed">Consolidating IT Hardware vendors could yield a potential 8% saving ($384k annually).</p>
              </div>
              <div className="p-3 bg-secondary-container/10 border-l-4 border-secondary rounded-r">
                <p className="text-body-sm text-secondary font-bold">Vendor Performance</p>
                <p className="text-[12px] text-on-surface-variant leading-relaxed">Infra Supplies delivery time improved by 12% following the Q1 audit session.</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <button onClick={() => alert('Redirecting to Audit Logs...')} className="flex-1 py-2 bg-surface-container-highest text-on-surface text-body-sm font-bold rounded hover:bg-surface-bright transition-all">Audit Logs</button>
            <button onClick={() => alert('Opening full forecast PDF report...')} className="flex-1 py-2 bg-primary/20 text-primary text-body-sm font-bold rounded hover:bg-primary/30 transition-all">Full Report</button>
          </div>
        </div>
      </div>

      {/* Recent Activity Ticker */}
      <div className="bento-card p-4 rounded-xl flex items-center justify-between hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-4">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          <p className="text-body-sm font-table-data text-on-surface">
            <span className="font-bold text-primary">LIVE:</span> {tickers[tickerIndex]}
          </p>
        </div>
        <div className="text-[11px] text-on-surface-variant uppercase tracking-widest font-label-caps">
          Updated just now
        </div>
      </div>
    </div>
  );
}
