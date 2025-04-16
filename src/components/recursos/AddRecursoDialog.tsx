
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface AddRecursoDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (recurso: any) => void;
}

const AddRecursoDialog = ({ open, onClose, onSave }: AddRecursoDialogProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    quantidade: 0,
    categoria: "",
    localizacao: "",
    observacoes: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "quantidade" ? Number(value) : value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.categoria || !formData.localizacao) {
      toast.error("Por favor, preencha os campos obrigatórios");
      return;
    }
    
    onSave(formData);
    toast.success("Recurso adicionado com sucesso!");
    setFormData({
      nome: "",
      quantidade: 0,
      categoria: "",
      localizacao: "",
      observacoes: ""
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Adicionar novo recurso</DialogTitle>
          <DialogDescription>
            Cadastre um novo recurso para o inventário da igreja
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantidade" className="text-right">
                Quantidade
              </Label>
              <Input
                id="quantidade"
                name="quantidade"
                type="number"
                min="0"
                value={formData.quantidade}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria" className="text-right">
                Categoria
              </Label>
              <Select 
                onValueChange={(value) => handleSelectChange("categoria", value)}
                value={formData.categoria}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Literatura">Literatura</SelectItem>
                  <SelectItem value="Equipamento de Som">Equipamento de Som</SelectItem>
                  <SelectItem value="Mobiliário">Mobiliário</SelectItem>
                  <SelectItem value="Material de Escritório">Material de Escritório</SelectItem>
                  <SelectItem value="Equipamento Eletrônico">Equipamento Eletrônico</SelectItem>
                  <SelectItem value="Música">Música</SelectItem>
                  <SelectItem value="Decoração">Decoração</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="localizacao" className="text-right">
                Localização
              </Label>
              <Input
                id="localizacao"
                name="localizacao"
                value={formData.localizacao}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="observacoes" className="text-right pt-2">
                Observações
              </Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
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

export default AddRecursoDialog;
