import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { loginSchema } from "@/lib/validators";
import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validar com Zod
      const validation = loginSchema.safeParse({ email, password });

      if (!validation.success) {
        toast.add({
          title: "Erro de validação",
          description: validation.error.message,
        });
        setLoading(false);
        return;
      }

      const { error } = await signIn(email, password);

      if (error) {
        toast.add({
          title: "Erro ao fazer login",
          description: error.message.includes("Invalid")
            ? "Email ou senha incorretos"
            : error.message,
        });
      } else {
        toast.add({ title: "Login realizado!", description: "Bem-vindo(a) de volta" });
        navigate("/admin", {
          replace: true,
        });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast.add({ title: "Erro", description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      {/* Botão voltar */}
      <button
        onClick={() => navigate(-1)}
        className="
          fixed left-4 top-4 z-50
          flex items-center gap-2
          rounded-full bg-background px-3 py-2
          text-sm shadow-md
        "
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-2">
          <NavLink to="/" className="flex items-center justify-center mb-2">
            <img
              src="/images/logo-horizontal.png"
              alt="NetPerto"
              className="h-14 w-auto object-contain"
            />
          </NavLink>
          <CardDescription>Descubra provedores e planos disponíveis em Petrolina.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative space-y-2">
              <Label>Senha</Label>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                data-testid="password-input"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                data-testid="show-password-button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                size={"lg"}
                data-testid="button-submit"
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
