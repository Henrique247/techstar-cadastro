
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Membro, Presenca, NovaPresenca, RelatorioFaltas } from "@/types/models";
import { toast } from "sonner";

export function usePresencas() {
  const queryClient = useQueryClient();

  const { data: presencas, isLoading: isLoadingPresencas } = useQuery({
    queryKey: ['presencas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('presencas')
        .select(`
          id,
          membro_id,
          data,
          culto,
          presente,
          criado_em,
          atualizado_em
        `)
        .order('data', { ascending: false });
      
      if (error) {
        toast.error('Erro ao carregar registros de presença');
        throw error;
      }
      
      return data as Presenca[];
    }
  });

  const { data: membros, isLoading: isLoadingMembros } = useQuery({
    queryKey: ['membros'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('membros')
        .select('*')
        .eq('status', 'Ativo')
        .order('nome');
      
      if (error) {
        toast.error('Erro ao carregar membros');
        throw error;
      }
      
      return data as Membro[];
    }
  });

  const registrarPresenca = useMutation({
    mutationFn: async (novaPresenca: NovaPresenca) => {
      // Verificar se já existe um registro para este membro, data e culto
      const { data: existing } = await supabase
        .from('presencas')
        .select()
        .eq('membro_id', novaPresenca.membro_id)
        .eq('data', novaPresenca.data)
        .eq('culto', novaPresenca.culto)
        .limit(1);
      
      if (existing && existing.length > 0) {
        // Atualizar registro existente
        const { data, error } = await supabase
          .from('presencas')
          .update({ presente: novaPresenca.presente })
          .eq('id', existing[0].id)
          .select()
          .single();

        if (error) {
          toast.error('Erro ao atualizar presença');
          throw error;
        }

        toast.success('Presença atualizada com sucesso!');
        return data;
      } else {
        // Criar novo registro
        const { data, error } = await supabase
          .from('presencas')
          .insert([novaPresenca])
          .select()
          .single();

        if (error) {
          toast.error('Erro ao registrar presença');
          throw error;
        }

        toast.success('Presença registrada com sucesso!');
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presencas'] });
    }
  });

  const obterPresencasPorData = (data: string, culto: string) => {
    if (!presencas) return [];
    return presencas.filter(p => p.data === data && p.culto === culto);
  };

  const obterPresencasPorMembro = (membroId: string) => {
    if (!presencas) return [];
    return presencas.filter(p => p.membro_id === membroId);
  };

  const contarPresentesPorData = (data: string, culto: string) => {
    const presencasDoDia = obterPresencasPorData(data, culto);
    return presencasDoDia.filter(p => p.presente).length;
  };

  const gerarRelatorioFaltas = async (numSemanas = 4) => {
    if (!membros || !presencas) return [];

    const hoje = new Date();
    const dataInicioRelatorio = new Date();
    dataInicioRelatorio.setDate(hoje.getDate() - (numSemanas * 7));
    
    const relatorioFaltas: RelatorioFaltas[] = membros
      .filter(membro => membro.status === 'Ativo')
      .map(membro => {
        const presencasDoMembro = presencas.filter(
          p => p.membro_id === membro.id && 
          new Date(p.data) >= dataInicioRelatorio &&
          p.presente
        );
        
        const ultimaPresenca = presencasDoMembro.length > 0 
          ? presencasDoMembro.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0].data
          : null;
        
        const faltasConsecutivas = calcularFaltasConsecutivas(membro.id, presencas);
        
        const cultosAusentes = presencas
          .filter(p => 
            p.membro_id === membro.id && 
            !p.presente && 
            new Date(p.data) >= dataInicioRelatorio
          )
          .map(p => ({ data: p.data, culto: p.culto }));
        
        return {
          membro_id: membro.id,
          nome_membro: membro.nome,
          faltas_consecutivas: faltasConsecutivas,
          ultima_presenca: ultimaPresenca,
          cultos_ausentes: cultosAusentes
        };
      })
      .filter(relatorio => relatorio.faltas_consecutivas > 0)
      .sort((a, b) => b.faltas_consecutivas - a.faltas_consecutivas);
    
    return relatorioFaltas;
  };

  const calcularFaltasConsecutivas = (membroId: string, todasPresencas: Presenca[]) => {
    const presencasDoMembro = todasPresencas
      .filter(p => p.membro_id === membroId)
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    
    let faltasConsecutivas = 0;
    
    for (const presenca of presencasDoMembro) {
      if (!presenca.presente) {
        faltasConsecutivas++;
      } else {
        break;
      }
    }
    
    return faltasConsecutivas;
  };

  return {
    presencas,
    membros,
    isLoading: isLoadingPresencas || isLoadingMembros,
    registrarPresenca,
    obterPresencasPorData,
    obterPresencasPorMembro,
    contarPresentesPorData,
    gerarRelatorioFaltas
  };
}
