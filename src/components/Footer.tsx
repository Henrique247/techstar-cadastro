
const Footer = () => {
  return (
    <footer className="bg-indigo-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/bf19cc8d-73fb-4d7a-9061-d25a0fcf1b22.png" 
              alt="Logo Rhema" 
              className="h-10 w-10 rounded-full bg-white p-1" 
            />
            <div>
              <span className="font-semibold block">Centro Rhema</span>
              <span className="text-xs text-indigo-200">Centro de Formação e de Missões</span>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} Centro Rhema. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
