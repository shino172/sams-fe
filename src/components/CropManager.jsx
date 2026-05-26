import React, { useState } from 'react';
import { 
  Sprout, 
  Plus, 
  Calendar, 
  User, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

export default function CropManager({ 
  crops, 
  onAddCrop, 
  onUpdateCropStatus, 
  plots,
  currentRole 
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  
  // Form states
  const [name, setName] = useState('');
  const [cropType, setCropType] = useState('Lúa thơm ST25');
  const [plotId, setPlotId] = useState('');
  const [farmer, setFarmer] = useState('');
  const [startDate, setStartDate] = useState('');
  const [harvestDate, setHarvestDate] = useState('');

  const getStatusLabel = (status) => {
    switch(status) {
      case 'growing': return 'Đang phát triển';
      case 'flowering': return 'Đang ra hoa';
      case 'harvesting': return 'Thu hoạch';
      case 'preparing': return 'Chuẩn bị';
      case 'harvested': return 'Đã thu hoạch';
      default: return status;
    }
  };

  const getStatusPercent = (status) => {
    switch(status) {
      case 'preparing': return 10;
      case 'growing': return 45;
      case 'flowering': return 75;
      case 'harvesting': return 90;
      case 'harvested': return 100;
      default: return 0;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !plotId || !farmer || !startDate || !harvestDate) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const selectedPlot = plots.find(p => p.id === plotId);
    
    const newCrop = {
      id: 'crop-' + Date.now(),
      name,
      cropType,
      plotId,
      plotName: selectedPlot ? selectedPlot.name : 'Chưa rõ',
      farmer,
      startDate,
      expectedHarvestDate: harvestDate,
      status: 'growing'
    };

    onAddCrop(newCrop);
    setShowAddModal(false);
    
    // Reset form
    setName('');
    setPlotId('');
    setFarmer('');
    setStartDate('');
    setHarvestDate('');
  };

  const handleAdvanceStatus = (crop) => {
    let nextStatus = 'growing';
    if (crop.status === 'growing') nextStatus = 'flowering';
    else if (crop.status === 'flowering') nextStatus = 'harvesting';
    else if (crop.status === 'harvesting') nextStatus = 'harvested';
    else return;

    onUpdateCropStatus(crop.id, nextStatus);
    
    // Update selected crop state
    if (selectedCrop && selectedCrop.id === crop.id) {
      setSelectedCrop({ ...selectedCrop, status: nextStatus });
    }
  };

  // Filter crops for farmer
  const visibleCrops = currentRole === 'coop' 
    ? crops 
    : crops.filter(c => c.farmer === 'Nguyễn Văn Ruộng');

  return (
    <div className="fade-in-up">
      {/* Tab Header & Add Action */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Quản Lý Mùa Vụ</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Theo dõi hành trình sinh trưởng và thiết lập lịch hoạt động cho từng vùng trồng
          </p>
        </div>
        {currentRole === 'coop' && (
          <button 
            className="quick-action-btn"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            <span>Thêm Vụ Mùa Mới</span>
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedCrop ? '3fr 2fr' : '1fr', gap: '24px', transition: 'all 0.3s ease' }}>
        {/* Left Side: Crop Listing Grid */}
        <div>
          <div className="crop-grid">
            {visibleCrops.map((crop) => {
              const percent = getStatusPercent(crop.status);
              return (
                <div 
                  key={crop.id} 
                  className={`crop-card ${selectedCrop && selectedCrop.id === crop.id ? 'active-border' : ''}`}
                  onClick={() => setSelectedCrop(crop)}
                  style={{ 
                    cursor: 'pointer',
                    border: selectedCrop && selectedCrop.id === crop.id ? '2px solid var(--primary)' : '1px solid var(--border-color)'
                  }}
                >
                  <div className="crop-card-image">
                    <Sprout size={48} />
                    <span className={`crop-badge ${crop.status}`}>
                      {getStatusLabel(crop.status)}
                    </span>
                  </div>
                  <div className="crop-card-content">
                    <h3 className="crop-card-title">{crop.name}</h3>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '12px' }}>
                      {crop.cropType}
                    </div>

                    <div className="crop-meta-row">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} />
                        {crop.plotName}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={14} />
                        {crop.farmer}
                      </span>
                    </div>

                    <div className="crop-progress-bar">
                      <div className="crop-progress-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Tiến độ: {percent}%</span>
                      <span>Hạn: {crop.expectedHarvestDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {visibleCrops.length === 0 && (
              <div className="card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center' }}>
                <Sprout size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                <h3>Chưa có vụ mùa nào hoạt động</h3>
                <p style={{ color: 'var(--text-muted)' }}>Bấm nút "Thêm Vụ Mùa Mới" để lên kế hoạch canh tác đầu tiên.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Crop Details & Timeline */}
        {selectedCrop && (
          <div className="card fade-in-up">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title">
                <TrendingUp size={20} className="color-primary" />
                <span>Tiến Độ Sinh Trưởng</span>
              </div>
              <button 
                onClick={() => setSelectedCrop(null)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-muted)', 
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="card-body">
              <h3 style={{ marginBottom: '4px' }}>{selectedCrop.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Loại giống: <strong>{selectedCrop.cropType}</strong> | Thửa đất: <strong>{selectedCrop.plotName}</strong>
              </p>

              {/* Growth Timeline representation */}
              <div className="timeline">
                <div className={`timeline-item ${selectedCrop.status === 'preparing' ? 'active' : 'completed'}`}>
                  <div className="timeline-marker">✓</div>
                  <div className="timeline-content">
                    <h4>Làm đất & Chuẩn bị</h4>
                    <p>Cày ải rạch hàng, bón vôi hạ phèn và bón lót hữu cơ vi sinh.</p>
                  </div>
                </div>

                <div className={`timeline-item ${selectedCrop.status === 'growing' ? 'active' : ['flowering', 'harvesting', 'harvested'].includes(selectedCrop.status) ? 'completed' : ''}`}>
                  <div className="timeline-marker">🌱</div>
                  <div className="timeline-content">
                    <h4>Gieo hạt & Cây con</h4>
                    <p>Bắt đầu: {selectedCrop.startDate} | Theo dõi tưới tiêu hàng ngày, bón thúc đợt 1.</p>
                  </div>
                </div>

                <div className={`timeline-item ${selectedCrop.status === 'flowering' ? 'active' : ['harvesting', 'harvested'].includes(selectedCrop.status) ? 'completed' : ''}`}>
                  <div className="timeline-marker">🌸</div>
                  <div className="timeline-content">
                    <h4>Ra hoa & Tạo quả</h4>
                    <p>Bón phân đón bông/trổ đòng, phòng ngừa dịch bệnh sâu cuốn lá.</p>
                  </div>
                </div>

                <div className={`timeline-item ${selectedCrop.status === 'harvesting' ? 'active' : selectedCrop.status === 'harvested' ? 'completed' : ''}`}>
                  <div className="timeline-marker">🌾</div>
                  <div className="timeline-content">
                    <h4>Thu hoạch</h4>
                    <p>Dự kiến: {selectedCrop.expectedHarvestDate} | Đo lường sản lượng thực tế và bàn giao nông sản.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons for status simulation */}
              {selectedCrop.status !== 'harvested' && (
                <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <button 
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => handleAdvanceStatus(selectedCrop)}
                  >
                    <span>Cập Nhật Giai Đoạn Tiếp Theo</span>
                    <ChevronRight size={16} />
                  </button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
                    Nhấp vào để đẩy tiến độ từ: <strong>{getStatusLabel(selectedCrop.status)}</strong> sang giai đoạn tiếp.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add New Crop Modal */}
      <div className={`modal-overlay ${showAddModal ? 'active' : ''}`}>
        <div className="modal-content">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Thêm Vụ Mùa Mới Cho Hợp Tác Xã</h3>
            <button 
              onClick={() => setShowAddModal(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="card-body">
            <div className="form-group">
              <label>Tên Vụ Mùa</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ví dụ: Vụ Lúa Đông Xuân Lô A1 - 2026" 
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Loại Cây Trồng / Giống</label>
                <select 
                  className="form-control" 
                  value={cropType}
                  onChange={e => setCropType(e.target.value)}
                >
                  <option value="Lúa thơm ST25">Lúa thơm ST25</option>
                  <option value="Sầu riêng Ri6">Sầu riêng Ri6</option>
                  <option value="Cà phê Robusta">Cà phê Robusta</option>
                  <option value="Rau má hữu cơ">Rau má hữu cơ</option>
                </select>
              </div>

              <div className="form-group">
                <label>Lô Đất Số Hóa</label>
                <select 
                  className="form-control" 
                  value={plotId}
                  onChange={e => setPlotId(e.target.value)}
                >
                  <option value="">-- Chọn lô đất --</option>
                  {plots.map(plot => (
                    <option key={plot.id} value={plot.id}>
                      {plot.name} ({plot.area} ha)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Nông Hộ Phụ Trách</label>
              <select 
                className="form-control" 
                value={farmer}
                onChange={e => setFarmer(e.target.value)}
              >
                <option value="">-- Chọn nông hộ --</option>
                <option value="Nguyễn Văn Ruộng">Nguyễn Văn Ruộng (Hộ 04)</option>
                <option value="Lê Văn Hải">Lê Văn Hải (Hộ 02)</option>
                <option value="Phạm Thị Thảo">Phạm Thị Thảo (Hộ 09)</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ngày Bắt Đầu Gieo Trồng</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Ngày Dự Kiến Thu Hoạch</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={harvestDate}
                  onChange={e => setHarvestDate(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowAddModal(false)}
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                Tạo Kế Hoạch Vụ Mùa
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
