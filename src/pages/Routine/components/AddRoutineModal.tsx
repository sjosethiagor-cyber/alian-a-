import { useState } from 'react';
import { X, Dumbbell, BookOpen, Droplet, Brain, Clock, Film, Headphones, Scroll } from 'lucide-react';
import { routineService } from '../../../services/routineService';

interface AddRoutineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    groupId: string;
}

const icons = [
    { id: 'dumbbell', component: Dumbbell, label: 'Exercício' },
    { id: 'book-open', component: BookOpen, label: 'Leitura' },
    { id: 'droplet', component: Droplet, label: 'Água' },
    { id: 'brain', component: Brain, label: 'Estudo' },
    { id: 'film', component: Film, label: 'Filmes/Séries' },
    { id: 'headphones', component: Headphones, label: 'Música' },
    { id: 'scroll', component: Scroll, label: 'Bíblia' },
    { id: 'clock', component: Clock, label: 'Outro' },
];

export default function AddRoutineModal({ isOpen, onClose, onSuccess, groupId }: AddRoutineModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'normal' | 'high'>('normal');
    const [selectedIcon, setSelectedIcon] = useState('clock');
    const [time, setTime] = useState('');
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'specific_date'>('daily');
    const [weekDays, setWeekDays] = useState<number[]>([]);
    const [specificDate, setSpecificDate] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const toggleWeekDay = (day: number) => {
        setWeekDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !groupId) return;

        setLoading(true);
        try {
            await routineService.createRoutine({
                group_id: groupId,
                title,
                description,
                priority,
                icon: selectedIcon,
                time: time || undefined,
                frequency,
                week_days: frequency === 'weekly' ? weekDays : undefined,
                specific_date: frequency === 'specific_date' ? specificDate : undefined
            });
            onSuccess();
            onClose();
            // Reset form
            setTitle('');
            setDescription('');
            setPriority('normal');
            setSelectedIcon('clock');
            setTime('');
            setFrequency('daily');
            setWeekDays([]);
            setSpecificDate('');
        } catch (error) {
            console.error(error);
            alert('Erro ao criar rotina');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Nova Rotina</h3>
                    <button onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Título</label>
                        <input
                            type="text"
                            placeholder="Ex: Beber Água"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            className="modal-input"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Horário (Opcional)</label>
                            <input
                                type="time"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                className="modal-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Frequência</label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value as any)}
                            className="modal-input"
                        >
                            <option value="daily">Todos os dias</option>
                            <option value="weekly">Dias específicos</option>
                            <option value="specific_date">Apenas uma data</option>
                        </select>
                    </div>

                    {frequency === 'weekly' && (
                        <div className="form-group">
                            <label>Dias da Semana</label>
                            <div className="week-selector">
                                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        className={`week-day-btn ${weekDays.includes(index) ? 'active' : ''}`}
                                        onClick={() => toggleWeekDay(index)}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {frequency === 'specific_date' && (
                        <div className="form-group">
                            <label>Data</label>
                            <input
                                type="date"
                                value={specificDate}
                                onChange={e => setSpecificDate(e.target.value)}
                                className="modal-input"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Descrição (Opcional)</label>
                        <input
                            type="text"
                            placeholder="Ex: 2 Litros por dia"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="modal-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Ícone</label>
                        <div className="icon-selector">
                            {icons.map(icon => {
                                const IconComp = icon.component;
                                return (
                                    <button
                                        type="button"
                                        key={icon.id}
                                        className={`icon-option ${selectedIcon === icon.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedIcon(icon.id)}
                                        title={icon.label}
                                    >
                                        <IconComp size={24} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="toggle-label">
                            Prioridade Alta
                            <button
                                type="button"
                                className={`toggle-switch ${priority === 'high' ? 'active' : ''}`}
                                onClick={() => setPriority(priority === 'normal' ? 'high' : 'normal')}
                            >
                                <div className="toggle-thumb" />
                            </button>
                        </label>
                    </div>

                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Salvando...' : 'Criar Rotina'}
                    </button>
                </form>
            </div>
        </div>
    );
}
