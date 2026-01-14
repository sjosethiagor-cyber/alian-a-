import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { activityService } from '../../../services/activityService';

interface AddActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    activeTab: 'movies' | 'music' | 'bible' | 'prayer' | 'podcast' | 'couple';
}

export default function AddActivityModal({ isOpen, onClose, onSuccess, activeTab }: AddActivityModalProps) {
    const [name, setName] = useState('');
    const [meta, setMeta] = useState('');
    const [loading, setLoading] = useState(false);

    // Reset form when modal opens/closes or tab changes
    useEffect(() => {
        if (isOpen) {
            setName('');
            setMeta('');
        }
    }, [isOpen, activeTab]);

    if (!isOpen) return null;

    const getMetaLabel = () => {
        switch (activeTab) {
            case 'movies': return 'Onde assistir / Nota';
            case 'music': return 'Artista';
            case 'podcast': return 'Link / Host';
            case 'bible': return 'Livro / Versículo';
            case 'prayer': return 'Tema / Motivo';
            case 'couple': return 'Data / Local';
            default: return 'Detalhes';
        }
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'movies': return 'Adicionar Filme/Série';
            case 'music': return 'Adicionar Música';
            case 'podcast': return 'Adicionar Podcast';
            case 'bible': return 'Adicionar Estudo Bíblico';
            case 'prayer': return 'Adicionar Motivo de Oração';
            case 'couple': return 'Adicionar Lazer';
            default: return 'Adicionar Item';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await activityService.addItem(activeTab, name, meta || undefined);
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao adicionar item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{getTitle()}</h3>
                    <button onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Nome do Item</label>
                        <input
                            type="text"
                            placeholder="Ex: Leite, Inception, Salmo 23..."
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="modal-input"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>{getMetaLabel()} (Opcional)</label>
                        <input
                            type="text"
                            placeholder="..."
                            value={meta}
                            onChange={e => setMeta(e.target.value)}
                            className="modal-input"
                        />
                    </div>

                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Adicionando...' : 'Adicionar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
