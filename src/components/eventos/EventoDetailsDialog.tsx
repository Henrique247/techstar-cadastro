
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventoDetailsDialogProps {
  evento: {
    id: number;
    titulo: string;
    data: string;
    horario: string;
    local: string;
    descricao: string;
    responsavel?: string;
  };
  open: boolean;
  onClose: () => void;
}

const EventoDetailsDialog = ({ evento, open, onClose }: EventoDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{evento.titulo}</DialogTitle>
          <DialogDescription>
            Detalhes do evento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="font-medium">Data</p>
              <p>{format(parseISO(evento.data), 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="font-medium">Horário</p>
              <p>{evento.horario}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="font-medium">Local</p>
              <p>{evento.local}</p>
            </div>
          </div>

          {evento.responsavel && (
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="font-medium">Responsável</p>
                <p>{evento.responsavel}</p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <p className="font-medium">Descrição</p>
            <p className="text-gray-700">{evento.descricao}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button>
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventoDetailsDialog;
