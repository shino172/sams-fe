import { Link } from 'react-router-dom';
import { Sprout, Leaf, BarChart3, Shield } from 'lucide-react';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="auth-brand-logo">
            <Sprout size={36} strokeWidth={2.2} />
          </div>
          <h1 className="auth-brand-title">SAMS</h1>
          <p className="auth-brand-tagline">Smart Agricultural Management System</p>
          <p className="auth-brand-desc">
            Quản lý vụ mùa, nhật ký canh tác và báo cáo nông nghiệp thông minh cho hợp tác xã và nông dân.
          </p>
          <ul className="auth-features">
            <li>
              <span className="auth-feature-icon"><Leaf size={18} /></span>
              Theo dõi vụ mùa & lô đất theo thời gian thực
            </li>
            <li>
              <span className="auth-feature-icon"><BarChart3 size={18} /></span>
              Dashboard & báo cáo tổng hợp cho HTX
            </li>
            <li>
              <span className="auth-feature-icon"><Shield size={18} /></span>
              Phân quyền an toàn: quản trị & nông dân
            </li>
          </ul>
        </div>
        <div className="auth-brand-pattern" aria-hidden="true" />
      </div>

      <div className="auth-panel">
        <div className="auth-panel-inner">
          <div className="auth-mobile-logo">
            <Sprout size={28} />
            <span>SAMS</span>
          </div>
          <div className="auth-header">
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {children}
          {footer && <div className="auth-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export function AuthLink({ to, children }) {
  return (
    <Link to={to} className="auth-link">
      {children}
    </Link>
  );
}
