import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Eye, EyeOff, Wallet } from 'lucide-react';
import { financeService, type Transaction } from '../../services/financeService';
import TransactionModal from './components/TransactionModal';
import './Finances.css';

export default function Finances() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBalance, setShowBalance] = useState(true); // Persist if needed

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'income' | 'expense'>('expense');

    const loadData = async () => {
        try {
            const data = await financeService.getTransactions();
            const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setTransactions(sorted);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const totals = transactions.reduce((acc, curr) => {
        if (curr.type === 'income') {
            acc.income += curr.amount;
            acc.total += curr.amount;
        } else {
            acc.expense += curr.amount;
            acc.total -= curr.amount;
        }
        return acc;
    }, { income: 0, expense: 0, total: 0 });

    const openModal = (type: 'income' | 'expense') => {
        setModalType(type);
        setIsModalOpen(true);
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="header-content">
                    <h1 className="page-title">Finanças</h1>
                    <span className="page-subtitle">Controle do Casal</span>
                </div>
                <div className="header-icon-box">
                    <Wallet size={20} className="text-primary" />
                </div>
            </header>

            {/* Balance Card */}
            <div className="balance-card">
                <div className="balance-header">
                    <span className="balance-label">Saldo Total</span>
                    <button className="eye-btn" onClick={() => setShowBalance(!showBalance)}>
                        {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>

                <div className="balance-value">
                    {showBalance
                        ? totals.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        : '••••••'
                    }
                </div>

                <div className="balance-stats-row">
                    <div className="stat-box income">
                        <div className="stat-icon-wrapper up">
                            <ArrowUpRight size={16} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Entradas</span>
                            <span className="stat-value">
                                {showBalance
                                    ? totals.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                    : '••••••'}
                            </span>
                        </div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-box expense">
                        <div className="stat-icon-wrapper down">
                            <ArrowDownLeft size={16} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Saídas</span>
                            <span className="stat-value">
                                {showBalance
                                    ? totals.expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                    : '••••••'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="actions-grid">
                <button className="action-btn" onClick={() => openModal('expense')}>
                    <div className="action-icon icon-bg-red">
                        <ArrowDownLeft size={24} />
                    </div>
                    <span>Nova Despesa</span>
                </button>
                <button className="action-btn" onClick={() => openModal('income')}>
                    <div className="action-icon icon-bg-green">
                        <ArrowUpRight size={24} />
                    </div>
                    <span>Nova Receita</span>
                </button>
            </div>

            {/* Transactions Section */}
            <div className="section-header">
                <h3 className="section-title">Últimas Movimentações</h3>
            </div>

            <div className="transactions-list">
                {loading ? (
                    <div className="loading-state">Carregando...</div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state">
                        <p>Nenhuma transação registrada.</p>
                    </div>
                ) : (
                    transactions.map(t => (
                        <div key={t.id} className="transaction-item">
                            <div className={`trans-icon-box ${t.type}`}>
                                {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                            </div>
                            <div className="trans-info">
                                <span className="trans-title">{t.title}</span>
                                <span className="trans-date">
                                    {new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                </span>
                            </div>
                            <span className={`trans-value ${t.type}`}>
                                {t.type === 'expense' ? '- ' : '+ '}
                                {showBalance
                                    ? t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                    : '••••••'}
                            </span>
                        </div>
                    ))
                )}
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadData}
                type={modalType}
            />
        </div>
    );
}
