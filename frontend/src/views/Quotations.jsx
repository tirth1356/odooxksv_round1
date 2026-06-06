import React, { useState } from 'react';
import { useDialog } from '../context/DialogContext';

export default function Quotations({ onBackToRFQs, onCompare }) {
  const { showAlert, showPrompt } = useDialog();
  const [taxRate, setTaxRate] = useState(18); // 18%
  const [validity, setValidity] = useState('30 Days');
  const [paymentTerms, setPaymentTerms] = useState('Payment terms: 20 days net. Standard 1-year warranty included for all furniture items. Shipping included in the quoted price.');

  const [lineItems, setLineItems] = useState([
    { id: 1, desc: 'Ergonomic chair', icon: 'chair', qty: 25, unitPrice: 5500, deliveryDays: 10 },
    { id: 2, desc: 'Standing desks', icon: 'desk', qty: 10, unitPrice: 3200, deliveryDays: 10 }
  ]);

  const handleUnitPriceChange = (id, newPrice) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        return { ...item, unitPrice: parseFloat(newPrice) || 0 };
      }
      return item;
    }));
  };

  const handleDeliveryChange = (id, newDays) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        return { ...item, deliveryDays: parseInt(newDays) || 0 };
      }
      return item;
    }));
  };

  const handleAddCustomItem = async () => {
    const desc = await showPrompt("Enter Custom Item Description:");
    if (!desc) return;
    const qtyStr = await showPrompt("Enter Quantity:");
    const qty = parseInt(qtyStr) || 1;
    const priceStr = await showPrompt("Enter Unit Price (₹):");
    const unitPrice = parseFloat(priceStr) || 0;
    const deliveryStr = await showPrompt("Enter Delivery (Days):");
    const deliveryDays = parseInt(deliveryStr) || 7;

    setLineItems([
      ...lineItems,
      {
        id: Date.now(),
        desc,
        icon: 'deployed_code',
        qty,
        unitPrice,
        deliveryDays
      }
    ]);
  };

  const handleDeleteItem = (id) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleTaxChange = (val) => {
    const numeric = parseFloat(val.replace(/[^0-9.]/g, '')) || 0;
    setTaxRate(numeric);
  };

  const subtotal = lineItems.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
  const gstAmount = subtotal * (taxRate / 100);
  const grandTotal = subtotal + gstAmount;

  const handleSubmit = (isDraft) => {
    const quoteData = {
      lineItems,
      taxRate,
      validity,
      paymentTerms,
      subtotal,
      gstAmount,
      grandTotal,
      status: isDraft ? 'Draft' : 'Submitted'
    };
    console.log('Submitting Quotation:', quoteData);
    showAlert(isDraft ? 'Quotation Draft Saved!' : 'Quotation Submitted Successfully!');
    setLineItems([]);
    setTaxRate(18);
    setValidity('30 Days');
    setPaymentTerms('Payment terms: 20 days net. Standard 1-year warranty included for all furniture items. Shipping included in the quoted price.');
  };

  return (
    <div className="space-y-6">

      <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700 flex justify-between items-end">
        <div>
          <button 
            onClick={onBackToRFQs}
            className="flex items-center gap-2 text-primary text-label-caps mb-2 hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back_ios</span>
            <span>Back to RFQ List</span>
          </button>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Submit Quotation</h2>
          <div className="flex items-center gap-4 text-on-surface-variant font-body-md">
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[12px] font-label-caps">RFQ ID: #99321</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">event</span> 
              Deadline: 15 June 2025
            </span>
          </div>
        </div>
        {onCompare && (
          <button
            onClick={onCompare}
            className="bg-surface-container-high border border-primary text-primary px-5 py-2 rounded-lg font-bold text-body-sm hover:bg-primary/10 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
            Compare Quotations
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">

          <section className="glass-panel p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h3 className="font-label-caps text-label-caps text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">info</span> 
              RFQ SUMMARY
            </h3>
            <div className="flex flex-col gap-1">
              <p className="font-title-sm text-title-sm text-on-surface">Office Furniture Procurement Q2</p>
              <p className="text-on-surface-variant font-body-md">Ergonomic chair × 25, standing desk × 10 — Category: Furniture &amp; Workspace Enhancement</p>
            </div>
          </section>

          <section className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-high/50">
              <h3 className="font-label-caps text-label-caps text-on-surface">LINE ITEMS PRICING</h3>
              <span className="text-body-sm text-on-surface-variant">{lineItems.length} Items Listed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-cell-padding-h py-cell-padding-v font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant">ITEM DESCRIPTION</th>
                    <th className="px-cell-padding-h py-cell-padding-v font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant">QTY</th>
                    <th className="px-cell-padding-h py-cell-padding-v font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant">UNIT PRICE (₹)</th>
                    <th className="px-cell-padding-h py-cell-padding-v font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant">TOTAL</th>
                    <th className="px-cell-padding-h py-cell-padding-v font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant text-right">DELIVERY (DAYS)</th>
                    <th className="px-cell-padding-h py-cell-padding-v border-b border-outline-variant"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {lineItems.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-highest transition-colors">
                      <td className="px-cell-padding-h py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center border border-outline-variant">
                            <span className="material-symbols-outlined text-primary">{item.icon}</span>
                          </div>
                          <span className="font-table-data text-table-data text-on-surface">{item.desc}</span>
                        </div>
                      </td>
                      <td className="px-cell-padding-h py-4 font-table-data text-table-data text-on-surface">{item.qty}</td>
                      <td className="px-cell-padding-h py-4">
                        <input
                          className="w-24 bg-surface-container-lowest border border-outline-variant rounded-lg px-2 py-1 focus:ring-1 focus:ring-primary text-table-data text-on-surface outline-none"
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleUnitPriceChange(item.id, e.target.value)}
                        />
                      </td>
                      <td className="px-cell-padding-h py-4 font-table-data text-table-data text-on-surface">
                        ${(item.qty * item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-cell-padding-h py-4 text-right">
                        <input
                          className="w-16 bg-surface-container-lowest border border-outline-variant rounded-lg px-2 py-1 focus:ring-1 focus:ring-primary text-table-data text-on-surface outline-none text-right"
                          type="number"
                          value={item.deliveryDays}
                          onChange={(e) => handleDeliveryChange(item.id, e.target.value)}
                        />
                      </td>
                      <td className="px-cell-padding-h py-4 text-right">
                        <button onClick={() => handleDeleteItem(item.id)} className="text-on-surface-variant hover:text-error transition-colors">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {lineItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-on-surface-variant opacity-60">
                        No items added. Click below to add a custom item.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-surface-container-high/20 text-center border-t border-outline-variant">
              <button 
                onClick={handleAddCustomItem}
                className="text-primary font-label-caps text-label-caps flex items-center gap-2 mx-auto hover:opacity-80 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add</span> 
                ADD CUSTOM LINE ITEM
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block uppercase px-1">Tax / GST (%)</label>
              <div className="relative">
                <input
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary outline-none text-on-surface"
                  type="text"
                  value={`${taxRate}%`}
                  onChange={(e) => handleTaxChange(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined">percent</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant block uppercase px-1">Validity Period</label>
              <div className="relative">
                <input
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary outline-none text-on-surface"
                  type="text"
                  value={validity}
                  onChange={(e) => setValidity(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined">schedule</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant block uppercase px-1">Note / Payment Terms</label>
            <textarea
              className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary outline-none text-on-surface resize-none"
              rows={4}
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
            <button 
              onClick={() => handleSubmit(true)}
              className="px-8 py-3 rounded-xl border border-primary text-primary font-body-md font-semibold hover:bg-primary/5 transition-all"
            >
              Save as Draft
            </button>
            <button 
              onClick={() => handleSubmit(false)}
              className="px-8 py-3 rounded-xl bg-primary text-on-primary-container font-body-md font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Submit Quotation
            </button>
          </div>
        </div>

        <div className="space-y-6">

          <section className="bg-surface-container-high rounded-xl p-6 border border-primary/20 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
            <h3 className="font-label-caps text-label-caps text-primary-fixed mb-6 uppercase">Calculation Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-mono text-on-surface">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>GST ({taxRate}%)</span>
                <span className="font-mono text-on-surface">${gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Shipping &amp; Handling</span>
                <span className="font-mono text-primary">FREE</span>
              </div>
              <div className="pt-4 border-t border-outline-variant">
                <div className="flex justify-between items-baseline animate-pulse">
                  <span className="text-title-sm font-bold text-on-surface">Grand Total</span>
                  <span className="text-headline-md font-mono text-primary-fixed">
                    ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-[10px] font-label-caps text-on-surface-variant mt-1 text-right italic">All prices in INR</p>
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-xl p-6">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase">Your Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container rounded-lg p-3 border border-outline-variant">
                <p className="text-[10px] text-on-surface-variant font-label-caps uppercase">Win Rate</p>
                <p className="text-title-sm font-bold text-primary">64%</p>
              </div>
              <div className="bg-surface-container rounded-lg p-3 border border-outline-variant">
                <p className="text-[10px] text-on-surface-variant font-label-caps uppercase">Avg Delivery</p>
                <p className="text-title-sm font-bold text-on-surface">9 Days</p>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-low rounded-xl p-6 border border-outline-variant border-dashed">
            <div className="flex items-center gap-3 mb-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-tertiary">insights</span>
              <span className="text-body-sm italic">Market Insight: 4 other vendors have already responded to this RFQ.</span>
            </div>
            <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary/40 w-3/4 animate-pulse"></div>
            </div>
          </section>

          <div className="rounded-xl overflow-hidden h-48 relative group">
            <img 
              alt="Warehouse Logistics" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuADbC4HNlfBevpghRbnfUqFNOQ71FhUOpbFq3O1ATckuMO9gIqEbGUIFgTC_QwOxjqMjH1qfYBKtu2Q0ruF71WJoP2I3r7cRuJECBHd681IMzpB0HhGnIIvAofa--7lOn0gUZSZ712LUK8RoXZ_E5a5S_4Grp3PSZ_lB0kagxBCh54G1MqaxaKqJsJXEuKKMzZLl1nhJvWTm9WPtZk-0s_LNpypT8Jb8hpoU7_K5mhBhuNcSobipcKr1IFHikSV5KDMKs8Yqnfw2Pyj"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4">
              <span className="text-body-sm font-semibold text-primary">Ready for Dispatch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
