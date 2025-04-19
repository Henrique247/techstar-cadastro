
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Edit, Trash2, User, Loader2 } from "lucide-react";
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
import AddMembroDialog from "@/components/membros/AddMembroDialog";
import { useMembros } from "@/hooks/useMembros";
import type { Membro } from "@/types/models";

const Membros = () => {
  const { membros, isLoading, adicionarMembro, removerMembro } = useMembros();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [membroToDelete, setMembroToDelete] = useState<Membro | null>(null);

  const filteredMembros = membros?.filter(membro =>
    membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (membro.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  ) ?? [];

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-800">Gestão de Membros</h1>
        <Button onClick={() => setDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar Membro
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar membros..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableCaption>Lista de membros da igreja</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data de Entrada</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
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
                  <TableCell>{membro.telefone || "—"}</TableCell>
                  <TableCell>{membro.email || "—"}</TableCell>
                  <TableCell>{new Date(membro.data_entrada).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
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
                <TableCell colSpan={5} className="text-center py-6">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <User className="h-12 w-12 mb-2 opacity-20" />
                    <p>Nenhum membro encontrado</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddMembroDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        onSave={async (novoMembro) => {
          await adicionarMembro.mutateAsync(novoMembro);
          setDialogOpen(false);
        }} 
      />

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
