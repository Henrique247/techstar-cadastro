
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Package, PlusCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Dados mock para a página inicial
const dashboardData = {
  totalMembros: 125,
  totalEventos: 8,
  totalRecursos: 320,
  eventoProximos: [
    { 
      id: 1, 
      titulo: "Culto de Domingo", 
      data: "2025-04-20", 
      horario: "10:00", 
      local: "Templo Principal"
    },
    { 
      id: 2, 
      titulo: "Encontro de Jovens", 
      data: "2025-04-25", 
      horario: "19:30", 
      local: "Salão Social"
    },
  ],
  membrosMaisRecentes: [
    { id: 1, nome: "João Silva", dataEntrada: "2025-03-15" },
    { id: 2, nome: "Maria Oliveira", dataEntrada: "2025-03-22" },
    { id: 3, nome: "Pedro Santos", dataEntrada: "2025-04-05" },
  ]
};

const Index = () => {
  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold text-indigo-800 mb-4">Sistema de Gestão da Igreja</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Bem-vindo ao sistema de gestão da igreja. Gerencie membros, eventos, recursos e muito mais.
        </p>
      </section>

      {/* Cards de estatísticas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Total de Membros</p>
              <p className="text-3xl font-bold">{dashboardData.totalMembros}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/membros">
              <Button variant="outline" className="w-full">Ver Membros</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Eventos Agendados</p>
              <p className="text-3xl font-bold">{dashboardData.totalEventos}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/eventos">
              <Button variant="outline" className="w-full">Ver Eventos</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 mb-1">Total de Recursos</p>
              <p className="text-3xl font-bold">{dashboardData.totalRecursos}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/recursos">
              <Button variant="outline" className="w-full">Ver Recursos</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Próximos eventos e membros recentes */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-700 text-white px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Próximos Eventos</h2>
            <Link to="/eventos">
              <Button variant="ghost" className="text-white hover:bg-indigo-600">
                <PlusCircle className="h-4 w-4 mr-2" />
                Novo
              </Button>
            </Link>
          </div>
          <div className="p-6">
            {dashboardData.eventoProximos.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.eventoProximos.map(evento => (
                  <div key={evento.id} className="border-b pb-3 last:border-0">
                    <p className="font-medium text-lg">{evento.titulo}</p>
                    <div className="flex flex-wrap text-sm text-gray-500 mt-1">
                      <span className="mr-3">
                        {format(parseISO(evento.data), "dd 'de' MMMM", { locale: ptBR })}
                      </span>
                      <span className="mr-3">{evento.horario}</span>
                      <span>{evento.local}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Não há eventos próximos</p>
            )}
            <div className="mt-4">
              <Link to="/calendario">
                <Button variant="outline" className="w-full">Ver Calendário Completo</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-700 text-white px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Membros Recentes</h2>
            <Link to="/membros">
              <Button variant="ghost" className="text-white hover:bg-indigo-600">
                <PlusCircle className="h-4 w-4 mr-2" />
                Novo
              </Button>
            </Link>
          </div>
          <div className="p-6">
            {dashboardData.membrosMaisRecentes.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.membrosMaisRecentes.map(membro => (
                  <div key={membro.id} className="border-b pb-3 last:border-0">
                    <p className="font-medium">{membro.nome}</p>
                    <p className="text-sm text-gray-500">
                      Entrou em {format(parseISO(membro.dataEntrada), "dd/MM/yyyy")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum membro recente</p>
            )}
            <div className="mt-4">
              <Link to="/membros">
                <Button variant="outline" className="w-full">Ver Todos os Membros</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ações rápidas */}
      <section className="bg-indigo-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-indigo-800 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/membros">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              <Users className="h-4 w-4 mr-2" />
              Adicionar Membro
            </Button>
          </Link>
          <Link to="/eventos">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Calendar className="h-4 w-4 mr-2" />
              Criar Evento
            </Button>
          </Link>
          <Link to="/recursos">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Package className="h-4 w-4 mr-2" />
              Registrar Recurso
            </Button>
          </Link>
          <Link to="/calendario">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Calendar className="h-4 w-4 mr-2" />
              Ver Calendário
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
