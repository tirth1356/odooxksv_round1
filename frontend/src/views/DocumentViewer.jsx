import React, { useState, useEffect } from 'react';
import { useDialog } from '../context/DialogContext';
import html2pdf from 'html2pdf.js';

export default function DocumentViewer({ setActiveTab, documentType = 'Invoice' }) {
  const { showAlert } = useDialog();
  const isPO = documentType === 'PO';
  const [paymentStatus, setPaymentStatus] = useState('Pending Payment'); // 'Pending Payment', 'Paid', 'Cancelled'
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [docData, setDocData] = useState(null);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchDocData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const endpoint = isPO 
          ? 'http://localhost:8000/api/procurement/purchase-orders/'
          : 'http://localhost:8000/api/procurement/invoices/';
        const res = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setDocData(data);
          setPaymentStatus(data.status);
          setTimeline(data.timeline || []);
        }
      } catch (err) {
        console.error('Error fetching document:', err);
      }
    };
    fetchDocData();
  }, [documentType]);

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleMarkAsPaid = async () => {
    if (paymentStatus === 'Paid') return;
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:8000/api/procurement/invoices/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'pay' })
      });
      if (res.ok) {
        const data = await res.json();
        setDocData(data);
        setPaymentStatus(data.status);
        setTimeline(data.timeline || []);
        triggerToast('Invoice marked as Paid successfully.');
      } else {
        showAlert('Error marking invoice as paid.');
      }
    } catch (err) {
      showAlert('Network error connecting to backend.');
    }
  };

  const handleCancelPO = async () => {
    if (paymentStatus === 'Cancelled') return;
    try {
      const token = localStorage.getItem('access_token');
      const endpoint = isPO 
        ? 'http://localhost:8000/api/procurement/purchase-orders/'
        : 'http://localhost:8000/api/procurement/invoices/';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'cancel' })
      });
      if (res.ok) {
        const data = await res.json();
        setDocData(data);
        setPaymentStatus(data.status);
        setTimeline(data.timeline || []);
        triggerToast(isPO ? 'Purchase Order has been Cancelled.' : 'Invoice has been Cancelled.');
      } else {
        showAlert('Error cancelling document.');
      }
    } catch (err) {
      showAlert('Network error connecting to backend.');
    }
  };


  return (
    <div className="space-y-6 relative">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <nav className="flex gap-2 text-xs font-label-caps text-on-surface-variant mb-2">
            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => setActiveTab && setActiveTab('Dashboard')}>HOME</span>
            <span>/</span>
            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => setActiveTab && setActiveTab(isPO ? 'Purchase Orders' : 'Invoices')}>
              {isPO ? 'PURCHASE ORDERS' : 'INVOICES'}
            </span>
            <span>/</span>
            <span className="text-primary">{isPO ? (docData?.po_number || 'PO-2024-0068') : (docData?.invoice_number || 'INV-2024-0091')}</span>
          </nav>
          <h2 className="font-display-lg text-display-lg text-on-surface">
            {isPO ? 'Purchase Order Details' : 'Invoice Details'}
          </h2>
          <p className="text-on-surface-variant font-body-md">Auto-generated after approval of RFQ: Office Furniture Q2</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => {
              triggerToast('Preparing PDF download...');
              const element = document.querySelector('.invoice-canvas');
              const opt = {
                margin:       0.5,
                filename:     isPO ? `PO-${docData?.po_number || '2024-0068'}.pdf` : `INV-${docData?.invoice_number || '2024-0091'}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
              };
              html2pdf().set(opt).from(element).save().then(() => {
                triggerToast('The document has been downloaded as PDF.');
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface border border-outline-variant rounded-lg hover:border-primary hover:text-primary transition-all text-body-sm"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span className="font-label-caps text-label-caps">Download PDF</span>
          </button>
          <button 
            onClick={() => { triggerToast('Preparing document for printing...'); window.print(); }}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface border border-outline-variant rounded-lg hover:border-primary hover:text-primary transition-all text-body-sm"
          >
            <span className="material-symbols-outlined text-[20px]">print</span>
            <span className="font-label-caps text-label-caps">Print</span>
          </button>
          <button 
            onClick={() => triggerToast(isPO ? 'PO sent to vendor email successfully.' : 'Invoice sent to vendor email successfully.')}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface border border-outline-variant rounded-lg hover:border-primary hover:text-primary transition-all text-body-sm"
          >
            <span className="material-symbols-outlined text-[20px]">mail</span>
            <span className="font-label-caps text-label-caps">{isPO ? 'Email PO' : 'Email Invoice'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">

        <div className="xl:col-span-8">
          <div className="invoice-canvas rounded-xl p-10 overflow-hidden relative">

            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>

            <div className="flex justify-between items-start relative z-10 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-on-primary">business</span>
                  </div>
                  <span className="text-title-sm font-headline-md font-bold text-on-surface">VendorBridge</span>
                </div>
                <div className="space-y-1 text-on-surface-variant font-body-sm">
                  <p className="font-bold text-on-surface">Bill to:</p>
                  <p>VendorBridge Corp HQ</p>
                  <p>123 Business Park, Ahmedabad</p>
                  <p>GSTIN: 243394394ZAFB</p>
                </div>
              </div>
              <div className="text-right space-y-4">
                <div>
                  <h3 className="font-label-caps text-label-caps text-primary mb-1">{isPO ? 'PURCHASE ORDER' : 'INVOICE'}</h3>
                  <p className="font-display-lg text-title-sm text-on-surface">{isPO ? `#${docData?.po_number || 'PO-2024-0068'}` : `#${docData?.invoice_number || 'INV-2024-0091'}`}</p>
                </div>
                <div className="space-y-1 text-on-surface-variant font-body-sm">
                  <p className="font-bold text-on-surface">Vendor:</p>
                  <p>Infra Supplies Pvt Ltd</p>
                  <p>456 Industrial Estate, Surat</p>
                  <p>GSTIN: 243940424GSZ3</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-outline-variant mb-8 bg-surface-container/30 px-6 rounded-lg">
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">PO Date</p>
                <p className="font-table-data text-body-md text-on-surface">{docData?.date || '22 May, 2025'}</p>
              </div>
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">{isPO ? 'Expected Delivery' : 'Invoice Date'}</p>
                <p className="font-table-data text-body-md text-on-surface">{isPO ? (docData?.delivery_date || '05 Jun, 2025') : (docData?.date || '22 May, 2025')}</p>
              </div>
              {!isPO && (
                <div>
                  <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">Due Date</p>
                  <p className="font-table-data text-body-md text-on-surface">{docData?.due_date || '21 June, 2025'}</p>
                </div>
              )}
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">{isPO ? 'PO Status' : 'Payment Status'}</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    paymentStatus === 'Paid' ? 'bg-primary' :
                    paymentStatus === 'Cancelled' ? 'bg-error' :
                    'bg-orange-400'
                  }`}></span>
                  <p className="font-table-data text-body-md text-on-surface">
                    {isPO ? (paymentStatus === 'Paid' ? 'Completed' : paymentStatus === 'Pending Payment' ? 'Issued' : paymentStatus === 'Issued' ? 'Issued' : paymentStatus) : paymentStatus}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant text-on-surface-variant font-label-caps text-[11px] uppercase">
                    <th className="py-cell-padding-v px-cell-padding-h">Item Description</th>
                    <th className="py-cell-padding-v px-cell-padding-h text-right">Qty</th>
                    <th className="py-cell-padding-v px-cell-padding-h text-right">Unit Price</th>
                    <th className="py-cell-padding-v px-cell-padding-h text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="text-on-surface font-table-data text-body-md">
                  {docData?.items && docData.items.length > 0 ? (
                    docData.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-outline-variant/30 hover:bg-surface-container-high/30">
                        <td className="py-cell-padding-v px-cell-padding-h">{item.desc}</td>
                        <td className="py-cell-padding-v px-cell-padding-h text-right">{item.qty}</td>
                        <td className="py-cell-padding-v px-cell-padding-h text-right">₹ {item.price.toLocaleString()}</td>
                        <td className="py-cell-padding-v px-cell-padding-h text-right font-mono">₹ {item.total.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 px-4 text-center text-on-surface-variant opacity-60">
                        No invoice items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-80 space-y-3 font-body-md">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="text-on-surface font-mono">{docData?.subtotal || '₹ 1,69,500'}</span>
                </div>
                {!isPO && (
                  <>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>CGST (9%)</span>
                      <span className="text-on-surface font-mono">{docData?.cgst || '₹ 15,255'}</span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>SGST (9%)</span>
                      <span className="text-on-surface font-mono">{docData?.sgst || '₹ 15,255'}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center py-3 border-t border-outline-variant mt-2">
                  <span className="font-bold text-title-sm text-on-surface">{isPO ? 'Total Value' : 'Grand Total'}</span>
                  <span className="font-display-lg text-title-sm text-primary font-mono">{docData?.grand_total || '₹ 2,00,010'}</span>
                </div>

                {!isPO && (
                  <div className="text-[10px] text-right font-label-caps text-on-surface-variant mt-2 italic">
                    Amount in words: Two Lakhs and Ten Rupees Only.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-20 pt-8 border-t border-outline-variant flex justify-between items-end">
              <div className="space-y-1 text-on-surface-variant font-body-sm italic">
                <p>Terms &amp; Conditions:</p>
                <p>1. Payment terms: Net 30 days.</p>
                <p>2. Goods once sold will not be taken back.</p>
              </div>
              <div className="text-center">
                <div className="w-48 h-12 border-b border-outline-variant mb-2"></div>
                <p class="font-label-caps text-label-caps text-on-surface">Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-gutter">

          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase">Actions</h3>
            <div className="space-y-3">
              {isPO ? (
                <>
                  <button 
                    onClick={() => { triggerToast('Invoice generated successfully.'); setTimeout(() => setActiveTab && setActiveTab('Invoices'), 1500); }}
                    className="w-full bg-primary text-on-primary font-headline-md text-body-md py-3 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">receipt_long</span>
                    Generate Invoice
                  </button>
                  <button 
                    onClick={handleCancelPO}
                    disabled={paymentStatus === 'Paid' || paymentStatus === 'Cancelled'}
                    className="w-full bg-error-container disabled:opacity-50 text-on-error-container font-headline-md text-body-md py-3 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">cancel</span>
                    Cancel PO
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleMarkAsPaid}
                    disabled={paymentStatus === 'Paid' || paymentStatus === 'Cancelled'}
                    className="w-full bg-primary disabled:opacity-50 text-on-primary font-headline-md text-body-md py-3 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">payments</span>
                    Mark as Paid
                  </button>
                  <button 
                    onClick={handleCancelPO}
                    disabled={paymentStatus === 'Paid' || paymentStatus === 'Cancelled'}
                    className="w-full bg-error-container disabled:opacity-50 text-on-error-container font-headline-md text-body-md py-3 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">cancel</span>
                    Cancel Invoice
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase">Vendor Profile</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">store</span>
              </div>
              <div>
                <h4 className="font-title-sm text-body-md text-on-surface">Infra Supplies Pvt Ltd</h4>
                <p className="font-body-sm text-xs text-on-surface-variant">Top-tier supplier since 2021</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container/50 p-3 rounded-lg">
                <p className="text-[10px] text-on-surface-variant font-label-caps uppercase">Vendor Rating</p>
                <p className="text-primary font-bold">4.8 / 5.0</p>
              </div>
              <div className="bg-surface-container/50 p-3 rounded-lg">
                <p className="text-[10px] text-on-surface-variant font-label-caps uppercase">Open POs</p>
                <p className="text-on-surface font-bold">12</p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-6 uppercase">PO Timeline</h3>
            <div className="relative space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant">
              {timeline.length === 0 && (
                <p className="text-sm text-on-surface-variant opacity-60">No timeline events available.</p>
              )}
              {timeline.map((event) => (
                <div key={event.id} className="relative pl-10">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                    event.isError ? 'bg-error text-on-error shadow-lg shadow-error/20' :
                    event.completed ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' :
                    'bg-outline-variant border-4 border-surface'
                  }`}>
                    {event.completed ? (
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {event.isError ? 'close' : 'check'}
                      </span>
                    ) : null}
                  </div>
                  <p className={`text-body-sm font-bold ${event.completed ? 'text-on-surface' : 'text-on-surface-variant'}`}>{event.title}</p>
                  <p className="text-xs text-on-surface-variant">{event.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div 
        className={`fixed bottom-8 right-8 bg-surface-container-highest border border-primary text-on-surface px-6 py-4 rounded-xl flex items-center gap-4 transition-all duration-500 z-[100] shadow-2xl ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">check_circle</span>
        </div>
        <div>
          <p className="font-bold text-body-md">Action Successful</p>
          <p className="text-xs text-on-surface-variant">{toastMessage}</p>
        </div>
      </div>
    </div>
  );
}
