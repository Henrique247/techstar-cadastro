
import { Mail, Phone } from "lucide-react";

const TechStarFooter = () => {
  return (
    <footer className="mt-12 py-6 border-t border-gray-800">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} TECH_STAR Academy
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="mailto:mendeshenrique158@gmail.com" className="flex items-center text-gray-400 hover:text-techstar-blue transition-colors">
              <Mail size={16} className="mr-2" />
              <span className="text-sm">mendeshenrique158@gmail.com</span>
            </a>
            <a href="tel:+244952993627" className="flex items-center text-gray-400 hover:text-techstar-blue transition-colors">
              <Phone size={16} className="mr-2" />
              <span className="text-sm">+244 952 993 627</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TechStarFooter;
