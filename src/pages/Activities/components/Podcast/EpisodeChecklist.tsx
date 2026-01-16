import { useState } from 'react';
import { Check } from 'lucide-react';

export default function EpisodeChecklist() {
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Definir meta de economia mensal', completed: true },
        { id: 2, text: 'Revisar extrato bancário juntos', completed: false },
        { id: 3, text: 'Criar o "Pote dos Sonhos"', completed: false },
    ]);

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const completedCount = tasks.filter(t => t.completed).length;

    return (
        <section style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Checklist do Episódio</h3>
                <span style={{
                    backgroundColor: '#10b981', color: 'white',
                    padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700
                }}>
                    {completedCount}/{tasks.length}
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tasks.map(task => (
                    <div key={task.id}
                        onClick={() => toggleTask(task.id)}
                        style={{
                            backgroundColor: '#1e293b',
                            borderRadius: '16px',
                            padding: '16px',
                            display: 'flex', alignItems: 'center', gap: '16px',
                            cursor: 'pointer',
                            opacity: task.completed ? 0.7 : 1,
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{
                            width: '24px', height: '24px', borderRadius: '6px',
                            backgroundColor: task.completed ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            {task.completed && <Check size={16} color="white" strokeWidth={3} />}
                        </div>

                        <span style={{
                            flex: 1, color: task.completed ? '#94a3b8' : 'white',
                            fontSize: '0.95rem',
                            textDecoration: task.completed ? 'line-through' : 'none'
                        }}>
                            {task.text}
                        </span>

                        <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden'
                        }}>
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
