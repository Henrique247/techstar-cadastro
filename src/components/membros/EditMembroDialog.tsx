
import { useState, useEffect } from "react";
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
import { AlertCircle, Check, Loader2 } from "lucide-react";
import type { Membro } from "@/types/models";

interface EditMembroDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (membro: Partial<Membro> & { id: string }) => void;
  membro: Membro;
  isSaving?: boolean;
}

const EditMembroDialog = ({ 
  open, 
  onClose, 
  onSave, 
  membro,
  isSaving = false
}: EditMembroDialogProps) => {
  const [formData, setFormData] = useState<Membro>(membro);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(membro);
    setHasChanges(false);
    setErrors({});
  }, [membro]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value || null };
      // Comparar o campo com o valor original para detectar mudanças
      const originalValue = membro[name as keyof Membro];
      const hasFieldChanged = value !== (originalValue || "");
      
      // Se algum campo mudou, marcar como tendo mudanças
      if (hasFieldChanged || hasChanges) {
        setHasChanges(true);
      }
      
      return newData;
    });

    // Validação básica
    if (name === "nome" && !value.trim()) {
      setErrors(prev => ({ ...prev, nome: "Nome é obrigatório" }));
    } else if (name === "nome" && value.trim()) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.nome;
        return newErrors;
      });
    }
    
    if (name === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      setErrors(prev => ({ ...prev, email: "Email inválido" }));
    } else if (name === "email") {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar validação antes de enviar
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    if (!formData.nome || !formData.data_entrada) {
      setErrors({
        ...(!formData.nome ? { nome: "Nome é obrigatório" } : {}),
        ...(!formData.data_entrada ? { data_entrada: "Data de entrada é obrigatória" } : {})
      });
      return;
    }
    
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar membro</DialogTitle>
          <DialogDescription>
            Atualize os dados do membro
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`${errors.nome ? 'border-red-500' : ''}`}
                  required
                />
                {errors.nome && (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.nome}
                  </p>
                )}
              </div>
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
              <div className="col-span-3 space-y-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className={`${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="data_entrada" className="text-right">
                Data de Entrada
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="data_entrada"
                  name="data_entrada"
                  type="date"
                  value={formData.data_entrada}
                  onChange={handleChange}
                  className={`${errors.data_entrada ? 'border-red-500' : ''}`}
                  required
                />
                {errors.data_entrada && (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.data_entrada}
                  </p>
                )}
              </div>
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
            <div className="flex flex-1 items-center justify-start text-sm text-muted-foreground">
              {hasChanges && (
                <span className="flex items-center text-amber-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Alterações não salvas
                </span>
              )}
              {!hasChanges && !isSaving && (
                <span className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  Sem alterações
                </span>
              )}
            </div>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!hasChanges || isSaving || Object.keys(errors).length > 0}
              className="min-w-[100px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMembroDialog;
