import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Filter, 
  Droplet, 
  Wind, 
  Flame, 
  AlertCircle,
  Clock,
  Sparkles,
  Smartphone,
  ChevronRight
} from 'lucide-react';

export default function FarmingLog({ 
  logs, 
  crops, 
  onAddLog, 
  currentRole 
}) {
  const [selectedCropFilter, setSelectedCropFilter] = useState('all');
  const [selectedActivityFilter, setSelectedActivityFilter] = useState('all');
  
  // Quick Log form state
  const [cropId, setCropId] = useState('');
  const [activity, setActivity] = useState('Tưới tiêu');
  const [materials, setMaterials] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const getActivityIcon = (act) => {
    switch(act) {
      case 'Tưới tiêu':
      case 'water':
        return { icon: Droplet, className: 'log-activity-icon water' };
      case 'Bón phân':
      case 'fertilize':
        return { icon: Flame, className: 'log-activity-icon fertilize' };
      case 'Phun thuốc':
      case 'pesticide':
        return { icon: Wind, className: 'log-activity-icon pesticide' };
      case 'Thu hoạch':
      case 'harvest':
        return { icon: Sparkles, className: 'log-activity-icon harvest' };
      default:
        return { icon: FileText, className: 'log-activity-icon fertilize' };
    }
  };

  const handleQuickLogSubmit = (e) => {
    e.preventDefault();
    if (!cropId || !notes) {
      alert('Vui lòng chọn Vụ Mùa và điền ghi chú hoạt động!');
      return;
    }

    const selectedCrop = crops.find(c => c.id === cropId);

    const newLog = {
      id: 'log-' + Date.now(),
      farmer: currentRole === 'coop' ? 'Ban quản lý HTX' : 'Nguyễn Văn Ruộng',
      cropId: cropId,
      cropName: selectedCrop ? selectedCrop.name : 'Chưa rõ',
      plotName: selectedCrop ? selectedCrop.plotName : 'Lô A1',
      activity: activity,
      type: activity === 'Tưới tiêu' ? 'water' : activity === 'Bón phân' ? 'fertilize' : activity === 'Phun thuốc' ? 'pesticide' : 'harvest',
      notes: `${notes} ${materials ? `(Vật tư: ${materials} - Lượng: ${amount})` : ''}`,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - Hôm nay'
    };

    onAddLog(newLog);
    
    // Reset Form
    setCropId('');
    setMaterials('');
    setAmount('');
    setNotes('');
  };

  // Filter logic
  const filteredLogs = logs.filter(log => {
    const cropMatch = selectedCropFilter === 'all' || log.cropId === selectedCropFilter;
    const actMatch = selectedActivityFilter === 'all' || 
                     (selectedActivityFilter === 'water' && log.type === 'water') ||
                     (selectedActivityFilter === 'fertilize' && log.type === 'fertilize') ||
                     (selectedActivityFilter === 'pesticide' && log.type === 'pesticide') ||
                     (selectedActivityFilter === 'harvest' && log.type === 'harvest');
    return cropMatch && actMatch;
  });

  return (
    <div className="fade-in-up">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Nhật Ký Canh Tác</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Ghi chép và theo dõi toàn bộ hoạt động bón phân, tưới tiêu, phun thuốc phòng dịch của toàn xã viên
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px' }}>
        
        {/* Left Side: Filter & Log List */}
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-body" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
                <Filter size={16} />
                <span>Bộ lọc nhanh:</span>
              </div>
              
              <select 
                className="form-control" 
                style={{ width: '200px', padding: '8px 12px' }}
                value={selectedCropFilter}
                onChange={e => setSelectedCropFilter(e.target.value)}
              >
                <option value="all">Tất cả vụ mùa</option>
                {crops.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select 
                className="form-control" 
                style={{ width: '180px', padding: '8px 12px' }}
                value={selectedActivityFilter}
                onChange={e => setSelectedActivityFilter(e.target.value)}
              >
                <option value="all">Tất cả hoạt động</option>
                <option value="water">Tưới tiêu</option>
                <option value="fertilize">Bón phân</option>
                <option value="pesticide">Phun thuốc</option>
                <option value="harvest">Thu hoạch</option>
              </select>
            </div>
          </div>

          <div className="log-list">
            {filteredLogs.map((log) => {
              const { icon: IconComponent, className } = getActivityIcon(log.activity);
              return (
                <div key={log.id} className="log-item fade-in-up">
                  <div className="log-left">
                    <div className={className}>
                      <IconComponent size={20} />
                    </div>
                    <div className="log-details">
                      <h4>{log.activity}</h4>
                      <p>
                        Vụ mùa: <strong>{log.cropName}</strong> ({log.plotName}) - {log.notes}
                      </p>
                    </div>
                  </div>
                  <div className="log-right">
                    <span className="log-operator">{log.farmer}</span>
                    <span className="log-time" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {log.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredLogs.length === 0 && (
              <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                <h3>Không tìm thấy hoạt động nào</h3>
                <p style={{ color: 'var(--text-muted)' }}>Chưa có bản ghi nhật ký phù hợp với bộ lọc đã chọn.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Quick Logger Form (designed like a Mobile Interface mockup) */}
        <div>
          <div className="card" style={{ borderColor: 'var(--primary)', borderWidth: '1px', overflow: 'hidden' }}>
            <div 
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Smartphone size={20} />
              <h3 style={{ fontSize: '1rem', color: 'white' }}>Báo Cáo Nhanh Từ Đồng Ruộng</h3>
            </div>
            
            <form onSubmit={handleQuickLogSubmit} className="card-body">
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                * Giả lập giao diện ứng dụng di động dành cho nông dân khi bón phân, tưới tiêu tại đồng ruộng.
              </p>

              <div className="form-group">
                <label>Vụ Mùa Đang Chăm Sóc</label>
                <select 
                  className="form-control"
                  value={cropId}
                  onChange={e => setCropId(e.target.value)}
                >
                  <option value="">-- Chọn vụ mùa cần ghi nhận --</option>
                  {crops
                    .filter(c => currentRole === 'coop' || c.farmer === 'Nguyễn Văn Ruộng')
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.plotName})
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Loại Hoạt Động</label>
                <select 
                  className="form-control"
                  value={activity}
                  onChange={e => setActivity(e.target.value)}
                >
                  <option value="Tưới tiêu">Tưới tiêu</option>
                  <option value="Bón phân">Bón phân</option>
                  <option value="Phun thuốc">Phun thuốc bảo vệ</option>
                  <option value="Thu hoạch">Thu hoạch</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Loại Vật Tư (Không bắt buộc)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="VD: Phân NPK, chế phẩm vi sinh"
                    value={materials}
                    onChange={e => setMaterials(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Liều Lượng / Thể tích</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="VD: 50kg, 20 Lít"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Ghi Chú & Tình Trạng Thực Tế</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  placeholder="Ghi nhận tình hình phát triển cây trồng hoặc sâu bệnh..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', gap: '8px' }}
              >
                <span>Gửi Báo Cáo Nhật Ký</span>
                <ChevronRight size={16} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
