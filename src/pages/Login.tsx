import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
});

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/perfil");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // Validate input
      if (isLogin) {
        loginSchema.parse({ email, password });
      } else {
        signupSchema.parse({ email, password, name });
      }

      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Credenciales incorrectas", {
              description: "El email o la contraseña son incorrectos.",
            });
          } else {
            toast.error("Error al iniciar sesión", {
              description: error.message,
            });
          }
        } else {
          toast.success("¡Bienvenido de nuevo!");
          navigate("/perfil");
        }
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error("Usuario ya registrado", {
              description: "Ya existe una cuenta con este email.",
            });
          } else {
            toast.error("Error al crear cuenta", {
              description: error.message,
            });
          }
        } else {
          toast.success("¡Cuenta creada!", {
            description: "Tu cuenta ha sido creada correctamente.",
          });
          navigate("/perfil");
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"} | Core Padel</title>
        <meta
          name="description"
          content="Accede a tu cuenta de Core Padel para gestionar tus reservas de pistas de pádel."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 md:pt-24 pb-12">
          <div className="container mx-auto">
            <div className="max-w-md mx-auto">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="inline-flex w-16 h-16 rounded-full bg-primary items-center justify-center mb-4">
                  <div className="w-6 h-6 rounded-full bg-accent" />
                </div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                  {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {isLogin
                    ? "Accede a tu cuenta para gestionar tus reservas"
                    : "Únete a Core Padel y reserva tu primera pista"}
                </p>
              </div>

              {/* Form Card */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-medium">
                {/* Toggle */}
                <div className="flex bg-secondary rounded-lg p-1 mb-6">
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={cn(
                      "flex-1 py-2.5 rounded-md text-sm font-semibold transition-all",
                      isLogin
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={cn(
                      "flex-1 py-2.5 rounded-md text-sm font-semibold transition-all",
                      !isLogin
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Crear Cuenta
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Tu nombre"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={cn("h-12 pl-10", errors.name && "border-destructive")}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={cn("h-12 pl-10", errors.email && "border-destructive")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={cn("h-12 pl-10 pr-10", errors.password && "border-destructive")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Procesando...
                      </span>
                    ) : (
                      <>
                        {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Terms */}
              {!isLogin && (
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Al crear una cuenta, aceptas nuestros{" "}
                  <Link to="/terms" className="text-primary hover:text-accent">
                    Términos de Servicio
                  </Link>{" "}
                  y{" "}
                  <Link to="/privacy" className="text-primary hover:text-accent">
                    Política de Privacidad
                  </Link>
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Login;
