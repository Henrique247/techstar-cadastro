
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { FormValues } from "@/types/formTypes";

const PersonalInfoFields = () => {
  const form = useFormContext<FormValues>();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-techstar-blue text-glow">Informações Pessoais</h2>
      
      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input placeholder="Digite seu nome completo" {...field} className="bg-muted/80 border-techstar-blue" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="idade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Idade</FormLabel>
            <FormControl>
              <Input placeholder="Digite sua idade" {...field} className="bg-muted/80 border-techstar-blue" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="whatsapp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número do WhatsApp (com DD, ex: +244 9xx xxx xxx)</FormLabel>
            <FormControl>
              <Input placeholder="+244 9xx xxx xxx" {...field} className="bg-muted/80 border-techstar-blue" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email (opcional)</FormLabel>
            <FormControl>
              <Input placeholder="seu.email@exemplo.com" {...field} className="bg-muted/80 border-techstar-blue" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="escolaridade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Escolaridade</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-muted/80 border-techstar-blue">
                  <SelectValue placeholder="Selecione sua escolaridade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="basico">Ensino Básico</SelectItem>
                <SelectItem value="medio">Ensino Médio</SelectItem>
                <SelectItem value="tecnico">Ensino Técnico</SelectItem>
                <SelectItem value="universitario">Ensino Universitário</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PersonalInfoFields;
