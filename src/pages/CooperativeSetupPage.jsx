import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function CooperativeSetupPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [form, setForm] = useState({ name: '', address: '', province: '', taxCode: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/api/cooperative/setup', { method: 'POST', body: JSON.stringify(form) });
      await refresh();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ maxWidth: 520, width: '100%', padding: 32 }}>
        <h1>Thiết lập Hợp tác xã</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên HTX</label>
            <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Địa chỉ</label>
            <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Tỉnh/Thành</label>
            <input className="form-control" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Mã số thuế</label>
            <input className="form-control" value={form.taxCode} onChange={(e) => setForm({ ...form, taxCode: e.target.value })} required />
          </div>
          {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
          <button type="submit" className="btn btn-primary">Hoàn tất</button>
        </form>
      </div>
    </div>
  );
}
