
import { Toaster } from "@/components/ui/toaster";
import TechStarForm from "@/components/TechStarForm";
import TechStarHeader from "@/components/TechStarHeader";
import TechStarFooter from "@/components/TechStarFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-techstar-dark text-techstar-light py-10 px-4">
      <div className="container mx-auto">
        <TechStarHeader />
        <div className="bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-gray-800 shadow-lg">
          <TechStarForm />
        </div>
        <TechStarFooter />
      </div>
      {/* Add the Toaster component here instead of at the app level */}
      <Toaster />
    </div>
  );
};

export default Index;
