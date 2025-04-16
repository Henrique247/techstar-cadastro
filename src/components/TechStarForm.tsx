
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FormValues, formSchema } from "@/types/formTypes";
import { generatePDF } from "@/utils/pdfGenerator";
import { shareOnWhatsApp } from "@/utils/whatsAppSender";
import PersonalInfoFields from "@/components/form/PersonalInfoFields";
import CourseFields from "@/components/form/CourseFields";
import OtherInfoFields from "@/components/form/OtherInfoFields";

const TechStarForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      idade: "",
      whatsapp: "",
      email: "",
      escolaridade: "medio",
      cursos: [],
      outroCurso: "",
      nivelConhecimento: "iniciante",
      comoSoube: "amigos",
      outroComoSoube: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Gerar o PDF
      const doc = generatePDF(data);
      
      // Salvar localmente
      doc.save(`Inscrição_${data.nome}_TECHSTAR.pdf`);
      
      // Converter para base64 para envio
      const pdfBase64 = doc.output('datauristring');
      
      // Enviar para WhatsApp
      const sent = shareOnWhatsApp(pdfBase64, data);
      
      if (sent) {
        toast.success("Obrigado pela inscrição! Os dados foram enviados para a TECH_STAR Academy.");
        
        // Resetar formulário
        form.reset();
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error("Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PersonalInfoFields />
            <CourseFields />
            <OtherInfoFields />
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full tech-gradient hover:opacity-90 transition-all duration-300 box-glow"
            >
              {isSubmitting ? "Enviando..." : "Enviar Inscrição"}
            </Button>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
};

export default TechStarForm;
