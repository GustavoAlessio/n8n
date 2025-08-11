'use client';

import { useState, useEffect } from 'react';
import api from '../services/api';

// Interface to define the type for a single "Obra"
interface IObra {
  _id: string;
  nome: string;
  endereco: string;
  cliente: string;
  orcamentoEstimado: number;
  prazoEntrega: string; // Keep as string for simplicity in display
  status: 'planejamento' | 'em execução' | 'concluída';
}

export default function Home() {
  const [obras, setObras] = useState<IObra[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObras = async () => {
      try {
        const response = await api.get('/obras');
        setObras(response.data);
      } catch (err) {
        setError('Falha ao carregar as obras. O serviço de back-end está rodando?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchObras();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta obra?')) {
      try {
        await api.delete(`/obras/${id}`);
        setObras(obras.filter((obra) => obra._id !== id));
      } catch (err) {
        alert('Falha ao excluir a obra.');
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
        <h1 className="text-3xl font-bold">ObraFácil - Gestão de Obras</h1>
        <button
          onClick={() => alert('Funcionalidade de adicionar nova obra a ser implementada.')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Adicionar Nova Obra
        </button>
      </header>

      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Nome da Obra</th>
              <th className="py-3 px-6 text-left">Cliente</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {obras.length > 0 ? (
              obras.map((obra) => (
                <tr key={obra._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium">{obra.nome}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <div className="flex items-center">
                      <span>{obra.cliente}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`py-1 px-3 rounded-full text-xs ${
                        obra.status === 'concluída'
                          ? 'bg-green-200 text-green-600'
                          : obra.status === 'em execução'
                          ? 'bg-yellow-200 text-yellow-600'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {obra.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button
                        onClick={() => alert(`Editar obra: ${obra.nome}`)}
                        className="w-6 h-6 text-gray-500 hover:text-blue-500"
                        title="Editar"
                      >
                        {/* Placeholder for Edit Icon */}
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(obra._id)}
                        className="w-6 h-6 text-gray-500 hover:text-red-500 ml-4"
                        title="Excluir"
                      >
                        {/* Placeholder for Delete Icon */}
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-3 px-6 text-center">
                  Nenhuma obra encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
