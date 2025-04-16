
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Package, Search, Edit, Trash2 } from "lucide-react";
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
import AddRecursoDialog from "@/components/recursos/AddRecursoDialog";

// Mock data para teste
const recursosMock = [
  { id: 1, nome: "Bíblias", quantidade: 50, categoria: "Literatura", localizacao: "Armário da Biblioteca" },
  { id: 2, nome: "Microfones", quantidade: 5, categoria: "Equipamento de Som", localizacao: "Sala de Áudio" },
  { id: 3, nome: "Cadeiras", quantidade: 200, categoria: "Mobiliário", localizacao: "Salão Principal" },
  { id: 4, nome: "Livros de Hinos", quantidade: 100, categoria: "Literatura", localizacao: "Armário da Biblioteca" },
];

const Recursos = () => {
  const [recursos, setRecursos] = useState(recursosMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredRecursos = recursos.filter(recurso => 
    recurso.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    recurso.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adicionarRecurso = (novoRecurso: any) => {
    setRecursos([...recursos, { ...novoRecurso, id: recursos.length + 1 }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-800">Gestão de Recursos</h1>
        <Button onClick={() => setDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Recurso
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar recursos..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableCaption>Lista de recursos da igreja</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecursos.length > 0 ? (
              filteredRecursos.map((recurso) => (
                <TableRow key={recurso.id}>
                  <TableCell>{recurso.id}</TableCell>
                  <TableCell className="font-medium">{recurso.nome}</TableCell>
                  <TableCell>{recurso.quantidade}</TableCell>
                  <TableCell>{recurso.categoria}</TableCell>
                  <TableCell>{recurso.localizacao}</TableCell>
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
                    <Package className="h-12 w-12 mb-2 opacity-20" />
                    <p>Nenhum recurso encontrado</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddRecursoDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={adicionarRecurso} />
    </div>
  );
};

export default Recursos;
