import { useState, useEffect } from 'react';
import { Lock, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatMXN, formatUSD } from '@/types/case';

interface ExchangeRateWidgetProps {
  montoMxn: number;
  onConfirm: (rate: number, montoUsd: number, comision: number, total: number) => void;
}

export function ExchangeRateWidget({ montoMxn, onConfirm }: ExchangeRateWidgetProps) {
  const [rate, setRate] = useState(17.50);
  const [locked, setLocked] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(0);

  useEffect(() => {
    if (locked) return;
    setLastUpdate(0);
    const tick = setInterval(() => setLastUpdate(p => p + 1), 1000);
    const fluctuate = setInterval(() => {
      setRate(prev => +(prev + (Math.random() - 0.5) * 0.04).toFixed(4));
      setLastUpdate(0);
    }, 30000);
    return () => { clearInterval(tick); clearInterval(fluctuate); };
  }, [locked]);

  const montoUsd = +(montoMxn / rate).toFixed(2);
  const comision = +(montoMxn * 0.01).toFixed(2);
  const total = montoMxn + comision;

  const handleConfirm = () => {
    setLocked(true);
    onConfirm(rate, montoUsd, comision, total);
  };

  return (
    <Card className={`border-2 transition-all ${locked ? 'border-status-released/50 bg-status-released/5' : 'border-accent/30'}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">💱</span>
            <h3 className="font-semibold text-foreground">Tipo de cambio {locked ? 'fijado' : 'actual'}</h3>
          </div>
          {locked ? (
            <span className="flex items-center gap-1 text-sm text-status-released font-medium">
              <Lock className="h-4 w-4" /> Fijado
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: '3s' }} />
              hace {lastUpdate}s
            </span>
          )}
        </div>

        <div className="text-center py-4 mb-4 bg-muted/50 rounded-xl">
          <p className="text-sm text-muted-foreground">1 USD =</p>
          <p className="text-3xl font-bold text-foreground">{formatMXN(rate)}</p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monto del deal:</span>
            <span className="font-medium text-foreground">{formatMXN(montoMxn)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">En USD:</span>
            <span className="font-medium text-foreground">{formatUSD(montoUsd)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Comisión Axioma (1%):</span>
            <span className="font-medium text-foreground">{formatMXN(comision)}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="font-semibold text-foreground">Total a transferir:</span>
            <span className="font-bold text-foreground">{formatMXN(total)}</span>
          </div>
        </div>

        {!locked && (
          <>
            <p className="text-xs text-muted-foreground mt-4">
              ⚠️ Al confirmar, el tipo de cambio se congela. El vendedor recibirá exactamente {formatUSD(montoUsd)}.
            </p>
            <Button onClick={handleConfirm} className="w-full mt-4 gradient-gold text-white font-semibold hover:opacity-90">
              Confirmar tipo de cambio y continuar →
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
