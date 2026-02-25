import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, AlertTriangle, TrendingUp, CheckCircle, Search, Filter, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { mockCases, formatDateMX, formatCurrency } from '@/data/mock';
import { CaseStatus, STATUS_CONFIG } from '@/types/case';

export default function OpsDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = mockCases.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCases = mockCases.filter(c => !['RELEASED', 'CANCELLED'].includes(c.status));
  const totalInEscrow = activeCases.reduce((s, c) => s + c.amountUSD, 0);
  const disputeCases = mockCases.filter(c => ['DISPUTE_OPEN', 'ARBITRATION_PENDING'].includes(c.status));
  const releasedThisMonth = mockCases.filter(c => c.status === 'RELEASED');
  const exceptionCases = mockCases.filter(c => c.status === 'EXCEPTION');

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Panel de Operaciones</h1>
        <p className="text-sm text-muted-foreground mt-1">Vista general de todos los casos</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50 rounded-2xl group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent/15 transition-colors">
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <p className="text-xl font-bold text-foreground">{formatCurrency(totalInEscrow, 'USD')}</p>
            <p className="text-xs text-muted-foreground mt-1">Total en escrow</p>
          </CardContent>
        </Card>
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50 rounded-2xl group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent/15 transition-colors">
                <Briefcase className="h-4 w-4 text-accent" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <p className="text-xl font-bold text-foreground">{activeCases.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Casos activos</p>
          </CardContent>
        </Card>
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50 rounded-2xl group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <p className="text-xl font-bold text-foreground">{disputeCases.length}</p>
            <p className="text-xs text-muted-foreground mt-1">En disputa</p>
          </CardContent>
        </Card>
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-border/50 rounded-2xl group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-released/10">
                <CheckCircle className="h-4 w-4 text-status-released" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <p className="text-xl font-bold text-foreground">{releasedThisMonth.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Liberados</p>
          </CardContent>
        </Card>
      </div>

      {/* Exception Alert */}
      {exceptionCases.length > 0 && (
        <Card className="mb-6 border-destructive/20 bg-destructive/5 rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10 shrink-0">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-sm font-medium text-destructive">
              {exceptionCases.length} caso(s) en estado de excepción requieren atención inmediata
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="shadow-card border-border/50 rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-lg font-semibold">Todos los Casos</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID o título..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm rounded-xl"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 h-9 text-sm rounded-xl">
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-sm text-muted-foreground">
              No se encontraron casos con los filtros aplicados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-left">
                    <th className="pb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">ID</th>
                    <th className="pb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Comprador</th>
                    <th className="pb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Vendedor</th>
                    <th className="pb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Monto</th>
                    <th className="pb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Estado</th>
                    <th className="pb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Fecha</th>
                    <th className="pb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`border-b border-border/30 last:border-0 animate-fade-in hover:bg-muted/50 transition-colors ${
                        ['DISPUTE_OPEN', 'EXCEPTION'].includes(c.status) ? 'bg-destructive/5' : ''
                      }`}
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <td className="py-3.5 font-mono text-xs">{c.id}</td>
                      <td className="py-3.5">{c.buyer.company}</td>
                      <td className="py-3.5">{c.seller.company}</td>
                      <td className="py-3.5 font-medium">{formatCurrency(c.amountUSD, 'USD')}</td>
                      <td className="py-3.5"><StatusBadge status={c.status} size="sm" /></td>
                      <td className="py-3.5 text-muted-foreground">{formatDateMX(c.createdAt)}</td>
                      <td className="py-3.5">
                        <Link to={`/cases/${c.id}`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg">Ver</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
