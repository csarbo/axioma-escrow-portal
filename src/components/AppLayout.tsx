import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockUser } from '@/data/mock';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isOps = location.pathname.startsWith('/ops');

  return (
    <div className="min-h-screen bg-background dot-pattern">
      {/* Header */}
      <header className="glass-dark border-b border-white/10 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 group-hover:bg-accent/30 transition-colors">
              <Shield className="h-5 w-5 text-gold" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Axioma <span className="text-gold">Escrow</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className={`text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all ${location.pathname === '/dashboard' ? 'bg-white/10 text-white' : ''}`}
              >
                <LayoutDashboard className="h-4 w-4 mr-1.5" />
                Portal
              </Button>
            </Link>
            <Link to="/ops">
              <Button
                variant="ghost"
                size="sm"
                className={`text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all ${isOps ? 'bg-white/10 text-white' : ''}`}
              >
                <Settings className="h-4 w-4 mr-1.5" />
                Operaciones
              </Button>
            </Link>
            <div className="ml-3 pl-3 border-l border-white/10 flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-white">{mockUser.name}</p>
                <p className="text-xs text-white/40">{mockUser.company}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/40 hover:text-white hover:bg-white/10 rounded-xl"
                onClick={() => navigate('/')}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="container py-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
