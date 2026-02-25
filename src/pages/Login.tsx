import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('carlos@techpymes.mx');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen gradient-navy flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 mb-4">
            <Shield className="h-8 w-8 text-gold" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Axioma <span className="text-gold">Escrow</span>
          </h1>
          <p className="text-sm text-white/50 mt-1">Plataforma de escrow condicional</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-card rounded-xl p-6 shadow-xl border border-border space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@empresa.mx"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gradient-gold text-primary font-semibold hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Demo: usa las credenciales precargadas
          </p>
        </form>

        <p className="text-center text-xs text-white/30 mt-6">
          © 2025 Axioma Finance. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
