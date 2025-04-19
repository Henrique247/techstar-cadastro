
export interface Membro {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  data_entrada: string;
  data_nascimento: string | null;
  endereco: string | null;
  observacoes: string | null;
  criado_em: string;
  atualizado_em: string;
}

export type NovoMembro = Omit<Membro, 'id' | 'criado_em' | 'atualizado_em'>;
