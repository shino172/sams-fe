import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/api/reports')
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p style={{ color: 'var(--danger)' }}>{error}</p>;
  if (!data) return <p>Đang tải báo cáo...</p>;

  const { summary, seasons } = data;

  return (
    <div className="fade-in-up">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-details">
            <h3>{summary.totalSeasons}</h3>
            <p>Tổng vụ mùa</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <h3>{summary.totalLogs}</h3>
            <p>Nhật ký canh tác</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <h3>{summary.totalExpectedYieldKg?.toFixed?.(0) ?? summary.totalExpectedYieldKg} kg</h3>
            <p>Sản lượng dự kiến</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-details">
            <h3>{summary.totalActualYieldKg?.toFixed?.(0) ?? summary.totalActualYieldKg} kg</h3>
            <p>Sản lượng thực tế</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header"><h3>Phân bổ nhật ký theo hoạt động</h3></div>
        <div className="card-body">
          {summary.logsByActivity?.map((row) => (
            <p key={row.activityType}>
              {row.activityType}: <strong>{row.count}</strong>
            </p>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header"><h3>Chi tiết theo vụ mùa</h3></div>
        <div className="card-body">
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8 }}>Vụ mùa</th>
                <th>Nông dân</th>
                <th>Lô</th>
                <th>Trạng thái</th>
                <th>Nhật ký</th>
              </tr>
            </thead>
            <tbody>
              {seasons?.map((s) => (
                <tr key={s.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: 8 }}>{s.cropName}</td>
                  <td>{s.farmerName}</td>
                  <td>{s.fieldName}</td>
                  <td>{s.status}</td>
                  <td>{s.logCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
