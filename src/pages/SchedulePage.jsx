import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router-dom';
import { Plus, Check, Clock3, CalendarDays, ClipboardList, X } from 'lucide-react';
import { apiFetch } from '../lib/api';

const TASK_TYPE_LABELS = {
  watering: 'Tưới tiêu',
  fertilizing: 'Bón phân',
  spraying: 'Phun thuốc',
  harvesting: 'Thu hoạch',
};

const STATUS_LABELS = {
  pending: 'Đang chờ',
  done: 'Đã hoàn thành',
  skipped: 'Đã bỏ qua',
};

export default function SchedulePage() {
  const { setHeaderAction, sidePanelRoot, openSidePanel, closeSidePanel } = useOutletContext();
  const [schedules, setSchedules] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    cropSeasonId: '',
    title: '',
    taskType: 'watering',
    plannedDate: '',
    note: '',
  });

  const resetForm = () =>
    setForm({
      cropSeasonId: '',
      title: '',
      taskType: 'watering',
      plannedDate: '',
      note: '',
    });

  const load = () => apiFetch('/api/schedule').then((d) => setSchedules(d.schedules));

  useEffect(() => {
    load();
    apiFetch('/api/crop-seasons').then((d) => setSeasons(d.seasons));
  }, []);

  useEffect(() => {
    setHeaderAction(
      <button type="button" className="quick-action-btn" onClick={() => setShowForm(true)}>
        <Plus size={18} />
        Thêm lịch
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

  const summary = useMemo(() => {
    const pending = schedules.filter((item) => item.status === 'pending').length;
    const done = schedules.filter((item) => item.status === 'done').length;
    return {
      total: schedules.length,
      pending,
      done,
    };
  }, [schedules]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await apiFetch('/api/schedule', { method: 'POST', body: JSON.stringify(form) });
    setShowForm(false);
    resetForm();
    load();
  };

  const markDone = async (id) => {
    await apiFetch(`/api/schedule/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'done' }),
    });
    load();
  };

  return (
    <div className="fade-in-up">
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon primary"><ClipboardList size={24} /></div>
          <div className="stat-details">
            <h3>{summary.total}</h3>
            <p>Tổng công việc</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent"><Clock3 size={24} /></div>
          <div className="stat-details">
            <h3>{summary.pending}</h3>
            <p>Đang chờ thực hiện</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success"><Check size={24} /></div>
          <div className="stat-details">
            <h3>{summary.done}</h3>
            <p>Đã hoàn thành</p>
          </div>
        </div>
      </div>

      <div className="content-stack">
        {schedules.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <CalendarDays size={36} style={{ color: 'var(--primary)', marginBottom: 12 }} />
            <h3 style={{ marginBottom: 8 }}>Chưa có lịch canh tác</h3>
            <p style={{ color: 'var(--text-muted)' }}>Nhấn "Thêm lịch" để lập kế hoạch công việc cho mùa vụ.</p>
          </div>
        ) : (
          schedules.map((schedule) => (
            <div key={schedule.id} className="card">
              <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: 6 }}>{schedule.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    {schedule.season?.cropName || 'Chưa gắn vụ mùa'}
                  </p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <span>{TASK_TYPE_LABELS[schedule.taskType] || schedule.taskType}</span>
                    <span>{new Date(schedule.plannedDate).toLocaleDateString('vi-VN')}</span>
                    <span>{STATUS_LABELS[schedule.status] || schedule.status}</span>
                  </div>
                </div>
                {schedule.status === 'pending' && (
                  <button type="button" className="btn btn-primary" onClick={() => markDone(schedule.id)}>
                    <Check size={16} />
                    Hoàn thành
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && sidePanelRoot
        ? createPortal(
            <div className="drawer-panel">
              <div className="drawer-header">
                <div className="drawer-header-copy">
                  <span className="drawer-eyebrow">Lập kế hoạch</span>
                  <h3>Thêm lịch canh tác</h3>
                  <p>Tạo công việc mới với ngày thực hiện, loại công việc và ghi chú đi kèm.</p>
                </div>
                <button className="drawer-close-btn" onClick={() => setShowForm(false)} type="button">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="drawer-content" id="schedule-create-form">
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
                  <label>Tiêu đề</label>
                  <input className="form-control" placeholder="Ví dụ: Bón phân đợt 1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Loại công việc</label>
                  <select className="form-control" value={form.taskType} onChange={(e) => setForm({ ...form, taskType: e.target.value })}>
                    <option value="watering">Tưới tiêu</option>
                    <option value="fertilizing">Bón phân</option>
                    <option value="spraying">Phun thuốc</option>
                    <option value="harvesting">Thu hoạch</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Ngày kế hoạch</label>
                  <input type="date" className="form-control" value={form.plannedDate} onChange={(e) => setForm({ ...form, plannedDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Ghi chú</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Mô tả chi tiết vật tư, lưu ý hoặc người phụ trách..."
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
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
                <button type="submit" form="schedule-create-form" className="btn btn-primary">Tạo lịch</button>
              </div>
            </div>
            ,
            sidePanelRoot
          )
        : null}
    </div>
  );
}
