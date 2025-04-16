
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormValues, cursos } from "@/types/formTypes";

const CourseFields = () => {
  const [showOutroCurso, setShowOutroCurso] = useState(false);
  const form = useFormContext<FormValues>();
  
  // Use useWatch to react to changes in the cursos field
  const selectedCursos = useWatch({
    control: form.control,
    name: "cursos",
    defaultValue: []
  });
  
  // Update showOutroCurso based on selected cursos
  useEffect(() => {
    if (selectedCursos.includes("outro")) {
      setShowOutroCurso(true);
    } else {
      setShowOutroCurso(false);
      form.setValue("outroCurso", "");
    }
  }, [selectedCursos, form]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-techstar-blue text-glow">Cursos de Interesse</h2>
      
      <FormField
        control={form.control}
        name="cursos"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>Cursos de Interesse (selecione pelo menos um)</FormLabel>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {cursos.map((curso) => (
                <FormField
                  key={curso.id}
                  control={form.control}
                  name="cursos"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={curso.id}
                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2 hover:bg-muted/50"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(curso.id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...field.value, curso.id]
                                : field.value?.filter(
                                    (value) => value !== curso.id
                                  );
                              field.onChange(updatedValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {curso.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {showOutroCurso && (
        <FormField
          control={form.control}
          name="outroCurso"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especifique outro curso</FormLabel>
              <FormControl>
                <Input placeholder="Digite o curso de interesse" {...field} className="bg-muted/80 border-techstar-blue" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      <FormField
        control={form.control}
        name="nivelConhecimento"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Nível de Conhecimento</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="iniciante" />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Iniciante
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="intermedio" />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Intermédio
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="avancado" />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Avançado
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CourseFields;
