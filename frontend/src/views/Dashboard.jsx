import React, { useState, useEffect } from 'react';
import VendorMgmt from './VendorMgmt';
import RFQContainer from './RFQContainer';
import Quotations from './Quotations';
import QuotationComparison from './QuotationComparison';
import Approvals from './Approvals';
import DocumentViewer from './DocumentViewer';
import Activity from './Activity';
import Reports from './Reports';
import { useDialog } from '../context/DialogContext';
import { API_BASE_URL } from '../config';

export default function Dashboard({ userRole, onLogout }) {
  const { showAlert } = useDialog();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [quotationView, setQuotationView] = useState('submit'); // 'submit' or 'compare'
  const [dashboardData, setDashboardData] = useState(null);

  const [glowStyle, setGlowStyle] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_BASE_URL}/api/dashboard/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    if (activeTab === 'Dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

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
    { name: 'Dashboard', icon: 'dashboard', roles: ['Procurement Officer', 'Vendor', 'Manager', 'Admin'] },
    { name: 'Vendors', icon: 'groups', roles: ['Procurement Officer', 'Admin'] },
    { name: 'RFQs', icon: 'request_quote', roles: ['Procurement Officer', 'Vendor', 'Manager'] },
    { name: 'Quotations', icon: 'receipt_long', roles: ['Procurement Officer', 'Vendor'] },
    { name: 'Approvals', icon: 'fact_check', roles: ['Manager'] },
    { name: 'Purchase Orders', icon: 'shopping_cart', roles: ['Procurement Officer', 'Vendor', 'Manager'] },
    { name: 'Invoices', icon: 'description', roles: ['Procurement Officer', 'Vendor', 'Manager'] },
    { name: 'Reports', icon: 'analytics', roles: ['Admin'] },
    { name: 'Activity', icon: 'history', roles: ['Procurement Officer', 'Manager', 'Admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(userRole));
  const isAuthorized = navItems.some(item => item.name === activeTab);

  return (
    <div 
      className=`min-h-screen bg-background text-on-surface font-body-md relative overflow-hidden flex"
      onMouseMove={handleMouseMove}
      style={glowStyle}
    >

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

      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">

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
              onClick={() => setActiveTab('RFQs')}
              className="bg-primary hover:bg-primary/90 text-on-primary font-bold px-4 py-2 rounded-lg text-body-sm transition-all shadow-lg shadow-primary/10"
            >
              Create RFQ
            </button>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <button 
                onClick={() => showAlert('Notifications: All systems operational.')}
                className="hover:bg-surface-container-highest/50 p-2 rounded-lg transition-colors relative"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-8 flex-grow overflow-y-auto max-w-[1440px] mx-auto w-full">
          <div className="mb-8">
            <h1 className="font-headline-md text-headline-md text-on-surface mb-1">{activeTab}</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Welcome back, {userRole} — Here is today's overview across your supply chain.
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-card p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-[48px] text-primary">request_quote</span>
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Active RFQs</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-on-surface">
                      {dashboardData?.kpis?.active_rfqs ?? 12}
                    </span>
                    <span className="text-primary text-[12px] font-bold">+2 this week</span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-[48px] text-primary">fact_check</span>
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Pending Approvals</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-on-surface">
                      {dashboardData?.kpis?.pending_approvals ?? 5}
                    </span>
                    <span className="text-error text-[12px] font-bold">Priority: 2</span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-xl flex flex-col gap-2 relative overflow-hidden group border-primary/20 hover:border-primary/50 transition-all duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="material-symbols-outlined text-[48px] text-primary">payments</span>
                  </div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Monthly Spend</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-primary">
                      {dashboardData?.kpis ? `₹ ${dashboardData.kpis.pos_this_month}` : "₹ 2.3L"}
                    </span>
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
                    <span className="font-display-lg text-display-lg text-error">
                      {dashboardData?.kpis?.overdue_invoices ?? 3}
                    </span>
                    <span className="text-on-surface-variant text-[12px]">Avg 4 days late</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                <div className="xl:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col">
                  <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
                    <h2 className="font-title-sm text-title-sm text-on-surface">Recent Purchase Orders</h2>
                    <a className="text-primary text-body-sm hover:underline" href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Purchase Orders'); }}>View All</a>
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
                        {dashboardData?.recent_purchase_orders?.length > 0 ? (
                          dashboardData.recent_purchase_orders.map((po) => {
                            const statusColor = 
                              po.status === 'Approved' ? 'bg-primary/10 text-primary border-primary/20' :
                              po.status === 'Pending' ? 'bg-on-surface-variant/10 text-on-surface-variant border-outline-variant/30' :
                              'bg-error-container/20 text-error border-error/20';
                            return (
                              <tr key={po.po_number} className="hover:bg-surface-container-high transition-colors">
                                <td className="px-6 py-4 font-table-data text-on-surface font-bold">{po.po_number}</td>
                                <td className="px-6 py-4 font-table-data text-on-surface-variant">{po.vendor}</td>
                                <td className="px-6 py-4 font-table-data text-on-surface-variant font-mono">₹ {po.amount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColor}`}>
                                    {po.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <button 
                                    onClick={() => showAlert(`Details for PO ${po.po_number}:\nVendor: ${po.vendor}\nAmount: ₹ ${po.amount}\nStatus: ${po.status}`)}
                                    className="text-primary hover:underline text-body-sm font-semibold"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant opacity-60">
                              No recent purchase orders found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="glass-card rounded-xl overflow-hidden flex flex-col h-full">
                  <div className="px-6 py-4 border-b border-outline-variant">
                    <h2 className="font-title-sm text-title-sm text-on-surface">Spending Trends</h2>
                    <span className="text-body-sm text-on-surface-variant">Last 6 months</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center items-center">
                    <div className="relative w-48 h-48 mb-6">

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
                        <span className="text-body-sm font-bold">₹ 1.2M</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-secondary rounded-full"></span>
                          <span className="text-body-sm text-on-surface">IT Services</span>
                        </div>
                        <span className="text-body-sm font-bold">₹ 450K</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-surface-container-highest rounded-full"></span>
                          <span className="text-body-sm text-on-surface">Other</span>
                        </div>
                        <span className="text-body-sm font-bold">₹ 650K</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-outline-variant flex flex-wrap gap-4 items-center">
                <span className="text-label-caps font-label-caps text-on-surface-variant mr-4 uppercase">Quick Actions</span>
                {['Procurement Officer', 'Manager'].includes(userRole) && (
                  <button 
                    onClick={() => setActiveTab('RFQs')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-primary/40 hover:bg-primary/5 transition-all text-primary font-bold text-body-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    New RFQ
                  </button>
                )}
                {['Procurement Officer', 'Admin'].includes(userRole) && (
                  <button 
                    onClick={() => setActiveTab('Vendors')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-all text-on-surface font-bold text-body-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                    Add Vendor
                  </button>
                )}
                {['Procurement Officer', 'Vendor'].includes(userRole) && (
                  <button 
                    onClick={() => setActiveTab('Invoices')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-all text-on-surface font-bold text-body-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">description</span>
                    View Invoices
                  </button>
                )}
              </div>
            </>
          ) : activeTab === 'Vendors' ? (
            <VendorMgmt setActiveTab={setActiveTab} />
          ) : activeTab === 'RFQs' ? (
            <RFQContainer setActiveTab={setActiveTab} />
          ) : activeTab === 'Quotations' ? (
            quotationView === 'submit' ? (
              <Quotations onBackToRFQs={() => setActiveTab('RFQs')} onCompare={() => setQuotationView('compare')} setActiveTab={setActiveTab} />
            ) : (
              <QuotationComparison onBack={() => setQuotationView('submit')} setActiveTab={setActiveTab} />
            )
          ) : activeTab === 'Approvals' ? (
            <Approvals setActiveTab={setActiveTab} />
          ) : activeTab === 'Purchase Orders' ? (
            <DocumentViewer setActiveTab={setActiveTab} documentType="PO" />
          ) : activeTab === 'Invoices' ? (
            <DocumentViewer setActiveTab={setActiveTab} documentType="Invoice" />
          ) : activeTab === 'Activity' ? (
            <Activity setActiveTab={setActiveTab} />
          ) : activeTab === 'Reports' ? (
            <Reports setActiveTab={setActiveTab} />
          ) : (
            <div className="glass-card p-12 rounded-xl text-center">
              <span className="material-symbols-outlined text-primary text-[64px] mb-4">construction</span>
              <h3 className="font-headline-md text-headline-md mb-2">{activeTab} Section</h3>
              <p className="text-on-surface-variant">The {activeTab} workspace and details are coming soon.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
