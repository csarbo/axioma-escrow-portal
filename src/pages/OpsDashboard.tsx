import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, AlertTriangle, TrendingUp, CheckCircle, Search, Filter } from 'lucide-react';
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Panel de Operaciones</h1>
        <p className="text-sm text-muted-foreground">Vista general de todos los casos</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                <TrendingUp className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{formatCurrency(totalInEscrow, 'USD')}</p>
                <p className="text-xs text-muted-foreground">Total en escrow</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                <Briefcase className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{activeCases.length}</p>
                <p className="text-xs text-muted-foreground">Casos activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{disputeCases.length}</p>
                <p className="text-xs text-muted-foreground">En disputa</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-status-released/10">
                <CheckCircle className="h-4 w-4 text-status-released" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{releasedThisMonth.length}</p>
                <p className="text-xs text-muted-foreground">Liberados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exception Alert */}
      {exceptionCases.length > 0 && (
        <Card className="shadow-card mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm font-medium text-destructive">
              {exceptionCases.length} caso(s) en estado de excepción requieren atención inmediata
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-lg">Todos los Casos</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID o título..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 h-9 text-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 h-9 text-sm">
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
            <div className="text-center py-12 text-sm text-muted-foreground">
              No se encontraron casos con los filtros aplicados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted-foreground">ID</th>
                    <th className="pb-3 font-medium text-muted-foreground">Comprador</th>
                    <th className="pb-3 font-medium text-muted-foreground">Vendedor</th>
                    <th className="pb-3 font-medium text-muted-foreground">Monto</th>
                    <th className="pb-3 font-medium text-muted-foreground">Estado</th>
                    <th className="pb-3 font-medium text-muted-foreground">Fecha</th>
                    <th className="pb-3 font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr
                      key={c.id}
                      className={`border-b border-border last:border-0 animate-fade-in ${
                        ['DISPUTE_OPEN', 'EXCEPTION'].includes(c.status) ? 'bg-destructive/5' : ''
                      }`}
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <td className="py-3 font-mono text-xs">{c.id}</td>
                      <td className="py-3">{c.buyer.company}</td>
                      <td className="py-3">{c.seller.company}</td>
                      <td className="py-3 font-medium">{formatCurrency(c.amountUSD, 'USD')}</td>
                      <td className="py-3"><StatusBadge status={c.status} size="sm" /></td>
                      <td className="py-3 text-muted-foreground">{formatDateMX(c.createdAt)}</td>
                      <td className="py-3">
                        <Link to={`/cases/${c.id}`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs">Ver</Button>
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
