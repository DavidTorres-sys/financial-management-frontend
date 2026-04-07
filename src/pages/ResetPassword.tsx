import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

type Step = "email" | "code" | "password";

export default function ResetPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.forgotPassword(email);
      if (res.mensaje) {
        toast.success("Código enviado a tu correo");
        setStep("code");
      } else {
        setError(res.error || "Correo no registrado");
      }
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setStep("password");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.resetPassword(code, password);
      if (res.mensaje) {
        toast.success("Contraseña actualizada exitosamente");
        setStep("email");
        setEmail("");
        setCode("");
        setPassword("");
      } else {
        setError(res.error || "Código inválido o expirado");
      }
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <Logo />
        <h2 className="text-lg font-semibold text-foreground">¿Olvidé mi contraseña?</h2>

        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="w-full space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
            </div>
            {error && <p className="text-destructive text-xs">{error}</p>}
            <Button type="submit" size="lg" className="w-full font-semibold" disabled={loading}>
              {loading ? "Enviando..." : "Enviar código"}
            </Button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={handleCodeSubmit} className="w-full space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Ingresa el código de 6 dígitos enviado a <strong>{email}</strong>
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="code">Código</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ej: 123456" maxLength={6} />
            </div>
            {error && <p className="text-destructive text-xs">{error}</p>}
            <Button type="submit" size="lg" className="w-full font-semibold">Verificar</Button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="w-full space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" />
            </div>
            {error && <p className="text-destructive text-xs">{error}</p>}
            <Button type="submit" size="lg" className="w-full font-semibold" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </Button>
          </form>
        )}

        <Link to="/login" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft size={16} /> Volver a iniciar sesión
        </Link>
      </div>
    </div>
  );
}
