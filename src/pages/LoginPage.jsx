import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout, { AuthLink } from '../components/auth/AuthLayout';
import { AuthField } from '../components/auth/AuthField';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registered = location.state?.registered;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      const redirect = location.state?.from?.pathname;
      if (redirect) {
        navigate(redirect, { replace: true });
      } else if (user.role === 'cooperative_admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/my-crops', { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Chào mừng trở lại"
      subtitle="Đăng nhập để tiếp tục quản lý trang trại của bạn"
      footer={
        <p>
          Chưa có tài khoản? <AuthLink to="/register">Tạo tài khoản mới</AuthLink>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {registered && (
          <div className="auth-alert auth-alert--success" role="status">
            Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.
          </div>
        )}
        {error && (
          <div className="auth-alert auth-alert--error" role="alert">
            {error}
          </div>
        )}

        <AuthField
          id="login-email"
          label="Email"
          type="email"
          icon={Mail}
          placeholder="name@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AuthField
          id="login-password"
          label="Mật khẩu"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          autoComplete="current-password"
          showToggle
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={20} className="auth-spin" />
              Đang đăng nhập...
            </>
          ) : (
            <>
              Đăng nhập
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
