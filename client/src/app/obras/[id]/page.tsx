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
  orcamentoEstimado: number;
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

interface ITransacao {
    _id: string;
    descricao: string;
    valor: number;
    tipo: 'entrada' | 'saida';
    data: string;
}

interface IFinancialReport {
    orcamentoEstimado: number;
    gastoReal: number;
    totalEntradas: number;
    saldo: number;
    transacoes: ITransacao[];
}

interface IMaterial {
    _id: string;
    nome: string;
    unidade: string;
    quantidade: number;
    precoUnitario: number;
}

// Initial state for forms
const initialNewTransaction = {
    descricao: '',
    valor: '',
    tipo: 'saida' as 'saida' | 'entrada',
};

const initialNewMaterial = {
    nome: '',
    unidade: '',
    quantidade: '',
    precoUnitario: '',
};

type Tab = 'ponto' | 'financeiro' | 'materiais';

export default function ObraDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // State variables
  const [obra, setObra] = useState<IObra | null>(null);
  const [colaboradores, setColaboradores] = useState<IColaborador[]>([]);
  const [activeRegistros, setActiveRegistros] = useState<IRegistroPonto[]>([]);
  const [financialReport, setFinancialReport] = useState<IFinancialReport | null>(null);
  const [materiais, setMateriais] = useState<IMaterial[]>([]);
  const [newTransaction, setNewTransaction] = useState(initialNewTransaction);
  const [newMaterial, setNewMaterial] = useState(initialNewMaterial);
  const [activeTab, setActiveTab] = useState<Tab>('ponto');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Parallel fetching
      const [obraRes, colabRes, pontoRes, financeiroRes, materiaisRes] = await Promise.all([
        api.get(`/obras/${id}`),
        api.get('/colaboradores'),
        api.get('/ponto/active'),
        api.get(`/financeiro/relatorio/${id}`),
        api.get(`/obras/${id}/materiais`)
      ]);
      setObra(obraRes.data);
      setColaboradores(colabRes.data);
      setActiveRegistros(pontoRes.data);
      setFinancialReport(financeiroRes.data);
      setMateriais(materiaisRes.data);
    } catch (err) {
      setError('Falha ao carregar os dados da obra. Verifique a conexão e o ID da obra.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // --- Handlers ---
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

  const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.descricao || !newTransaction.valor) {
        alert('Preencha a descrição e o valor.');
        return;
    }
    try {
        await api.post('/transacoes', {
            ...newTransaction,
            valor: parseFloat(newTransaction.valor),
            obra: id,
        });
        setNewTransaction(initialNewTransaction);
        fetchData(); // Re-fetch all data
        alert('Transação adicionada com sucesso!');
    } catch (err) {
        alert('Erro ao adicionar transação.');
    }
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMaterial(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await api.post(`/obras/${id}/materiais`, {
            ...newMaterial,
            quantidade: parseFloat(newMaterial.quantidade),
            precoUnitario: parseFloat(newMaterial.precoUnitario),
        });
        setNewMaterial(initialNewMaterial);
        fetchData(); // Re-fetch all data
        alert('Material adicionado com sucesso!');
    } catch (err) {
        alert('Erro ao adicionar material.');
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este material?')) {
        try {
            await api.delete(`/materiais/${materialId}`);
            fetchData(); // Re-fetch
        } catch (err) {
            alert('Erro ao excluir material.');
        }
    }
  };

  const getColaboradorStatus = (colaboradorId: string) => {
    return activeRegistros.find(r => r.colaborador._id === colaboradorId);
  };

  if (loading) return <div className="text-center p-10">Carregando...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!obra) return <div className="text-center p-10">Obra não encontrada.</div>;

  const TabButton = ({ tab, children }: { tab: Tab, children: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`py-2 px-4 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="container mx-auto p-8">
      <header className="mb-8">
        <Link href="/" className="text-blue-500 hover:underline">&larr; Voltar para Obras</Link>
        <h1 className="text-3xl font-bold mt-2">{obra.nome}</h1>
        <p className="text-xl text-gray-600">{obra.cliente}</p>
        <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">{obra.status}</span>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <TabButton tab="ponto">Controle de Ponto</TabButton>
            <TabButton tab="financeiro">Financeiro</TabButton>
            <TabButton tab="materiais">Materiais</TabButton>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'ponto' && (
            <section>
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
                            <button onClick={() => handleCheckOut(registroAtivo._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded">Check-out</button>
                            </div>
                        ) : (
                            <button onClick={() => handleCheckIn(colaborador._id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded">Check-in</button>
                        )}
                        </li>
                    );
                    })}
                </ul>
                </div>
            </section>
        )}

        {activeTab === 'financeiro' && (
            <section>
                <div className="bg-white shadow-md rounded p-6">
                    {financialReport && (
                        <>
                            {/* Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                                <div><p className="text-gray-500">Orçamento</p><p className="text-2xl font-bold">R$ {financialReport.orcamentoEstimado.toFixed(2)}</p></div>
                                <div><p className="text-gray-500">Gasto Real</p><p className="text-2xl font-bold text-red-500">R$ {financialReport.gastoReal.toFixed(2)}</p></div>
                                <div><p className="text-gray-500">Receitas</p><p className="text-2xl font-bold text-green-500">R$ {financialReport.totalEntradas.toFixed(2)}</p></div>
                                <div><p className="text-gray-500">Saldo Final</p><p className={`text-2xl font-bold ${financialReport.saldo >= 0 ? 'text-green-500' : 'text-red-500'}`}>R$ {financialReport.saldo.toFixed(2)}</p></div>
                            </div>

                            {/* Add Transaction Form */}
                            <form onSubmit={handleCreateTransaction} className="mb-6 p-4 border rounded-lg">
                                <h3 className="font-semibold mb-2">Adicionar Transação</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input type="text" name="descricao" placeholder="Descrição" value={newTransaction.descricao} onChange={handleTransactionChange} className="p-2 border rounded col-span-1 sm:col-span-2" />
                                    <input type="number" name="valor" placeholder="Valor (R$)" value={newTransaction.valor} onChange={handleTransactionChange} className="p-2 border rounded" />
                                    <select name="tipo" value={newTransaction.tipo} onChange={handleTransactionChange} className="p-2 border rounded">
                                        <option value="saida">Saída / Despesa</option>
                                        <option value="entrada">Entrada / Receita</option>
                                    </select>
                                    <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-1 sm:col-span-3">Adicionar</button>
                                </div>
                            </form>

                            {/* Transaction List */}
                            <h3 className="font-semibold mb-2">Histórico</h3>
                            <ul className="space-y-2">
                                {financialReport.transacoes.map(t => (
                                    <li key={t._id} className="flex justify-between p-2 border-b">
                                        <span>{t.descricao}</span>
                                        <span className={t.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}>{t.tipo === 'entrada' ? '+' : '-'} R$ {t.valor.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </section>
        )}

        {activeTab === 'materiais' && (
            <section>
                <div className="bg-white shadow-md rounded p-6">
                    {/* Add Material Form */}
                    <form onSubmit={handleCreateMaterial} className="mb-6 p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Adicionar Material</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <input type="text" name="nome" placeholder="Nome do Material" value={newMaterial.nome} onChange={handleMaterialChange} className="p-2 border rounded col-span-2 sm:col-span-4"/>
                            <input type="text" name="unidade" placeholder="Unidade (kg, m³)" value={newMaterial.unidade} onChange={handleMaterialChange} className="p-2 border rounded"/>
                            <input type="number" name="quantidade" placeholder="Qtd" value={newMaterial.quantidade} onChange={handleMaterialChange} className="p-2 border rounded"/>
                            <input type="number" name="precoUnitario" placeholder="Preço/Un" value={newMaterial.precoUnitario} onChange={handleMaterialChange} className="p-2 border rounded"/>
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-2 sm:col-span-4">Adicionar</button>
                        </div>
                    </form>

                    {/* Material List */}
                    <h3 className="font-semibold mb-2">Lista de Materiais</h3>
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Material</th>
                                <th className="py-3 px-6 text-center">Quantidade</th>
                                <th className="py-3 px-6 text-right">Custo Total</th>
                                <th className="py-3 px-6 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {materiais.map(m => (
                                <tr key={m._id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left">{m.nome}</td>
                                    <td className="py-3 px-6 text-center">{m.quantidade} {m.unidade}</td>
                                    <td className="py-3 px-6 text-right">R$ {(m.quantidade * m.precoUnitario).toFixed(2)}</td>
                                    <td className="py-3 px-6 text-center">
                                        <button onClick={() => handleDeleteMaterial(m._id)} className="w-6 h-6 text-gray-500 hover:text-red-500" title="Excluir">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        )}
      </div>
    </div>
  );
}
