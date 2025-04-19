
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Loader2 } from "lucide-react";
import type { NovoMembro } from "@/types/models";

interface AddMembroDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (membro: NovoMembro) => void;
  isSaving?: boolean;
}

const AddMembroDialog = ({ open, onClose, onSave, isSaving = false }: AddMembroDialogProps) => {
  const [formData, setFormData] = useState<NovoMembro>({
    nome: "",
    telefone: "",
    email: "",
    data_entrada: new Date().toISOString().split('T')[0],
    data_nascimento: "",
    endereco: "",
    observacoes: "",
    idade: null,
    genero: null,
    categoria: null,
    status: "Ativo", // Default value
    funcao: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "idade" && value ? Number(value) : (value || null) 
    }));

    // Validação básica
    validateField(name, value);
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateField = (name: string, value: string) => {
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

    if (name === "idade" && value && (isNaN(Number(value)) || Number(value) < 0)) {
      setErrors(prev => ({ ...prev, idade: "Idade inválida" }));
    } else if (name === "idade") {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.idade;
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
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      telefone: "",
      email: "",
      data_entrada: new Date().toISOString().split('T')[0],
      data_nascimento: "",
      endereco: "",
      observacoes: "",
      idade: null,
      genero: null,
      categoria: null,
      status: "Ativo", // Default value
      funcao: null
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
              <Label htmlFor="idade" className="text-right">
                Idade
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="idade"
                  name="idade"
                  type="number"
                  value={formData.idade || ""}
                  onChange={handleChange}
                  className={`${errors.idade ? 'border-red-500' : ''}`}
                />
                {errors.idade && (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.idade}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genero" className="text-right">
                Gênero
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.genero || ""}
                  onValueChange={(value) => handleSelectChange("genero", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria" className="text-right">
                Categoria
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.categoria || ""}
                  onValueChange={(value) => handleSelectChange("categoria", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jovem">Jovem</SelectItem>
                    <SelectItem value="Mamã">Mamã</SelectItem>
                    <SelectItem value="Papá">Papá</SelectItem>
                    <SelectItem value="Visitante">Visitante</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.status || "Ativo"}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="funcao" className="text-right">
                Função na Igreja
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.funcao || ""}
                  onValueChange={(value) => handleSelectChange("funcao", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Obreiro">Obreiro</SelectItem>
                    <SelectItem value="Discípulo">Discípulo</SelectItem>
                    <SelectItem value="Em formação">Em formação</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving || Object.keys(errors).length > 0}
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

export default AddMembroDialog;
