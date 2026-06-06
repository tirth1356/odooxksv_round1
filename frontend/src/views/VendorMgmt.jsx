import React, { useState } from 'react';

export default function VendorMgmt() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [vendors, setVendors] = useState([
    { id: 1, init: 'IS', name: 'Infra Supplies Pvt Ltd', category: 'Constructions', gst: '27AABCS1429Bz0', contact: '+91 98230 45XXX', status: 'Active' },
    { id: 2, init: 'TC', name: 'Tech Core LTD', category: 'IT & Electronics', gst: '27AABCS1429Bz0', contact: '+91 97412 88XXX', status: 'Active' },
    { id: 3, init: 'FL', name: 'FastLog Transport', category: 'Logistics', gst: '27AABCS1429Bz0', contact: '+91 88562 11XXX', status: 'Blocked' },
    { id: 4, init: 'MS', name: 'Modular Solutions', category: 'Furniture', gst: '27AABCS1429Bz0', contact: '+91 74125 66XXX', status: 'Pending' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: '', category: 'Constructions', gst: '', contact: '', status: 'Active' });

  const handleAddVendorSubmit = (e) => {
    e.preventDefault();
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
    if (!gstRegex.test(newVendor.gst)) {
      alert("Invalid GST format. Must be 15 alphanumeric characters (e.g., 22AAAAA0000A1Z5).");
      return;
    }
    const phoneRegex = /^[+0-9\s\-()]{10,20}$/;
    if (!phoneRegex.test(newVendor.contact)) {
      alert("Invalid contact format.");
      return;
    }

    const init = newVendor.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const vendorToAdd = {
      id: vendors.length + 1,
      init,
      ...newVendor
    };

    setVendors([...vendors, vendorToAdd]);
    setIsModalOpen(false);
    setNewVendor({ name: '', category: 'Constructions', gst: '', contact: '', status: 'Active' });
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesFilter = filter === 'All' || vendor.status === filter;
    const matchesSearch = vendor.name.toLowerCase().includes(search.toLowerCase()) ||
                          vendor.category.toLowerCase().includes(search.toLowerCase()) ||
                          vendor.gst.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Vendors</h2>
          <p className="text-on-surface-variant text-body-md">Manage supplier profiles and registrations</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-surface-container-high border border-primary text-primary px-5 py-2 rounded-lg font-bold text-body-sm hover:bg-primary/10 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Add Vendor
        </button>
      </div>

      {/* Bento Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between group hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant font-label-caps text-label-caps">Total Vendors</span>
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-display-lg text-display-lg block">{vendors.length}</span>
            <span className="text-primary text-[12px] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +12% from last quarter
            </span>
          </div>
        </div>

        <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between group hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant font-label-caps text-label-caps">Active RFQs</span>
            <div className="bg-tertiary/10 p-2 rounded-lg text-tertiary">
              <span className="material-symbols-outlined">analytics</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-display-lg text-display-lg block">48</span>
            <span className="text-on-surface-variant text-[12px]">8 pending approval</span>
          </div>
        </div>

        <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between group hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant font-label-caps text-label-caps">Avg Onboarding</span>
            <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
              <span className="material-symbols-outlined">timer</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-display-lg text-display-lg block">4.2<span className="text-headline-md opacity-40">d</span></span>
            <span className="text-primary text-[12px] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Target: &lt; 5 days
            </span>
          </div>
        </div>

        <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between group hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant font-label-caps text-label-caps">Critical Issues</span>
            <div className="bg-error-container/20 p-2 rounded-lg text-error">
              <span className="material-symbols-outlined">warning</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-display-lg text-display-lg block">
              {vendors.filter(v => v.status === 'Blocked').length}
            </span>
            <span className="text-error text-[12px] flex items-center gap-1">
              Blocked vendors require review
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
        {/* Filters & Search Bar */}
        <div className="px-6 py-4 bg-surface-container-high/50 flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant">
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Active', 'Pending', 'Blocked'].map((type) => {
              const count = type === 'All' ? vendors.length : vendors.filter(v => v.status === type).length;
              const isActive = filter === type;
              return (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-1.5 rounded-full font-bold text-body-sm transition-all border ${
                    isActive
                      ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20'
                      : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface border-outline-variant/30'
                  }`}
                >
                  {type} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {/* Inline search bar for convenience */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search local list..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40"
              />
            </div>
            <button 
              onClick={() => alert('Exporting Vendor List to CSV...')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-highest border border-outline-variant text-body-sm text-on-surface-variant hover:text-on-surface transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export
            </button>
          </div>
        </div>

        {/* Main Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-cell-padding-h py-4 font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant uppercase tracking-wider">Vendor Name</th>
                <th className="px-cell-padding-h py-4 font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant uppercase tracking-wider">Category</th>
                <th className="px-cell-padding-h py-4 font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant uppercase tracking-wider">GST No.</th>
                <th className="px-cell-padding-h py-4 font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant uppercase tracking-wider">Contact</th>
                <th className="px-cell-padding-h py-4 font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant uppercase tracking-wider">Status</th>
                <th className="px-cell-padding-h py-4 font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredVendors.map((vendor) => {
                const statusColor = 
                  vendor.status === 'Active' ? 'bg-primary/10 text-primary border-primary/20' :
                  vendor.status === 'Blocked' ? 'bg-error-container/20 text-error border-error/20' :
                  'bg-on-surface-variant/10 text-on-surface-variant border-outline-variant/30';
                
                const dotColor = 
                  vendor.status === 'Active' ? 'bg-primary' :
                  vendor.status === 'Blocked' ? 'bg-error' :
                  'bg-on-surface-variant';

                const avatarColor = 
                  vendor.status === 'Active' ? 'bg-primary/10 text-primary' :
                  vendor.status === 'Blocked' ? 'bg-error/10 text-error' :
                  'bg-surface-container-highest text-on-surface-variant';

                return (
                  <tr key={vendor.id} className="hover:bg-surface-container-high hover:translate-x-1 transition-all duration-200 group">
                    <td className="px-cell-padding-h py-cell-padding-v font-table-data text-table-data">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center font-bold ${avatarColor}`}>
                          {vendor.init}
                        </div>
                        <span className="text-on-surface font-bold">{vendor.name}</span>
                      </div>
                    </td>
                    <td className="px-cell-padding-h py-cell-padding-v font-table-data text-table-data text-on-surface-variant">
                      {vendor.category}
                    </td>
                    <td className="px-cell-padding-h py-cell-padding-v font-table-data text-table-data text-on-surface-variant font-mono">
                      {vendor.gst}
                    </td>
                    <td className="px-cell-padding-h py-cell-padding-v font-table-data text-table-data text-on-surface-variant">
                      {vendor.contact}
                    </td>
                    <td className="px-cell-padding-h py-cell-padding-v">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${vendor.status === 'Active' ? 'animate-pulse' : ''}`}></span>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-cell-padding-h py-cell-padding-v text-right">
                      <button 
                        onClick={() => alert(`Supplier Profile Details:\nName: ${vendor.name}\nCategory: ${vendor.category}\nGST No: ${vendor.gst}\nContact: ${vendor.contact}\nStatus: ${vendor.status}`)}
                        className="text-primary hover:bg-primary/10 px-4 py-1.5 rounded font-bold text-[12px] transition-all"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-on-surface-variant opacity-60">
                    No vendors found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between bg-surface-container-low/30">
          <p className="text-[12px] text-on-surface-variant">Showing 1 to {filteredVendors.length} of {filteredVendors.length} vendors</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-highest border border-outline-variant text-on-surface-variant disabled:opacity-30" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-bold text-[12px]">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-highest border border-outline-variant text-on-surface-variant font-bold text-[12px] hover:text-primary transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-highest border border-outline-variant text-on-surface-variant font-bold text-[12px] hover:text-primary transition-colors">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-highest border border-outline-variant text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Insight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-high/40 p-6 rounded-2xl border border-outline-variant backdrop-blur-md relative overflow-hidden group">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">stars</span>
            </div>
            <div>
              <h3 className="font-title-sm text-title-sm text-on-surface">Top Performer</h3>
              <p className="text-body-sm text-on-surface-variant">Infra Supplies Pvt Ltd</p>
            </div>
          </div>
          <p className="text-body-md text-on-surface mb-4">Consistent quality rating of 4.9/5 based on the last 24 deliveries. Eligibility for Platinum Partner status achieved.</p>
          <div className="h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[98%] rounded-full"></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold">Delivery Success Rate</span>
            <span className="text-[10px] text-primary font-bold">98.2%</span>
          </div>
        </div>

        <div className="bg-surface-container-high/40 p-6 rounded-2xl border border-outline-variant backdrop-blur-md relative overflow-hidden group">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-error/5 rounded-full blur-3xl group-hover:bg-error/10 transition-colors"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-error/20 flex items-center justify-center text-error">
              <span className="material-symbols-outlined">gavel</span>
            </div>
            <div>
              <h3 className="font-title-sm text-title-sm text-on-surface">Compliance Alert</h3>
              <p className="text-body-sm text-on-surface-variant">3 Vendors Expiring</p>
            </div>
          </div>
          <p className="text-body-md text-on-surface mb-4">Insurance documentation for 'FastLog Transport' and 2 others will expire in the next 15 days.</p>
          <div className="flex gap-2">
            <button onClick={() => alert('Sending notification email to compliant contacts...')} className="flex-1 bg-error-container/20 text-error py-2 rounded font-bold text-[12px] hover:bg-error-container/40 transition-all">Send Notifications</button>
            <button onClick={() => alert('Opening Compliance Document Vault...')} className="flex-1 bg-surface-container-highest border border-outline-variant text-on-surface py-2 rounded font-bold text-[12px] hover:bg-surface-container-low transition-all">Review Docs</button>
          </div>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 bg-primary rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center text-on-primary hover:scale-110 active:scale-95 transition-all group overflow-hidden relative"
        >
          <span className="material-symbols-outlined text-[28px] group-hover:rotate-90 transition-transform">add</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>

      {/* Add Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface p-8 rounded-xl w-full max-w-md border border-outline-variant shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Register Vendor</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-error">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddVendorSubmit} className="space-y-4">
              <div>
                <label className="text-label-caps font-label-caps text-on-surface-variant">Vendor Name</label>
                <input required className="w-full mt-1 bg-surface-container border border-outline-variant rounded p-2 text-body-md text-on-surface focus:border-primary" type="text" value={newVendor.name} onChange={e => setNewVendor({...newVendor, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-label-caps font-label-caps text-on-surface-variant">Category</label>
                  <select required className="w-full mt-1 bg-surface-container border border-outline-variant rounded p-2 text-body-md text-on-surface focus:border-primary" value={newVendor.category} onChange={e => setNewVendor({...newVendor, category: e.target.value})}>
                    <option value="Constructions">Constructions</option>
                    <option value="IT & Electronics">IT & Electronics</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="text-label-caps font-label-caps text-on-surface-variant">Status</label>
                  <select className="w-full mt-1 bg-surface-container border border-outline-variant rounded p-2 text-body-md text-on-surface focus:border-primary" value={newVendor.status} onChange={e => setNewVendor({...newVendor, status: e.target.value})}>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-label-caps font-label-caps text-on-surface-variant">GST Number</label>
                <input required placeholder="22AAAAA0000A1Z5" className="w-full mt-1 bg-surface-container border border-outline-variant rounded p-2 text-body-md text-on-surface focus:border-primary uppercase" type="text" value={newVendor.gst} onChange={e => setNewVendor({...newVendor, gst: e.target.value})} />
              </div>
              <div>
                <label className="text-label-caps font-label-caps text-on-surface-variant">Contact Number</label>
                <input required placeholder="+91 98765 43210" className="w-full mt-1 bg-surface-container border border-outline-variant rounded p-2 text-body-md text-on-surface focus:border-primary" type="text" value={newVendor.contact} onChange={e => setNewVendor({...newVendor, contact: e.target.value})} />
              </div>
              <button type="submit" className="w-full mt-6 bg-primary text-on-primary font-bold py-2.5 rounded-lg hover:bg-primary/90 transition-all">
                Register Vendor
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
