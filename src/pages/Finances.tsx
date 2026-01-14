import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Wallet, PieChart } from 'lucide-react';
import './Finances.css';

export default function Finances() {
    const navigate = useNavigate();

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
                <div className="balance-value">R$ 14.250,00</div>
                <div className="balance-stats">
                    <div className="stat-item income">
                        <ArrowUpRight size={16} />
                        <span>R$ 5.200</span>
                    </div>
                    <div className="stat-item expense">
                        <ArrowDownLeft size={16} />
                        <span>R$ 2.100</span>
                    </div>
                </div>
            </div>

            {/* Actions Grid */}
            <div className="actions-grid">
                <button className="action-btn">
                    <div className="action-icon icon-bg-purple">
                        <Wallet size={20} />
                    </div>
                    <span>Contas</span>
                </button>
                <button className="action-btn">
                    <div className="action-icon icon-bg-orange">
                        <PieChart size={20} />
                    </div>
                    <span>Metas</span>
                </button>
            </div>

            {/* Transactions Section */}
            <h3 className="section-title" style={{ marginTop: '2rem' }}>Últimas Movimentações</h3>
            <div className="transactions-list">
                <div className="transaction-item">
                    <div className="trans-icon bg-grocery">🛒</div>
                    <div className="trans-info">
                        <span className="trans-title">Supermercado Extra</span>
                        <span className="trans-date">Hoje, 14:30</span>
                    </div>
                    <span className="trans-value expense">- R$ 450,00</span>
                </div>

                <div className="transaction-item">
                    <div className="trans-icon bg-salary">💰</div>
                    <div className="trans-info">
                        <span className="trans-title">Salário Ana</span>
                        <span className="trans-date">Ontem</span>
                    </div>
                    <span className="trans-value income">+ R$ 3.500,00</span>
                </div>

                <div className="transaction-item">
                    <div className="trans-icon bg-home">🏠</div>
                    <div className="trans-info">
                        <span className="trans-title">Aluguel</span>
                        <span className="trans-date">10 Out</span>
                    </div>
                    <span className="trans-value expense">- R$ 1.800,00</span>
                </div>
            </div>
        </div>
    );
}
