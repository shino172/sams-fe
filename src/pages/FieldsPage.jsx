import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { apiFetch } from '../lib/api';

export default function FieldsPage() {
  const { setHeaderAction, sidePanelRoot, openSidePanel, closeSidePanel } = useOutletContext();
  const [fields, setFields] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    farmerId: '',
    name: '',
    areaHa: '',
    soilType: 'phù sa',
    lat: '',
    lng: '',
    locationNote: '',
  });

  const resetForm = () =>
    setForm({
      farmerId: '',
      name: '',
      areaHa: '',
      soilType: 'phù sa',
      lat: '',
      lng: '',
      locationNote: '',
    });

  const load = () => apiFetch('/api/cooperative/fields').then((d) => setFields(d.fields));

  useEffect(() => {
    load();
    apiFetch('/api/cooperative/farmers').then((d) => setFarmers(d.farmers));
  }, []);

  useEffect(() => {
    setHeaderAction(
      <button type="button" className="quick-action-btn" onClick={() => setShowForm(true)}>
        <Plus size={18} />
        Thêm lô đất
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
    await apiFetch('/api/cooperative/fields', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        areaHa: Number(form.areaHa),
        lat: Number(form.lat),
        lng: Number(form.lng),
      }),
    });
    setShowForm(false);
    resetForm();
    load();
  };

  return (
    <div className="fade-in-up">
      <div className="crop-grid">
        {fields.map((field) => (
          <div key={field.id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 4 }}>{field.name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {field.areaHa} ha • {field.soilType}
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
              <p style={{ fontSize: '0.85rem', marginBottom: 6 }}>
                <strong>Nông dân:</strong> {field.farmer?.user?.fullName || 'N/A'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                📍 {field.lat}, {field.lng}
              </p>
            </div>
            {field.seasons?.[0] && (
              <div style={{ backgroundColor: 'var(--primary-light)', padding: 8, borderRadius: '6px', marginTop: 8 }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Vụ hiện tại: {field.seasons[0].cropName} ({field.seasons[0].status})
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && sidePanelRoot
        ? createPortal(
            <div className="drawer-panel">
              <div className="drawer-header">
                <div className="drawer-header-copy">
                  <span className="drawer-eyebrow">Thêm mới</span>
                  <h3>Thêm lô đất mới</h3>
                  <p>Nhập thông tin khu đất ở panel bên phải để giữ danh sách luôn dễ theo dõi.</p>
                </div>
                <button className="drawer-close-btn" onClick={() => setShowForm(false)} type="button">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="drawer-content" id="field-create-form">
                <div className="form-group">
                  <label>Chọn nông dân <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <select className="form-control" value={form.farmerId} onChange={(e) => setForm({ ...form, farmerId: e.target.value })} required>
                    <option value="">-- Chọn nông dân --</option>
                    {farmers.map((farmer) => (
                      <option key={farmer.id} value={farmer.id}>{farmer.user.fullName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tên lô đất <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input className="form-control" placeholder="VD: Lô A1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Diện tích (ha) <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input type="number" step="0.1" className="form-control" placeholder="0.5" value={form.areaHa} onChange={(e) => setForm({ ...form, areaHa: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Loại đất <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input className="form-control" placeholder="phù sa, đất sét..." value={form.soilType} onChange={(e) => setForm({ ...form, soilType: e.target.value })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Vĩ độ <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input type="number" step="any" className="form-control" placeholder="10.7769" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Kinh độ <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input type="number" step="any" className="form-control" placeholder="106.6869" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Ghi chú vị trí</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Mô tả thêm về vị trí, đường vào, mốc nhận diện..."
                    value={form.locationNote}
                    onChange={(e) => setForm({ ...form, locationNote: e.target.value })}
                  />
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
                <button type="submit" form="field-create-form" className="btn btn-primary">Tạo lô đất</button>
              </div>
            </div>,
            sidePanelRoot
          )
        : null}
    </div>
  );
}
