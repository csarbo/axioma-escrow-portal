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
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Regresar
        </button>

        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-8">Nuevo Caso de Escrow</h1>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold shrink-0 transition-all ${
                i <= step ? 'gradient-gold text-white shadow-glow' : 'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-px transition-colors ${i < step ? 'bg-accent' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <Card className="shadow-card border-border/50 rounded-2xl">
          <CardContent className="p-7">
            {/* Step 1 */}
            {step === 0 && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2">
                  <Label>Título del caso</Label>
                  <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ej. Compra de materiales" className="rounded-xl h-11" />
                  {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Monto (USD)</Label>
                  <Input type="number" value={form.amountUSD} onChange={e => setForm(f => ({ ...f, amountUSD: e.target.value }))} placeholder="0.00" className="rounded-xl h-11" />
                  {form.amountUSD && <p className="text-xs text-muted-foreground">≈ {formatCurrency(estimatedMXN, 'MXN')}</p>}
                  {errors.amountUSD && <p className="text-xs text-destructive">{errors.amountUSD}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Email de la contraparte</Label>
                  <Input type="email" value={form.counterpartyEmail} onChange={e => setForm(f => ({ ...f, counterpartyEmail: e.target.value }))} placeholder="vendedor@empresa.mx" className="rounded-xl h-11" />
                  {errors.counterpartyEmail && <p className="text-xs text-destructive">{errors.counterpartyEmail}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Descripción del deal</Label>
                  <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe los bienes o servicios..." rows={3} className="rounded-xl" />
                  {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2">
                  <Label>Fecha límite</Label>
                  <Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="rounded-xl h-11" />
                  {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Ventana de disputa (días)</Label>
                  <Input type="number" value={form.disputeWindow} onChange={e => setForm(f => ({ ...f, disputeWindow: e.target.value }))} min="1" max="30" className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de liquidación</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['SPEI', 'ON_CHAIN'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, settlementType: type }))}
                        className={`p-4 rounded-xl border text-sm font-medium text-center transition-all ${
                          form.settlementType === type
                            ? 'border-accent bg-accent/10 text-foreground shadow-glow'
                            : 'border-border/50 hover:border-accent/30 text-muted-foreground'
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
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-semibold text-foreground">Resumen del caso</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Título</p>
                    <p className="font-medium text-foreground mt-1">{form.title}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Monto</p>
                    <p className="font-medium text-foreground mt-1">{formatCurrency(Number(form.amountUSD), 'USD')}</p>
                    <p className="text-xs text-muted-foreground">≈ {formatCurrency(estimatedMXN, 'MXN')}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Contraparte</p>
                    <p className="font-medium text-foreground mt-1">{form.counterpartyEmail}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Liquidación</p>
                    <p className="font-medium text-foreground mt-1">{form.settlementType === 'SPEI' ? 'SPEI (MXN)' : 'On-chain (XRPL)'}</p>
                  </div>
                  <div className="col-span-2 p-4 bg-muted/50 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Descripción</p>
                    <p className="font-medium text-foreground mt-1">{form.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-5 border-t border-border/50">
              <Button variant="outline" onClick={() => setStep(s => Math.max(s - 1, 0))} disabled={step === 0} className="rounded-xl">
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Anterior
              </Button>
              {step < 2 ? (
                <Button onClick={next} className="gradient-gold text-white font-semibold hover:opacity-90 rounded-xl shadow-glow">
                  Siguiente <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              ) : (
                <Button onClick={submit} disabled={loading} className="gradient-gold text-white font-semibold hover:opacity-90 rounded-xl shadow-glow">
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
