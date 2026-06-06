import React, { useState } from 'react';
import { useDialog } from '../context/DialogContext';
import { API_BASE_URL } from '../config';

export default function RFQContainer({ setActiveTab }) {
  const { showAlert, showPrompt, showToast } = useDialog();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');

  const [lineItems, setLineItems] = useState([]);
  const [assignedVendors, setAssignedVendors] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const validateStep1 = () => {
    if (!title.trim()) {
      showAlert("RFQ Title is required.");
      return false;
    }
    if (!category) {
      showAlert("Please select a Category.");
      return false;
    }
    if (!deadline) {
      showAlert("Deadline is required.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (lineItems.length === 0) {
      showAlert("Please add at least one line item to the RFQ before proceeding.");
      return false;
    }
    return true;
  };

  const handleDeleteItem = (id) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleAddLineItem = async () => {
    const desc = await showPrompt("Enter Item Description:");
    if (!desc) return;
    const qtyStr = await showPrompt("Enter Quantity:");
    const qty = parseInt(qtyStr) || 1;
    const unit = await showPrompt("Enter Unit (e.g., NOS, SET, KG):") || "NOS";

    setLineItems([...lineItems, { id: Date.now(), desc, qty, unit }]);
  };

  const handleAddVendor = async () => {
    const name = await showPrompt("Enter Vendor Name to Assign:");
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
    if (!validateStep1()) return;
    if (!isDraft && !validateStep2()) return;

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
      const res = await fetch(`${API_BASE_URL}/api/rfqs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (res.ok) {
        showToast(isDraft ? 'RFQ Saved as Draft successfully!' : `RFQ '${title}' created and published successfully!`);
        setTitle('');
        setCategory('');
        setDeadline('');
        setDescription('');
        setLineItems([]);
        setAssignedVendors([]);
        setAttachments([]);
        setStep(1);
      } else {
        showAlert('Error saving RFQ: ' + (resData.error || JSON.stringify(resData)));
      }
    } catch (err) {
      showAlert('Network error connecting to backend.');
    }
  };

  return (
    <div className="space-y-6">

      <header>
        <div className="flex items-center gap-2 text-on-surface-variant text-body-sm mb-2">
          <a className="hover:text-primary cursor-pointer" onClick={(e) => { e.preventDefault(); setActiveTab && setActiveTab('RFQs'); }}>RFQs</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span>New Request</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-on-surface">Create RFQ's</h2>
        <p className="text-on-surface-variant font-body-md">Initiate a new request for quotation to your preferred vendors.</p>
      </header>

      <div className="relative flex justify-between items-center mb-12 max-w-2xl mx-auto px-4">
        <div className="absolute top-5 left-0 w-full h-[2px] bg-surface-container-highest -translate-y-1/2 z-0"></div>
        <div 
          className="absolute top-5 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
        />

        <button 
          onClick={() => setStep(1)} 
          className="relative z-10 flex flex-col items-center gap-2 group focus:outline-none"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 1 ? 'step-active bg-primary text-on-primary' : 'bg-surface-container-highest border border-outline-variant text-on-surface-variant'}`}>1</div>
          <span className={`text-[11px] font-label-caps ${step >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>DETAILS</span>
        </button>

        <button 
          onClick={() => {
            if (step === 3) setStep(2);
            else if (step === 1 && validateStep1()) setStep(2);
          }} 
          className="relative z-10 flex flex-col items-center gap-2 group focus:outline-none"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 2 ? 'step-active bg-primary text-on-primary' : 'bg-surface-container-highest border border-outline-variant text-on-surface-variant'}`}>2</div>
          <span className={`text-[11px] font-label-caps ${step >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>ITEMS</span>
        </button>

        <button 
          onClick={() => {
            if (step === 1 && validateStep1() && validateStep2()) setStep(3);
            else if (step === 2 && validateStep2()) setStep(3);
          }} 
          className="relative z-10 flex flex-col items-center gap-2 group focus:outline-none"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 3 ? 'step-active bg-primary text-on-primary' : 'bg-surface-container-highest border border-outline-variant text-on-surface-variant'}`}>3</div>
          <span className={`text-[11px] font-label-caps ${step >= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>VENDORS</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {step === 1 && (
          <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30 backdrop-blur-sm relative">
              <h3 className="text-title-sm font-headline-md mb-6 flex items-center gap-2 text-on-surface">
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
                    <label className="block text-[11px] font-label-caps text-on-surface-variant mb-1 ml-1 uppercase">Category *</label>
                    <select
                      className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-body-md focus:border-primary outline-none text-on-surface"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select Category</option>
                      <option value="Furniture">Furniture</option>
                      <option value="IT Hardware">IT Hardware</option>
                      <option value="Software">Software</option>
                      <option value="Stationery">Stationery</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Construction">Construction</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Raw Materials">Raw Materials</option>
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

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                className="px-8 py-3.5 border border-outline-variant hover:bg-surface-container rounded-lg text-title-sm font-title-sm transition-all text-on-surface"
                onClick={() => setActiveTab && setActiveTab('RFQs')}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-12 py-3.5 bg-primary hover:bg-primary/90 text-on-primary rounded-lg text-title-sm font-title-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
              >
                Next Step
                <span className="material-symbols-outlined !text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-surface-container rounded-xl border border-outline-variant/30 overflow-hidden relative">
              <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
                <h3 className="text-title-sm font-headline-md flex items-center gap-2 text-on-surface">
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

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                className="px-8 py-3.5 border border-outline-variant hover:bg-surface-container rounded-lg text-title-sm font-title-sm transition-all text-on-surface"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="button"
                className="px-12 py-3.5 bg-primary hover:bg-primary/90 text-on-primary rounded-lg text-title-sm font-title-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
              >
                Next Step
                <span className="material-symbols-outlined !text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/30 relative">
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

            <div className="flex gap-4 justify-end pt-4 border-t border-outline-variant">
              <button
                type="button"
                className="px-8 py-3.5 border border-outline-variant hover:bg-surface-container rounded-lg text-title-sm font-title-sm transition-all text-on-surface"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                onClick={() => handleSave(true)}
                className="px-6 py-3.5 border border-outline-variant text-on-surface-variant rounded-xl font-semibold hover:bg-surface-container-high transition-colors"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSave(false)}
                className="bg-primary text-on-primary py-3.5 px-8 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
              >
                Save &amp; Send to Vendors
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        )}
      </div>

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
