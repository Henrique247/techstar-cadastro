
import { toast } from "sonner";
import { FormValues, cursos } from "@/types/formTypes";

export const shareOnWhatsApp = (pdfBase64: string, data: FormValues) => {
  try {
    // Criar um Blob com o PDF para o link de download direto
    const byteCharacters = atob(pdfBase64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
    
    // Criar uma mensagem com um resumo detalhado da inscrição
    const message = encodeURIComponent(
      `*Novo Inscrito na TECH_STAR Academy!* 🚀\n\n` +
      `*Nome:* ${data.nome}\n` +
      `*Idade:* ${data.idade}\n` +
      `*WhatsApp:* ${data.whatsapp}\n` +
      `*Email:* ${data.email || "Não informado"}\n` +
      `*Escolaridade:* ${data.escolaridade}\n` +
      `*Cursos de Interesse:* ${data.cursos.map(curso => {
        if (curso === "outro") return data.outroCurso;
        return cursos.find(c => c.id === curso)?.label || curso;
      }).join(", ")}\n` +
      `*Nível de Conhecimento:* ${data.nivelConhecimento}\n` +
      `*Como soube da TECH_STAR:* ${data.comoSoube === "outros" ? data.outroComoSoube : data.comoSoube}\n\n` +
      `_PDF da ficha de inscrição está anexado._`
    );
    
    // Número do WhatsApp da empresa
    const whatsappNumber = "+244952993627";
    
    // Abrir o WhatsApp com a mensagem
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    
    // Como não podemos anexar diretamente o PDF via URL, criamos um link para download
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfUrl;
    downloadLink.download = `Inscrição_${data.nome}_TECHSTAR.pdf`;
    
    // Instruções para o usuário
    toast.success(
      "Inscrição enviada para o WhatsApp da TECH_STAR. Agora baixe o PDF para enviar como anexo.",
      {
        action: {
          label: "Baixar PDF",
          onClick: () => downloadLink.click()
        },
        duration: 10000
      }
    );
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar para WhatsApp:", error);
    toast.error("Ocorreu um erro ao preparar o envio. Por favor, tente novamente.");
    return false;
  }
};
