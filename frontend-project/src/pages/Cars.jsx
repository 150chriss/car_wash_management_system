import { useState, useEffect } from 'react';
import { getCars, createCar } from '../api/carApi';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import { FormField, inputCls, selectCls } from '../components/FormField';
import { ErrorAlert, SuccessAlert } from '../components/Alert';

const initialForm = { PlateNumber: '', CarType: '', CarSize: 'Small', DriverName: '', PhoneNumber: '' };

const sizeBadge = {
  Small:  'bg-sky-500/15 text-sky-400 border border-sky-500/25',
  Medium: 'bg-violet-500/15 text-violet-400 border border-violet-500/25',
  Large:  'bg-orange-500/15 text-orange-400 border border-orange-500/25',
};

export default function Cars() {
  const [cars, setCars]       = useState([]);
  const [form, setForm]       = useState(initialForm);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCars = async () => {
    try { const res = await getCars(); setCars(res.data); } catch { /* silent */ }
  };
  useEffect(() => { fetchCars(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    const { PlateNumber, CarType, CarSize, DriverName, PhoneNumber } = form;
    if (!PlateNumber || !CarType || !CarSize || !DriverName || !PhoneNumber) {
      setError('All fields are required.'); return;
    }
    setLoading(true);
    try {
      await createCar(form);
      setSuccess('Car registered successfully!');
      setForm(initialForm); fetchCars();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register car.');
    } finally { setLoading(false); }
  };

  return (
    <PageLayout icon="🚘" title="Car Registration" subtitle="Register and manage vehicles in the system">

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Cars"   value={cars.length}                                   icon="🚗" gradient="from-blue-500 to-cyan-400" />
        <StatCard label="Small"        value={cars.filter(c => c.CarSize==='Small').length}   icon="🔵" gradient="from-sky-500 to-blue-400" />
        <StatCard label="Medium"       value={cars.filter(c => c.CarSize==='Medium').length}  icon="🟣" gradient="from-violet-500 to-purple-400" />
        <StatCard label="Large"        value={cars.filter(c => c.CarSize==='Large').length}   icon="🟠" gradient="from-orange-500 to-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card title="Register New Car" glow className="lg:col-span-1">
          <ErrorAlert msg={error} />
          <SuccessAlert msg={success} />
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'PlateNumber', label: 'Plate Number',  placeholder: 'e.g. RAB 123A' },
              { name: 'CarType',     label: 'Car Type',      placeholder: 'e.g. Sedan, SUV, Truck' },
              { name: 'DriverName',  label: "Driver's Name", placeholder: 'Full name' },
              { name: 'PhoneNumber', label: 'Phone Number',  placeholder: '0788 000 000' },
            ].map((f) => (
              <FormField key={f.name} label={f.label}>
                <input type="text" name={f.name} value={form[f.name]} onChange={handleChange}
                  placeholder={f.placeholder} className={inputCls} />
              </FormField>
            ))}
            <FormField label="Car Size">
              <select name="CarSize" value={form.CarSize} onChange={handleChange} className={selectCls}>
                <option>Small</option><option>Medium</option><option>Large</option>
              </select>
            </FormField>
            <button type="submit" disabled={loading}
              className="relative w-full mt-2 overflow-hidden rounded-xl py-2.5 text-sm font-bold text-white transition-all duration-300 disabled:opacity-50 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:from-blue-500 group-hover:to-cyan-400 transition-all duration-300 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl" />
              <span className="relative">{loading ? '⏳ Saving...' : '+ Register Car'}</span>
            </button>
          </form>
        </Card>

        {/* Table */}
        <Card title="Registered Vehicles" badge={`${cars.length} total`} className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Plate', 'Type', 'Size', 'Driver', 'Phone'].map((h) => (
                    <th key={h} className="pb-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cars.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-slate-600 text-sm">No vehicles registered yet.</td></tr>
                ) : cars.map((car) => (
                  <tr key={car._id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group">
                    <td className="py-3.5 pr-4">
                      <span className="bg-blue-500/15 text-blue-400 border border-blue-500/25 text-xs font-bold px-2.5 py-1 rounded-lg">
                        {car.PlateNumber}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-300 text-sm">{car.CarType}</td>
                    <td className="py-3.5 pr-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${sizeBadge[car.CarSize]}`}>
                        {car.CarSize}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-white text-sm font-medium">{car.DriverName}</td>
                    <td className="py-3.5 text-slate-400 text-sm">{car.PhoneNumber}</td>
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
