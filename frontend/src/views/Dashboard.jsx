import React, { useState } from 'react';
import VendorMgmt from './VendorMgmt';
import RFQContainer from './RFQContainer';
import Quotations from './Quotations';
import QuotationComparison from './QuotationComparison';
import Approvals from './Approvals';
import DocumentViewer from './DocumentViewer';
import Activity from './Activity';
import Reports from './Reports';









export default function Dashboard({ userRole, onLogout }) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [quotationView, setQuotationView] = useState('submit'); // 'submit' or 'compare'

  
  // Custom cursor-glow micro-interaction state
  const [glowStyle, setGlowStyle] = useState({});

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlowStyle({
      '--mouse-x': `${x}px`,
      '--mouse-y': `${y}px`,
    });
  };

  const allNavItems = [
    { name: 'Dashboard', icon: 'dashboard', roles: ['Procurement Officer', 'Vendor', 'Manager / Approver', 'Admin'] },
    { name: 'Vendors', icon: 'groups', roles: ['Procurement Officer', 'Admin'] },
    { name: 'RFQs', icon: 'request_quote', roles: ['Procurement Officer', 'Vendor', 'Manager / Approver'] },
    { name: 'Quotations', icon: 'receipt_long', roles: ['Procurement Officer', 'Vendor'] },
    { name: 'Approvals', icon: 'fact_check', roles: ['Manager / Approver'] },
    { name: 'Purchase Orders', icon: 'shopping_cart', roles: ['Procurement Officer', 'Vendor', 'Manager / Approver'] },
    { name: 'Invoices', icon: 'description', roles: ['Procurement Officer', 'Vendor'] },
    { name: 'Reports', icon: 'analytics', roles: ['Admin'] },
    { name: 'Activity', icon: 'history', roles: ['Procurement Officer', 'Manager / Approver', 'Admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(userRole));
  const isAuthorized = navItems.some(item => item.name === activeTab);

  return (
    <div 
      className="min-h-screen bg-background text-on-surface font-body-md relative overflow-hidden flex"
      onMouseMove={handleMouseMove}
      style={glowStyle}
    >
      {/* SIDEBAR */}
      <aside className="w-[260px] h-screen fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant flex flex-col py-6 z-50">
        <div className="px-6 mb-10 flex flex-col gap-1">
          <span className="text-title-sm font-headline-md font-bold text-primary">VendorBridge</span>
          <span className="font-label-caps text-label-caps text-on-surface-variant/60 uppercase tracking-widest">Procurement ERP</span>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-secondary-container/20 text-primary font-bold border-r-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                <span className="font-label-caps text-label-caps">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto px-6 pt-6 border-t border-outline-variant/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                alt="User Profile"
                className="w-10 h-10 rounded-full border border-primary/30"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe_f7zRnJJKjQb6gDElTwIAt0Vl0wbj7lzUAhmIiZT5f2eokCgOHhdqJXXJPOrMQHtz9j5qKMT4CtjEt-8BRt-rp3gKoRB5JXDXgD097I7Pn3ss-NEuo-VbFIT6zF7zJ2qYDjWXtigFBRijbNa5dk0srz4aOrg1Tgg79tQ4di6drB2Qr7qTHhwSBaAW4wq4Skr2MeAsmcTSIWKsO4knRICDFsNn1OeU5OpEXtMsf-is0b_vDh5l00MfAdulMDyAeg5SBlc7xSIfFqp"
              />
              <div className="flex flex-col">
                <span className="font-body-md text-body-md font-bold text-on-surface">System User</span>
                <span className="text-[11px] text-on-surface-variant">{userRole}</span>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="p-1.5 rounded-lg hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-colors"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE MAIN WRAPPER */}
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        {/* TOP BAR */}
        <header className="h-16 border-b border-outline-variant flex justify-between items-center px-8 bg-surface z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md group focus-within:ring-1 focus-within:ring-primary rounded-lg transition-all">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input
                className="w-full bg-surface-container border-none rounded-lg pl-10 pr-4 py-2 text-body-md focus:ring-0 placeholder:text-on-surface-variant/40 text-on-surface"
                placeholder="Search POs, Vendors, or RFQs..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => alert('Initiating new Request for Quotation (RFQ)...')}
              className="bg-primary hover:bg-primary/90 text-on-primary font-bold px-4 py-2 rounded-lg text-body-sm transition-all shadow-lg shadow-primary/10"
            >
              Create RFQ
            </button>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <button 
                onClick={() => alert('Notifications: All systems operational.')}
                className="hover:bg-surface-container-highest/50 p-2 rounded-lg transition-colors relative"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              <button 
                onClick={() => alert('Settings Panel')}
                className="hover:bg-surface-container-highest/50 p-2 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">settings</span>
              </button>
              <button 
                onClick={() => alert('Help & Documentation')}
                className="hover:bg-surface-container-highest/50 p-2 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">help</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="p-8 flex-grow overflow-y-auto max-w-[1440px] mx-auto w-full">
          <div className="mb-8">
            <h1 className="font-headline-md text-headline-md text-on-surface mb-1">{activeTab}</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Welcome back, Procurement Officer — Here is today's overview across your supply chain.
            </p>
          </div>

          {!isAuthorized ? (
            <div className="glass-card p-12 rounded-xl text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-error text-[64px] mb-4">block</span>
              <h3 className="font-headline-md text-headline-md mb-2">Access Denied</h3>
              <p className="text-on-surface-variant">Your current role ({userRole}) does not have permission to access the {activeTab} section.</p>
              <button 
                onClick={() => setActiveTab('Dashboard')}
                className="mt-6 bg-primary hover:bg-primary/90 text-on-primary font-bold px-6 py-2 rounded-lg text-body-sm transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          ) : activeTab === 'Dashboard' ? (
            <>
              {/* KPI BENTO GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-card p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-[48px] text-primary">request_quote</span>
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Active RFQs</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-on-surface">12</span>
                    <span className="text-primary text-[12px] font-bold">+2 this week</span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-[48px] text-primary">fact_check</span>
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Pending Approvals</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-on-surface">5</span>
                    <span className="text-error text-[12px] font-bold">Priority: 2</span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden group border-primary/20 hover:border-primary/50 transition-all duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-[48px] text-primary">payments</span>
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Monthly Spend</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-primary">$ 2.3L</span>
                    <span className="text-on-surface-variant text-[12px]">84% of budget</span>
                  </div>
                  <div className="mt-2 h-1 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[84%]"></div>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden group border-error-container/20 hover:border-error/50 transition-all duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-[48px] text-error">priority_high</span>
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Overdue Invoices</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-error">3</span>
                    <span className="text-on-surface-variant text-[12px]">Avg 4 days late</span>
                  </div>
                </div>
              </div>

              {/* MAIN LAYOUT: TABLES & CHARTS */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Purchase Orders */}
                <div className="xl:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col">
                  <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                    <h2 class="font-title-sm text-title-sm text-on-surface">Recent Purchase Orders</h2>
                    <a className="text-primary text-body-sm hover:underline" href="#" onClick={(e) => { e.preventDefault(); alert('Redirecting to full PO history...'); }}>View All</a>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-surface-container-highest/30">
                        <tr>
                          <th className="px-6 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">PO#</th>
                          <th className="px-6 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Vendor</th>
                          <th className="px-6 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Amount</th>
                          <th className="px-6 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Status</th>
                          <th className="px-6 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/30">
                        <tr className="hover:bg-surface-container-high transition-colors group">
                          <td className="px-6 py-cell-padding-v font-table-data text-table-data text-on-surface">PO-2024-001</td>
                          <td className="px-6 py-cell-padding-v font-table-data text-table-data text-on-surface">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-primary-fixed text-on-primary-fixed rounded flex items-center justify-center text-[10px] font-bold">IN</div>
                              <span>Infra Logistics</span>
                            </div>
                          </td>
                          <td className="px-6 py-cell-padding-v font-table-data text-table-data text-on-surface">$ 87,000</td>
                          <td className="px-6 py-cell-padding-v">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-container/10 text-primary">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                              Approved
                            </span>
                          </td>
                          <td className="px-6 py-cell-padding-v">
                            <button onClick={() => alert('PO Options')} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_vert</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-surface-container-high transition-colors group">
                          <td className="px-6 py-cell-padding-v font-table-data text-table-data text-on-surface">PO-2024-002</td>
                          <td className="px-6 py-cell-padding-v font-table-data text-table-data text-on-surface">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-secondary-fixed text-on-secondary-fixed rounded flex items-center justify-center text-[10px] font-bold">TC</div>
                              <span>Tech Core Hub</span>
                            </div>
                          </td>
                          <td className="px-6 py-cell-padding-v font-table-data text-table-data text-on-surface">$ 140,000</td>
                          <td className="px-6 py-cell-padding-v">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-tertiary-container/10 text-tertiary">
                              <span className="w-1.5 h-1.5 bg-tertiary rounded-full"></span>
                              Pending
                            </span>
                          </td>
                          <td className="px-6 py-cell-padding-v">
                            <button onClick={() => alert('PO Options')} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_vert</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-surface-container-high transition-colors group">
                          <td className="px-6 py-cell-padding-v font-table-data text-table-data text-on-surface">PO-2024-003</td>
                          <td className="px-6 py-cell-padding-v font-table-data text-table-data text-on-surface">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-outline-variant text-on-surface-variant rounded flex items-center justify-center text-[10px] font-bold">ON</div>
                              <span>OfficeNeed Co</span>
                            </div>
                          </td>
                          <td className="px-6 py-cell-padding-v font-table-data text-table-data text-on-surface">$ 34,900</td>
                          <td className="px-6 py-cell-padding-v">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-surface-container-highest/30 text-on-surface-variant">
                              <span className="w-1.5 h-1.5 bg-outline rounded-full"></span>
                              Draft
                            </span>
                          </td>
                          <td className="px-6 py-cell-padding-v">
                            <button onClick={() => alert('PO Options')} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_vert</button>
                          </td>
                        </tr>
                        <tr className="hover:bg-surface-container-high transition-colors group">
                          <td className="px-6 py-cell-padding-v font-table-data text-table-data text-on-surface">PO-2024-004</td>
                          <td className="px-6 py-cell-padding-v font-table-data text-table-data text-on-surface">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-primary-fixed text-on-primary-fixed rounded flex items-center justify-center text-[10px] font-bold">GS</div>
                              <span>Global Steel</span>
                            </div>
                          </td>
                          <td className="px-6 py-cell-padding-v font-table-data text-table-data text-on-surface">$ 212,500</td>
                          <td className="px-6 py-cell-padding-v">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-container/10 text-primary">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                              Approved
                            </span>
                          </td>
                          <td className="px-6 py-cell-padding-v">
                            <button onClick={() => alert('PO Options')} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_vert</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Spending Trends Widget */}
                <div className="glass-card rounded-xl overflow-hidden flex flex-col h-full">
                  <div className="px-6 py-4 border-b border-outline-variant">
                    <h2 className="font-title-sm text-title-sm text-on-surface">Spending Trends</h2>
                    <span className="text-body-sm text-on-surface-variant">Last 6 months</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center items-center">
                    <div className="relative w-48 h-48 mb-6">
                      {/* Simulated Pie Chart with SVG */}
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2d3449" strokeDasharray="100, 100" strokeWidth="4"></path>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4edea3" strokeDasharray="65, 100" strokeWidth="4"></path>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#95d3ba" strokeDasharray="25, 100" strokeDashoffset="-65" strokeWidth="4"></path>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-display-lg font-bold text-on-surface">65%</span>
                        <span className="text-label-caps font-label-caps text-on-surface-variant">LOGISTICS</span>
                      </div>
                    </div>
                    
                    <div className="w-full space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-primary rounded-full"></span>
                          <span className="text-body-sm text-on-surface">Logistics</span>
                        </div>
                        <span className="text-body-sm font-bold">$ 1.2M</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-secondary rounded-full"></span>
                          <span className="text-body-sm text-on-surface">IT Services</span>
                        </div>
                        <span className="text-body-sm font-bold">$ 450K</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-surface-container-highest rounded-full"></span>
                          <span className="text-body-sm text-on-surface">Other</span>
                        </div>
                        <span className="text-body-sm font-bold">$ 650K</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS BAR */}
              <div className="mt-8 pt-8 border-t border-outline-variant flex flex-wrap gap-4 items-center">
                <span className="text-label-caps font-label-caps text-on-surface-variant mr-4 uppercase">Quick Actions</span>
                <button 
                  onClick={() => alert('New RFQ creation flow')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-primary/40 hover:bg-primary/5 transition-all text-primary font-bold text-body-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  New RFQ
                </button>
                <button 
                  onClick={() => alert('Registering new vendor partner')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-all text-on-surface font-bold text-body-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                  Add Vendor
                </button>
                <button 
                  onClick={() => alert('Opening invoice panel')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-all text-on-surface font-bold text-body-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">description</span>
                  View Invoices
                </button>
              </div>
            </>
          ) : activeTab === 'Vendors' ? (
            <VendorMgmt />
          ) : activeTab === 'RFQs' ? (
            <RFQContainer />
          ) : activeTab === 'Quotations' ? (
            quotationView === 'submit' ? (
              <Quotations onBackToRFQs={() => setActiveTab('RFQs')} onCompare={() => setQuotationView('compare')} />
            ) : (
              <QuotationComparison onBack={() => setQuotationView('submit')} />
            )
          ) : activeTab === 'Approvals' ? (
            <Approvals />
          ) : activeTab === 'Invoices' || activeTab === 'Purchase Orders' ? (
            <DocumentViewer />
          ) : activeTab === 'Activity' ? (
            <Activity />
          ) : activeTab === 'Reports' ? (
            <Reports />
          ) : (
            <div className="glass-card p-12 rounded-xl text-center">
              <span className="material-symbols-outlined text-primary text-[64px] mb-4">construction</span>
              <h3 className="font-headline-md text-headline-md mb-2">{activeTab} Section</h3>
              <p className="text-on-surface-variant">The {activeTab} workspace and details are coming soon.</p>
            </div>
          )}

          {/* DECORATIVE BACKGROUND ELEMENTS */}
          <div className="fixed bottom-0 right-0 p-12 -z-10 pointer-events-none opacity-20">
            <div className="text-[120px] font-bold text-primary select-none opacity-5">Big Squid</div>
          </div>
        </main>
      </div>
    </div>
  );
}
