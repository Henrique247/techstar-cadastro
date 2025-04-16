
import { FileText } from "lucide-react";

const TechStarHeader = () => {
  return (
    <header className="mb-8 text-center">
      <div className="flex justify-center mb-4">
        <img 
          src="/lovable-uploads/ae2350f3-052b-4933-ae8a-41224cb96b20.png" 
          alt="TECH_STAR Logo" 
          className="w-32 h-32 object-contain animate-glow"
        />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-techstar-blue text-glow font-poppins">
        TECH_STAR <span className="text-white">Academy</span>
      </h1>
      <div className="h-1 w-40 mx-auto tech-gradient mb-4 rounded-full"></div>
      <p className="text-lg text-gray-300 max-w-xl mx-auto">
        Preencha o formulário abaixo para se inscrever nos nossos cursos de tecnologia e iniciar sua jornada no mundo tech.
      </p>
      <div className="flex items-center justify-center mt-4 text-sm text-gray-400">
        <FileText size={16} className="mr-2 text-techstar-blue" />
        <span>Os campos marcados são obrigatórios</span>
      </div>
    </header>
  );
};

export default TechStarHeader;
