import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

const quickLogins = [
  { label: 'Entrar como Comprador', email: 'carlos@importadoradelnorte.com', icon: '🏢' },
  { label: 'Entrar como Vendedor', email: 'wei@shenzhenelectronics.com', icon: '🌍' },
  { label: 'Entrar como Ops Axioma', email: 'ana@axioma-finance.com', icon: '⚙️' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent, overrideEmail?: string) => {
    e?.preventDefault();
    setLoading(true);
    const loginEmail = overrideEmail || email;
    const loginPassword = overrideEmail ? 'demo123' : password;

    setTimeout(() => {
      const success = login(loginEmail, loginPassword);
      if (success) {
        const user = [
          { email: 'carlos@importadoradelnorte.com', role: 'BUYER' },
          { email: 'wei@shenzhenelectronics.com', role: 'SELLER' },
          { email: 'ana@axioma-finance.com', role: 'OPS' },
        ].find(u => u.email === loginEmail);

        if (user?.role === 'OPS') navigate('/ops');
        else if (user?.role === 'SELLER') navigate('/vendor/seller-1');
        else navigate('/dashboard');
      } else {
        toast({ title: 'Error de acceso', description: 'Credenciales incorrectas', variant: 'destructive' });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20 mb-4">
            <Shield className="h-8 w-8 text-gold" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Axioma <span className="text-gold">Escrow</span>
          </h1>
          <p className="text-white/50 text-sm mt-2">Garantías comerciales internacionales</p>
        </div>

        <Card className="shadow-card-hover">
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Correo electrónico</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@empresa.com" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>Contraseña</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="h-11" />
              </div>
              <Button type="submit" disabled={loading} className="w-full gradient-gold text-white font-semibold h-11 hover:opacity-90">
                {loading ? 'Ingresando...' : <><LogIn className="h-4 w-4 mr-2" /> Iniciar sesión</>}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">Acceso rápido para demo</p>
              <div className="space-y-2">
                {quickLogins.map(q => (
                  <Button key={q.email} variant="outline" className="w-full justify-start text-sm h-10" onClick={() => handleLogin(undefined, q.email)} disabled={loading}>
                    <span className="mr-2">{q.icon}</span> {q.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-white/30 text-xs mt-6">© 2024 Axioma Finance S.A. de C.V.</p>
      </div>
    </div>
  );
}
