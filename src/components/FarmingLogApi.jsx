import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router-dom';
import { ClipboardPlus, Droplet, Filter, FlaskConical, Leaf, Search, Sprout, X } from 'lucide-react';
import { apiFetch } from '../lib/api';

export default function FarmingLogApi() {
  const { setHeaderAction, sidePanelRoot, openSidePanel, closeSidePanel } = useOutletContext();
  const [logs, setLogs] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [filterSeason, setFilterSeason] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    cropSeasonId: '',
    activityType: 'watering',
    description: '',
  });

  const load = () => {
    const q = filterSeason !== 'all' ? `?cropSeasonId=${filterSeason}` : '';
    apiFetch(`/api/logs${q}`).then((d) => setLogs(d.logs));
  };

  useEffect(() => {
    load();
    apiFetch('/api/crop-seasons').then((d) => setSeasons(d.seasons));
  }, [filterSeason]);

  useEffect(() => {
    setHeaderAction(
      <button type="button" className="quick-action-btn" onClick={() => setShowForm(true)}>
        <ClipboardPlus size={18} />
        Thêm nhật ký
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
    await apiFetch('/api/logs', {
      method: 'POST',
      body: JSON.stringify({
        cropSeasonId: form.cropSeasonId,
        activityType: form.activityType,
        description: form.description,
        inputsUsed: {},
      }),
    });
    setForm({ cropSeasonId: '', activityType: 'watering', description: '' });
    setShowForm(false);
    load();
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'fertilizing':
        return <FlaskConical size={18} />;
      case 'spraying':
        return <Leaf size={18} />;
      case 'harvesting':
        return <Sprout size={18} />;
      default:
        return <Droplet size={18} />;
    }
  };

  return (
    <div className="fade-in-up">
      <div className="content-stack">
        <div className="card">
          <div className="card-body inline-filter-bar">
            <div className="filter-badge">
              <Filter size={16} />
              Bộ lọc nhật ký
            </div>
            <select className="form-control filter-select" value={filterSeason} onChange={(e) => setFilterSeason(e.target.value)}>
              <option value="all">Tất cả vụ mùa</option>
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>{season.cropName} ({season.field?.name})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="log-list">
          {logs.map((log) => (
            <div key={log.id} className="log-item">
              <div className="log-left">
                <div className={`log-activity-icon ${log.activityType === 'fertilizing' ? 'fertilize' : log.activityType === 'spraying' ? 'pesticide' : log.activityType === 'harvesting' ? 'harvest' : 'water'}`}>
                  {getLogIcon(log.activityType)}
                </div>
                <div className="log-details">
                  <h4>{log.activityType}</h4>
                  <p>{log.season?.cropName} {log.fieldName ? `(${log.fieldName})` : ''} — {log.description}</p>
                </div>
              </div>
              <div className="log-right">
                {log.farmerName && <span className="log-operator">{log.farmerName}</span>}
                <span className="log-time">Nhật ký canh tác</span>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <Search size={36} style={{ color: 'var(--primary)', marginBottom: 12 }} />
              <h3 style={{ marginBottom: 8 }}>Chưa có nhật ký phù hợp</h3>
              <p style={{ color: 'var(--text-muted)' }}>Hãy tạo nhật ký mới hoặc thay đổi bộ lọc vụ mùa.</p>
            </div>
          )}
        </div>
      </div>

      {showForm && sidePanelRoot
        ? createPortal(
            <div className="drawer-panel">
              <div className="drawer-header">
                <div className="drawer-header-copy">
                  <span className="drawer-eyebrow">Nhật ký nhanh</span>
                  <h3>Thêm nhật ký canh tác</h3>
                  <p>Ghi lại hoạt động mới ngay từ panel bên phải để không làm gián đoạn việc theo dõi danh sách.</p>
                </div>
                <button className="drawer-close-btn" type="button" onClick={() => setShowForm(false)}>
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="drawer-content" id="log-create-form">
                <div className="form-group">
                  <label>Vụ mùa</label>
                  <select className="form-control" value={form.cropSeasonId} onChange={(e) => setForm({ ...form, cropSeasonId: e.target.value })} required>
                    <option value="">-- Chọn --</option>
                    {seasons.map((season) => (
                      <option key={season.id} value={season.id}>{season.cropName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Hoạt động</label>
                  <select className="form-control" value={form.activityType} onChange={(e) => setForm({ ...form, activityType: e.target.value })}>
                    <option value="watering">Tưới tiêu</option>
                    <option value="fertilizing">Bón phân</option>
                    <option value="spraying">Phun thuốc</option>
                    <option value="observation">Quan sát</option>
                    <option value="harvesting">Thu hoạch</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Ghi chú</label>
                  <textarea className="form-control" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                </div>
              </form>
              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
                <button type="submit" form="log-create-form" className="btn btn-primary">Gửi nhật ký</button>
              </div>
            </div>,
            sidePanelRoot
          )
        : null}
    </div>
  );
}
