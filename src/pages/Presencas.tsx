
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  CalendarIcon, 
  Users, 
  Loader2, 
  Search, 
  ChevronRight,
  Check,
  X,
  UserX 
} from "lucide-react";
import { usePresencas } from "@/hooks/usePresencas";
import type { NovaPresenca } from "@/types/models";

const Presencas = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCulto, setSelectedCulto] = useState<"Quarta" | "Sexta" | "Domingo">("Domingo");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("registrar");
  
  const { 
    membros,
    isLoading,
    registrarPresenca,
    obterPresencasPorData,
    contarPresentesPorData,
    gerarRelatorioFaltas
  } = usePresencas();

  const [relatorioFaltas, setRelatorioFaltas] = useState<any[]>([]);
  const [carregandoRelatorio, setCarregandoRelatorio] = useState(false);

  // Formatação de data para o Supabase (YYYY-MM-DD)
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  // Carregar relatório de faltas quando a aba for alterada
  useEffect(() => {
    if (selectedTab === "relatorio") {
      carregarRelatorioFaltas();
    }
  }, [selectedTab]);

  const carregarRelatorioFaltas = async () => {
    setCarregandoRelatorio(true);
    try {
      const relatorio = await gerarRelatorioFaltas(4); // Últimas 4 semanas
      setRelatorioFaltas(relatorio);
    } catch (error) {
      console.error("Erro ao carregar relatório de faltas", error);
    } finally {
      setCarregandoRelatorio(false);
    }
  };

  const handlePresencaChange = async (membroId: string, presente: boolean) => {
    const novaPresenca: NovaPresenca = {
      membro_id: membroId,
      data: formattedDate,
      culto: selectedCulto,
      presente
    };

    await registrarPresenca.mutateAsync(novaPresenca);
  };

  const totalPresentes = contarPresentesPorData(formattedDate, selectedCulto);
  const presencasDoDia = obterPresencasPorData(formattedDate, selectedCulto);
  
  // Filtra membros para mostrar na lista
  const filteredMembros = membros?.filter(membro => 
    membro.nome.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Verifica se um membro está presente na data/culto selecionados
  const isMembroPresente = (membroId: string) => {
    const presenca = presencasDoDia.find(p => p.membro_id === membroId);
    return presenca ? presenca.presente : false;
  };

  // Categoriza os membros do relatório
  const membrosFaltantesGrupos = {
    faltasTres: relatorioFaltas.filter(m => m.faltas_consecutivas >= 3),
    faltasDuas: relatorioFaltas.filter(m => m.faltas_consecutivas === 2),
    faltasUma: relatorioFaltas.filter(m => m.faltas_consecutivas === 1)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-800">Controle de Presenças</h1>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="registrar">Registrar Presenças</TabsTrigger>
          <TabsTrigger value="relatorio">Relatório de Faltas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="registrar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Data do Culto</CardTitle>
                <CardDescription>Selecione a data para o registro de presenças</CardDescription>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, 'PPP', { locale: ptBR })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Culto</CardTitle>
                <CardDescription>Selecione o dia da semana</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedCulto} onValueChange={(value) => setSelectedCulto(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o culto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quarta">Culto de Quarta</SelectItem>
                    <SelectItem value="Sexta">Culto de Sexta</SelectItem>
                    <SelectItem value="Domingo">Culto de Domingo</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
                <CardDescription>Informações sobre a presença</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-indigo-100 p-3">
                    <Users className="h-6 w-6 text-indigo-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Presentes</p>
                    <p className="text-3xl font-bold text-indigo-700">
                      {totalPresentes} 
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        / {filteredMembros.length}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lista de Presença</CardTitle>
                <div className="relative w-[250px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Buscar membros..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <CardDescription>
                Marque os membros presentes no culto de {selectedCulto.toLowerCase()}, {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              ) : filteredMembros.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Presente</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembros.map((membro) => (
                      <TableRow key={membro.id}>
                        <TableCell className="font-medium">{membro.nome}</TableCell>
                        <TableCell>
                          {membro.categoria && (
                            <Badge variant="outline">{membro.categoria}</Badge>
                          )}
                        </TableCell>
                        <TableCell>{membro.funcao || "—"}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={isMembroPresente(membro.id)}
                            onCheckedChange={(checked) => 
                              handlePresencaChange(membro.id, checked === true)
                            }
                            disabled={registrarPresenca.isPending}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum membro encontrado
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorio" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Relatório de Faltas</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={carregarRelatorioFaltas}
                    disabled={carregandoRelatorio}
                  >
                    {carregandoRelatorio ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Atualizar Relatório
                  </Button>
                </div>
                <CardDescription>
                  Membros com ausências registradas nas últimas semanas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {carregandoRelatorio ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                        <UserX className="h-5 w-5 mr-2" />
                        Três ou mais faltas consecutivas
                      </h3>
                      {membrosFaltantesGrupos.faltasTres.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nome</TableHead>
                              <TableHead>Categoria</TableHead>
                              <TableHead>Faltas Consecutivas</TableHead>
                              <TableHead>Última Presença</TableHead>
                              <TableHead>Ação</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {membrosFaltantesGrupos.faltasTres.map((relatorio) => {
                              const membro = membros?.find(m => m.id === relatorio.membro_id);
                              return (
                                <TableRow key={relatorio.membro_id} className="bg-red-50">
                                  <TableCell className="font-medium">{relatorio.nome_membro}</TableCell>
                                  <TableCell>{membro?.categoria || "—"}</TableCell>
                                  <TableCell>
                                    <Badge variant="destructive">{relatorio.faltas_consecutivas}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    {relatorio.ultima_presenca 
                                      ? format(new Date(relatorio.ultima_presenca), 'dd/MM/yyyy')
                                      : "Nunca presente"}
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => navigate(`/membros?id=${relatorio.membro_id}`)}
                                    >
                                      Ver Detalhes
                                      <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                          Nenhum membro com três ou mais faltas consecutivas
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-amber-600 mb-3 flex items-center">
                        <X className="h-5 w-5 mr-2" />
                        Duas faltas consecutivas
                      </h3>
                      {membrosFaltantesGrupos.faltasDuas.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nome</TableHead>
                              <TableHead>Categoria</TableHead>
                              <TableHead>Faltas Consecutivas</TableHead>
                              <TableHead>Última Presença</TableHead>
                              <TableHead>Ação</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {membrosFaltantesGrupos.faltasDuas.map((relatorio) => {
                              const membro = membros?.find(m => m.id === relatorio.membro_id);
                              return (
                                <TableRow key={relatorio.membro_id} className="bg-amber-50">
                                  <TableCell className="font-medium">{relatorio.nome_membro}</TableCell>
                                  <TableCell>{membro?.categoria || "—"}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                      {relatorio.faltas_consecutivas}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {relatorio.ultima_presenca 
                                      ? format(new Date(relatorio.ultima_presenca), 'dd/MM/yyyy')
                                      : "Nunca presente"}
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => navigate(`/membros?id=${relatorio.membro_id}`)}
                                    >
                                      Ver Detalhes
                                      <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                          Nenhum membro com duas faltas consecutivas
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-blue-600 mb-3 flex items-center">
                        <Check className="h-5 w-5 mr-2" />
                        Uma falta consecutiva
                      </h3>
                      {membrosFaltantesGrupos.faltasUma.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nome</TableHead>
                              <TableHead>Categoria</TableHead>
                              <TableHead>Faltas Consecutivas</TableHead>
                              <TableHead>Última Presença</TableHead>
                              <TableHead>Ação</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {membrosFaltantesGrupos.faltasUma.map((relatorio) => {
                              const membro = membros?.find(m => m.id === relatorio.membro_id);
                              return (
                                <TableRow key={relatorio.membro_id} className="bg-blue-50">
                                  <TableCell className="font-medium">{relatorio.nome_membro}</TableCell>
                                  <TableCell>{membro?.categoria || "—"}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                      {relatorio.faltas_consecutivas}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {relatorio.ultima_presenca 
                                      ? format(new Date(relatorio.ultima_presenca), 'dd/MM/yyyy')
                                      : "Nunca presente"}
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => navigate(`/membros?id=${relatorio.membro_id}`)}
                                    >
                                      Ver Detalhes
                                      <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                          Nenhum membro com uma falta consecutiva
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Presencas;
