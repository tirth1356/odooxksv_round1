import React, { useState } from 'react';

export default function RFQContainer() {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('Office Furniture procurement Q2');
  const [category, setCategory] = useState('Furniture');
  const [deadline, setDeadline] = useState('2025-06-15');
  const [description, setDescription] = useState('Ergonomic chairs and standing desks for 3rd floor workspace expansion. High durability grade required.');

  const [lineItems, setLineItems] = useState([
    { id: 1, desc: 'Ergonomic task chair - Mesh back', qty: 25, unit: 'NOS' },
    { id: 2, desc: 'Motorized Standing Desks (140x80cm)', qty: 10, unit: 'NOS' },
  ]);

  const [assignedVendors, setAssignedVendors] = useState([
    { id: 1, init: 'IS', name: 'Infra Supplies Pvt Ltd', color: 'bg-emerald-500/10 text-primary' },
    { id: 2, init: 'TL', name: 'Techcore LTD', color: 'bg-blue-500/10 text-blue-400' },
  ]);

  const [attachments, setAttachments] = useState([]);

  const handleDeleteItem = (id) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleAddLineItem = () => {
    const desc = prompt("Enter Item Description:");
    if (!desc) return;
    const qtyStr = prompt("Enter Quantity:");
    const qty = parseInt(qtyStr) || 1;
    const unit = prompt("Enter Unit (e.g., NOS, SET, KG):") || "NOS";

    setLineItems([...lineItems, { id: Date.now(), desc, qty, unit }]);
  };

  const handleAddVendor = () => {
    const name = prompt("Enter Vendor Name to Assign:");
    if (!name) return;
    const init = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = [
      'bg-emerald-500/10 text-primary',
      'bg-blue-500/10 text-blue-400',
      'bg-purple-500/10 text-purple-400',
      'bg-amber-500/10 text-amber-400'
    ];
    const color = colors[assignedVendors.length % colors.length];

    setAssignedVendors([...assignedVendors, { id: Date.now(), init, name, color }]);
  };

  const handleRemoveVendor = (id) => {
    setAssignedVendors(assignedVendors.filter(v => v.id !== id));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files.map(f => f.name)]);
  };

  const handleSave = async (isDraft) => {
    const data = {
      title,
      category,
      deadline,
      description,
      line_items: lineItems.map(item => ({ item: item.desc, qty: item.qty, unit: item.unit })),
      assigned_vendors: assignedVendors.map(v => v.name),
      status: isDraft ? 'Draft' : 'Open'
    };

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:8000/api/rfqs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (res.ok) {
        alert(isDraft ? 'RFQ Saved as Draft successfully!' : `RFQ '${title}' created and published successfully!`);
      } else {
        alert('Error saving RFQ: ' + (resData.error || JSON.stringify(resData)));
      }
    } catch (err) {
      alert('Network error connecting to backend.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header>
        <div className="flex items-center gap-2 text-on-surface-variant text-body-sm mb-2">
          <a className="hover:text-primary" href="#" onClick={(e) => e.preventDefault()}>RFQs</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span>New Request</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-on-surface">Create RFQ's</h2>
        <p className="text-on-surface-variant font-body-md">Initiate a new request for quotation to your preferred vendors.</p>
      </header>

      {/* Multi-step Stepper */}
      <div className="relative flex justify-between items-center mb-12 max-w-2xl mx-auto px-4">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-highest -translate-y-1/2 z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: step === 1 ? '33.33%' : step === 2 ? '66.66%' : '100%' }}
        />
        
        <button 
          onClick={() => setStep(1)} 
          className="relative z-10 flex flex-col items-center gap-2 group focus:outline-none"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 1 ? 'step-active text-on-primary' : 'bg-surface-container-highest border border-outline-variant text-on-surface-variant'}`}>1</div>
          <span className={`text-[11px] font-label-caps ${step >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>DETAILS</span>
        </button>

        <button 
          onClick={() => setStep(2)} 
          className="relative z-10 flex flex-col items-center gap-2 group focus:outline-none"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 2 ? 'step-active text-on-primary' : 'bg-surface-container-highest border border-outline-variant text-on-surface-variant'}`}>2</div>
          <span className={`text-[11px] font-label-caps ${step >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>ITEMS</span>
        </button>

        <button 
          onClick={() => setStep(3)} 
          className="relative z-10 flex flex-col items-center gap-2 group focus:outline-none"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 3 ? 'step-active text-on-primary' : 'bg-surface-container-highest border border-outline-variant text-on-surface-variant'}`}>3</div>
          <span className={`text-[11px] font-label-caps ${step >= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>VENDORS</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-stack-gap">
        {/* Left Column: Basic Info */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30 backdrop-blur-sm relative">
            <h3 className="text-title-sm font-headline-md mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              General Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-label-caps text-on-surface-variant mb-1 ml-1 uppercase">RFQ Title*</label>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none text-on-surface"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-label-caps text-on-surface-variant mb-1 ml-1 uppercase">Category</label>
                  <select
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:border-primary outline-none text-on-surface"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>Furniture</option>
                    <option>IT Hardware</option>
                    <option>Stationery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-label-caps text-on-surface-variant mb-1 ml-1 uppercase">Deadline*</label>
                  <input
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:border-primary outline-none text-on-surface"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-label-caps text-on-surface-variant mb-1 ml-1 uppercase">Description</label>
                <textarea
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:border-primary outline-none resize-none text-on-surface"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleSave(false)}
              className="flex-1 bg-primary text-on-primary py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
            >
              Save &amp; Send to Vendors
              <span className="material-symbols-outlined">send</span>
            </button>
            <button
              onClick={() => handleSave(true)}
              className="px-6 py-3 border border-outline-variant text-on-surface-variant rounded-xl font-semibold hover:bg-surface-container-high transition-colors"
            >
              Save as Draft
            </button>
          </div>
        </div>

        {/* Right Column: Line Items & Vendors */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Line Items Table */}
          <div className="bg-surface-container rounded-xl border border-outline-variant/30 overflow-hidden relative">
            {/* Superb Hummingbird Tooltip */}
            <div className="absolute right-40 top-4 z-10 flex items-center gap-1.5 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-bounce pointer-events-none">
              <span className="material-symbols-outlined text-[12px]">navigation</span>
              Superb Hummingbird
            </div>
            
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
              <h3 className="text-title-sm font-headline-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">list_alt</span>
                Line Items
              </h3>
              <button
                onClick={handleAddLineItem}
                className="text-primary flex items-center gap-1 text-body-sm font-semibold hover:underline"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Add line item
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-high/50 border-b border-outline-variant">
                    <th className="px-6 py-cell-padding-v text-label-caps text-on-surface-variant">ITEM DESCRIPTION</th>
                    <th className="px-6 py-cell-padding-v text-label-caps text-on-surface-variant w-24">QTY</th>
                    <th className="px-6 py-cell-padding-v text-label-caps text-on-surface-variant w-32">UNIT</th>
                    <th className="px-6 py-cell-padding-v text-label-caps text-on-surface-variant w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {lineItems.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-highest/20 transition-colors">
                      <td className="px-6 py-cell-padding-v font-table-data text-on-surface">{item.desc}</td>
                      <td className="px-6 py-cell-padding-v font-table-data text-on-surface">{item.qty}</td>
                      <td className="px-6 py-cell-padding-v font-table-data text-on-surface">{item.unit}</td>
                      <td className="px-6 py-cell-padding-v text-right">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-on-surface-variant hover:text-error transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {lineItems.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-on-surface-variant opacity-60">
                        No items added yet. Click 'Add line item' above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assign Vendors & Dropzone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30 relative">
              {/* Artistic Goat Tooltip */}
              <div className="absolute right-4 top-2 z-10 flex items-center gap-1.5 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse pointer-events-none">
                <span className="material-symbols-outlined text-[12px]">navigation</span>
                Artistic Goat
              </div>

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[11px] font-label-caps text-on-surface-variant uppercase tracking-widest">ASSIGN VENDORS</h3>
                <button onClick={handleAddVendor} className="text-primary text-[11px] font-bold">+ ADD VENDOR</button>
              </div>

              <div className="space-y-2">
                {assignedVendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 group">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${vendor.color}`}>
                        {vendor.init}
                      </div>
                      <span className="text-body-sm text-on-surface">{vendor.name}</span>
                    </div>
                    <span 
                      onClick={() => handleRemoveVendor(vendor.id)}
                      className="material-symbols-outlined text-on-surface-variant/50 text-sm group-hover:text-error cursor-pointer transition-colors"
                    >
                      close
                    </span>
                  </div>
                ))}
                {assignedVendors.length === 0 && (
                  <p className="text-xs text-on-surface-variant opacity-60 py-3 text-center">
                    No vendors assigned. Click '+ ADD VENDOR'.
                  </p>
                )}
              </div>
            </div>

            {/* Dropzone Attachment */}
            <div className="relative bg-surface-container p-6 rounded-xl border border-dashed border-outline-variant flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary transition-colors">
              <input 
                type="file" 
                multiple 
                onChange={handleFileUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">upload_file</span>
              </div>
              <h4 className="text-body-sm font-semibold text-on-surface mb-1">Attachments</h4>
              <p className="text-[11px] text-on-surface-variant">Drag &amp; drop files or click to upload</p>
              <p className="text-[10px] text-on-surface-variant/40 mt-2 italic">PDF, DOCX, XLSX (Max 10MB)</p>

              {attachments.length > 0 && (
                <div className="mt-4 w-full text-left space-y-1">
                  <p className="text-[11px] font-bold text-primary">Uploaded Files:</p>
                  {attachments.map((filename, idx) => (
                    <p key={idx} className="text-[10px] text-on-surface truncate">📎 {filename}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Decorative Elements */}
      <div className="fixed bottom-8 right-8 pointer-events-none opacity-20 hidden 2xl:block">
        <img 
          className="w-64 h-64 grayscale contrast-125" 
          alt="Abstract Digital Grid Pattern"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPzAXyCaY9G4YH0jfJ9zF8HEQhJENHjUiPmQVVlaqwRC06XtO0tWNJWEaLvREpJR3HltHRZqxXY-yrwwzAZ3dCP3raDnxzT392MlT8bofgkIEgm6CXTv4YeoaTL9EFJEVbUUgEJ0vum8f2sv5_nZCzSX6r5um1cMew7vDG_36LIPpv1vpprlMAPWUUZXVzguWvdKMkaCZ9RqPfDqYdmc8O6AkvUMh0Ymza_WSCGCEJ92dXqlXyGChDs9AdpOg0BXACXEUhmvd1ey6R"
        />
      </div>
    </div>
  );
}
