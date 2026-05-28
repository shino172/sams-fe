import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  FileText,
  Users,
  Layers,
  BarChart3,
  Calendar,
  LogOut,
} from 'lucide-react';

export default function Sidebar({ role, userName, onLogout }) {
  const coopItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/farmers', label: 'Nông dân', icon: Users },
    { to: '/fields', label: 'Lô đất', icon: Layers },
    { to: '/crop-seasons', label: 'Vụ mùa', icon: Sprout },
    { to: '/logs', label: 'Nhật ký', icon: FileText },
    { to: '/reports', label: 'Báo cáo', icon: BarChart3 },
  ];

  const farmerItems = [
    { to: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { to: '/my-crops', label: 'Vụ mùa của tôi', icon: Sprout },
    { to: '/logs', label: 'Nhật ký', icon: FileText },
    { to: '/schedule', label: 'Lịch trình', icon: Calendar },
  ];

  const navItems = role === 'cooperative_admin' ? coopItems : farmerItems;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Sprout size={24} />
        </div>
        <div className="brand-text">
          <h2>SAMS</h2>
          <p>Nông Nghiệp Số</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">{role === 'cooperative_admin' ? 'HTX' : 'ND'}</div>
          <div className="user-info">
            <h4>{userName}</h4>
            <p>{role === 'cooperative_admin' ? 'Quản lý HTX' : 'Nông dân'}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="btn btn-secondary"
          style={{ width: '100%', marginTop: 12, justifyContent: 'flex-start', gap: 8 }}
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
