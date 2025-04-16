
import { Link } from "react-router-dom";
import { Church, Users, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="bg-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Church className="h-8 w-8" />
            <span className="text-xl font-bold">Igreja Online</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-indigo-200 transition-colors">
              Início
            </Link>
            <Link to="/membros" className="hover:text-indigo-200 transition-colors">
              Membros
            </Link>
            <Link to="/eventos" className="hover:text-indigo-200 transition-colors">
              Eventos
            </Link>
            <Link to="/recursos" className="hover:text-indigo-200 transition-colors">
              Recursos
            </Link>
            <Link to="/calendario" className="hover:text-indigo-200 transition-colors">
              Calendário
            </Link>
          </nav>
          
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:bg-indigo-600">
              <span className="sr-only">Abrir menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
