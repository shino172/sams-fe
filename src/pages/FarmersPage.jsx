import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { apiFetch } from '../lib/api';

export default function FarmersPage() {
  const { setHeaderAction, sidePanelRoot, openSidePanel, closeSidePanel } = useOutletContext();
  const [farmers, setFarmers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    farmerCode: '',
    address: '',
    totalAreaHa: 0,
  });

  const resetForm = () =>
    setForm({
      email: '',
      password: '',
      fullName: '',
      phone: '',
      farmerCode: '',
      address: '',
      totalAreaHa: 0,
    });

  const load = () => apiFetch('/api/cooperative/farmers').then((d) => setFarmers(d.farmers));

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setHeaderAction(
      <button type="button" className="quick-action-btn" onClick={() => setShowForm(true)}>
        <Plus size={18} />
        Thêm nông dân
      </button>
    );

    return () => setHeaderAction(null);
  }, [setHeaderAction]);

  useEffect(() => {
    if (!showForm) {
      closeSidePanel();
      return;
    }

    openSidePanel();

    return () => closeSidePanel();
  }, [showForm, openSidePanel, closeSidePanel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await apiFetch('/api/cooperative/farmers', { method: 'POST', body: JSON.stringify(form) });
    setShowForm(false);
    resetForm();
    load();
  };

  return (
    <div className="fade-in-up">
      <div className="card">
        <div className="card-body">
          {farmers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1rem' }}>Chưa có nông dân nào</p>
              <p style={{ fontSize: '0.9rem' }}>Nhấn "Thêm nông dân" để tạo nông dân mới</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Mã</th>
                  <th style={{ width: '20%' }}>Họ tên</th>
                  <th style={{ width: '25%' }}>Email</th>
                  <th style={{ width: '15%' }}>Diện tích (ha)</th>
                  <th style={{ width: '15%' }}>Lô đất</th>
                  <th style={{ width: '10%' }}>SĐT</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        {f.farmerCode}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{f.user.fullName}</span>
                    </td>
                    <td>{f.user.email}</td>
                    <td>
                      <span style={{ backgroundColor: 'var(--primary-light)', padding: '4px 8px', borderRadius: '4px', color: 'var(--primary)', fontWeight: 600 }}>
                        {f.totalAreaHa} ha
                      </span>
                    </td>
                    <td>
                      <span style={{ backgroundColor: 'var(--accent-light)', padding: '4px 8px', borderRadius: '4px', color: 'var(--accent)', fontWeight: 600 }}>
                        {f._count?.fields ?? 0} lô
                      </span>
                    </td>
                    <td>{f.user.phone || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && sidePanelRoot
        ? createPortal(
            <div className="drawer-panel">
              <div className="drawer-header">
                <div className="drawer-header-copy">
                  <span className="drawer-eyebrow">Thêm mới</span>
                  <h3>Thêm nông dân mới</h3>
                  <p>Tạo tài khoản và hồ sơ nông dân trong một bước gọn gàng hơn.</p>
                </div>
                <button className="drawer-close-btn" onClick={() => setShowForm(false)} type="button">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="drawer-content" id="farmer-create-form">
                <div className="form-group">
                  <label>Họ và tên <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input className="form-control" placeholder="Nguyễn Văn A" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email đăng nhập <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input type="email" className="form-control" placeholder="farmer@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Mật khẩu <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input type="password" className="form-control" placeholder="Tối thiểu 6 ký tự" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
                <div className="drawer-grid">
                  <div className="form-group">
                    <label>Mã nông dân <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input className="form-control" placeholder="NĐ001" value={form.farmerCode} onChange={(e) => setForm({ ...form, farmerCode: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input className="form-control" placeholder="0901234567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Địa chỉ <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input className="form-control" placeholder="Số 123, Đường ABC, Xã XYZ" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                </div>
              </form>
              <div className="drawer-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Hủy
                </button>
                <button type="submit" form="farmer-create-form" className="btn btn-primary">Tạo nông dân</button>
              </div>
            </div>,
            sidePanelRoot
          )
        : null}
    </div>
  );
}
