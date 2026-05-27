import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Loader2, ArrowRight } from 'lucide-react';
import AuthLayout, { AuthLink } from '../components/auth/AuthLayout';
import { AuthField, RoleSelector } from '../components/auth/AuthField';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'cooperative_admin',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Đăng ký thất bại');
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Tạo tài khoản"
      subtitle="Bắt đầu số hóa quy trình canh tác nông nghiệp"
      footer={
        <p>
          Đã có tài khoản? <AuthLink to="/login">Đăng nhập</AuthLink>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="auth-alert auth-alert--error" role="alert">
            {error}
          </div>
        )}

        <RoleSelector value={form.role} onChange={(role) => update('role', role)} />

        <AuthField
          id="register-name"
          label="Họ và tên"
          type="text"
          icon={User}
          placeholder="Nguyễn Văn A"
          autoComplete="name"
          value={form.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          required
        />

        <AuthField
          id="register-email"
          label="Email"
          type="email"
          icon={Mail}
          placeholder="name@example.com"
          autoComplete="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          required
        />

        <AuthField
          id="register-phone"
          label="Số điện thoại"
          type="tel"
          icon={Phone}
          placeholder="0901234567"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          hint="Không bắt buộc"
        />

        <AuthField
          id="register-password"
          label="Mật khẩu"
          type="password"
          icon={Lock}
          placeholder="Tối thiểu 6 ký tự"
          autoComplete="new-password"
          showToggle
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          required
        />

        {form.role === 'farmer' && (
          <div className="auth-alert auth-alert--info">
            Tài khoản nông dân cần được quản trị HTX liên kết hồ sơ sau khi đăng ký.
          </div>
        )}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={20} className="auth-spin" />
              Đang tạo tài khoản...
            </>
          ) : (
            <>
              Đăng ký
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
