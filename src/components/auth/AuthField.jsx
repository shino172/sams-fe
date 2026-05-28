import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function AuthField({
  label,
  type = 'text',
  icon: Icon,
  error,
  hint,
  showToggle,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showToggle && visible ? 'text' : type;

  return (
    <div className={`auth-field ${error ? 'auth-field--error' : ''}`}>
      <label className="auth-field-label" htmlFor={props.id}>
        {label}
      </label>
      <div className="auth-field-control">
        {Icon && (
          <span className="auth-field-icon" aria-hidden="true">
            <Icon size={18} />
          </span>
        )}
        <input
          {...props}
          type={inputType}
          className="auth-field-input"
          autoComplete={props.autoComplete}
        />
        {isPassword && showToggle && (
          <button
            type="button"
            className="auth-field-toggle"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {hint && !error && <p className="auth-field-hint">{hint}</p>}
      {error && <p className="auth-field-error">{error}</p>}
    </div>
  );
}

export function RoleSelector({ value, onChange }) {
  const roles = [
    {
      id: 'cooperative_admin',
      title: 'Quản trị HTX',
      desc: 'Dashboard, quản lý nông dân & báo cáo',
    },
    {
      id: 'farmer',
      title: 'Nông dân',
      desc: 'Vụ mùa, nhật ký & lịch canh tác',
    },
  ];

  return (
    <div className="auth-field">
      <span className="auth-field-label">Vai trò tài khoản</span>
      <div className="auth-role-grid">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            className={`auth-role-card ${value === role.id ? 'auth-role-card--active' : ''}`}
            onClick={() => onChange(role.id)}
          >
            <span className="auth-role-card-title">{role.title}</span>
            <span className="auth-role-card-desc">{role.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
