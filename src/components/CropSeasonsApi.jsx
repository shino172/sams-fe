import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router-dom';
import { CalendarDays, ChevronRight, Plus, Sprout, Tractor, UserRound, Waves, X } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const STATUS_FLOW = ['preparing', 'growing', 'harvesting', 'completed'];
const STATUS_META = {
  preparing: { label: 'Chuẩn bị', tone: 'preparing', progress: 20 },
  growing: { label: 'Đang phát triển', tone: 'growing', progress: 55 },
  harvesting: { label: 'Đang thu hoạch', tone: 'harvesting', progress: 85 },
  completed: { label: 'Hoàn tất', tone: 'completed', progress: 100 },
  failed: { label: 'Tạm dừng', tone: 'failed', progress: 0 },
};

export default function CropSeasonsApi() {
  const { user } = useAuth();
  const { setHeaderAction, setHeaderMeta, sidePanelRoot, openSidePanel, closeSidePanel } = useOutletContext();
  const isAdmin = user?.role === 'cooperative_admin';
  const [seasons, setSeasons] = useState([]);
  const [fields, setFields] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fieldId: '',
    farmerId: '',
    cropName: '',
    cropVariety: '',
    startDate: '',
    expectedHarvest: '',
  });

  const resetForm = () =>
    setForm({
      fieldId: '',
      farmerId: '',
      cropName: '',
      cropVariety: '',
      startDate: '',
      expectedHarvest: '',
    });

  const load = () => {
    apiFetch('/api/crop-seasons').then((d) => setSeasons(d.seasons));
  };

  useEffect(() => {
    load();
    if (isAdmin) {
      apiFetch('/api/cooperative/fields').then((d) => setFields(d.fields));
      apiFetch('/api/cooperative/farmers').then((d) => setFarmers(d.farmers));
    }
  }, [isAdmin]);

  useEffect(() => {
    setHeaderMeta({
      title: isAdmin ? 'Quản lý vụ mùa' : 'Vụ mùa của tôi',
    });

    if (isAdmin) {
      setHeaderAction(
        <button type="button" className="quick-action-btn" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          Thêm vụ mùa
        </button>
      );
    } else {
      setHeaderAction(null);
    }

    return () => setHeaderAction(null);
  }, [isAdmin, setHeaderAction, setHeaderMeta]);

  useEffect(() => {
    if (!showForm || !isAdmin) {
      closeSidePanel();
      return;
    }

    openSidePanel('wide');

    return () => closeSidePanel();
  }, [showForm, isAdmin, openSidePanel, closeSidePanel]);

  const visibleFields = useMemo(
    () => fields.filter((field) => !form.farmerId || field.farmerId === form.farmerId),
    [fields, form.farmerId]
  );

  const summary = useMemo(() => {
    const active = seasons.filter((season) => !['completed', 'failed'].includes(season.status)).length;
    const harvesting = seasons.filter((season) => season.status === 'harvesting').length;
    const uniqueFarmers = new Set(seasons.map((season) => season.farmer?.id).filter(Boolean)).size;
    return {
      total: seasons.length,
      active,
      harvesting,
      farmers: uniqueFarmers,
    };
  }, [seasons]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await apiFetch('/api/crop-seasons', { method: 'POST', body: JSON.stringify(form) });
    setShowForm(false);
    resetForm();
    load();
  };

  const advanceStatus = async (season) => {
    const idx = STATUS_FLOW.indexOf(season.status);
    const next = STATUS_FLOW[idx + 1];
    if (!next) return;
    await apiFetch(`/api/crop-seasons/${season.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: next }),
    });
    load();
  };

  return (
    <div className="fade-in-up">
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon primary"><Sprout size={24} /></div>
          <div className="stat-details">
            <h3>{summary.total}</h3>
            <p>Tổng vụ mùa</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success"><Waves size={24} /></div>
          <div className="stat-details">
            <h3>{summary.active}</h3>
            <p>Đang hoạt động</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent"><Tractor size={24} /></div>
          <div className="stat-details">
            <h3>{summary.harvesting}</h3>
            <p>Đến kỳ thu hoạch</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info"><UserRound size={24} /></div>
          <div className="stat-details">
            <h3>{summary.farmers}</h3>
            <p>Nông dân tham gia</p>
          </div>
        </div>
      </div>

      <div className="season-list">
        {seasons.map((season) => {
          const status = STATUS_META[season.status] || { label: season.status, tone: 'preparing', progress: 0 };
          return (
            <div key={season.id} className="season-card">
              <div className="season-card-main">
                <div className={`season-icon season-icon--${status.tone}`}>
                  <Sprout size={24} />
                </div>
                <div className="season-main-copy">
                  <div className="season-card-topline">
                    <h3>{season.cropName}</h3>
                    <span className={`season-status season-status--${status.tone}`}>{status.label}</span>
                  </div>
                  <p className="season-variety">{season.cropVariety || 'Chưa có giống cây trồng'}</p>
                  <div className="season-meta">
                    <span><UserRound size={15} /> {season.farmer?.user?.fullName || 'Chưa gán nông dân'}</span>
                    <span><Tractor size={15} /> {season.field?.name || 'Chưa gán lô đất'}</span>
                    <span><CalendarDays size={15} /> {season.startDate ? new Date(season.startDate).toLocaleDateString('vi-VN') : 'Chưa có ngày bắt đầu'}</span>
                  </div>
                </div>
              </div>
              <div className="season-side">
                <div className="season-progress-label">
                  <span>Tiến độ mùa vụ</span>
                  <strong>{status.progress}%</strong>
                </div>
                <div className="crop-progress-bar">
                  <div className="crop-progress-fill" style={{ width: `${status.progress}%` }} />
                </div>
                <p className="season-harvest-date">
                  Dự kiến thu hoạch: {season.expectedHarvest ? new Date(season.expectedHarvest).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                </p>
                {season.status !== 'completed' && season.status !== 'failed' && (
                  <button type="button" className="btn btn-secondary season-action" onClick={() => advanceStatus(season)}>
                    Chuyển giai đoạn
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {seasons.length === 0 && (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <Sprout size={42} style={{ color: 'var(--primary)', marginBottom: 16 }} />
            <h3 style={{ marginBottom: 8 }}>Chưa có vụ mùa nào</h3>
            <p style={{ color: 'var(--text-muted)' }}>Tạo vụ mùa đầu tiên để bắt đầu quản lý chu kỳ canh tác tập trung.</p>
          </div>
        )}
      </div>

      {showForm && isAdmin && sidePanelRoot
        ? createPortal(
            <div className="drawer-panel drawer-panel--xl">
              <div className="drawer-header">
                <div className="drawer-header-copy">
                  <span className="drawer-eyebrow">Lập mùa vụ</span>
                  <h3>Thêm vụ mùa mới</h3>
                  <p>Panel này dùng toàn bộ chiều cao màn hình, phần thao tác luôn cố định ở cuối để không cần kéo xuống.</p>
                </div>
                <button className="drawer-close-btn" type="button" onClick={() => setShowForm(false)}>
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="drawer-content" id="crop-season-create-form">
                <div className="form-group">
                  <label>Nông dân</label>
                  <select className="form-control" value={form.farmerId} onChange={(e) => setForm({ ...form, farmerId: e.target.value })} required>
                    <option value="">-- Chọn --</option>
                    {farmers.map((farmer) => (
                      <option key={farmer.id} value={farmer.id}>{farmer.user.fullName} ({farmer.farmerCode})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Lô đất</label>
                  <select className="form-control" value={form.fieldId} onChange={(e) => setForm({ ...form, fieldId: e.target.value })} required>
                    <option value="">-- Chọn --</option>
                    {visibleFields.map((field) => (
                      <option key={field.id} value={field.id}>{field.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tên vụ mùa</label>
                  <input className="form-control" placeholder="VD: Vụ lúa Đông Xuân 2026" value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Giống / loại cây trồng</label>
                  <input className="form-control" placeholder="VD: Lúa ST25, Sầu riêng Ri6..." value={form.cropVariety} onChange={(e) => setForm({ ...form, cropVariety: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày bắt đầu</label>
                    <input type="date" className="form-control" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Dự kiến thu hoạch</label>
                    <input type="date" className="form-control" value={form.expectedHarvest} onChange={(e) => setForm({ ...form, expectedHarvest: e.target.value })} required />
                  </div>
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
                <button type="submit" form="crop-season-create-form" className="btn btn-primary">Tạo vụ mùa</button>
              </div>
            </div>,
            sidePanelRoot
          )
        : null}
    </div>
  );
}
