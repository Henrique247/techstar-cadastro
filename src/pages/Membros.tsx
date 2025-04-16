
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Edit, Trash2, User } from "lucide-react";
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
import AddMembroDialog from "@/components/membros/AddMembroDialog";

// Mock data para teste
const membrosMock = [
  { id: 1, nome: "João Silva", telefone: "(11) 98765-4321", email: "joao@exemplo.com", dataEntrada: "2018-05-12" },
  { id: 2, nome: "Maria Oliveira", telefone: "(11) 91234-5678", email: "maria@exemplo.com", dataEntrada: "2019-03-22" },
  { id: 3, nome: "Pedro Santos", telefone: "(11) 98888-7777", email: "pedro@exemplo.com", dataEntrada: "2020-01-15" },
];

const Membros = () => {
  const [membros, setMembros] = useState(membrosMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredMembros = membros.filter(membro => 
    membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    membro.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adicionarMembro = (novoMembro: any) => {
    setMembros([...membros, { ...novoMembro, id: membros.length + 1 }]);
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
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data de Entrada</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembros.length > 0 ? (
              filteredMembros.map((membro) => (
                <TableRow key={membro.id}>
                  <TableCell>{membro.id}</TableCell>
                  <TableCell className="font-medium">{membro.nome}</TableCell>
                  <TableCell>{membro.telefone}</TableCell>
                  <TableCell>{membro.email}</TableCell>
                  <TableCell>{new Date(membro.dataEntrada).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
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

      <AddMembroDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={adicionarMembro} />
    </div>
  );
};

export default Membros;
