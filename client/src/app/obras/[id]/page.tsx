'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../services/api';

// --- INTERFACES ---
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
    colaborador: { _id: string; nome: string; };
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

interface ITarefa {
    _id: string;
    titulo: string;
    descricao?: string;
    prazo: string;
    status: 'pendente' | 'em andamento' | 'concluida';
    colaborador?: { _id: string; nome: string; };
}

// --- INITIAL STATES ---
const initialNewTransaction = { descricao: '', valor: '', tipo: 'saida' as 'saida' | 'entrada' };
const initialNewMaterial = { nome: '', unidade: '', quantidade: '', precoUnitario: '' };
const initialNewTarefa = { titulo: '', descricao: '', prazo: '', colaborador: '' };

type Tab = 'ponto' | 'financeiro' | 'materiais' | 'tarefas';

// --- COMPONENT ---
export default function ObraDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // --- STATE MANAGEMENT ---
  const [obra, setObra] = useState<IObra | null>(null);
  const [colaboradores, setColaboradores] = useState<IColaborador[]>([]);
  const [activeRegistros, setActiveRegistros] = useState<IRegistroPonto[]>([]);
  const [financialReport, setFinancialReport] = useState<IFinancialReport | null>(null);
  const [materiais, setMateriais] = useState<IMaterial[]>([]);
  const [tarefas, setTarefas] = useState<ITarefa[]>([]);
  const [newTransaction, setNewTransaction] = useState(initialNewTransaction);
  const [newMaterial, setNewMaterial] = useState(initialNewMaterial);
  const [newTarefa, setNewTarefa] = useState(initialNewTarefa);
  const [activeTab, setActiveTab] = useState<Tab>('ponto');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- DATA FETCHING ---
  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [obraRes, colabRes, pontoRes, financeiroRes, materiaisRes, tarefasRes] = await Promise.all([
        api.get(`/obras/${id}`),
        api.get('/colaboradores'),
        api.get('/ponto/active'),
        api.get(`/financeiro/relatorio/${id}`),
        api.get(`/obras/${id}/materiais`),
        api.get(`/obras/${id}/tarefas`)
      ]);
      setObra(obraRes.data);
      setColaboradores(colabRes.data);
      setActiveRegistros(pontoRes.data);
      setFinancialReport(financeiroRes.data);
      setMateriais(materiaisRes.data);
      setTarefas(tarefasRes.data);
    } catch (err) {
      setError('Falha ao carregar os dados da obra.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [id, router]);

  // --- HANDLERS ---
  const handleCheckIn = async (colaboradorId: string) => { /* ... */ };
  const handleCheckOut = async (registroId: string) => { /* ... */ };
  const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { /* ... */ };
  const handleCreateTransaction = async (e: React.FormEvent) => { /* ... */ };
  const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement>) => { /* ... */ };
  const handleCreateMaterial = async (e: React.FormEvent) => { /* ... */ };
  const handleDeleteMaterial = async (materialId: string) => { /* ... */ };

  const handleTarefaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTarefa(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTarefa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await api.post(`/obras/${id}/tarefas`, newTarefa);
        setNewTarefa(initialNewTarefa);
        fetchData();
        alert('Tarefa adicionada com sucesso!');
    } catch (err) {
        alert('Erro ao adicionar tarefa.');
    }
  };

  const handleUpdateTarefaStatus = async (tarefaId: string, status: ITarefa['status']) => {
    try {
        await api.put(`/tarefas/${tarefaId}`, { status });
        fetchData();
    } catch (err) {
        alert('Erro ao atualizar status da tarefa.');
    }
  };

  const getColaboradorStatus = (colaboradorId: string) => activeRegistros.find(r => r.colaborador._id === colaboradorId);

  // --- RENDER ---
  if (loading) return <div className="text-center p-10">Carregando...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!obra) return <div className="text-center p-10">Obra não encontrada.</div>;

  const TabButton = ({ tab, children }: { tab: Tab, children: React.ReactNode }) => (
    <button onClick={() => setActiveTab(tab)} className={`py-2 px-4 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>{children}</button>
  );

  const kanbanColumns: { status: ITarefa['status']; title: string }[] = [
    { status: 'pendente', title: 'Pendente' },
    { status: 'em andamento', title: 'Em Andamento' },
    { status: 'concluida', title: 'Concluída' },
  ];

  return (
    <div className="container mx-auto p-8">
      <header className="mb-8">
        <Link href="/" className="text-blue-500 hover:underline">&larr; Voltar para Obras</Link>
        <h1 className="text-3xl font-bold mt-2">{obra.nome}</h1>
        <p className="text-xl text-gray-600">{obra.cliente}</p>
        <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">{obra.status}</span>
      </header>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <TabButton tab="ponto">Ponto</TabButton>
            <TabButton tab="financeiro">Financeiro</TabButton>
            <TabButton tab="materiais">Materiais</TabButton>
            <TabButton tab="tarefas">Tarefas</TabButton>
        </nav>
      </div>

      <div>
        {/* Other tabs content collapsed for brevity */}
        {activeTab === 'ponto' && ( <section>...</section> )}
        {activeTab === 'financeiro' && ( <section>...</section> )}
        {activeTab === 'materiais' && ( <section>...</section> )}

        {activeTab === 'tarefas' && (
            <section>
                <div className="bg-white shadow-md rounded p-6">
                    {/* Add Tarefa Form */}
                    <form onSubmit={handleCreateTarefa} className="mb-6 p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Adicionar Nova Tarefa</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="text" name="titulo" placeholder="Título da Tarefa" value={newTarefa.titulo} onChange={handleTarefaChange} className="p-2 border rounded col-span-2" required />
                            <textarea name="descricao" placeholder="Descrição (opcional)" value={newTarefa.descricao} onChange={handleTarefaChange} className="p-2 border rounded col-span-2" rows={3}></textarea>
                            <div>
                                <label htmlFor="prazo" className="block text-sm font-medium text-gray-700">Prazo</label>
                                <input type="date" id="prazo" name="prazo" value={newTarefa.prazo} onChange={handleTarefaChange} className="p-2 border rounded w-full" required />
                            </div>
                            <div>
                                <label htmlFor="colaborador" className="block text-sm font-medium text-gray-700">Atribuir a</label>
                                <select id="colaborador" name="colaborador" value={newTarefa.colaborador} onChange={handleTarefaChange} className="p-2 border rounded w-full">
                                    <option value="">Ninguém</option>
                                    {colaboradores.map(c => <option key={c._id} value={c._id}>{c.nome}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-2">Adicionar Tarefa</button>
                        </div>
                    </form>

                    {/* Kanban Board */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {kanbanColumns.map(column => (
                            <div key={column.status} className="bg-gray-100 rounded-lg p-4">
                                <h3 className="font-bold text-lg mb-4 text-center">{column.title}</h3>
                                <div className="space-y-4">
                                    {tarefas.filter(t => t.status === column.status).map(tarefa => (
                                        <div key={tarefa._id} className="bg-white p-4 rounded-md shadow">
                                            <h4 className="font-semibold">{tarefa.titulo}</h4>
                                            <p className="text-sm text-gray-600">{tarefa.descricao}</p>
                                            <div className="text-xs text-gray-500 mt-2">
                                                <p>Prazo: {new Date(tarefa.prazo).toLocaleDateString()}</p>
                                                <p>Responsável: {tarefa.colaborador?.nome || 'N/A'}</p>
                                            </div>
                                            <select value={tarefa.status} onChange={(e) => handleUpdateTarefaStatus(tarefa._id, e.target.value as ITarefa['status'])} className="mt-2 text-xs p-1 border rounded w-full">
                                                <option value="pendente">Pendente</option>
                                                <option value="em andamento">Em Andamento</option>
                                                <option value="concluida">Concluída</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )}
      </div>
    </div>
  );
}
