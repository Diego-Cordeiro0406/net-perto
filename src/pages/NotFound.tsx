import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <PageSEO
        title="Página Não Encontrada"
        description="A página que você procura não foi encontrada. Volte para a página inicial do NetPerto."
        noindex
      />
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground">
          Ops! A página que você procura não foi encontrada.
        </p>
        {/* <div className="flex flex-col sm:flex-row gap-3 justify-center"> */}
        <Button className="h-10 w-40">
          <Link className="flex items-center" to="/">
            <Home className="mr-2 h-4 w-4" />
            Página Inicial
          </Link>
        </Button>
        {/* </div> */}
      </div>
    </div>
  );
};

export default NotFound;
