
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jsPDF } from "jspdf";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Definição do esquema de validação
const formSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  idade: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Idade deve ser um número válido",
  }),
  whatsapp: z.string().min(9, { message: "Número de WhatsApp inválido" }),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal("")),
  escolaridade: z.enum(["basico", "medio", "tecnico", "universitario", "outro"]),
  cursos: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Selecione pelo menos um curso",
  }),
  outroCurso: z.string().optional(),
  nivelConhecimento: z.enum(["iniciante", "intermedio", "avancado"]),
  comoSoube: z.enum(["amigos", "redes_sociais", "eventos", "outros"]),
  outroComoSoube: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const cursos = [
  { id: "design", label: "Design Gráfico" },
  { id: "logica", label: "Lógica de Programação" },
  { id: "ia", label: "Inteligência Artificial" },
  { id: "programacao", label: "Programação Iniciante" },
  { id: "informatica", label: "Curso de Informática" },
  { id: "eletronica", label: "Eletrônica Básica" },
  { id: "outro", label: "Outro" },
];

const TechStarForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOutroCurso, setShowOutroCurso] = useState(false);
  const [showOutroComoSoube, setShowOutroComoSoube] = useState(false);

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

  // Manipulador para mostrar/ocultar o campo "Outro curso"
  const handleCursosChange = (values: string[]) => {
    if (values.includes("outro")) {
      setShowOutroCurso(true);
    } else {
      setShowOutroCurso(false);
      form.setValue("outroCurso", "");
    }
  };

  // Manipulador para mostrar/ocultar o campo "Outro como soube"
  const handleComoSoubeChange = (value: string) => {
    if (value === "outros") {
      setShowOutroComoSoube(true);
    } else {
      setShowOutroComoSoube(false);
      form.setValue("outroComoSoube", "");
    }
  };

  // Função para gerar o PDF
  const generatePDF = (data: FormValues) => {
    const doc = new jsPDF();
    
    // Adicionar imagem de cabeçalho
    try {
      doc.addImage("/lovable-uploads/ae2350f3-052b-4933-ae8a-41224cb96b20.png", "PNG", 15, 15, 40, 40);
    } catch (error) {
      console.error("Error adding image:", error);
    }
    
    // Título
    doc.setFontSize(22);
    doc.setTextColor(56, 189, 248); // Azul neon
    doc.text("FICHA DE INSCRIÇÃO - TECH_STAR ACADEMY", 105, 30, { align: "center" });
    
    // Linha decorativa
    doc.setDrawColor(56, 189, 248); // Azul neon
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
    
    // Dados do formulário
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Preto
    
    const startY = 50;
    const lineHeight = 8;
    let y = startY;
    
    // Informações pessoais
    doc.setFontSize(14);
    doc.setTextColor(56, 189, 248); // Azul neon
    doc.text("INFORMAÇÕES PESSOAIS", 20, y);
    y += lineHeight;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Preto
    
    doc.text(`Nome: ${data.nome}`, 20, y);
    y += lineHeight;
    
    doc.text(`Idade: ${data.idade}`, 20, y);
    y += lineHeight;
    
    doc.text(`WhatsApp: ${data.whatsapp}`, 20, y);
    y += lineHeight;
    
    doc.text(`Email: ${data.email || "Não informado"}`, 20, y);
    y += lineHeight;
    
    doc.text(`Escolaridade: ${getEscolaridadeText(data.escolaridade)}`, 20, y);
    y += lineHeight * 1.5;
    
    // Cursos de interesse
    doc.setFontSize(14);
    doc.setTextColor(56, 189, 248); // Azul neon
    doc.text("CURSOS DE INTERESSE", 20, y);
    y += lineHeight;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Preto
    
    const cursosSelectedText = data.cursos.map(curso => {
      if (curso === "outro") {
        return data.outroCurso;
      }
      return cursos.find(c => c.id === curso)?.label || curso;
    }).join(", ");
    
    doc.text(`Cursos: ${cursosSelectedText}`, 20, y);
    y += lineHeight;
    
    doc.text(`Nível de Conhecimento: ${getNivelText(data.nivelConhecimento)}`, 20, y);
    y += lineHeight * 1.5;
    
    // Outras informações
    doc.setFontSize(14);
    doc.setTextColor(56, 189, 248); // Azul neon
    doc.text("OUTRAS INFORMAÇÕES", 20, y);
    y += lineHeight;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Preto
    
    const comoSoubeText = data.comoSoube === "outros" 
      ? data.outroComoSoube 
      : getComoSoubeText(data.comoSoube);
      
    doc.text(`Como soube da TECH_STAR: ${comoSoubeText}`, 20, y);
    y += lineHeight * 3;
    
    // Rodapé
    doc.setDrawColor(56, 189, 248); // Azul neon
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += lineHeight;
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Cinza
    doc.text("TECH_STAR Academy - Ficha de Inscrição", 105, y, { align: "center" });
    y += lineHeight;
    
    const dataAtual = new Date().toLocaleDateString();
    doc.text(`Data de inscrição: ${dataAtual}`, 105, y, { align: "center" });
    
    return doc;
  };

  // Função para obter texto da escolaridade
  const getEscolaridadeText = (escolaridade: string) => {
    const mapping: Record<string, string> = {
      basico: "Ensino Básico",
      medio: "Ensino Médio",
      tecnico: "Ensino Técnico",
      universitario: "Ensino Universitário",
      outro: "Outro",
    };
    return mapping[escolaridade] || escolaridade;
  };

  // Função para obter texto do nível de conhecimento
  const getNivelText = (nivel: string) => {
    const mapping: Record<string, string> = {
      iniciante: "Iniciante",
      intermedio: "Intermédio",
      avancado: "Avançado",
    };
    return mapping[nivel] || nivel;
  };

  // Função para obter texto de como soube
  const getComoSoubeText = (comoSoube: string) => {
    const mapping: Record<string, string> = {
      amigos: "Através de amigos",
      redes_sociais: "Redes sociais",
      eventos: "Eventos",
      outros: "Outros",
    };
    return mapping[comoSoube] || comoSoube;
  };

  // Função para compartilhar no WhatsApp
  const shareOnWhatsApp = (pdfBase64: string) => {
    const message = encodeURIComponent("Nova inscrição na TECH_STAR Academy!");
    const whatsappNumber = "+244952993627";
    
    // Como não podemos enviar arquivos diretamente via URL do WhatsApp,
    // enviamos uma mensagem indicando que um novo registro foi feito
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    
    // Nota: Na prática, precisaríamos de uma API de backend para enviar o PDF via WhatsApp
    toast.info("Mensagem enviada para o WhatsApp da TECH_STAR. O PDF precisa ser anexado manualmente.");
  };

  // Função para enviar por email
  const sendEmail = async (pdfBase64: string, data: FormValues) => {
    // Na prática, isso seria feito através de uma API de backend
    // Aqui estamos apenas simulando o envio
    
    toast.info("Email seria enviado para mendeshenrique158@gmail.com em uma implementação completa.");
    
    // Nota: Na prática, usaríamos algum serviço como EmailJS, SendGrid, etc.
    console.log("Enviando email com PDF para mendeshenrique158@gmail.com");
  };

  // Função de envio do formulário
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Gerar o PDF
      const doc = generatePDF(data);
      const pdfBase64 = doc.output('datauristring');
      
      // Salvar o PDF
      doc.save(`Inscrição_${data.nome}_TECHSTAR.pdf`);
      
      // Compartilhar no WhatsApp
      shareOnWhatsApp(pdfBase64);
      
      // Enviar por email
      await sendEmail(pdfBase64, data);
      
      // Mostrar mensagem de sucesso
      toast.success("Obrigado pela inscrição! A tua ficha foi enviada e em breve receberás o nosso contacto.");
      
      // Resetar o formulário
      form.reset();
      setShowOutroCurso(false);
      setShowOutroComoSoube(false);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error("Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-techstar-blue text-glow">Informações Pessoais</h2>
            
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} className="bg-muted/80 border-techstar-blue" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="idade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idade</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite sua idade" {...field} className="bg-muted/80 border-techstar-blue" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do WhatsApp (com DD, ex: +244 9xx xxx xxx)</FormLabel>
                  <FormControl>
                    <Input placeholder="+244 9xx xxx xxx" {...field} className="bg-muted/80 border-techstar-blue" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="seu.email@exemplo.com" {...field} className="bg-muted/80 border-techstar-blue" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="escolaridade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escolaridade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/80 border-techstar-blue">
                        <SelectValue placeholder="Selecione sua escolaridade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="basico">Ensino Básico</SelectItem>
                      <SelectItem value="medio">Ensino Médio</SelectItem>
                      <SelectItem value="tecnico">Ensino Técnico</SelectItem>
                      <SelectItem value="universitario">Ensino Universitário</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-techstar-blue text-glow">Cursos de Interesse</h2>
            
            <FormField
              control={form.control}
              name="cursos"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Cursos de Interesse (selecione pelo menos um)</FormLabel>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {cursos.map((curso) => (
                      <FormField
                        key={curso.id}
                        control={form.control}
                        name="cursos"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={curso.id}
                              className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2 hover:bg-muted/50"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(curso.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...field.value, curso.id]
                                      : field.value?.filter(
                                          (value) => value !== curso.id
                                        );
                                    field.onChange(updatedValue);
                                    handleCursosChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {curso.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {showOutroCurso && (
              <FormField
                control={form.control}
                name="outroCurso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especifique outro curso</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o curso de interesse" {...field} className="bg-muted/80 border-techstar-blue" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="nivelConhecimento"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Nível de Conhecimento</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="iniciante" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Iniciante
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="intermedio" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Intermédio
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="avancado" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Avançado
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-techstar-blue text-glow">Outras Informações</h2>
            
            <FormField
              control={form.control}
              name="comoSoube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Como soube da TECH_STAR?</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleComoSoubeChange(value);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-muted/80 border-techstar-blue">
                        <SelectValue placeholder="Selecione como soube da TECH_STAR" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="amigos">Amigos</SelectItem>
                      <SelectItem value="redes_sociais">Redes Sociais</SelectItem>
                      <SelectItem value="eventos">Eventos</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {showOutroComoSoube && (
              <FormField
                control={form.control}
                name="outroComoSoube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especifique como soube</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite como soube da TECH_STAR" {...field} className="bg-muted/80 border-techstar-blue" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full tech-gradient hover:opacity-90 transition-all duration-300 box-glow"
          >
            {isSubmitting ? "Enviando..." : "Enviar Inscrição"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TechStarForm;
