
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Membro, NovoMembro } from "@/types/models";
import { toast } from "sonner";

export function useMembros() {
  const queryClient = useQueryClient();

  const { data: membros, isLoading } = useQuery({
    queryKey: ['membros'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('membros')
        .select('*')
        .order('nome');
      
      if (error) {
        toast.error('Erro ao carregar membros');
        throw error;
      }
      
      return data as Membro[];
    }
  });

  const adicionarMembro = useMutation({
    mutationFn: async (novoMembro: NovoMembro) => {
      const { data, error } = await supabase
        .from('membros')
        .insert(novoMembro)
        .select()
        .single();

      if (error) {
        toast.error('Erro ao adicionar membro');
        throw error;
      }

      toast.success('Membro adicionado com sucesso!');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membros'] });
    }
  });

  const atualizarMembro = useMutation({
    mutationFn: async ({ id, ...membro }: Partial<Membro> & { id: string }) => {
      const { data, error } = await supabase
        .from('membros')
        .update(membro)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast.error('Erro ao atualizar membro');
        throw error;
      }

      toast.success('Membro atualizado com sucesso!');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membros'] });
    }
  });

  const removerMembro = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('membros')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Erro ao remover membro');
        throw error;
      }

      toast.success('Membro removido com sucesso!');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membros'] });
    }
  });

  const filtrarMembros = (membros: Membro[] | undefined, termo: string, categoria?: string) => {
    if (!membros) return [];
    
    return membros.filter(membro => {
      const matchesTermo = termo ? 
        membro.nome.toLowerCase().includes(termo.toLowerCase()) || 
        (membro.email?.toLowerCase() || "").includes(termo.toLowerCase()) : 
        true;
      
      const matchesCategoria = categoria ? membro.categoria === categoria : true;
      
      return matchesTermo && matchesCategoria;
    });
  };

  return {
    membros,
    isLoading,
    adicionarMembro,
    atualizarMembro,
    removerMembro,
    filtrarMembros
  };
}
