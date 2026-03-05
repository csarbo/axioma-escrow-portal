import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, TrendingUp, FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import { formatMXN, formatUSD, CaseStatus, getRequiredDocs } from '@/types/case';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function OpsDashboard() {
  const { cases, updateCaseStatus, addTimelineEvent, validateDocument } = useApp();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'ALL'>('ALL');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const totalEscrow = cases.filter(c => c.status === 'IN_ESCROW').reduce((s, c) => s + c.montoMxn, 0);
  const totalEscrowUsd = cases.filter(c => c.status === 'IN_ESCROW').reduce((s, c) => s + c.montoUsd, 0);
  const activeCases = cases.filter(c => !['RELEASED', 'CANCELLED'].includes(c.status)).length;
  const pendingDocs = cases.reduce((count, c) => {
    return count + c.documents.filter(d => d.status === 'UPLOADED').length;
  }, 0);
  const completados = cases.filter(c => c.status === 'RELEASED').length;

  const filtered = statusFilter === 'ALL' ? cases : cases.filter(c => c.status === statusFilter);

  const doAction = (caseId: string, action: () => void) => {
    setLoadingAction(caseId);
    setTimeout(() => { action(); setLoadingAction(null); }, 1200);
  };

  const confirmSpei = (caseId: string) => {
    doAction(caseId, () => {
      updateCaseStatus(caseId, 'IN_ESCROW');
      addTimelineEvent(caseId, { date: new Date().toISOString().replace('T', ' ').substring(0, 16), event: 'SPEI confirmado por Axioma — Garantía activada', icon: '🔒' });
      toast({ title: 'SPEI confirmado', description: 'Garantía activada correctamente.' });
    });
  };

  const executePayment = (c: typeof cases[0]) => {
    doAction(c.id, () => {
      updateCaseStatus(c.id, 'RELEASED');
      addTimelineEvent(c.id, { date: new Date().toISOString().replace('T', ' ').substring(0, 16), event: `Pago ejecutado — ${formatUSD(c.montoUsd)} enviados a ${c.sellerCountry}`, icon: '✓' });
      toast({ title: 'Pago ejecutado', description: `${formatUSD(c.montoUsd)} enviados al vendedor.` });
    });
  };

  const getDocCount = (c: typeof cases[0]) => {
    const req = getRequiredDocs(c.incoterm).length;
    const done = c.documents.filter(d => ['UPLOADED', 'VALIDATED'].includes(d.status)).length;
    return { done, total: req };
  };

  const statuses: (CaseStatus | 'ALL')[] = ['ALL', 'AWAITING_FUNDING', 'IN_ESCROW', 'READY_TO_RELEASE', 'RELEASED', 'DISPUTE_OPEN'];

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6">Panel de Operaciones</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total en garantía', value: formatMXN(totalEscrow), sub: formatUSD(totalEscrowUsd), icon: Shield, color: 'text-status-escrow' },
          { label: 'Casos activos', value: activeCases.toString(), icon: TrendingUp, color: 'text-accent' },
          { label: 'Docs pendientes', value: pendingDocs.toString(), icon: FileText, color: 'text-status-funding', badge: pendingDocs > 0 },
          { label: 'Completados', value: completados.toString(), icon: CheckCircle2, color: 'text-status-released' },
        ].map(m => (
          <Card key={m.label} className="shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <m.icon className={`h-5 w-5 ${m.color}`} />
                {m.badge && <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />}
              </div>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              {m.sub && <p className="text-xs text-muted-foreground">{m.sub}</p>}
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {statuses.map(s => (
          <Button key={s} variant={statusFilter === s ? 'default' : 'outline'} size="sm"
            onClick={() => setStatusFilter(s)} className={statusFilter === s ? 'gradient-gold text-white' : ''}>
            {s === 'ALL' ? 'Todos' : s.replace(/_/g, ' ').toLowerCase()}
          </Button>
        ))}
      </div>

      <Card className="shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Folio</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Comprador</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Vendedor</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Monto</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Docs</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Estado</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const docs = getDocCount(c);
                const isException = c.status === 'EXCEPTION' || c.status === 'DISPUTE_OPEN';
                return (
                  <tr key={c.id} className={`border-b border-border hover:bg-muted/30 transition-colors ${isException ? 'bg-destructive/5' : ''}`}>
                    <td className="p-3 font-mono font-medium">
                      <Link to={`/cases/${c.id}`} className="text-accent hover:underline">{c.id}</Link>
                    </td>
                    <td className="p-3 text-foreground">{c.buyer}</td>
                    <td className="p-3 text-foreground">{c.seller}</td>
                    <td className="p-3 text-right">
                      <span className="font-medium text-foreground">{formatMXN(c.montoMxn)}</span>
                      <br /><span className="text-xs text-muted-foreground">{formatUSD(c.montoUsd)}</span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${docs.done === docs.total ? 'bg-status-released/20 text-status-released' : 'bg-muted text-muted-foreground'}`}>
                        {docs.done}/{docs.total} docs
                      </span>
                    </td>
                    <td className="p-3"><StatusBadge status={c.status} /></td>
                    <td className="p-3 space-x-1">
                      {c.status === 'AWAITING_FUNDING' && (
                        <Button size="sm" variant="outline" onClick={() => confirmSpei(c.id)} disabled={loadingAction === c.id} className="text-xs">
                          {loadingAction === c.id ? '...' : 'Confirmar SPEI'}
                        </Button>
                      )}
                      {c.status === 'IN_ESCROW' && c.documents.some(d => d.status === 'UPLOADED') && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-xs">Validar docs</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Validar documentos — {c.id}</DialogTitle>
                              <DialogDescription>Revisa y aprueba o rechaza cada documento.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3">
                              {c.documents.filter(d => d.status === 'UPLOADED').map(d => (
                                <div key={d.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">{d.name}</p>
                                      <p className="text-xs text-muted-foreground">{d.type}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button size="sm" variant="outline" className="text-xs text-status-released border-status-released/30"
                                      onClick={() => { validateDocument(c.id, d.id, true); toast({ title: 'Documento aprobado' }); }}>
                                      ✓ Aprobar
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-xs text-destructive border-destructive/30"
                                      onClick={() => { validateDocument(c.id, d.id, false); toast({ title: 'Documento rechazado' }); }}>
                                      ✗ Rechazar
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      {c.status === 'READY_TO_RELEASE' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="text-xs">
                              Ejecutar pago {formatUSD(c.montoUsd)}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Ejecutar pago?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Se enviarán {formatUSD(c.montoUsd)} al vendedor ({c.seller}). Esta acción es irreversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => executePayment(c)} className="bg-destructive text-white">
                                Confirmar pago
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  );
}
