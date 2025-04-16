
import { useState, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormValues } from "@/types/formTypes";

const OtherInfoFields = () => {
  const [showOutroComoSoube, setShowOutroComoSoube] = useState(false);
  const form = useFormContext<FormValues>();
  
  // Use useWatch to react to changes in the comoSoube field
  const comoSoube = useWatch({
    control: form.control,
    name: "comoSoube",
    defaultValue: "amigos"
  });
  
  // Update showOutroComoSoube based on selected value
  useEffect(() => {
    if (comoSoube === "outros") {
      setShowOutroComoSoube(true);
    } else {
      setShowOutroComoSoube(false);
      form.setValue("outroComoSoube", "");
    }
  }, [comoSoube, form]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-techstar-blue text-glow">Outras Informações</h2>
      
      <FormField
        control={form.control}
        name="comoSoube"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Como soube da TECH_STAR?</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="bg-muted/80 border-techstar-blue">
                  <SelectValue placeholder="Selecione como soube da TECH_STAR" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="amigos">Amigos</SelectItem>
                <SelectItem value="redes_sociais">Redes Sociais</SelectItem>
                <SelectItem value="eventos">Eventos</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {showOutroComoSoube && (
        <FormField
          control={form.control}
          name="outroComoSoube"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especifique como soube</FormLabel>
              <FormControl>
                <Input placeholder="Digite como soube da TECH_STAR" {...field} className="bg-muted/80 border-techstar-blue" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default OtherInfoFields;
