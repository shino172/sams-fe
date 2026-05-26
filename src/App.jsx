import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CropManager from './components/CropManager';
import FarmingLog from './components/FarmingLog';
import { Sun, Moon, Bell, Sprout } from 'lucide-react';

// Initial Mock Data for SAMS App
const initialPlots = [
  { 
    id: 'plot-1', 
    name: 'Lô A1', 
    area: 2.5, 
    farmer: 'Nguyễn Văn Ruộng',
    mapCoords: { top: '15%', left: '10%', width: '35%', height: '35%' } 
  },
  { 
    id: 'plot-2', 
    name: 'Lô A2', 
    area: 3.2, 
    farmer: 'Lê Văn Hải',
    mapCoords: { top: '15%', left: '50%', width: '40%', height: '35%' } 
  },
  { 
    id: 'plot-3', 
    name: 'Lô B1', 
    area: 1.8, 
    farmer: 'Nguyễn Văn Ruộng',
    mapCoords: { top: '55%', left: '10%', width: '35%', height: '35%' } 
  },
  { 
    id: 'plot-4', 
    name: 'Lô A3', 
    area: 1.2, 
    farmer: 'Phạm Thị Thảo',
    mapCoords: { top: '55%', left: '50%', width: '40%', height: '35%' } 
  }
];

const initialCrops = [
  {
    id: 'crop-1',
    name: 'Vụ Lúa Đông Xuân A1 - 2026',
    cropType: 'Lúa thơm ST25',
    plotId: 'plot-1',
    plotName: 'Lô A1',
    farmer: 'Nguyễn Văn Ruộng',
    startDate: '2026-05-01',
    expectedHarvestDate: '2026-08-15',
    status: 'growing'
  },
  {
    id: 'crop-2',
    name: 'Vụ Sầu Riêng Ri6 Thử Nghiệm B1',
    cropType: 'Sầu riêng Ri6',
    plotId: 'plot-3',
    plotName: 'Lô B1',
    farmer: 'Nguyễn Văn Ruộng',
    startDate: '2025-10-10',
    expectedHarvestDate: '2026-06-20',
    status: 'flowering'
  },
  {
    id: 'crop-3',
    name: 'Mùa Cà Phê Chè A2',
    cropType: 'Cà phê Robusta',
    plotId: 'plot-2',
    plotName: 'Lô A2',
    farmer: 'Lê Văn Hải',
    startDate: '2025-06-01',
    expectedHarvestDate: '2026-05-30',
    status: 'harvesting'
  },
  {
    id: 'crop-4',
    name: 'Rau cải ngọt canh tác nhanh A3',
    cropType: 'Rau cải hữu cơ',
    plotId: 'plot-4',
    plotName: 'Lô A3',
    farmer: 'Phạm Thị Thảo',
    startDate: '2026-04-10',
    expectedHarvestDate: '2026-05-15',
    status: 'harvested'
  }
];

const initialLogs = [
  {
    id: 'log-1',
    farmer: 'Nguyễn Văn Ruộng',
    cropId: 'crop-1',
    cropName: 'Vụ Lúa Đông Xuân A1 - 2026',
    plotName: 'Lô A1',
    activity: 'Tưới tiêu',
    type: 'water',
    notes: 'Tưới phun sương định kỳ buổi sáng sớm, lượng nước đo đạt đạt chuẩn.',
    time: '06:30 - Hôm nay'
  },
  {
    id: 'log-2',
    farmer: 'Nguyễn Văn Ruộng',
    cropId: 'crop-2',
    cropName: 'Vụ Sầu Riêng Ri6 Thử Nghiệm B1',
    plotName: 'Lô B1',
    activity: 'Bón phân',
    type: 'fertilize',
    notes: 'Bón lót phân hữu cơ sinh học để nuôi hoa đợt 2. Sử dụng NPK hữu cơ.',
    time: '15:15 - Hôm qua'
  },
  {
    id: 'log-3',
    farmer: 'Lê Văn Hải',
    cropId: 'crop-3',
    cropName: 'Mùa Cà Phê Chè A2',
    plotName: 'Lô A2',
    activity: 'Phun thuốc',
    type: 'pesticide',
    notes: 'Phun chế phẩm sinh học diệt trừ nấm lá rỉ sắt giai đoạn chuẩn bị thu hoạch.',
    time: '09:00 - 24/05/2026'
  }
];

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('coop'); // 'coop' (Hợp Tác Xã) or 'farmer' (Nông Dân)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [crops, setCrops] = useState(() => {
    const savedCrops = localStorage.getItem('sams_crops');
    return savedCrops ? JSON.parse(savedCrops) : initialCrops;
  });
  const [logs, setLogs] = useState(() => {
    const savedLogs = localStorage.getItem('sams_logs');
    return savedLogs ? JSON.parse(savedLogs) : initialLogs;
  });
  const [plots] = useState(initialPlots);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sams_crops', JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem('sams_logs', JSON.stringify(logs));
  }, [logs]);

  // Dark Mode Toggle Effect
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Role toggle
  const toggleRole = () => {
    setCurrentRole(prev => prev === 'coop' ? 'farmer' : 'coop');
  };

  // Add new Crop
  const handleAddCrop = (newCrop) => {
    setCrops(prev => [newCrop, ...prev]);
    
    // Add automatic log for crop creation
    const creationLog = {
      id: 'log-auto-' + Date.now(),
      farmer: currentRole === 'coop' ? 'Hợp Tác Xã' : newCrop.farmer,
      cropId: newCrop.id,
      cropName: newCrop.name,
      plotName: newCrop.plotName,
      activity: 'Tưới tiêu', // default type
      type: 'water',
      notes: `Khởi tạo kế hoạch gieo trồng cây ${newCrop.cropType}. Kế hoạch bắt đầu từ ${newCrop.startDate}.`,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - Hôm nay'
    };
    setLogs(prev => [creationLog, ...prev]);
  };

  // Update Crop Status
  const handleUpdateCropStatus = (cropId, newStatus) => {
    setCrops(prev => prev.map(c => {
      if (c.id === cropId) {
        // Automatically add log when status updates
        const statusMap = {
          growing: 'Đang phát triển',
          flowering: 'Đang ra hoa',
          harvesting: 'Thu hoạch',
          harvested: 'Đã hoàn thành thu hoạch'
        };
        const actionLog = {
          id: 'log-update-' + Date.now(),
          farmer: currentRole === 'coop' ? 'Ban quản trị' : c.farmer,
          cropId: c.id,
          cropName: c.name,
          plotName: c.plotName,
          activity: newStatus === 'harvested' ? 'Thu hoạch' : 'Tưới tiêu',
          type: newStatus === 'harvested' ? 'harvest' : 'water',
          notes: `Chuyển trạng thái vụ mùa sang: ${statusMap[newStatus] || newStatus}`,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - Vừa xong'
        };
        setLogs(l => [actionLog, ...l]);
        
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  // Add Log
  const handleAddLog = (newLog) => {
    setLogs(prev => [newLog, ...prev]);
  };

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Tổng Quan Trang Trại';
      case 'crops': return 'Quản Lý Kế Hoạch Vụ Mùa';
      case 'logs': return 'Sổ Tay Nhật Ký Canh Tác';
      default: return 'Trang Chủ';
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Nav */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        currentRole={currentRole} 
        toggleRole={toggleRole}
      />

      {/* Main Panel */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="page-title">
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {getPageTitle()}
            </h1>
          </div>
          
          <div className="topbar-actions">
            {/* Dark Mode Toggle button */}
            <button className="theme-toggle" onClick={toggleDarkMode} title="Đổi giao diện Sáng/Tối">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notification button (Simulation) */}
            <button className="theme-toggle" style={{ position: 'relative' }} title="Thông báo">
              <Bell size={20} />
              <span style={{ 
                position: 'absolute', 
                top: '6px', 
                right: '6px', 
                width: '10px', 
                height: '10px', 
                backgroundColor: 'var(--danger)', 
                borderRadius: '50%',
                border: '2px solid var(--bg-card)'
              }}></span>
            </button>

            <button 
              className="quick-action-btn"
              onClick={() => setCurrentTab(currentTab === 'logs' ? 'crops' : 'logs')}
            >
              <Sprout size={18} />
              <span>{currentTab === 'logs' ? 'Quản lý Mùa vụ' : 'Ghi chép Nhật ký'}</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <section className="content-body">
          {currentTab === 'dashboard' && (
            <Dashboard 
              crops={crops} 
              logs={logs} 
              currentRole={currentRole}
              plots={plots}
            />
          )}
          {currentTab === 'crops' && (
            <CropManager 
              crops={crops} 
              onAddCrop={handleAddCrop} 
              onUpdateCropStatus={handleUpdateCropStatus}
              plots={plots}
              currentRole={currentRole}
            />
          )}
          {currentTab === 'logs' && (
            <FarmingLog 
              logs={logs} 
              crops={crops} 
              onAddLog={handleAddLog}
              currentRole={currentRole}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
