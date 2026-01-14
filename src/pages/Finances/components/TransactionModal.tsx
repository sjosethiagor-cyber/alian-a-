import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { financeService } from '../../../services/financeService';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    type: 'income' | 'expense';
}

export default function TransactionModal({ isOpen, onClose, onSuccess, type }: TransactionModalProps) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]); // Today YYYY-MM-DD
        }
    }, [isOpen, type]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !amount || !date) return;

        const val = parseFloat(amount.replace(',', '.'));
        if (isNaN(val) || val <= 0) {
            alert('Valor inválido');
            return;
        }

        setLoading(true);
        try {
            await financeService.addTransaction(title, val, type, new Date(date));
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{type === 'income' ? 'Nova Receita 💰' : 'Nova Despesa 💸'}</h3>
                    <button onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Descrição</label>
                        <input
                            type="text"
                            placeholder={type === 'income' ? "Ex: Salário, Venda..." : "Ex: Mercado, Luz..."}
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="modal-input"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Valor (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0,00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="modal-input"
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Data</label>
                            <div className="input-with-icon">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="modal-input"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="save-btn"
                        disabled={loading}
                        style={{ backgroundColor: type === 'expense' ? '#ef4444' : 'var(--color-primary)' }}
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
