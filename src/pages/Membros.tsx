
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Edit, Trash2, User, Loader2, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddMembroDialog from "@/components/membros/AddMembroDialog";
import EditMembroDialog from "@/components/membros/EditMembroDialog";
import { useMembros } from "@/hooks/useMembros";
import type { Membro } from "@/types/models";

const Membros = () => {
  const { membros, isLoading, adicionarMembro, atualizarMembro, removerMembro, filtrarMembros } = useMembros();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<string | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [membroToEdit, setMembroToEdit] = useState<Membro | null>(null);
  const [membroToDelete, setMembroToDelete] = useState<Membro | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const filteredMembros = filtrarMembros(membros, searchTerm, selectedCategoria);

  const handleEdit = (membro: Membro) => {
    setMembroToEdit(membro);
    setEditDialogOpen(true);
  };

  const handleDelete = async (membro: Membro) => {
    setMembroToDelete(membro);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (membroToDelete) {
      await removerMembro.mutateAsync(membroToDelete.id);
      setDeleteDialogOpen(false);
      setMembroToDelete(null);
    }
  };

  const getStatusBadge = (status: string | null) => {
    if (status === "Ativo") {
      return <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>;
    } else if (status === "Inativo") {
      return <Badge className="bg-gray-500 hover:bg-gray-600">Inativo</Badge>;
    }
    return null;
  };

  const getCategoriaColor = (categoria: string | null) => {
    switch (categoria) {
      case "Jovem":
        return "bg-blue-100 text-blue-800";
      case "Mamã":
        return "bg-pink-100 text-pink-800";
      case "Papá":
        return "bg-indigo-100 text-indigo-800";
      case "Visitante":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categorias = ["Jovem", "Mamã", "Papá", "Visitante", "Outro"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-800">Gestão de Membros</h1>
        <Button onClick={() => setDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar Membro
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar membros..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Filtrar por:</span>
          <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>Todas as categorias</SelectItem>
              {categorias.map(categoria => (
                <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto">
          <Tabs value={viewMode} onValueChange={value => setViewMode(value as "table" | "cards")}>
            <TabsList>
              <TabsTrigger value="table">Tabela</TabsTrigger>
              <TabsTrigger value="cards">Cartões</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {viewMode === "table" ? (
          <Table>
            <TableCaption>Lista de membros da igreja</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Loader2 className="h-8 w-8 animate-spin mb-2" />
                      <p>Carregando membros...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredMembros.length > 0 ? (
                filteredMembros.map((membro) => (
                  <TableRow key={membro.id}>
                    <TableCell className="font-medium">{membro.nome}</TableCell>
                    <TableCell>
                      {membro.categoria && (
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoriaColor(membro.categoria)}`}>
                          {membro.categoria}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(membro.status)}</TableCell>
                    <TableCell>{membro.funcao || "—"}</TableCell>
                    <TableCell>{membro.telefone || "—"}</TableCell>
                    <TableCell>{membro.email || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(membro)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(membro)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <User className="h-12 w-12 mb-2 opacity-20" />
                      <p>Nenhum membro encontrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p>Carregando membros...</p>
                  </div>
                </div>
              ) : filteredMembros.length > 0 ? (
                filteredMembros.map((membro) => (
                  <Card key={membro.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{membro.nome}</CardTitle>
                          <CardDescription>
                            {membro.funcao || "Sem função definida"}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <span className="sr-only">Abrir menu</span>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(membro)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(membro)}
                              className="text-red-500 focus:text-red-500"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          {membro.categoria && (
                            <span className={`text-xs px-2 py-1 rounded-full ${getCategoriaColor(membro.categoria)}`}>
                              {membro.categoria}
                            </span>
                          )}
                          {getStatusBadge(membro.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                          <div>
                            <p className="text-gray-500">Telefone</p>
                            <p>{membro.telefone || "—"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Email</p>
                            <p className="truncate">{membro.email || "—"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Idade</p>
                            <p>{membro.idade || "—"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Entrada</p>
                            <p>{new Date(membro.data_entrada).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex justify-center items-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <User className="h-12 w-12 mb-2 opacity-20" />
                    <p>Nenhum membro encontrado</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AddMembroDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        onSave={async (novoMembro) => {
          await adicionarMembro.mutateAsync(novoMembro);
          setDialogOpen(false);
        }} 
        isSaving={adicionarMembro.isPending}
      />

      {membroToEdit && (
        <EditMembroDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setMembroToEdit(null);
          }}
          onSave={async (membroAtualizado) => {
            await atualizarMembro.mutateAsync(membroAtualizado);
            setEditDialogOpen(false);
            setMembroToEdit(null);
          }}
          membro={membroToEdit}
          isSaving={atualizarMembro.isPending}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o membro {membroToDelete?.nome}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Membros;
