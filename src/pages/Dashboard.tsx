import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Clock, CheckCircle2, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import { formatMXN, formatUSD, formatDateMX } from '@/types/case';

export default function Dashboard() {
  const { cases, currentUser } = useApp();

  const activeCases = cases.filter(c => !['RELEASED', 'CANCELLED'].includes(c.status));
  const totalEnGarantia = cases.filter(c => c.status === 'IN_ESCROW').reduce((s, c) => s + c.montoMxn, 0);
  const pendientes = cases.filter(c => ['AWAITING_FUNDING', 'AWAITING_ACCEPTANCE'].includes(c.status)).length;
  const completados = cases.filter(c => c.status === 'RELEASED').length;

  const metrics = [
    { label: 'Total en garantía', value: formatMXN(totalEnGarantia), icon: Shield, color: 'text-status-escrow' },
    { label: 'Casos activos', value: activeCases.length.toString(), icon: TrendingUp, color: 'text-accent' },
    { label: 'Pendientes de acción', value: pendientes.toString(), icon: Clock, color: 'text-status-funding', badge: pendientes > 0 },
    { label: 'Completados', value: completados.toString(), icon: CheckCircle2, color: 'text-status-released' },
  ];

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis Garantías</h1>
          <p className="text-sm text-muted-foreground">Bienvenido, {currentUser?.name}</p>
        </div>
        <Link to="/cases/new">
          <Button className="gradient-gold text-white font-semibold hover:opacity-90 shadow-glow">
            <Plus className="h-4 w-4 mr-1.5" /> Nueva Garantía
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map(m => (
          <Card key={m.label} className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <m.icon className={`h-5 w-5 ${m.color}`} />
                {m.badge && <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />}
              </div>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Folio</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Vendedor</th>
                <th className="text-left p-3 font-medium text-muted-foreground">País</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Monto MXN</th>
                <th className="text-right p-3 font-medium text-muted-foreground">USD</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Incoterm</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Estado</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Fecha</th>
                <th className="text-left p-3 font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {cases.map(c => (
                <tr key={c.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono font-medium text-foreground">{c.id}</td>
                  <td className="p-3 text-foreground">{c.seller}</td>
                  <td className="p-3 text-muted-foreground">{c.sellerCountry}</td>
                  <td className="p-3 text-right font-medium text-foreground">{formatMXN(c.montoMxn)}</td>
                  <td className="p-3 text-right text-muted-foreground">{formatUSD(c.montoUsd)}</td>
                  <td className="p-3"><span className="px-2 py-0.5 bg-muted rounded text-xs font-medium">{c.incoterm}</span></td>
                  <td className="p-3"><StatusBadge status={c.status} /></td>
                  <td className="p-3 text-muted-foreground text-xs">{formatDateMX(c.createdAt)}</td>
                  <td className="p-3">
                    <Link to={`/cases/${c.id}`}>
                      <Button variant="ghost" size="sm" className="text-xs">Ver →</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  );
}
