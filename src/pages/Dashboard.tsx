import { Link } from 'react-router-dom';
import { Plus, Briefcase, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Portal del Cliente</h1>
          <p className="text-sm text-muted-foreground">Gestiona tus casos de escrow</p>
        </div>
        <Link to="/cases/new">
          <Button className="gradient-gold text-primary font-semibold hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4 mr-1.5" />
            Nuevo Caso de Escrow
          </Button>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Briefcase className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeCases.length}</p>
                <p className="text-xs text-muted-foreground">Casos activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{formatCurrency(totalInEscrow, 'USD')}</p>
                <p className="text-xs text-muted-foreground">≈ {formatCurrency(totalInEscrowMXN, 'MXN')} en escrow</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingAction}</p>
                <p className="text-xs text-muted-foreground">Pendientes de acción</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cases List */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Mis Casos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockCases.map((c, i) => (
              <Link
                key={c.id}
                to={`/cases/${c.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border hover:shadow-card-hover hover:border-accent/30 transition-all animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Contraparte: {c.seller.company} — {formatDateMX(c.createdAt)}
                  </p>
                </div>
                <AmountDisplay amountUSD={c.amountUSD} amountMXN={c.amountMXN} />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
