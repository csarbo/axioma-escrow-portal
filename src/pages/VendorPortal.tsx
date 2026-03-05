import { useParams, Link } from 'react-router-dom';
import { Shield, Upload, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { DocumentChecklist } from '@/components/DocumentChecklist';
import { CaseTimeline } from '@/components/CaseTimeline';
import { formatMXN, formatUSD, formatDateMX, getRequiredDocs } from '@/types/case';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';

export default function VendorPortal() {
  const { token } = useParams();
  const { cases, currentUser, uploadDocument, signContract, updateCaseStatus, addTimelineEvent } = useApp();
  const { toast } = useToast();
  const [paymentRequested, setPaymentRequested] = useState(false);

  // Find case for this seller — for demo, show first case matching seller
  const caseData = cases.find(c => c.sellerEmail === currentUser?.email) || cases[0];

  if (!caseData) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">No se encontró información.</p>
    </div>
  );

  const requiredDocs = getRequiredDocs(caseData.incoterm);
  const allDocsUploaded = requiredDocs.every(req =>
    caseData.documents.some(d => d.type === req.type && ['UPLOADED', 'VALIDATED'].includes(d.status))
  );

  const handleUpload = (docType: string, fileName: string) => {
    uploadDocument(caseData.id, docType, fileName);
    addTimelineEvent(caseData.id, {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      event: `Documento subido: ${docType}`,
      icon: '📄',
    });
    toast({ title: 'Documento subido', description: fileName });
  };

  const handleSign = () => {
    signContract(caseData.id, 'seller');
    addTimelineEvent(caseData.id, {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      event: 'Contrato firmado por vendedor',
      icon: '📝',
    });
    toast({ title: 'Contrato firmado', description: 'Tu firma ha sido registrada.' });
  };

  const handleRequestPayment = () => {
    setPaymentRequested(true);
    updateCaseStatus(caseData.id, 'READY_TO_RELEASE');
    addTimelineEvent(caseData.id, {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      event: `Pago solicitado por vendedor — ${formatUSD(caseData.montoUsd)}`,
      icon: '💰',
    });
    toast({ title: 'Pago solicitado', description: `Recibirás ${formatUSD(caseData.montoUsd)} en 1-3 días hábiles.` });
  };

  const paymentProvider = ['CN', 'JP', 'KR'].includes(caseData.sellerCountry?.substring(0, 2) || '')
    ? 'Airwallex' : 'Wise';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-navy border-b border-white/10">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20">
              <Shield className="h-5 w-5 text-gold" />
            </div>
            <span className="text-lg font-bold text-white">Axioma <span className="text-gold">Escrow</span></span>
          </div>
          <span className="text-sm text-white/50">Portal del Vendedor</span>
        </div>
      </header>

      <main className="container py-8 max-w-3xl mx-auto animate-fade-in">
        {/* Welcome */}
        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Hola <strong className="text-foreground">{currentUser?.name || caseData.seller}</strong>,</p>
            <p className="text-muted-foreground mt-1">
              Tienes una garantía comercial pendiente de <strong className="text-foreground">{caseData.buyer}</strong>
            </p>
          </CardContent>
        </Card>

        {/* Deal Summary */}
        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Resumen del deal</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Comprador:</span><span className="text-foreground">{caseData.buyer}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monto a recibir:</span>
                <span className="text-xl font-bold text-gold">{formatUSD(caseData.montoUsd)}</span>
              </div>
              <div className="flex justify-between"><span className="text-muted-foreground">Incoterm:</span><span className="text-foreground">{caseData.incoterm} — {caseData.deliveryPoint}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Fecha límite:</span><span className="text-foreground">{formatDateMX(caseData.deliveryDeadline)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Estado:</span><StatusBadge status={caseData.status} /></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pago vía:</span><span className="text-foreground">{paymentProvider} — 1-3 días hábiles</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Contract signing */}
        {!caseData.sellerSigned && (
          <div className="p-4 bg-status-awaiting/10 border border-status-awaiting/30 rounded-xl mb-6">
            <p className="text-sm font-medium text-foreground mb-3">⚠️ Debes firmar el contrato antes de continuar</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gradient-gold text-white font-semibold hover:opacity-90">Revisar y firmar contrato</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contrato de Garantía Comercial</DialogTitle>
                  <DialogDescription>Revisa los términos antes de firmar.</DialogDescription>
                </DialogHeader>
                <div className="text-sm space-y-2 p-4 bg-muted/50 rounded-lg max-h-60 overflow-y-auto">
                  <p><strong>Comprador:</strong> {caseData.buyer}</p>
                  <p><strong>Vendedor:</strong> {caseData.seller}</p>
                  <p><strong>Monto:</strong> {formatUSD(caseData.montoUsd)}</p>
                  <p><strong>Incoterm:</strong> {caseData.incoterm}</p>
                  <p><strong>Descripción:</strong> {caseData.description}</p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Axioma Finance actúa como intermediario de pago y árbitro de la transacción.
                  </p>
                </div>
                <DialogFooter>
                  <Button onClick={handleSign} className="gradient-gold text-white font-semibold hover:opacity-90">
                    📝 Firmar contrato
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Documents */}
        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <DocumentChecklist
              incoterm={caseData.incoterm}
              documents={caseData.documents}
              onUpload={handleUpload}
            />
          </CardContent>
        </Card>

        {/* Payment button */}
        {!paymentRequested && caseData.status !== 'RELEASED' && caseData.status !== 'READY_TO_RELEASE' ? (
          allDocsUploaded ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full h-12 gradient-gold text-white font-semibold text-base hover:opacity-90 shadow-glow">
                  💰 Solicitar pago de {formatUSD(caseData.montoUsd)}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Confirmas solicitar el pago?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Recibirás {formatUSD(caseData.montoUsd)} en tu cuenta bancaria en 1-3 días hábiles vía {paymentProvider}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRequestPayment} className="gradient-gold text-white">
                    Confirmar solicitud
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button disabled className="w-full h-12 text-base">
              Sube todos los documentos para habilitar el cobro
            </Button>
          )
        ) : (
          <div className="p-4 bg-status-released/10 border border-status-released/30 rounded-xl text-center">
            <p className="text-sm font-medium text-status-released">
              {caseData.status === 'RELEASED' ? '✓ Pago completado' : '⏳ Pago en proceso — recibirás tu pago en 1-3 días hábiles'}
            </p>
          </div>
        )}

        {/* Timeline */}
        <Card className="shadow-card mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Historial</h3>
            <CaseTimeline events={caseData.timeline} />
          </CardContent>
        </Card>

        {/* CTA banner */}
        <div className="mt-8 p-4 bg-muted/50 rounded-xl text-center">
          <p className="text-xs text-muted-foreground">¿Tienes varias operaciones con compradores mexicanos?</p>
          <button className="text-xs text-accent font-medium hover:underline mt-1">Crea tu cuenta gratis →</button>
        </div>
      </main>
    </div>
  );
}
