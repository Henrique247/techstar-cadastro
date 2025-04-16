
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface AddEventoDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (evento: any) => void;
}

const AddEventoDialog = ({ open, onClose, onSave }: AddEventoDialogProps) => {
  const [formData, setFormData] = useState({
    titulo: "",
    data: new Date().toISOString().split('T')[0],
    horario: "10:00",
    local: "",
    descricao: "",
    responsavel: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.data || !formData.local) {
      toast.error("Por favor, preencha os campos obrigatórios");
      return;
    }
    
    onSave(formData);
    toast.success("Evento adicionado com sucesso!");
    setFormData({
      titulo: "",
      data: new Date().toISOString().split('T')[0],
      horario: "10:00",
      local: "",
      descricao: "",
      responsavel: ""
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Adicionar novo evento</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do evento para adicionar ao calendário da igreja
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="titulo" className="text-right">
                Título
              </Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="data" className="text-right">
                Data
              </Label>
              <Input
                id="data"
                name="data"
                type="date"
                value={formData.data}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="horario" className="text-right">
                Horário
              </Label>
              <Input
                id="horario"
                name="horario"
                type="time"
                value={formData.horario}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="local" className="text-right">
                Local
              </Label>
              <Input
                id="local"
                name="local"
                value={formData.local}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsavel" className="text-right">
                Responsável
              </Label>
              <Input
                id="responsavel"
                name="responsavel"
                value={formData.responsavel}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="descricao" className="text-right pt-2">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventoDialog;
