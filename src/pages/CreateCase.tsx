import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppLayout } from '@/components/AppLayout';
import { ExchangeRateWidget } from '@/components/ExchangeRateWidget';
import { useApp } from '@/context/AppContext';
import { formatMXN, formatUSD, Incoterm, EscrowCase } from '@/types/case';

const steps = ['Datos de la operación', 'Datos del vendedor', 'Tipo de cambio', 'Contrato y firma'];

const COUNTRIES = [
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'DE', name: 'Alemania', flag: '🇩🇪' },
  { code: 'JP', name: 'Japón', flag: '🇯🇵' },
  { code: 'KR', name: 'Corea del Sur', flag: '🇰🇷' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
];

function getBankFields(country: string) {
  if (country === 'US') return [{ key: 'routing', label: 'Routing number' }, { key: 'account', label: 'Account number' }, { key: 'bankName', label: 'Nombre del banco' }];
  if (['ES', 'DE'].includes(country)) return [{ key: 'iban', label: 'IBAN' }, { key: 'bic', label: 'BIC/SWIFT' }];
  if (['CN', 'JP', 'KR'].includes(country)) return [{ key: 'swift', label: 'SWIFT' }, { key: 'account', label: 'Account number' }, { key: 'bankName', label: 'Nombre del banco' }, { key: 'branch', label: 'Branch' }];
  if (country === 'CO') return [{ key: 'account', label: 'Cuenta bancaria' }, { key: 'nit', label: 'NIT' }, { key: 'bankName', label: 'Banco' }];
  return [{ key: 'swift', label: 'SWIFT' }, { key: 'account', label: 'Account' }, { key: 'bankName', label: 'Banco' }];
}

export default function CreateCase() {
  const navigate = useNavigate();
  const { createCase, addTimelineEvent } = useApp();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [signed, setSigned] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    montoMxn: '',
    incoterm: 'FOB' as Incoterm,
    description: '',
    deliveryDeadline: '',
    garantiaMaxDate: '',
    sellerName: '',
    sellerCountry: 'CN',
    sellerEmail: '',
    sellerRfc: '',
    sellerBank: {} as Record<string, string>,
    deliveryPoint: '',
    // Set after exchange rate confirmation
    tipoCambio: 0,
    montoUsd: 0,
    comision: 0,
    totalTransferido: 0,
    rateConfirmed: false,
  });

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));
  const setBankField = (key: string, value: string) => setForm(f => ({ ...f, sellerBank: { ...f.sellerBank, [key]: value } }));

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.montoMxn || Number(form.montoMxn) <= 0) e.montoMxn = 'Ingresa un monto válido';
      if (!form.description.trim()) e.description = 'La descripción es obligatoria';
      if (!form.deliveryDeadline) e.deliveryDeadline = 'Selecciona una fecha';
    }
    if (s === 1) {
      if (!form.sellerName.trim()) e.sellerName = 'Nombre del vendedor obligatorio';
      if (!form.sellerEmail.includes('@')) e.sellerEmail = 'Email inválido';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => Math.min(s + 1, 3)); };

  const handleRateConfirm = (rate: number, usd: number, comision: number, total: number) => {
    setForm(f => ({ ...f, tipoCambio: rate, montoUsd: usd, comision, totalTransferido: total, rateConfirmed: true }));
  };

  const submit = () => {
    setLoading(true);
    const now = new Date().toISOString();
    const id = `AX-2024-${String(Date.now()).slice(-3)}`;
    const newCase: EscrowCase = {
      id, status: 'AWAITING_FUNDING',
      buyer: 'Importadora del Norte S.A. de C.V.',
      seller: form.sellerName, sellerCountry: COUNTRIES.find(c => c.code === form.sellerCountry)?.name || form.sellerCountry,
      sellerEmail: form.sellerEmail,
      montoMxn: Number(form.montoMxn), montoUsd: form.montoUsd, tipoCambio: form.tipoCambio,
      comisionMxn: form.comision, totalTransferidoMxn: form.totalTransferido,
      incoterm: form.incoterm, deliveryPoint: form.deliveryPoint, deliveryDeadline: form.deliveryDeadline,
      description: form.description, createdAt: now.split('T')[0],
      buyerSigned: true, sellerSigned: false,
      documents: [], timeline: [
        { date: now.replace('T', ' ').substring(0, 16), event: 'Caso creado', icon: '🟦' },
        { date: now.replace('T', ' ').substring(0, 16), event: 'Contrato firmado por comprador', icon: '📝' },
      ],
      sellerBankCountry: form.sellerCountry, sellerRfc: form.sellerRfc, sellerBankInfo: form.sellerBank,
    };
    createCase(newCase);
    setTimeout(() => navigate(`/cases/${id}`), 1000);
  };

  const countryObj = COUNTRIES.find(c => c.code === form.sellerCountry);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Regresar
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-8">Nueva Garantía Comercial</h1>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold shrink-0 transition-all ${
                i <= step ? 'gradient-gold text-white shadow-glow' : 'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden lg:block ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-accent' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <Card className="shadow-card">
          <CardContent className="p-6">
            {/* Step 1 */}
            {step === 0 && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2">
                  <Label>Monto del deal (MXN)</Label>
                  <Input type="number" value={form.montoMxn} onChange={e => set('montoMxn', e.target.value)} placeholder="$0.00" className="h-11" />
                  {form.montoMxn && <p className="text-xs text-muted-foreground">≈ {formatMXN(Number(form.montoMxn))}</p>}
                  {errors.montoMxn && <p className="text-xs text-destructive">{errors.montoMxn}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Incoterm</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['FOB', 'DAP'] as Incoterm[]).map(inc => (
                      <button key={inc} type="button" onClick={() => set('incoterm', inc)}
                        className={`p-4 rounded-xl border text-left transition-all ${form.incoterm === inc ? 'border-accent bg-accent/10 shadow-glow' : 'border-border hover:border-accent/30'}`}>
                        <p className="font-semibold text-foreground">{inc}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {inc === 'FOB' ? 'Free On Board — vendedor entrega en puerto de origen' : 'Delivered At Place — vendedor entrega en destino'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descripción de mercancía / servicio</Label>
                  <Textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe los bienes o servicios..." rows={3} />
                  {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha límite de entrega</Label>
                    <Input type="date" value={form.deliveryDeadline} onChange={e => set('deliveryDeadline', e.target.value)} className="h-11" />
                    {errors.deliveryDeadline && <p className="text-xs text-destructive">{errors.deliveryDeadline}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha máxima de garantía</Label>
                    <Input type="date" value={form.garantiaMaxDate} onChange={e => set('garantiaMaxDate', e.target.value)} className="h-11" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2">
                  <Label>Nombre / Razón social del vendedor</Label>
                  <Input value={form.sellerName} onChange={e => set('sellerName', e.target.value)} placeholder="Empresa del vendedor" className="h-11" />
                  {errors.sellerName && <p className="text-xs text-destructive">{errors.sellerName}</p>}
                </div>
                <div className="space-y-2">
                  <Label>País</Label>
                  <Select value={form.sellerCountry} onValueChange={v => set('sellerCountry', v)}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={form.sellerEmail} onChange={e => set('sellerEmail', e.target.value)} placeholder="vendedor@empresa.com" className="h-11" />
                    {errors.sellerEmail && <p className="text-xs text-destructive">{errors.sellerEmail}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>RFC / Tax ID</Label>
                    <Input value={form.sellerRfc} onChange={e => set('sellerRfc', e.target.value)} placeholder="Tax ID" className="h-11" />
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Datos bancarios ({countryObj?.name})</h4>
                  <div className="space-y-3">
                    {getBankFields(form.sellerCountry).map(f => (
                      <div key={f.key} className="space-y-1">
                        <Label className="text-xs">{f.label}</Label>
                        <Input value={form.sellerBank[f.key] || ''} onChange={e => setBankField(f.key, e.target.value)} className="h-10" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Punto de entrega {form.incoterm === 'FOB' ? '(Puerto)' : '(Dirección)'}</Label>
                  <Input value={form.deliveryPoint} onChange={e => set('deliveryPoint', e.target.value)}
                    placeholder={form.incoterm === 'FOB' ? 'Puerto de origen' : 'Dirección de entrega'} className="h-11" />
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 2 && (
              <div className="animate-fade-in">
                {Number(form.montoMxn) > 0 ? (
                  <ExchangeRateWidget montoMxn={Number(form.montoMxn)} onConfirm={handleRateConfirm} />
                ) : (
                  <p className="text-sm text-destructive">Regresa al paso 1 e ingresa un monto válido.</p>
                )}
              </div>
            )}

            {/* Step 4 */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-semibold text-foreground">Contrato de Garantía Comercial</h3>
                <div className="p-4 bg-muted/50 rounded-xl text-sm space-y-3">
                  <p><strong>Comprador:</strong> Importadora del Norte S.A. de C.V.</p>
                  <p><strong>Vendedor:</strong> {form.sellerName} ({countryObj?.name})</p>
                  <p><strong>Monto:</strong> {formatMXN(Number(form.montoMxn))} / {formatUSD(form.montoUsd)}</p>
                  <p><strong>Incoterm:</strong> {form.incoterm} — {form.deliveryPoint}</p>
                  <p><strong>Comisión Axioma:</strong> {formatMXN(form.comision)} (no reembolsable)</p>
                  <p><strong>Total a transferir:</strong> {formatMXN(form.totalTransferido)}</p>
                  <p><strong>Tipo de cambio fijado:</strong> 1 USD = {formatMXN(form.tipoCambio)}</p>
                  <p><strong>Fecha límite de entrega:</strong> {form.deliveryDeadline}</p>
                  <p><strong>Descripción:</strong> {form.description}</p>
                  <div className="border-t border-border pt-3 text-xs text-muted-foreground">
                    <p>Axioma Finance actúa como intermediario de pago y árbitro de la transacción. Los fondos se mantienen en garantía hasta que se cumplan las condiciones de entrega y se validen los documentos requeridos.</p>
                  </div>
                </div>

                {!signed ? (
                  <Button onClick={() => setSigned(true)} className="w-full gradient-gold text-white font-semibold hover:opacity-90 h-11">
                    📝 Firmar contrato
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-status-released/10 rounded-lg border border-status-released/20 text-sm text-status-released font-medium text-center">
                      ✅ Contrato firmado electrónicamente
                    </div>
                    <Button onClick={submit} disabled={loading} className="w-full gradient-gold text-white font-semibold hover:opacity-90 h-11">
                      {loading ? 'Creando garantía...' : '🔒 Crear garantía'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Nav */}
            <div className="flex justify-between mt-8 pt-5 border-t border-border">
              <Button variant="outline" onClick={() => setStep(s => Math.max(s - 1, 0))} disabled={step === 0}>
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Anterior
              </Button>
              {step < 2 && (
                <Button onClick={next} className="gradient-gold text-white font-semibold hover:opacity-90">
                  Siguiente <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              )}
              {step === 2 && form.rateConfirmed && (
                <Button onClick={() => setStep(3)} className="gradient-gold text-white font-semibold hover:opacity-90">
                  Siguiente <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
