import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const PAGE_META = {
  '/dashboard': {
    title: 'Tổng quan trang trại',
  },
  '/farmers': {
    title: 'Quản lý nông dân',
  },
  '/fields': {
    title: 'Quản lý lô đất',
  },
  '/crop-seasons': {
    title: 'Quản lý vụ mùa',
  },
  '/my-crops': {
    title: 'Vụ mùa của tôi',
  },
  '/logs': {
    title: 'Nhật ký canh tác',
  },
  '/schedule': {
    title: 'Lịch canh tác',
  },
  '/reports': {
    title: 'Báo cáo & phân tích',
  },
};

export default function AppLayout() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const baseMeta = PAGE_META[location.pathname] || { title: 'SAMS' };
  const [headerMeta, setHeaderMeta] = useState(baseMeta);
  const [headerAction, setHeaderAction] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [sidePanelVariant, setSidePanelVariant] = useState('default');
  const [sidePanelRoot, setSidePanelRoot] = useState(null);

  useEffect(() => {
    if (user?.role === 'cooperative_admin' && profile === null) {
      navigate('/cooperative/setup');
    }
  }, [user, profile, navigate]);

  useEffect(() => {
    setHeaderMeta(baseMeta);
    setHeaderAction(null);
    setSidePanelOpen(false);
    setSidePanelVariant('default');
  }, [baseMeta.title, location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const role = user?.role === 'farmer' ? 'farmer' : 'cooperative_admin';
  const handleSidePanelRef = useCallback((node) => {
    setSidePanelRoot(node);
  }, []);
  const outletContext = useMemo(
    () => ({
      setHeaderMeta,
      setHeaderAction,
      sidePanelRoot,
      openSidePanel: (variant = 'default') => {
        setSidePanelVariant(variant);
        setSidePanelOpen(true);
      },
      closeSidePanel: () => {
        setSidePanelOpen(false);
        setSidePanelVariant('default');
      },
    }),
    [sidePanelRoot]
  );

  return (
    <div className="app-container">
      <Sidebar role={role} userName={user?.fullName || ''} onLogout={handleLogout} />
      <div className={`workspace-shell ${sidePanelOpen ? 'has-side-panel' : ''}`}>
        <main className="main-content">
          <header className="topbar">
            <div className="page-title">
              <h1>{headerMeta.title}</h1>
            </div>
            <div className="topbar-actions">
              {headerAction}
            </div>
          </header>
          <section className="content-body">
            <Outlet context={outletContext} />
          </section>
        </main>
        <aside
          ref={handleSidePanelRef}
          className={`workspace-side-panel ${sidePanelVariant === 'wide' ? 'workspace-side-panel--wide' : ''} ${sidePanelOpen ? 'is-open' : ''}`}
        />
      </div>
    </div>
  );
}
