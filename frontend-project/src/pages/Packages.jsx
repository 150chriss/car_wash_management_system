import { useState, useEffect } from 'react';
import { getPackages, createPackage } from '../api/packageApi';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import { FormField, inputCls } from '../components/FormField';
import { ErrorAlert, SuccessAlert } from '../components/Alert';

const initialForm = { PackageNumber: '', PackageName: '', PackageDescription: '', PackagePrice: '' };

const pkgGradients = [
  { from: 'from-sky-600',     to: 'to-blue-500',    glow: 'shadow-sky-500/30',    badge: 'bg-sky-500/15 text-sky-400 border-sky-500/25' },
  { from: 'from-violet-600',  to: 'to-purple-500',  glow: 'shadow-violet-500/30', badge: 'bg-violet-500/15 text-violet-400 border-violet-500/25' },
  { from: 'from-emerald-600', to: 'to-teal-500',    glow: 'shadow-emerald-500/30',badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  { from: 'from-rose-600',    to: 'to-pink-500',    glow: 'shadow-rose-500/30',   badge: 'bg-rose-500/15 text-rose-400 border-rose-500/25' },
];

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [form, setForm]         = useState(initialForm);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);

  const fetchPackages = async () => {
    try { const res = await getPackages(); setPackages(res.data); } catch { /* silent */ }
  };
  useEffect(() => { fetchPackages(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    const { PackageNumber, PackageName, PackageDescription, PackagePrice } = form;
    if (!PackageNumber || !PackageName || !PackageDescription || !PackagePrice) {
      setError('All fields are required.'); return;
    }
    if (isNaN(PackagePrice) || Number(PackagePrice) <= 0) {
      setError('Price must be a positive number.'); return;
    }
    setLoading(true);
    try {
      await createPackage({ ...form, PackagePrice: Number(PackagePrice) });
      setSuccess('Package created!');
      setForm(initialForm); fetchPackages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create package.');
    } finally { setLoading(false); }
  };

  return (
    <PageLayout icon="📦" title="Service Packages" subtitle="Define and manage car wash service tiers">

      {/* Package showcase cards */}
      {packages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {packages.map((pkg, i) => {
            const g = pkgGradients[i % pkgGradients.length];
            return (
              <div key={pkg._id}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${g.from} ${g.to} p-6 shadow-2xl ${g.glow} group hover:scale-[1.02] transition-transform duration-300`}>
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-black/10" />
                {/* Shimmer */}
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                <div className="relative">
                  <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{pkg.PackageNumber}</span>
                  <h3 className="text-white text-xl font-black mt-1 tracking-tight">{pkg.PackageName}</h3>
                  <p className="text-white/70 text-sm mt-2 leading-relaxed">{pkg.PackageDescription}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-white/50 text-[10px] uppercase tracking-wider">Price</p>
                      <p className="text-white text-2xl font-black">{pkg.PackagePrice.toLocaleString()} <span className="text-sm font-semibold opacity-60">RWF</span></p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">💧</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card title="Add New Package" glow className="lg:col-span-1">
          <ErrorAlert msg={error} />
          <SuccessAlert msg={success} />
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'PackageNumber',      label: 'Package Number', placeholder: 'e.g. PKG001',             type: 'text' },
              { name: 'PackageName',        label: 'Package Name',   placeholder: 'e.g. Basic Wash',         type: 'text' },
              { name: 'PackageDescription', label: 'Description',    placeholder: 'e.g. Exterior hand wash', type: 'text' },
              { name: 'PackagePrice',       label: 'Price (RWF)',    placeholder: 'e.g. 5000',               type: 'number' },
            ].map((f) => (
              <FormField key={f.name} label={f.label}>
                <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange}
                  placeholder={f.placeholder} className={inputCls} />
              </FormField>
            ))}
            <button type="submit" disabled={loading}
              className="relative w-full mt-2 overflow-hidden rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-50 group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-500 group-hover:from-violet-500 group-hover:to-blue-400 transition-all duration-300 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl" />
              <span className="relative">{loading ? '⏳ Saving...' : '+ Add Package'}</span>
            </button>
          </form>
        </Card>

        {/* Table */}
        <Card title="All Packages" badge={`${packages.length} total`} className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['No.', 'Name', 'Description', 'Price'].map((h) => (
                    <th key={h} className="pb-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {packages.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-12 text-slate-600 text-sm">No packages yet.</td></tr>
                ) : packages.map((pkg, i) => {
                  const g = pkgGradients[i % pkgGradients.length];
                  return (
                    <tr key={pkg._id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                      <td className="py-3.5 pr-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${g.badge}`}>
                          {pkg.PackageNumber}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-white font-semibold text-sm">{pkg.PackageName}</td>
                      <td className="py-3.5 pr-4 text-slate-400 text-sm">{pkg.PackageDescription}</td>
                      <td className="py-3.5">
                        <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-xs font-bold px-2.5 py-1 rounded-lg">
                          {pkg.PackagePrice.toLocaleString()} RWF
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
