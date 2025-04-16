
import { jsPDF } from "jspdf";
import { FormValues, cursos } from "@/types/formTypes";

export const getEscolaridadeText = (escolaridade: string) => {
  const mapping: Record<string, string> = {
    basico: "Ensino Básico",
    medio: "Ensino Médio",
    tecnico: "Ensino Técnico",
    universitario: "Ensino Universitário",
    outro: "Outro",
  };
  return mapping[escolaridade] || escolaridade;
};

export const getNivelText = (nivel: string) => {
  const mapping: Record<string, string> = {
    iniciante: "Iniciante",
    intermedio: "Intermédio",
    avancado: "Avançado",
  };
  return mapping[nivel] || nivel;
};

export const getComoSoubeText = (comoSoube: string) => {
  const mapping: Record<string, string> = {
    amigos: "Através de amigos",
    redes_sociais: "Redes sociais",
    eventos: "Eventos",
    outros: "Outros",
  };
  return mapping[comoSoube] || comoSoube;
};

export const generatePDF = (data: FormValues) => {
  const doc = new jsPDF();
  
  try {
    doc.addImage("/lovable-uploads/ae2350f3-052b-4933-ae8a-41224cb96b20.png", "PNG", 15, 15, 40, 40);
  } catch (error) {
    console.error("Error adding image:", error);
  }
  
  doc.setFontSize(22);
  doc.setTextColor(56, 189, 248);
  doc.text("FICHA DE INSCRIÇÃO - TECH_STAR ACADEMY", 105, 30, { align: "center" });
  
  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  const startY = 50;
  const lineHeight = 8;
  let y = startY;
  
  doc.setFontSize(14);
  doc.setTextColor(56, 189, 248);
  doc.text("INFORMAÇÕES PESSOAIS", 20, y);
  y += lineHeight;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
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
  
  doc.setFontSize(14);
  doc.setTextColor(56, 189, 248);
  doc.text("CURSOS DE INTERESSE", 20, y);
  y += lineHeight;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
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
  
  doc.setFontSize(14);
  doc.setTextColor(56, 189, 248);
  doc.text("OUTRAS INFORMAÇÕES", 20, y);
  y += lineHeight;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  const comoSoubeText = data.comoSoube === "outros" 
    ? data.outroComoSoube 
    : getComoSoubeText(data.comoSoube);
    
  doc.text(`Como soube da TECH_STAR: ${comoSoubeText}`, 20, y);
  y += lineHeight * 3;
  
  doc.setDrawColor(56, 189, 248);
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  y += lineHeight;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("TECH_STAR Academy - Ficha de Inscrição", 105, y, { align: "center" });
  y += lineHeight;
  
  const dataAtual = new Date().toLocaleDateString();
  doc.text(`Data de inscrição: ${dataAtual}`, 105, y, { align: "center" });
  
  return doc;
};
