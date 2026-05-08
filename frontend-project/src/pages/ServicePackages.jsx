import { useState, useEffect } from 'react';
import { getServicePackages, createServicePackage, updateServicePackage, deleteServicePackage } from '../api/servicePackageApi';
import { getCars }     from '../api/carApi';
import { getPackages } from '../api/packageApi';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import { FormField, inputCls, selectCls } from '../components/FormField';
import { ErrorAlert, SuccessAlert } from '../components/Alert';

const initialForm = { RecordNumber: '', ServiceDate: '', PlateNumber: '', PackageNumber: '' };

export default function ServicePackages() {
  const [records, setRecords]       = useState([]);
  const [cars, setCars]             = useState([]);
  const [packages, setPackages]     = useState([]);
  const [form, setForm]             = useState(initialForm);
  const [editMode, setEditMode]     = useState(false);
  const [editRecord, setEditRecord] = useState('');
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [loading, setLoading]       = useState(false);

  const fetchAll = async () => {
    try {
      const [r, c, p] = await Promise.all([getServicePackages(), getCars(), getPackages()]);
      setRecords(r.data); setCars(c.data); setPackages(p.data);
    } catch { /* silent */ }
  };
  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    const { RecordNumber, PlateNumber, PackageNumber } = form;
    if (!PlateNumber || !PackageNumber || (!editMode && !RecordNumber)) {
      setError('Record Number, Plate Number and Package are required.'); return;
    }
    setLoading(true);
    try {
      if (editMode) {
        await updateServicePackage(editRecord, { ServiceDate: form.ServiceDate || undefined, PlateNumber: form.PlateNumber, PackageNumber: form.PackageNumber });
        setSuccess('Record updated!'); setEditMode(false); setEditRecord('');
      } else {
        await createServicePackage(form);
        setSuccess('Service record created!');
      }
      setForm(initialForm); fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally { setLoading(false); }
  };

  const handleEdit = (rec) => {
    setEditMode(true); setEditRecord(rec.RecordNumber);
    setForm({ RecordNumber: rec.RecordNumber, ServiceDate: rec.ServiceDate ? rec.ServiceDate.slice(0, 10) : '', PlateNumber: rec.PlateNumber, PackageNumber: rec.PackageNumber });
    setError(''); setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (recordNumber) => {
    if (!window.confirm(`Delete record ${recordNumber}?`)) return;
    try { await deleteServicePackage(recordNumber); setSuccess('Record deleted.'); fetchAll(); }
    catch (err) { setError(err.response?.data?.message || 'Delete failed.'); }
  };

  const handleCancel = () => { setEditMode(false); setEditRecord(''); setForm(initialForm); setError(''); setSuccess(''); };

  const today = records.filter(r => new Date(r.ServiceDate).toDateString() === new Date().toDateString()).length;

  return (
    <PageLayout icon="🗂️" title="Service Records" subtitle="Track and manage car wash service assignments">

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Records" value={records.length}  icon="📋" gradient="from-blue-500 to-cyan-400" />
        <StatCard label="Today"         value={today}           icon="📅" gradient="from-emerald-500 to-teal-400" />
        <StatCard label="Cars Linked"   value={cars.length}     icon="🚘" gradient="from-violet-500 to-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card title={editMode ? '✏️ Edit Record' : '➕ New Service Record'} glow className="lg:col-span-1">
          {editMode && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl px-4 py-2.5 mb-4 text-xs font-semibold">
              <span>✏️</span> Editing: <span className="font-black">{editRecord}</span>
            </div>
          )}
          <ErrorAlert msg={error} />
          <SuccessAlert msg={success} />
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Record Number">
              <input type="text" name="RecordNumber" value={form.RecordNumber} onChange={handleChange}
                placeholder="e.g. REC001" disabled={editMode} className={inputCls} />
            </FormField>
            <FormField label="Service Date">
              <input type="date" name="ServiceDate" value={form.ServiceDate} onChange={handleChange} className={inputCls} />
            </FormField>
            <FormField label="Car (Plate Number)">
              <select name="PlateNumber" value={form.PlateNumber} onChange={handleChange} className={selectCls}>
                <option value="">— Select Car —</option>
                {cars.map((c) => <option key={c._id} value={c.PlateNumber}>{c.PlateNumber} · {c.DriverName}</option>)}
              </select>
            </FormField>
            <FormField label="Package">
              <select name="PackageNumber" value={form.PackageNumber} onChange={handleChange} className={selectCls}>
                <option value="">— Select Package —</option>
                {packages.map((p) => <option key={p._id} value={p.PackageNumber}>{p.PackageName} · {p.PackagePrice.toLocaleString()} RWF</option>)}
              </select>
            </FormField>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={loading}
                className="relative flex-1 overflow-hidden rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-50 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:from-blue-500 group-hover:to-cyan-400 transition-all duration-300 rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl" />
                <span className="relative">{loading ? '⏳ Saving...' : editMode ? '💾 Update' : '+ Add Record'}</span>
              </button>
              {editMode && (
                <button type="button" onClick={handleCancel}
                  className="px-4 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-slate-400 hover:text-white font-semibold rounded-xl transition-all text-sm">
                  ✕
                </button>
              )}
            </div>
          </form>
        </Card>

        {/* Table */}
        <Card title="Service Records" badge={`${records.length} total`} className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Record', 'Date', 'Plate', 'Driver', 'Package', 'Price', 'Actions'].map((h) => (
                    <th key={h} className="pb-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] pr-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-600 text-sm">No service records yet.</td></tr>
                ) : records.map((rec) => (
                  <tr key={rec._id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 pr-3">
                      <span className="bg-blue-500/15 text-blue-400 border border-blue-500/25 text-[10px] font-bold px-2 py-1 rounded-lg">{rec.RecordNumber}</span>
                    </td>
                    <td className="py-3.5 pr-3 text-slate-400 text-xs whitespace-nowrap">{new Date(rec.ServiceDate).toLocaleDateString()}</td>
                    <td className="py-3.5 pr-3 text-white font-semibold text-sm">{rec.PlateNumber}</td>
                    <td className="py-3.5 pr-3 text-slate-300 text-sm">{rec.car?.DriverName || '—'}</td>
                    <td className="py-3.5 pr-3 text-slate-300 text-sm">{rec.package?.PackageName || '—'}</td>
                    <td className="py-3.5 pr-3">
                      {rec.package && (
                        <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold px-2 py-1 rounded-lg">
                          {rec.package.PackagePrice.toLocaleString()} RWF
                        </span>
                      )}
                    </td>
                    <td className="py-3.5">
                      <div className="flex gap-1.5">
                        <button onClick={() => handleEdit(rec)}
                          className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/25 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all">Edit</button>
                        <button onClick={() => handleDelete(rec.RecordNumber)}
                          className="bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/25 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all">Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
