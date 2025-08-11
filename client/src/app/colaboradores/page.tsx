'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

// Interface for a single Collaborator
interface IColaborador {
  _id: string;
  nome: string;
  funcao: string;
  tipoPagamento: 'hora' | 'diaria';
  valor: number;
}

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<IColaborador[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchColaboradores = async () => {
      try {
        const response = await api.get('/colaboradores');
        setColaboradores(response.data);
      } catch (err) {
        setError('Falha ao carregar os colaboradores. O serviço de back-end está rodando?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchColaboradores();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este colaborador?')) {
      try {
        await api.delete(`/colaboradores/${id}`);
        setColaboradores(colaboradores.filter((c) => c._id !== id));
      } catch (err) {
        alert('Falha ao excluir o colaborador.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestão de Equipe</h1>
        <div className="flex gap-4">
          <Link href="/" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Ver Obras
          </Link>
          <button
            onClick={() => alert('Funcionalidade de adicionar novo colaborador a ser implementada.')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Adicionar Colaborador
          </button>
        </div>
      </header>

      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Nome</th>
              <th className="py-3 px-6 text-left">Função</th>
              <th className="py-3 px-6 text-center">Pagamento</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {colaboradores.length > 0 ? (
              colaboradores.map((colaborador) => (
                <tr key={colaborador._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <span className="font-medium">{colaborador.nome}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{colaborador.funcao}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span>R$ {colaborador.valor.toFixed(2)} / {colaborador.tipoPagamento}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button
                        onClick={() => alert(`Editar colaborador: ${colaborador.nome}`)}
                        className="w-6 h-6 text-gray-500 hover:text-blue-500"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(colaborador._id)}
                        className="w-6 h-6 text-gray-500 hover:text-red-500 ml-4"
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-3 px-6 text-center">
                  Nenhum colaborador encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
