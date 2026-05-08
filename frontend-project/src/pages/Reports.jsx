import { useState } from 'react';
import { getDailyReport, getBill } from '../api/paymentApi';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import { ErrorAlert } from '../components/Alert';
import { inputCls } from '../components/FormField';

export default function Reports() {
  const [reportDate, setReportDate]     = useState('');
  const [reportData, setReportData]     = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError]   = useState('');

  const [billRecord, setBillRecord]     = useState('');
  const [bill, setBill]                 = useState(null);
  const [billLoading, setBillLoading]   = useState(false);
  const [billError, setBillError]       = useState('');

  const fetchReport = async () => {
    setReportError(''); setReportData([]); setReportLoading(true);
    try {
      const res = await getDailyReport(reportDate);
      setReportData(res.data);
      if (res.data.length === 0) setReportError('No records found for this date.');
    } catch (err) {
      setReportError(err.response?.data?.message || 'Failed to load report.');
    } finally { setReportLoading(false); }
  };

  const fetchBill = async () => {
    setBillError(''); setBill(null);
    if (!billRecord.trim()) { setBillError('Enter a record number.'); return; }
    setBillLoading(true);
    try {
      const res = await getBill(billRecord.trim());
      setBill(res.data.bill);
    } catch (err) {
      setBillError(err.response?.data?.message || 'Bill not found.');
    } finally { setBillLoading(false); }
  };

  const totalRevenue = reportData.reduce((s, r) => s + Number(r.AmountPaid), 0);

  return (
    <PageLayout icon="📊" title="Reports" subtitle="Generate bills and daily revenue reports">

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ── Bill Generator ── */}
        <Card title="🧾 Generate Bill" glow>
          <div className="flex gap-3 mb-4">
            <input type="text" value={billRecord} onChange={(e) => setBillRecord(e.target.value)}
              placeholder="Enter Record Number (e.g. REC001)"
              className={`${inputCls} flex-1`}
              onKeyDown={(e) => e.key === 'Enter' && fetchBill()}
            />
            <button onClick={fetchBill} disabled={billLoading}
              className="relative overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50 shrink-0 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:from-blue-500 group-hover:to-cyan-400 transition-all duration-300 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl" />
              <span className="relative">{billLoading ? '⏳' : '🔍 Get Bill'}</span>
            </button>
          </div>
          <ErrorAlert msg={billError} />

          {bill && (
            <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden print:bg-white print:text-black">
              {/* Top shimmer */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

              {/* Bill header */}
              <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/10 border-b border-white/[0.06] px-6 py-5 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-2xl mb-3 shadow-lg shadow-blue-500/30">🚗</div>
                <h3 className="text-white font-black text-lg tracking-tight">SmartPark Car Wash</h3>
                <p className="text-slate-400 text-xs mt-0.5">Rubavu District, Western Province, Rwanda</p>
                <p className="text-slate-500 text-[10px] mt-0.5">Tel: +250 788 000 000</p>
                <div className="mt-3 inline-block bg-blue-500/15 border border-blue-500/25 text-blue-400 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                  Invoice / Bill
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Reference row */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Record No.',    value: bill.RecordNumber },
                    { label: 'Payment No.',   value: bill.PaymentNumber || '—' },
                    { label: 'Service Date',  value: bill.ServiceDate ? new Date(bill.ServiceDate).toLocaleDateString() : '—' },
                    { label: 'Payment Date',  value: bill.PaymentDate  ? new Date(bill.PaymentDate).toLocaleDateString()  : '—' },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
                      <p className="text-white text-sm font-semibold mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Customer */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Customer Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Driver',    value: bill.DriverName },
                      { label: 'Phone',     value: bill.PhoneNumber },
                      { label: 'Plate No.', value: bill.PlateNumber, highlight: true },
                      { label: 'Car',       value: `${bill.CarType} (${bill.CarSize})` },
                    ].map((item) => (
                      <div key={item.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
                        <p className={`text-sm font-semibold mt-0.5 ${item.highlight ? 'text-blue-400' : 'text-white'}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Service Details</p>
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/15 rounded-xl p-4 space-y-2.5">
                    {[
                      { label: 'Package',     value: bill.PackageName },
                      { label: 'Description', value: bill.PackageDescription },
                      { label: 'Package Price', value: `${bill.PackagePrice?.toLocaleString()} RWF` },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-medium">{item.label}</span>
                        <span className="text-white font-semibold">{item.value}</span>
                      </div>
                    ))}
                    <div className="h-px bg-blue-500/20 my-1" />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-bold text-sm">Amount Paid</span>
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-black px-3 py-1 rounded-lg">
                        {bill.AmountPaid ? `${Number(bill.AmountPaid).toLocaleString()} RWF` : 'Not yet paid'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-center text-slate-600 text-xs">Thank you for choosing SmartPark Car Wash! 🚗✨</p>

                <button onClick={() => window.print()}
                  className="relative w-full overflow-hidden rounded-xl py-2.5 text-sm font-bold text-white print:hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 group-hover:from-emerald-500 group-hover:to-teal-400 transition-all duration-300 rounded-xl" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl" />
                  <span className="relative">🖨️ Print Bill</span>
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* ── Daily Report ── */}
        <Card title="📅 Daily Report" glow>
          <div className="flex gap-3 mb-4">
            <input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)}
              className={`${inputCls} flex-1`} />
            <button onClick={fetchReport} disabled={reportLoading}
              className="relative overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50 shrink-0 group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-500 group-hover:from-violet-500 group-hover:to-blue-400 transition-all duration-300 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl" />
              <span className="relative">{reportLoading ? '⏳' : '📊 Generate'}</span>
            </button>
          </div>
          <ErrorAlert msg={reportError} />

          {reportData.length > 0 && (
            <>
              {/* Summary strip */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Records</p>
                  <p className="text-blue-400 text-2xl font-black">{reportData.length}</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Revenue</p>
                  <p className="text-emerald-400 text-xl font-black">{totalRevenue.toLocaleString()} <span className="text-sm">RWF</span></p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-xs">
                  Report for: <span className="text-white font-semibold">{reportDate || 'Today'}</span>
                </p>
                <button onClick={() => window.print()}
                  className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/25 text-xs font-bold px-3 py-1.5 rounded-lg transition-all print:hidden">
                  🖨️ Print
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-white/[0.04] border-b border-white/[0.06]">
                      {['Plate', 'Package', 'Description', 'Amount', 'Date'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((row, i) => (
                      <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                        <td className="px-4 py-3">
                          <span className="bg-blue-500/15 text-blue-400 border border-blue-500/25 text-[10px] font-bold px-2 py-1 rounded-lg">{row.PlateNumber}</span>
                        </td>
                        <td className="px-4 py-3 text-white font-semibold text-sm">{row.PackageName}</td>
                        <td className="px-4 py-3 text-slate-400 text-sm">{row.PackageDescription}</td>
                        <td className="px-4 py-3">
                          <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-xs font-bold px-2 py-1 rounded-lg">
                            {Number(row.AmountPaid).toLocaleString()} RWF
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{new Date(row.PaymentDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-white/[0.04] border-t border-white/[0.06]">
                      <td colSpan={3} className="px-4 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total</td>
                      <td className="px-4 py-3">
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-2.5 py-1 rounded-lg">
                          {totalRevenue.toLocaleString()} RWF
                        </span>
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
