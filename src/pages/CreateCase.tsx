import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { AppLayout } from '@/components/AppLayout';
import { formatCurrency } from '@/data/mock';

const steps = ['Datos del deal', 'Condiciones', 'Revisión'];

export default function CreateCase() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amountUSD: '',
    description: '',
    counterpartyEmail: '',
    title: '',
    dueDate: '',
    disputeWindow: '7',
    settlementType: 'SPEI' as 'SPEI' | 'ON_CHAIN',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (s: number) => {
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (!form.title.trim()) errs.title = 'El título es obligatorio';
      if (!form.amountUSD || Number(form.amountUSD) <= 0) errs.amountUSD = 'Ingresa un monto válido';
      if (!form.counterpartyEmail.includes('@')) errs.counterpartyEmail = 'Ingresa un email válido';
      if (!form.description.trim()) errs.description = 'La descripción es obligatoria';
    }
    if (s === 1) {
      if (!form.dueDate) errs.dueDate = 'Selecciona una fecha límite';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep(s => Math.min(s + 1, 2));
  };

  const submit = () => {
    setLoading(true);
    setTimeout(() => navigate('/dashboard'), 1000);
  };

  const estimatedMXN = Number(form.amountUSD || 0) * 17.2;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Regresar
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6">Nuevo Caso de Escrow</h1>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold shrink-0 transition-colors ${
                i <= step ? 'gradient-gold text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-accent' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <Card className="shadow-card">
          <CardContent className="p-6">
            {/* Step 1 */}
            {step === 0 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1.5">
                  <Label>Título del caso</Label>
                  <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ej. Compra de materiales" />
                  {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Monto (USD)</Label>
                  <Input type="number" value={form.amountUSD} onChange={e => setForm(f => ({ ...f, amountUSD: e.target.value }))} placeholder="0.00" />
                  {form.amountUSD && <p className="text-xs text-muted-foreground">≈ {formatCurrency(estimatedMXN, 'MXN')}</p>}
                  {errors.amountUSD && <p className="text-xs text-destructive">{errors.amountUSD}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Email de la contraparte</Label>
                  <Input type="email" value={form.counterpartyEmail} onChange={e => setForm(f => ({ ...f, counterpartyEmail: e.target.value }))} placeholder="vendedor@empresa.mx" />
                  {errors.counterpartyEmail && <p className="text-xs text-destructive">{errors.counterpartyEmail}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Descripción del deal</Label>
                  <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe los bienes o servicios..." rows={3} />
                  {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1.5">
                  <Label>Fecha límite</Label>
                  <Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                  {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Ventana de disputa (días)</Label>
                  <Input type="number" value={form.disputeWindow} onChange={e => setForm(f => ({ ...f, disputeWindow: e.target.value }))} min="1" max="30" />
                </div>
                <div className="space-y-1.5">
                  <Label>Tipo de liquidación</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['SPEI', 'ON_CHAIN'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, settlementType: type }))}
                        className={`p-3 rounded-lg border text-sm font-medium text-center transition-all ${
                          form.settlementType === type
                            ? 'border-accent bg-accent/10 text-accent-foreground'
                            : 'border-border hover:border-accent/30 text-muted-foreground'
                        }`}
                      >
                        {type === 'SPEI' ? 'SPEI (MXN)' : 'On-chain (XRPL)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 - Review */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-foreground">Resumen del caso</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Título</p>
                    <p className="font-medium text-foreground">{form.title}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Monto</p>
                    <p className="font-medium text-foreground">{formatCurrency(Number(form.amountUSD), 'USD')}</p>
                    <p className="text-xs text-muted-foreground">≈ {formatCurrency(estimatedMXN, 'MXN')}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Contraparte</p>
                    <p className="font-medium text-foreground">{form.counterpartyEmail}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Liquidación</p>
                    <p className="font-medium text-foreground">{form.settlementType === 'SPEI' ? 'SPEI (MXN)' : 'On-chain (XRPL)'}</p>
                  </div>
                  <div className="col-span-2 p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Descripción</p>
                    <p className="font-medium text-foreground">{form.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setStep(s => Math.max(s - 1, 0))} disabled={step === 0}>
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Anterior
              </Button>
              {step < 2 ? (
                <Button onClick={next} className="gradient-gold text-primary font-semibold hover:opacity-90">
                  Siguiente <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              ) : (
                <Button onClick={submit} disabled={loading} className="gradient-gold text-primary font-semibold hover:opacity-90">
                  {loading ? 'Creando...' : 'Crear Caso de Escrow'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
