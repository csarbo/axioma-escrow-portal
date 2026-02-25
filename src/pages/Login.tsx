import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 gradient-mesh" />
      
      {/* Decorative circles */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="w-full max-w-sm animate-fade-in relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 border border-accent/20 mb-5 shadow-glow">
            <Shield className="h-8 w-8 text-gold" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Axioma <span className="text-gold">Escrow</span>
          </h1>
          <p className="text-sm text-white/40 mt-2">Plataforma de escrow condicional</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="glass-dark rounded-2xl p-7 border border-white/10 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-white/70">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@empresa.mx"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-accent/50 rounded-xl h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-white/70">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-accent/50 rounded-xl h-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gradient-gold text-white font-semibold hover:opacity-90 transition-all rounded-xl h-11 shadow-glow"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : (
              <>Iniciar sesión <ArrowRight className="h-4 w-4 ml-1" /></>
            )}
          </Button>

          <p className="text-xs text-center text-white/30">
            Demo: usa las credenciales precargadas
          </p>
        </form>

        <p className="text-center text-xs text-white/20 mt-8">
          © 2025 Axioma Finance. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
