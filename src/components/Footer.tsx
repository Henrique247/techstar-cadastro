
import { Church } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-indigo-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Church className="h-6 w-6" />
            <span className="text-lg font-semibold">Igreja Online</span>
          </div>
          
          <div className="text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} Igreja Online. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
