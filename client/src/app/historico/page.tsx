'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

// This interface can be shared in a types file later
interface IObra {
  _id: string;
  nome: string;
  cliente: string;
  status: 'planejamento' | 'em execução' | 'concluída';
}

export default function HistoricoPage() {
  const [obras, setObras] = useState<IObra[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchObrasConcluidas = async () => {
      try {
        const response = await api.get('/obras/concluidas');
        setObras(response.data);
      } catch (err) {
        setError('Falha ao carregar o histórico de obras.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchObrasConcluidas();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Histórico de Obras Concluídas</h1>
        <div className="flex gap-4">
            <Link href="/" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                Voltar para Obras Ativas
            </Link>
            <button
                disabled
                className="bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded cursor-not-allowed"
                title="Funcionalidade a ser implementada"
            >
                Exportar Excel
            </button>
        </div>
      </header>

      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Nome da Obra</th>
              <th className="py-3 px-6 text-left">Cliente</th>
              <th className="py-3 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {obras.length > 0 ? (
              obras.map((obra) => (
                <tr key={obra._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <Link href={`/obras/${obra._id}`} className="text-blue-600 hover:underline">
                        <span className="font-medium">{obra.nome}</span>
                    </Link>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{obra.cliente}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">
                      {obra.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-3 px-6 text-center">
                  Nenhuma obra concluída encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
