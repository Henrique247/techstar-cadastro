
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar as CalendarIcon, Clock, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddEventoDialog from "@/components/eventos/AddEventoDialog";

// Mock data para teste
const eventosMock = [
  { 
    id: 1, 
    titulo: "Culto de Domingo", 
    data: "2025-04-20", 
    horario: "10:00", 
    local: "Templo Principal", 
    descricao: "Culto dominical com pregação especial."
  },
  { 
    id: 2, 
    titulo: "Encontro de Jovens", 
    data: "2025-04-25", 
    horario: "19:30", 
    local: "Salão Social", 
    descricao: "Encontro para jovens com louvor e atividades."
  },
  { 
    id: 3, 
    titulo: "Reunião de Oração", 
    data: "2025-04-22", 
    horario: "20:00", 
    local: "Sala de Estudos", 
    descricao: "Momento de intercessão e oração."
  },
];

const Eventos = () => {
  const [eventos, setEventos] = useState(eventosMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredEventos = eventos.filter(evento => 
    evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    evento.local.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adicionarEvento = (novoEvento: any) => {
    setEventos([...eventos, { ...novoEvento, id: eventos.length + 1 }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-indigo-800">Eventos da Igreja</h1>
        <Button onClick={() => setDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar Evento
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar eventos..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredEventos.map((evento) => (
          <div key={evento.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="bg-indigo-600 text-white p-4">
              <h3 className="font-bold text-xl">{evento.titulo}</h3>
            </div>
            <div className="p-4 flex-1 flex flex-col space-y-3">
              <div className="flex items-start space-x-2">
                <CalendarIcon className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="font-medium">Data</p>
                  <p>{new Date(evento.data).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Clock className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="font-medium">Horário</p>
                  <p>{evento.horario}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="font-medium">Local</p>
                  <p>{evento.local}</p>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="font-medium">Descrição</p>
                <p className="text-gray-600">{evento.descricao}</p>
              </div>
            </div>
            <div className="border-t p-4 flex justify-end space-x-2">
              <Button variant="outline" size="sm">Editar</Button>
              <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                Remover
              </Button>
            </div>
          </div>
        ))}
        
        {filteredEventos.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <CalendarIcon className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-xl font-medium">Nenhum evento encontrado</p>
            <p>Crie um novo evento ou refine sua busca</p>
          </div>
        )}
      </div>

      <AddEventoDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={adicionarEvento} />
    </div>
  );
};

export default Eventos;
