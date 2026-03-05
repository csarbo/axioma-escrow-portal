import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { CaseTimeline } from '@/components/CaseTimeline';
import { SpeiInstructionsCard } from '@/components/SpeiInstructionsCard';
import { DocumentChecklist } from '@/components/DocumentChecklist';
import { useApp } from '@/context/AppContext';
import { formatMXN, formatUSD, formatDateMX } from '@/types/case';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cases, updateCaseStatus, addTimelineEvent, uploadDocument } = useApp();
  const { toast } = useToast();
  const [disputeReason, setDisputeReason] = useState('');

  const caseData = cases.find(c => c.id === id);
  if (!caseData) return (
    <AppLayout>
      <div className="text-center py-20">
        <p className="text-muted-foreground">Caso no encontrado</p>
        <Button variant="outline" onClick={() => navigate('/dashboard')} className="mt-4">Volver al dashboard</Button>
      </div>
    </AppLayout>
  );

  const handleSpeiNotify = () => {
    updateCaseStatus(caseData.id, 'IN_ESCROW');
    addTimelineEvent(caseData.id, {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      event: `Transferencia SPEI notificada — ${formatMXN(caseData.totalTransferidoMxn)}`,
      icon: '💰',
    });
    toast({ title: 'Notificación enviada', description: 'Axioma revisará tu transferencia en las próximas 2 horas hábiles.' });
  };

  const handleDispute = () => {
    updateCaseStatus(caseData.id, 'DISPUTE_OPEN');
    addTimelineEvent(caseData.id, {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      event: `Disputa abierta: ${disputeReason}`,
      icon: '⚠️',
    });
    toast({ title: 'Disputa abierta', description: 'Un ejecutivo de Axioma revisará tu caso.' });
  };

  const handleUpload = (docType: string, fileName: string) => {
    uploadDocument(caseData.id, docType, fileName);
    toast({ title: 'Documento subido', description: fileName });
  };

  return (
    <AppLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Regresar
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground font-mono">{caseData.id}</h1>
            <StatusBadge status={caseData.status} size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">{caseData.description}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{formatMXN(caseData.montoMxn)}</p>
          <p className="text-sm text-muted-foreground">{formatUSD(caseData.montoUsd)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Vendedor', value: caseData.seller },
          { label: 'País', value: caseData.sellerCountry },
          { label: 'Incoterm', value: `${caseData.incoterm} — ${caseData.deliveryPoint}` },
          { label: 'Fecha límite', value: formatDateMX(caseData.deliveryDeadline) },
        ].map(item => (
          <Card key={item.label} className="shadow-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-medium text-foreground mt-1">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {caseData.status === 'AWAITING_FUNDING' && (
            <SpeiInstructionsCard
              caseId={caseData.id}
              totalMxn={caseData.totalTransferidoMxn}
              montoUsd={caseData.montoUsd}
              tipoCambio={caseData.tipoCambio}
              onNotify={handleSpeiNotify}
            />
          )}

          <Card className="shadow-card">
            <CardContent className="p-6">
              <DocumentChecklist
                incoterm={caseData.incoterm}
                documents={caseData.documents}
                onUpload={handleUpload}
              />
            </CardContent>
          </Card>

          {caseData.status === 'IN_ESCROW' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">Abrir disputa</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Abrir una disputa?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Describe el motivo de la disputa. Un ejecutivo de Axioma revisará tu caso.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <textarea
                  className="w-full border border-border rounded-lg p-3 text-sm bg-background text-foreground"
                  rows={3} placeholder="Motivo de la disputa..."
                  value={disputeReason} onChange={e => setDisputeReason(e.target.value)}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDispute} className="bg-destructive text-white">
                    Confirmar disputa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Historial del caso</h3>
              <CaseTimeline events={caseData.timeline} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
