
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { 
  Info, 
  PlusCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, parseISO, isEqual, isSameMonth, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import AddEventoDialog from "@/components/eventos/AddEventoDialog";
import EventoDetailsDialog from "@/components/eventos/EventoDetailsDialog";

// Mock data para teste
const eventosMock = [
  { 
    id: 1, 
    titulo: "Culto de Domingo", 
    data: "2025-04-20", 
    horario: "10:00", 
    local: "Templo Principal", 
    descricao: "Culto dominical com pregação especial.",
    responsavel: "Pastor João"
  },
  { 
    id: 2, 
    titulo: "Encontro de Jovens", 
    data: "2025-04-25", 
    horario: "19:30", 
    local: "Salão Social", 
    descricao: "Encontro para jovens com louvor e atividades.",
    responsavel: "Líder de Jovens"
  },
  { 
    id: 3, 
    titulo: "Reunião de Oração", 
    data: "2025-04-22", 
    horario: "20:00", 
    local: "Sala de Estudos", 
    descricao: "Momento de intercessão e oração.",
    responsavel: "Equipe de Oração"
  },
  { 
    id: 4, 
    titulo: "Estudo Bíblico", 
    data: "2025-04-23", 
    horario: "19:00", 
    local: "Sala de Estudos", 
    descricao: "Estudo bíblico semanal.",
    responsavel: "Pastor Auxiliar"
  },
];

const Calendario = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [eventos, setEventos] = useState(eventosMock);
  const [selectedEvento, setSelectedEvento] = useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Função para obter eventos de um dia específico
  const getEventosDodia = (day: Date) => {
    return eventos.filter(evento => {
      const eventoDate = parseISO(evento.data);
      return isSameDay(eventoDate, day);
    });
  };

  // Função para adicionar um novo evento
  const adicionarEvento = (novoEvento: any) => {
    setEventos([...eventos, { ...novoEvento, id: eventos.length + 1 }]);
  };

  // Função para mostrar detalhes de um evento
  const showEventoDetails = (evento: any) => {
    setSelectedEvento(evento);
    setDetailsDialogOpen(true);
  };

  // Função para renderizar eventos do mês atual
  const renderEventosMes = () => {
    const eventosDoMes = eventos.filter(evento => {
      const eventoDate = parseISO(evento.data);
      return isSameMonth(eventoDate, date);
    }).sort((a, b) => {
      const dateA = parseISO(a.data);
      const dateB = parseISO(b.data);
      return dateA.getTime() - dateB.getTime();
    });

    return (
      <div className="space-y-2 mt-6">
        <h3 className="font-medium text-lg">Eventos de {format(date, 'MMMM yyyy', { locale: ptBR })}</h3>
        {eventosDoMes.length > 0 ? (
          <div className="divide-y">
            {eventosDoMes.map(evento => (
              <div 
                key={evento.id} 
                className="py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 px-2 rounded"
                onClick={() => showEventoDetails(evento)}
              >
                <div>
                  <p className="font-medium">{evento.titulo}</p>
                  <p className="text-sm text-gray-500">
                    {format(parseISO(evento.data), 'dd/MM/yyyy')} • {evento.horario} • {evento.local}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>Nenhum evento neste mês</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-indigo-800">Calendário da Igreja</h1>
        <Button onClick={() => setAddDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar Evento
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="bg-white p-4 rounded-lg shadow-md lg:w-1/2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{format(date, 'MMMM yyyy', { locale: ptBR })}</h2>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border"
            locale={ptBR}
            modifiers={{
              event: (date) => 
                eventos.some(evento => isSameDay(parseISO(evento.data), date)),
            }}
            modifiersClassNames={{
              event: "bg-indigo-100 font-bold text-indigo-800 rounded-md",
            }}
            components={{
              DayContent: (props) => {
                const eventosDodia = getEventosDodia(props.date);
                return (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {props.date.getDate()}
                    {eventosDodia.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md lg:w-1/2">
          {renderEventosMes()}
        </div>
      </div>

      <AddEventoDialog 
        open={addDialogOpen} 
        onClose={() => setAddDialogOpen(false)} 
        onSave={adicionarEvento} 
      />
      
      {selectedEvento && (
        <EventoDetailsDialog 
          evento={selectedEvento}
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default Calendario;
