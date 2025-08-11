'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../../services/api';

// Interfaces
interface IObra {
  _id: string;
  nome: string;
  cliente: string;
  status: string;
}

interface IColaborador {
  _id: string;
  nome: string;
}

interface IRegistroPonto {
    _id: string;
    colaborador: {
        _id: string;
        nome: string;
    };
    checkIn: string;
}

export default function ObraDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [obra, setObra] = useState<IObra | null>(null);
  const [colaboradores, setColaboradores] = useState<IColaborador[]>([]);
  const [activeRegistros, setActiveRegistros] = useState<IRegistroPonto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Parallel fetching
        const [obraRes, colabRes, pontoRes] = await Promise.all([
          api.get(`/obras/${id}`),
          api.get('/colaboradores'),
          api.get('/ponto/active')
        ]);
        setObra(obraRes.data);
        setColaboradores(colabRes.data);
        setActiveRegistros(pontoRes.data);
      } catch (err) {
        setError('Falha ao carregar os dados da obra. Verifique a conexão e o ID da obra.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCheckIn = async (colaboradorId: string) => {
    try {
      const response = await api.post('/ponto/checkin', { colaboradorId, obraId: id });
      setActiveRegistros([...activeRegistros, response.data]);
      alert('Check-in realizado com sucesso!');
    } catch (err: any) {
      alert(`Erro no check-in: ${err.response?.data?.message || 'Tente novamente.'}`);
    }
  };

  const handleCheckOut = async (registroId: string) => {
    try {
      await api.put(`/ponto/checkout/${registroId}`);
      setActiveRegistros(activeRegistros.filter(r => r._id !== registroId));
      alert('Check-out realizado com sucesso!');
    } catch (err: any) {
      alert(`Erro no check-out: ${err.response?.data?.message || 'Tente novamente.'}`);
    }
  };

  const getColaboradorStatus = (colaboradorId: string) => {
    return activeRegistros.find(r => r.colaborador._id === colaboradorId);
  };

  if (loading) return <div className="text-center p-10">Carregando...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!obra) return <div className="text-center p-10">Obra não encontrada.</div>;

  return (
    <div className="container mx-auto p-8">
      <header className="mb-8">
        <Link href="/" className="text-blue-500 hover:underline">&larr; Voltar para Obras</Link>
        <h1 className="text-3xl font-bold mt-2">{obra.nome}</h1>
        <p className="text-xl text-gray-600">{obra.cliente}</p>
        <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">{obra.status}</span>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Controle de Ponto da Equipe</h2>
        <div className="bg-white shadow-md rounded p-6">
          <ul className="space-y-4">
            {colaboradores.map(colaborador => {
              const registroAtivo = getColaboradorStatus(colaborador._id);
              return (
                <li key={colaborador._id} className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">{colaborador.nome}</span>
                  {registroAtivo ? (
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-green-600">
                        Check-in: {new Date(registroAtivo.checkIn).toLocaleTimeString()}
                      </span>
                      <button
                        onClick={() => handleCheckOut(registroAtivo._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded"
                      >
                        Check-out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCheckIn(colaborador._id)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded"
                    >
                      Check-in
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
