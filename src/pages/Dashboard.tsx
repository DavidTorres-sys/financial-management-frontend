import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, TrendingDown, PieChart,
  FileText, Lightbulb, DollarSign, Target, LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const categoryData = [
  { name: "Alimentación", percentage: 35, color: "hsl(152, 55%, 38%)" },
  { name: "Transporte", percentage: 20, color: "hsl(38, 92%, 55%)" },
  { name: "Entretenimiento", percentage: 15, color: "hsl(210, 80%, 55%)" },
  { name: "Servicios", percentage: 18, color: "hsl(0, 72%, 51%)" },
  { name: "Otros", percentage: 12, color: "hsl(280, 50%, 55%)" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName] = useState(localStorage.getItem("userName") || "Usuario");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [balance, setBalance] = useState(0);
  const [balanceInicial, setBalanceInicial] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    api.getBalance().then((res) => {
      if (res.balance !== undefined) {
        setBalanceInicial(res.balanceInicial);
        setTotalIncome(res.totalIngresos);
        setTotalGastos(res.totalGastos);
        setBalance(res.balance);
      }
    }).catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    toast.success("Sesión cerrada");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-card">
        <span className="text-base font-semibold text-foreground">Hola, {userName}!</span>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut size={20} />
        </Button>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <div className="flex justify-center">
          <Logo size="sm" showText={false} />
        </div>

        {/* Balance inicial */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target size={16} className="text-primary" />
              Balance inicial registrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-foreground">
              ${balanceInicial.toLocaleString("es-CL")}
            </p>
          </CardContent>
        </Card>

        {/* Balance total */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign size={16} className="text-primary" />
              Balance financiero actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${balance >= 0 ? "text-green-600" : "text-destructive"}`}>
              ${balance.toLocaleString("es-CL")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Balance inicial + Ingresos - Gastos
            </p>
          </CardContent>
        </Card>

        {/* Categorías */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <PieChart size={16} className="text-primary" />
              Transacciones por categorías
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {categoryData.reduce((acc, cat, i) => {
                    const offset = categoryData.slice(0, i).reduce((s, c) => s + c.percentage, 0);
                    acc.push(
                      <circle key={cat.name} cx="50" cy="50" r="40" fill="none"
                        stroke={cat.color} strokeWidth="20"
                        strokeDasharray={`${cat.percentage * 2.51} ${251.2 - cat.percentage * 2.51}`}
                        strokeDashoffset={`${-offset * 2.51}`}
                      />
                    );
                    return acc;
                  }, [] as React.ReactNode[])}
                </svg>
              </div>
              <div className="space-y-1.5 flex-1">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                    <span className="text-muted-foreground flex-1">{cat.name}</span>
                    <span className="font-medium text-foreground">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registros */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Registros</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="shadow-card cursor-pointer hover:shadow-elevated transition-shadow" onClick={() => navigate("/register-income")}>
              <CardContent className="flex flex-col items-center gap-2 py-5">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <TrendingUp size={24} className="text-income" />
                </div>
                <span className="text-sm font-medium text-foreground">Ingresos</span>
                <span className="text-lg font-bold text-income">${totalIncome.toLocaleString("es-CL")}</span>
              </CardContent>
            </Card>
            <Card className="shadow-card cursor-pointer hover:shadow-elevated transition-shadow">
              <CardContent className="flex flex-col items-center gap-2 py-5">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <TrendingDown size={24} className="text-expense" />
                </div>
                <span className="text-sm font-medium text-foreground">Gastos</span>
                <span className="text-lg font-bold text-expense">${totalGastos.toLocaleString("es-CL")}</span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reportes y Recomendaciones */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="shadow-card cursor-pointer hover:shadow-elevated transition-shadow">
            <CardContent className="flex flex-col items-center gap-2 py-5">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <FileText size={24} className="text-info" />
              </div>
              <span className="text-sm font-medium text-foreground">Reportes</span>
            </CardContent>
          </Card>
          <Card className="shadow-card cursor-pointer hover:shadow-elevated transition-shadow">
            <CardContent className="flex flex-col items-center gap-2 py-5">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Lightbulb size={24} className="text-warning" />
              </div>
              <span className="text-sm font-medium text-foreground">Recomendaciones</span>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
