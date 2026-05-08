import { useState, useEffect } from 'react';
import { getPayments, createPayment } from '../api/paymentApi';
import { getCars }            from '../api/carApi';
import { getServicePackages } from '../api/servicePackageApi';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import { FormField, inputCls, selectCls } from '../components/FormField';
import { ErrorAlert, SuccessAlert } from '../components/Alert';

const initialForm = { PaymentNumber: '', AmountPaid: '', PaymentDate: '', PlateNumber: '', RecordNumber: '' };

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [cars, setCars]         = useState([]);
  const [records, setRecords]   = useState([]);
  const [form, setForm]         = useState(initialForm);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);

  const fetchAll = async () => {
    try {
      const [p, c, r] = await Promise.all([getPayments(), getCars(), getServicePackages()]);
      setPayments(p.data); setCars(c.data); setRecords(r.data);
    } catch { /* silent */ }
  };
  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    const { PaymentNumber, AmountPaid, PlateNumber, RecordNumber } = form;
    if (!PaymentNumber || !AmountPaid || !PlateNumber || !RecordNumber) { setError('All fields are required.'); return; }
    if (isNaN(AmountPaid) || Number(AmountPaid) <= 0) { setError('Amount must be a positive number.'); return; }
    setLoading(true);
    try {
      await createPayment({ ...form, AmountPaid: Number(form.AmountPaid) });
      setSuccess('Payment recorded!'); setForm(initialForm); fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment.');
    } finally { setLoading(false); }
  };

  const totalRevenue = payments.reduce((s, p) => s + Number(p.AmountPaid), 0);
  const todayPayments = payments.filter(p => new Date(p.PaymentDate).toDateString() === new Date().toDateString());
  const todayRevenue  = todayPayments.reduce((s, p) => s + Number(p.AmountPaid), 0);

  return (
    <PageLayout icon="💳" title="Payments" subtitle="Record and track all service payments">

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Payments"  value={payments.length}              icon="💳" gradient="from-blue-500 to-cyan-400" />
        <StatCard label="Total Revenue"   value={totalRevenue.toLocaleString()} suffix="RWF" icon="💰" gradient="from-emerald-500 to-teal-400" />
        <StatCard label="Today Payments"  value={todayPayments.length}          icon="📅" gradient="from-violet-500 to-purple-400" />
        <StatCard label="Today Revenue"   value={todayRevenue.toLocaleString()} suffix="RWF" icon="📈" gradient="from-rose-500 to-pink-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card title="Record Payment" glow className="lg:col-span-1">
          <ErrorAlert msg={error} />
          <SuccessAlert msg={success} />
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Payment Number">
              <input type="text" name="PaymentNumber" value={form.PaymentNumber} onChange={handleChange} placeholder="e.g. PAY001" className={inputCls} />
            </FormField>
            <FormField label="Amount Paid (RWF)">
              <input type="number" name="AmountPaid" value={form.AmountPaid} onChange={handleChange} placeholder="e.g. 5000" className={inputCls} />
            </FormField>
            <FormField label="Payment Date">
              <input type="date" name="PaymentDate" value={form.PaymentDate} onChange={handleChange} className={inputCls} />
            </FormField>
            <FormField label="Car (Plate Number)">
              <select name="PlateNumber" value={form.PlateNumber} onChange={handleChange} className={selectCls}>
                <option value="">— Select Car —</option>
                {cars.map((c) => <option key={c._id} value={c.PlateNumber}>{c.PlateNumber} · {c.DriverName}</option>)}
              </select>
            </FormField>
            <FormField label="Service Record">
              <select name="RecordNumber" value={form.RecordNumber} onChange={handleChange} className={selectCls}>
                <option value="">— Select Record —</option>
                {records.map((r) => <option key={r._id} value={r.RecordNumber}>{r.RecordNumber} · {r.PlateNumber} ({r.package?.PackageName || 'N/A'})</option>)}
              </select>
            </FormField>
            <button type="submit" disabled={loading}
              className="relative w-full mt-2 overflow-hidden rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-50 group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 group-hover:from-emerald-500 group-hover:to-teal-400 transition-all duration-300 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl" />
              <span className="relative">{loading ? '⏳ Saving...' : '💳 Record Payment'}</span>
            </button>
          </form>
        </Card>

        {/* Table */}
        <Card title="Payment History" badge={`${payments.length} records`} className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Payment No.', 'Plate', 'Record', 'Amount', 'Date'].map((h) => (
                    <th key={h} className="pb-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-slate-600 text-sm">No payments recorded yet.</td></tr>
                ) : payments.map((p) => (
                  <tr key={p._id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 pr-4">
                      <span className="bg-violet-500/15 text-violet-400 border border-violet-500/25 text-[10px] font-bold px-2.5 py-1 rounded-lg">{p.PaymentNumber}</span>
                    </td>
                    <td className="py-3.5 pr-4 text-white font-semibold text-sm">{p.PlateNumber}</td>
                    <td className="py-3.5 pr-4 text-slate-400 text-sm">{p.RecordNumber}</td>
                    <td className="py-3.5 pr-4">
                      <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-xs font-bold px-2.5 py-1 rounded-lg">
                        {Number(p.AmountPaid).toLocaleString()} RWF
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400 text-xs whitespace-nowrap">{new Date(p.PaymentDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
              {payments.length > 0 && (
                <tfoot>
                  <tr className="border-t border-white/[0.06]">
                    <td colSpan={3} className="pt-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider pr-4">Total Revenue</td>
                    <td className="pt-4">
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-2.5 py-1 rounded-lg">
                        {totalRevenue.toLocaleString()} RWF
                      </span>
                    </td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
