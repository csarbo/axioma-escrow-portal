import { Link } from 'react-router-dom';
import { Plus, Briefcase, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { AmountDisplay } from '@/components/AmountDisplay';
import { mockCases, formatDateMX, formatCurrency } from '@/data/mock';

export default function Dashboard() {
  const activeCases = mockCases.filter(c => !['RELEASED', 'CANCELLED'].includes(c.status));
  const totalInEscrow = activeCases.reduce((sum, c) => sum + c.amountUSD, 0);
  const totalInEscrowMXN = activeCases.reduce((sum, c) => sum + c.amountMXN, 0);
  const pendingAction = mockCases.filter(c =>
    ['AWAITING_ACCEPTANCE', 'AWAITING_FUNDING_USDC', 'READY_TO_RELEASE'].includes(c.status)
  ).length;

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Portal del Cliente</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestiona tus casos de escrow</p>
        </div>
        <Link to="/cases/new">
          <Button className="gradient-gold text-white font-semibold hover:opacity-90 transition-all rounded-xl shadow-glow">
            <Plus className="h-4 w-4 mr-1.5" />
            Nuevo Caso de Escrow
          </Button>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50 rounded-2xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent/15 transition-colors">
                <Briefcase className="h-5 w-5 text-accent" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/40" />
            </div>
            <p className="text-3xl font-bold text-foreground tracking-tight">{activeCases.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Casos activos</p>
          </CardContent>
        </Card>
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50 rounded-2xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent/15 transition-colors">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/40" />
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{formatCurrency(totalInEscrow, 'USD')}</p>
            <p className="text-sm text-muted-foreground mt-1">≈ {formatCurrency(totalInEscrowMXN, 'MXN')} en escrow</p>
          </CardContent>
        </Card>
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50 rounded-2xl overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent/15 transition-colors">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/40" />
            </div>
            <p className="text-3xl font-bold text-foreground tracking-tight">{pendingAction}</p>
            <p className="text-sm text-muted-foreground mt-1">Pendientes de acción</p>
          </CardContent>
        </Card>
      </div>

      {/* Cases List */}
      <Card className="shadow-card border-border/50 rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Mis Casos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockCases.map((c, i) => (
              <Link
                key={c.id}
                to={`/cases/${c.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/50 hover:shadow-card-hover hover:border-accent/20 transition-all duration-300 animate-fade-in group"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">{c.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Contraparte: {c.seller.company} — {formatDateMX(c.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <AmountDisplay amountUSD={c.amountUSD} amountMXN={c.amountMXN} />
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-accent transition-colors hidden sm:block" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
