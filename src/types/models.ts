
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
  idade: number | null;
  genero: 'Masculino' | 'Feminino' | 'Outro' | null;
  categoria: 'Jovem' | 'Mamã' | 'Papá' | 'Visitante' | 'Outro' | null;
  status: 'Ativo' | 'Inativo' | null;
  funcao: 'Obreiro' | 'Discípulo' | 'Em formação' | 'Outro' | null;
}

export type NovoMembro = Omit<Membro, 'id' | 'criado_em' | 'atualizado_em'>;

export interface Presenca {
  id: string;
  membro_id: string;
  data: string;
  culto: 'Quarta' | 'Sexta' | 'Domingo';
  presente: boolean;
  criado_em: string;
  atualizado_em: string;
}

export type NovaPresenca = Omit<Presenca, 'id' | 'criado_em' | 'atualizado_em'>;

export interface RelatorioFaltas {
  membro_id: string;
  nome_membro: string;
  faltas_consecutivas: number;
  ultima_presenca: string | null;
  cultos_ausentes: {
    data: string;
    culto: string;
  }[];
}
