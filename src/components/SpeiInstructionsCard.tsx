import { useState } from 'react';
import { Copy, Check, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatMXN, formatUSD } from '@/types/case';
import { useToast } from '@/hooks/use-toast';

interface SpeiInstructionsCardProps {
  caseId: string;
  totalMxn: number;
  montoUsd: number;
  tipoCambio: number;
  onNotify: () => void;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: `${label} copiado al portapapeles` });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={copy} className="ml-2 text-muted-foreground hover:text-accent transition-colors">
      {copied ? <Check className="h-4 w-4 text-status-released" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

export function SpeiInstructionsCard({ caseId, totalMxn, montoUsd, tipoCambio, onNotify }: SpeiInstructionsCardProps) {
  const [loading, setLoading] = useState(false);
  const clabe = '072 180 00123456789 0';
  const referencia = `${caseId}-FONDEO`;

  const handleNotify = () => {
    setLoading(true);
    setTimeout(() => {
      onNotify();
      setLoading(false);
    }, 1500);
  };

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-foreground">Instrucciones de transferencia SPEI</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Para activar tu garantía realiza una transferencia SPEI:
        </p>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Banco:</span>
            <span className="font-medium text-foreground">Banorte</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Beneficiario:</span>
            <span className="font-medium text-foreground">Axioma Finance S.A. de C.V.</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">CLABE:</span>
            <span className="font-mono font-medium text-foreground">{clabe}<CopyButton text={clabe.replace(/\s/g, '')} label="CLABE" /></span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Monto exacto:</span>
            <span className="font-bold text-foreground">{formatMXN(totalMxn)}<CopyButton text={totalMxn.toFixed(2)} label="Monto" /></span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Referencia:</span>
            <span className="font-mono text-foreground">{referencia}<CopyButton text={referencia} label="Referencia" /></span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Concepto:</span>
            <span className="text-foreground">Garantía comercial {caseId}</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-status-awaiting/10 rounded-lg border border-status-awaiting/20">
          <p className="text-xs text-muted-foreground">
            ⚠️ Usa exactamente la referencia indicada.<br />
            El tipo de cambio fue fijado: 1 USD = {formatMXN(tipoCambio)}<br />
            El vendedor recibirá: {formatUSD(montoUsd)}
          </p>
        </div>

        <Button
          onClick={handleNotify}
          disabled={loading}
          className="w-full mt-4 gradient-gold text-white font-semibold hover:opacity-90"
        >
          {loading ? 'Notificando...' : '✓ Ya realicé la transferencia — notificar a Axioma'}
        </Button>
      </CardContent>
    </Card>
  );
}
