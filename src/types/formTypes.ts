
import { z } from "zod";

export const formSchema = z.object({
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

export type FormValues = z.infer<typeof formSchema>;

export const cursos = [
  { id: "design", label: "Design Gráfico" },
  { id: "logica", label: "Lógica de Programação" },
  { id: "ia", label: "Inteligência Artificial" },
  { id: "programacao", label: "Programação Iniciante" },
  { id: "informatica", label: "Curso de Informática" },
  { id: "eletronica", label: "Eletrônica Básica" },
  { id: "outro", label: "Outro" },
];
