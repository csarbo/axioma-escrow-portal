import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useApp();
  const isOps = location.pathname.startsWith('/ops');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-navy border-b border-white/10 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link to={currentUser?.role === 'OPS' ? '/ops' : '/dashboard'} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 group-hover:bg-accent/30 transition-colors">
              <Shield className="h-5 w-5 text-gold" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Axioma <span className="text-gold">Escrow</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {currentUser?.role !== 'SELLER' && (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm"
                  className={`text-white/60 hover:text-white hover:bg-white/10 rounded-xl ${location.pathname === '/dashboard' ? 'bg-white/10 text-white' : ''}`}>
                  <LayoutDashboard className="h-4 w-4 mr-1.5" /> Portal
                </Button>
              </Link>
            )}
            {currentUser?.role === 'OPS' && (
              <Link to="/ops">
                <Button variant="ghost" size="sm"
                  className={`text-white/60 hover:text-white hover:bg-white/10 rounded-xl ${isOps ? 'bg-white/10 text-white' : ''}`}>
                  <Settings className="h-4 w-4 mr-1.5" /> Operaciones
                </Button>
              </Link>
            )}
            <div className="ml-3 pl-3 border-l border-white/10 flex items-center gap-3">
              {currentUser && (
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium text-white">{currentUser.name}</p>
                  <p className="text-xs text-white/40">{currentUser.company}</p>
                </div>
              )}
              <Button variant="ghost" size="sm" className="text-white/40 hover:text-white hover:bg-white/10 rounded-xl" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="container py-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
