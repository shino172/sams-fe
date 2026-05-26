import React, { useState } from 'react';
import { 
  Users, 
  Sprout, 
  Maximize2, 
  TrendingUp, 
  MapPin, 
  AlertTriangle,
  Droplet,
  CloudRain,
  CheckCircle2,
  Calendar,
  Activity,
  ArrowRight
} from 'lucide-react';

export default function Dashboard({ 
  crops, 
  logs, 
  currentRole, 
  plots, 
  onSelectPlot 
}) {
  const [selectedPlot, setSelectedPlot] = useState(null);

  // Cooperative stats
  const totalArea = plots.reduce((acc, plot) => acc + plot.area, 0);
  const activeFarmersCount = 14;
  const activeCropsCount = crops.filter(c => c.status !== 'harvested').length;
  const expectedYield = 142.5; // Tons

  // Farmer stats (only plots assigned to farmer "Nguyễn Văn Ruộng")
  const farmerPlots = plots.filter(p => p.farmer === 'Nguyễn Văn Ruộng');
  const farmerArea = farmerPlots.reduce((acc, plot) => acc + plot.area, 0);
  const farmerActiveCrops = crops.filter(c => c.farmer === 'Nguyễn Văn Ruộng' && c.status !== 'harvested');

  const handlePlotClick = (plot) => {
    const crop = crops.find(c => c.plotId === plot.id);
    setSelectedPlot({ ...plot, crop });
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'growing': return 'Đang phát triển';
      case 'flowering': return 'Đang ra hoa';
      case 'harvesting': return 'Sắp thu hoạch';
      case 'preparing': return 'Chuẩn bị đất';
      default: return 'Trống';
    }
  };

  return (
    <div className="fade-in-up">
      {/* Overview Stats */}
      {currentRole === 'coop' ? (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <Maximize2 size={24} />
            </div>
            <div className="stat-details">
              <h3>{totalArea.toFixed(1)} ha</h3>
              <p>Tổng Diện Tích Số Hóa</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon info">
              <Users size={24} />
            </div>
            <div className="stat-details">
              <h3>{activeFarmersCount} hộ</h3>
              <p>Nông Hộ Liên Kết</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon success">
              <Sprout size={24} />
            </div>
            <div className="stat-details">
              <h3>{activeCropsCount} vụ</h3>
              <p>Vụ Mùa Đang Hoạt Động</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon accent">
              <TrendingUp size={24} />
            </div>
            <div className="stat-details">
              <h3>{expectedYield} Tấn</h3>
              <p>Sản Lượng Dự Kiến</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <Maximize2 size={24} />
            </div>
            <div className="stat-details">
              <h3>{farmerArea.toFixed(1)} ha</h3>
              <p>Diện Tích Canh Tác Của Bạn</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon success">
              <Sprout size={24} />
            </div>
            <div className="stat-details">
              <h3>{farmerActiveCrops.length} vụ</h3>
              <p>Vụ Mùa Đang Chăm Sóc</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon info">
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-details">
              <h3>3 / 4</h3>
              <p>Công Việc Hoàn Thành Hôm Nay</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon accent">
              <CloudRain size={24} />
            </div>
            <div className="stat-details">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Có mưa lúc 15:00</h3>
              <p>Khuyến Nghị: Hoãn tưới nước</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="dashboard-grid">
        {/* Left Side - Interactive GIS Map */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <MapPin size={20} className="color-primary" />
              <span>Bản Đồ Trang Trại Số (GIS Simulator)</span>
            </div>
            <span className="view-mode-badge">
              <Activity size={12} />
              {currentRole === 'coop' ? 'Chế độ Hợp tác xã' : 'Đất canh tác cá nhân'}
            </span>
          </div>
          <div className="card-body">
            <div className="map-container">
              <div className="map-grid-overlay"></div>
              {plots
                .filter(plot => currentRole === 'coop' || plot.farmer === 'Nguyễn Văn Ruộng')
                .map((plot) => {
                  const crop = crops.find(c => c.plotId === plot.id);
                  const statusClass = crop ? `status-${crop.status}` : 'status-preparing';
                  return (
                    <div
                      key={plot.id}
                      className={`map-plot ${statusClass}`}
                      style={{
                        top: plot.mapCoords.top,
                        left: plot.mapCoords.left,
                        width: plot.mapCoords.width,
                        height: plot.mapCoords.height,
                      }}
                      onClick={() => handlePlotClick(plot)}
                    >
                      <span className="plot-name">{plot.name}</span>
                      <span className="plot-crop">
                        {crop ? crop.cropType : 'Đất trống'}
                      </span>
                    </div>
                  );
                })}
              
              <div className="map-legend">
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#22c55e' }}></div>
                  <span>Đang lớn</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#eab308' }}></div>
                  <span>Ra hoa</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#f97316' }}></div>
                  <span>Thu hoạch</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#a855f7' }}></div>
                  <span>Làm đất</span>
                </div>
              </div>
            </div>

            {/* Plot detail drawer/card below map if clicked */}
            {selectedPlot ? (
              <div 
                style={{ 
                  marginTop: '20px', 
                  padding: '16px', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-app)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  animation: 'fadeInUp 0.3s ease'
                }}
              >
                <div>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {selectedPlot.name} ({selectedPlot.area} ha)
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Chủ hộ: <strong>{selectedPlot.farmer}</strong> | Cây trồng: <strong>{selectedPlot.crop ? selectedPlot.crop.cropType : 'Chưa gieo giống'}</strong>
                  </p>
                  {selectedPlot.crop && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Vụ: {selectedPlot.crop.name} | Trạng thái: {getStatusLabel(selectedPlot.crop.status)}
                    </p>
                  )}
                </div>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setSelectedPlot(null)}
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  Đóng
                </button>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '16px', textAlign: 'center', fontStyle: 'italic' }}>
                * Bấm vào một lô đất trên bản đồ để xem chi tiết nhanh
              </p>
            )}
          </div>
        </div>

        {/* Right Side - Custom Interactive Content depending on role */}
        <div className="card">
          {currentRole === 'coop' ? (
            <>
              <div className="card-header">
                <div className="card-title">
                  <TrendingUp size={20} className="color-accent" />
                  <span>Sản Lượng Nông Sản Dự Kiến (Tấn)</span>
                </div>
              </div>
              <div className="card-body">
                <div className="graph-container">
                  <div className="bar-column">
                    <div className="bar-fill" style={{ height: '75%' }} data-value="45T"></div>
                    <span className="bar-label">Lúa thơm</span>
                  </div>
                  <div className="bar-column">
                    <div className="bar-fill" style={{ height: '50%' }} data-value="30T"></div>
                    <span className="bar-label">Sầu riêng</span>
                  </div>
                  <div className="bar-column">
                    <div className="bar-fill" style={{ height: '35%' }} data-value="22T"></div>
                    <span className="bar-label">Cà phê</span>
                  </div>
                  <div className="bar-column">
                    <div className="bar-fill" style={{ height: '60%' }} data-value="38T"></div>
                    <span className="bar-label">Mắc ca</span>
                  </div>
                  <div className="bar-column">
                    <div className="bar-fill" style={{ height: '15%' }} data-value="7.5T"></div>
                    <span className="bar-label">Rau má</span>
                  </div>
                </div>

                <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <AlertTriangle size={18} style={{ color: 'var(--accent)' }} />
                    <span>Cảnh Báo Vùng Trồng</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ 
                      padding: '10px 14px', 
                      borderRadius: 'var(--radius-sm)', 
                      backgroundColor: 'var(--accent-light)', 
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      borderLeft: '4px solid var(--accent)'
                    }}>
                      Lô A2 (Nông dân Ruộng): Độ ẩm đất giảm sâu xuống 35%. Khuyến nghị tưới tiêu bổ sung.
                    </div>
                    <div style={{ 
                      padding: '10px 14px', 
                      borderRadius: 'var(--radius-sm)', 
                      backgroundColor: 'var(--danger-light)', 
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      borderLeft: '4px solid var(--danger)'
                    }}>
                      Lô B1: Phát hiện sâu cuốn lá ở rải rác khu vực phía Tây. Khuyến nghị phun chế phẩm vi sinh.
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="card-header">
                <div className="card-title">
                  <Calendar size={20} className="color-primary" />
                  <span>Nhiệm Vụ Canh Tác Hôm Nay</span>
                </div>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-app)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                      <div>
                        <h4 style={{ fontSize: '0.9rem', textDecoration: 'line-through', opacity: 0.6 }}>Tưới nước Lô A1</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Thời gian: Sáng sớm (06:00)</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--success-light)', color: 'var(--success)', fontWeight: 600 }}>Xong</span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-app)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                      <div>
                        <h4 style={{ fontSize: '0.9rem', textDecoration: 'line-through', opacity: 0.6 }}>Kiểm tra bẫy pheromone côn trùng Lô B1</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Thời gian: Sáng (08:30)</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--success-light)', color: 'var(--success)', fontWeight: 600 }}>Xong</span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-app)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Bón phân kali bổ sung Lô A1</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mục tiêu: Đón đòng cây lúa, lượng: 50kg</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 600 }}>Chờ</span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-app)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Chụp ảnh báo cáo sinh trưởng tuần Lô B1</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tải ảnh lên Nhật ký canh tác</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 600 }}>Chờ</span>
                  </div>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button 
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', width: '100%' }}
                  >
                    Xem lịch lịch trình vụ mùa chi tiết <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Activity List at the bottom */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Activity size={20} className="color-primary" />
            <span>Nhật Ký Hoạt Động Trang Trại Gần Đây</span>
          </div>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {logs.slice(0, 3).map((log, index) => (
              <div 
                key={log.id || index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: index !== 2 ? '1px solid var(--border-color)' : 'none',
                  fontSize: '0.9rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: log.type === 'water' ? '#e0f2fe' : log.type === 'fertilize' ? '#fef3c7' : '#fee2e2',
                    color: log.type === 'water' ? '#0284c7' : log.type === 'fertilize' ? '#d97706' : '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Sprout size={16} />
                  </div>
                  <div>
                    <strong>{log.farmer}</strong> đã thực hiện: <strong>{log.activity}</strong> trên thửa <strong>{log.plotName}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Vụ mùa: {log.cropName} | Ghi chú: {log.notes}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {log.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
