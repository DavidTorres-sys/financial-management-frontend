import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [balanceInicial, setBalanceInicial] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "El nombre es obligatorio";
    if (!email.trim()) errs.email = "El correo es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Correo inválido";
    if (!password) errs.password = "La contraseña es obligatoria";
    else if (password.length < 8) errs.password = "Debe tener al menos 8 caracteres";
    else if (!/\d/.test(password)) errs.password = "Debe incluir números";
    const balanceNum = parseFloat(balanceInicial);
    if (balanceInicial === "" || isNaN(balanceNum)) errs.balanceInicial = "El balance inicial es obligatorio";
    else if (balanceNum < 0) errs.balanceInicial = "El balance no puede ser negativo";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      try {
        const res = await api.register({
          nombre: name,
          email,
          password,
          balanceInicial: parseFloat(balanceInicial),
        });
        if (res.mensaje === "Registro exitoso") {
          toast.success("Registro exitoso");
          navigate("/login");
        } else {
          if (res.error?.includes("correo ya existe")) {
            setErrors({ email: "El correo ya existe" });
          } else {
            setErrors({ email: res.error || "Error al registrar" });
          }
        }
      } catch {
        setErrors({ email: "Error al conectar con el servidor" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <Logo />
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre completo" />
            {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
            {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-muted-foreground text-xs">Tu contraseña debe tener al menos 8 caracteres e incluir números</p>
            {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="balanceInicial">¿Cuánto dinero tienes actualmente?</Label>
            <Input
              id="balanceInicial"
              type="number"
              value={balanceInicial}
              onChange={(e) => setBalanceInicial(e.target.value)}
              placeholder="Ej: 500000"
              min="0"
              step="any"
            />
            <p className="text-muted-foreground text-xs">Este será tu balance inicial en la app</p>
            {errors.balanceInicial && <p className="text-destructive text-xs">{errors.balanceInicial}</p>}
          </div>
          <Button type="submit" size="lg" className="w-full text-base font-semibold" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
