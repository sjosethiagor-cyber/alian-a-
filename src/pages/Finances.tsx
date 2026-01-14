import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { financeService, type Transaction } from '../services/financeService';
import './Finances.css';

export default function Finances() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const data = await financeService.getTransactions();
            setTransactions(data);
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

    const handleAdd = async (type: 'income' | 'expense') => {
        const title = prompt('Descrição:');
        if (!title) return;
        const amountStr = prompt('Valor (R$):');
        if (!amountStr) return;
        const amount = parseFloat(amountStr.replace(',', '.'));
        if (isNaN(amount)) {
            alert('Valor inválido');
            return;
        }

        try {
            await financeService.addTransaction(title, amount, type);
            loadData();
        } catch (error) {
            alert('Erro ao adicionar');
        }
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
            </header>

            {/* Balance Card */}
            <div className="balance-card">
                <div className="balance-label">Saldo Total</div>
                <div className="balance-value">
                    {totals.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <div className="balance-stats">
                    <div className="stat-item income">
                        <ArrowUpRight size={16} />
                        <span>{totals.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                    <div className="stat-item expense">
                        <ArrowDownLeft size={16} />
                        <span>{totals.expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                </div>
            </div>

            {/* Actions Grid */}
            <div className="actions-grid">
                <button className="action-btn" onClick={() => handleAdd('expense')}>
                    <div className="action-icon icon-bg-red" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                        <ArrowDownLeft size={20} />
                    </div>
                    <span>Despesa</span>
                </button>
                <button className="action-btn" onClick={() => handleAdd('income')}>
                    <div className="action-icon icon-bg-green" style={{ backgroundColor: '#dcfce7', color: '#22c55e' }}>
                        <ArrowUpRight size={20} />
                    </div>
                    <span>Receita</span>
                </button>
            </div>

            {/* Transactions Section */}
            <h3 className="section-title" style={{ marginTop: '2rem' }}>Últimas Movimentações</h3>
            <div className="transactions-list">
                {loading ? <p>Carregando...</p> : transactions.length === 0 ? (
                    <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Nenhuma transação registrada.</p>
                ) : (
                    transactions.map(t => (
                        <div key={t.id} className="transaction-item">
                            <div className={`trans-icon ${t.type === 'income' ? 'bg-salary' : 'bg-grocery'}`}>
                                {t.type === 'income' ? '💰' : '💸'}
                            </div>
                            <div className="trans-info">
                                <span className="trans-title">{t.title}</span>
                                <span className="trans-date">{new Date(t.date).toLocaleDateString()}</span>
                            </div>
                            <span className={`trans-value ${t.type}`}>
                                {t.type === 'expense' ? '- ' : '+ '}
                                {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
