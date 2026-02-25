import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Settings, LogOut, Plus } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-navy border-b border-navy-light sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
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
                className={`text-white/70 hover:text-white hover:bg-white/10 ${location.pathname === '/dashboard' ? 'bg-white/10 text-white' : ''}`}
              >
                <LayoutDashboard className="h-4 w-4 mr-1.5" />
                Portal
              </Button>
            </Link>
            <Link to="/ops">
              <Button
                variant="ghost"
                size="sm"
                className={`text-white/70 hover:text-white hover:bg-white/10 ${isOps ? 'bg-white/10 text-white' : ''}`}
              >
                <Settings className="h-4 w-4 mr-1.5" />
                Operaciones
              </Button>
            </Link>
            <div className="ml-3 pl-3 border-l border-white/20 flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-white">{mockUser.name}</p>
                <p className="text-xs text-white/50">{mockUser.company}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/50 hover:text-white hover:bg-white/10"
                onClick={() => navigate('/')}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="container py-6 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
