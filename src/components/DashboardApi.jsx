import { useEffect, useState } from 'react';
import { Maximize2, Users, Sprout, TrendingUp, MapPin, Activity } from 'lucide-react';
import { apiFetch } from '../lib/api';

export default function DashboardApi() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/api/dashboard')
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p style={{ color: 'var(--danger)' }}>{error}</p>;
  if (!data) return <p>Đang tải dashboard...</p>;

  const isCoop = data.role === 'cooperative_admin';
  const stats = data.stats;

  return (
    <div className="fade-in-up">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><Maximize2 size={24} /></div>
          <div className="stat-details">
            <h3>{Number(stats.totalAreaHa || 0).toFixed(1)} ha</h3>
            <p>{isCoop ? 'Tổng diện tích' : 'Diện tích canh tác'}</p>
          </div>
        </div>
        {isCoop && (
          <div className="stat-card">
            <div className="stat-icon info"><Users size={24} /></div>
            <div className="stat-details">
              <h3>{stats.farmerCount} hộ</h3>
              <p>Nông hộ liên kết</p>
            </div>
          </div>
        )}
        <div className="stat-card">
          <div className="stat-icon success"><Sprout size={24} /></div>
          <div className="stat-details">
            <h3>{stats.activeSeasons} vụ</h3>
            <p>Vụ mùa đang hoạt động</p>
          </div>
        </div>
        {!isCoop && (
          <div className="stat-card">
            <div className="stat-icon accent"><TrendingUp size={24} /></div>
            <div className="stat-details">
              <h3>{stats.pendingSchedules ?? 0}</h3>
              <p>Lịch chờ thực hiện</p>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-grid" style={{ marginTop: 24 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <MapPin size={20} className="color-primary" />
              <span>Bản đồ lô đất</span>
            </div>
          </div>
          <div className="card-body">
            <div className="map-container" style={{ minHeight: 280 }}>
              {data.mapMarkers.length === 0 ? (
                <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Chưa có lô đất</p>
              ) : (
                data.mapMarkers.map((m, i) => (
                  <div
                    key={m.id}
                    className={`map-plot status-${m.seasonStatus || 'preparing'}`}
                    style={{
                      top: `${15 + (i % 2) * 40}%`,
                      left: `${10 + (i % 3) * 30}%`,
                      width: '28%',
                      height: '35%',
                    }}
                    title={`${m.name} (${m.lat}, ${m.lng})`}
                  >
                    <span className="plot-name">{m.name}</span>
                    <span className="plot-crop">{m.cropName || 'Đất trống'}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Activity size={20} />
              <span>Hoạt động gần đây</span>
            </div>
          </div>
          <div className="card-body">
            {data.recentLogs.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Chưa có nhật ký</p>
            ) : (
              data.recentLogs.map((log) => (
                <div key={log.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <strong>{log.farmerName}</strong> — {log.activityType} ({log.cropName})
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.description}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
