import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, ExternalLink, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { AmountDisplay } from '@/components/AmountDisplay';
import { CaseTimeline } from '@/components/CaseTimeline';
import { mockCases, mockEvents, mockDocuments, mockXrplTxs, mockPspEntries, formatDateMX, formatCurrency } from '@/data/mock';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const caseData = mockCases.find(c => c.id === id);
  if (!caseData) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Caso no encontrado</p>
          <Button variant="outline" className="mt-4 rounded-xl" onClick={() => navigate('/dashboard')}>Volver al dashboard</Button>
        </div>
      </AppLayout>
    );
  }

  const handleAction = (action: string) => {
    setActionLoading(action);
    setTimeout(() => setActionLoading(null), 1500);
  };

  return (
    <AppLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Regresar
      </button>

      {/* Case Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono text-muted-foreground">{caseData.id}</span>
            <StatusBadge status={caseData.status} size="lg" />
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">{caseData.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{caseData.description}</p>
        </div>
        <AmountDisplay amountUSD={caseData.amountUSD} amountMXN={caseData.amountMXN} size="lg" />
      </div>

      {/* Parties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <Card className="shadow-card border-border/50 rounded-2xl hover:shadow-card-hover transition-all duration-300">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Comprador</p>
            <p className="text-sm font-semibold text-foreground">{caseData.buyer.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{caseData.buyer.company}</p>
            <p className="text-xs text-muted-foreground">{caseData.buyer.email}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border/50 rounded-2xl hover:shadow-card-hover transition-all duration-300">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Vendedor</p>
            <p className="text-sm font-semibold text-foreground">{caseData.seller.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{caseData.seller.company}</p>
            <p className="text-xs text-muted-foreground">{caseData.seller.email}</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      {caseData.status === 'AWAITING_ACCEPTANCE' && (
        <Card className="mb-6 border-status-awaiting/20 bg-status-awaiting/5 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <p className="text-sm font-medium">Este caso espera aceptación de la contraparte</p>
            <Button onClick={() => handleAction('accept')} disabled={actionLoading === 'accept'} className="gradient-gold text-white font-semibold hover:opacity-90 rounded-xl shadow-glow">
              {actionLoading === 'accept' ? 'Procesando...' : 'Aceptar términos'}
            </Button>
          </CardContent>
        </Card>
      )}
      {caseData.status === 'AWAITING_FUNDING_USDC' && (
        <Card className="mb-6 border-status-funding/20 bg-status-funding/5 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <p className="text-sm font-medium">Se requiere confirmar el fondeo USDC</p>
            <Button onClick={() => handleAction('fund')} disabled={actionLoading === 'fund'} className="gradient-gold text-white font-semibold hover:opacity-90 rounded-xl shadow-glow">
              {actionLoading === 'fund' ? 'Procesando...' : 'Confirmar fondeo USDC'}
            </Button>
          </CardContent>
        </Card>
      )}
      {caseData.status === 'IN_ESCROW' && (
        <Card className="mb-6 border-status-dispute/20 bg-status-dispute/5 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <p className="text-sm font-medium">Fondos en escrow — puedes abrir una disputa si es necesario</p>
            <Button variant="destructive" onClick={() => setDisputeOpen(true)} className="rounded-xl">
              <AlertTriangle className="h-4 w-4 mr-1.5" /> Abrir disputa
            </Button>
          </CardContent>
        </Card>
      )}
      {caseData.status === 'READY_TO_RELEASE' && (
        <Card className="mb-6 border-status-ready/20 bg-status-ready/5 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <p className="text-sm font-medium">Caso listo para liquidación</p>
            <Button onClick={() => handleAction('release')} disabled={actionLoading === 'release'} className="gradient-gold text-white font-semibold hover:opacity-90 rounded-xl shadow-glow">
              {actionLoading === 'release' ? 'Ejecutando...' : 'Ejecutar liquidación'}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <Card className="shadow-card border-border/50 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Historial del caso</CardTitle>
          </CardHeader>
          <CardContent>
            <CaseTimeline events={mockEvents} />
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="shadow-card border-border/50 rounded-2xl">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Documentos</CardTitle>
            <Button variant="outline" size="sm" className="rounded-lg">
              <Upload className="h-3.5 w-3.5 mr-1.5" /> Subir
            </Button>
          </CardHeader>
          <CardContent>
            {mockDocuments.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                Sin documentos
              </div>
            ) : (
              <div className="space-y-2">
                {mockDocuments.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 text-sm hover:bg-muted/50 transition-colors">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateMX(doc.uploadedAt)} — SHA-256: {doc.hash.substring(0, 12)}…
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* XRPL Transactions */}
        <Card className="shadow-card border-border/50 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Transacciones XRPL</CardTitle>
          </CardHeader>
          <CardContent>
            {mockXrplTxs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Sin transacciones</p>
            ) : (
              <div className="space-y-2">
                {mockXrplTxs.map(tx => (
                  <div key={tx.hash} className="p-3 rounded-xl border border-border/50 text-sm hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{tx.type}</span>
                      <span className={`text-xs font-medium ${tx.status === 'SUCCESS' ? 'text-status-released' : 'text-status-awaiting'}`}>
                        {tx.status}
                      </span>
                    </div>
                    <a
                      href={`https://testnet.xrpl.org/transactions/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline flex items-center gap-1"
                    >
                      {tx.hash.substring(0, 20)}… <ExternalLink className="h-3 w-3" />
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">{formatDateMX(tx.date)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* PSP / Funds */}
        <Card className="shadow-card border-border/50 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">PSP / Fondos</CardTitle>
          </CardHeader>
          <CardContent>
            {mockPspEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Sin movimientos</p>
            ) : (
              <div className="space-y-2">
                {mockPspEntries.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 text-sm hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{entry.type}</p>
                      <p className="text-xs text-muted-foreground">{entry.reference}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{formatCurrency(entry.amountUSD, 'USD')}</p>
                      <p className={`text-xs font-medium ${entry.status === 'COMPLETED' ? 'text-status-released' : 'text-status-awaiting'}`}>
                        {entry.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dispute Dialog */}
      <Dialog open={disputeOpen} onOpenChange={setDisputeOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Abrir disputa</DialogTitle>
            <DialogDescription>Describe la razón por la cual deseas abrir una disputa. Se asignará un árbitro ICC.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <Label>Razón de la disputa</Label>
              <Textarea value={disputeReason} onChange={e => setDisputeReason(e.target.value)} placeholder="Describe el problema..." rows={4} className="rounded-xl" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDisputeOpen(false)} className="rounded-xl">Cancelar</Button>
              <Button variant="destructive" onClick={() => { handleAction('dispute'); setDisputeOpen(false); }} disabled={!disputeReason.trim()} className="rounded-xl">
                Confirmar disputa
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
