import React from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  FileText, 
  Users, 
  Layers, 
  Moon, 
  Sun, 
  ArrowRightLeft 
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  currentRole, 
  toggleRole, 
  isDarkMode, 
  toggleDarkMode 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crops', label: 'Quản Lý Vụ Mùa', icon: Sprout },
    { id: 'logs', label: 'Nhật Ký Canh Tác', icon: FileText },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Sprout size={24} />
        </div>
        <div className="brand-text">
          <h2>SAMS</h2>
          <p>Nông Nghiệp Số Hiện Đại</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button 
          onClick={toggleRole} 
          className="btn btn-secondary" 
          style={{ 
            width: '100%', 
            fontSize: '0.85rem', 
            padding: '10px', 
            justifyContent: 'flex-start',
            gap: '10px'
          }}
        >
          <ArrowRightLeft size={16} />
          <span>Vai trò: <strong>{currentRole === 'coop' ? 'Hợp Tác Xã' : 'Nông Dân'}</strong></span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            {currentRole === 'coop' ? 'HTX' : 'ND'}
          </div>
          <div className="user-info">
            <h4>{currentRole === 'coop' ? 'Trần Quốc Bảo' : 'Nguyễn Văn Ruộng'}</h4>
            <p>{currentRole === 'coop' ? 'Quản lý HTX' : 'Hộ canh tác số 04'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
