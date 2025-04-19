
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
import type { NovoMembro } from "@/types/models";

interface AddMembroDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (membro: NovoMembro) => void;
}

const AddMembroDialog = ({ open, onClose, onSave }: AddMembroDialogProps) => {
  const [formData, setFormData] = useState<NovoMembro>({
    nome: "",
    telefone: "",
    email: "",
    data_entrada: new Date().toISOString().split('T')[0],
    data_nascimento: "",
    endereco: "",
    observacoes: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value || null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      nome: "",
      telefone: "",
      email: "",
      data_entrada: new Date().toISOString().split('T')[0],
      data_nascimento: "",
      endereco: "",
      observacoes: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Adicionar novo membro</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo membro da igreja
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
              <Label htmlFor="telefone" className="text-right">
                Telefone
              </Label>
              <Input
                id="telefone"
                name="telefone"
                value={formData.telefone || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="data_entrada" className="text-right">
                Data de Entrada
              </Label>
              <Input
                id="data_entrada"
                name="data_entrada"
                type="date"
                value={formData.data_entrada}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="data_nascimento" className="text-right">
                Data de Nascimento
              </Label>
              <Input
                id="data_nascimento"
                name="data_nascimento"
                type="date"
                value={formData.data_nascimento || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endereco" className="text-right">
                Endereço
              </Label>
              <Input
                id="endereco"
                name="endereco"
                value={formData.endereco || ""}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="observacoes" className="text-right pt-2">
                Observações
              </Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes || ""}
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

export default AddMembroDialog;
