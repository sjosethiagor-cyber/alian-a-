import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Circle, Sun, Moon, Coffee } from 'lucide-react';
import './Routine.css';

export default function Routine() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Beber água ao acordar', time: '07:00', completed: true, icon: Sun },
        { id: 2, title: 'Yoga / Alongamento', time: '07:15', completed: true, icon: Sun },
        { id: 3, title: 'Café da manhã saudável', time: '07:45', completed: false, icon: Coffee },
        { id: 4, title: 'Leitura Bíblica', time: '08:15', completed: false, icon: Sun },
        { id: 5, title: 'Skincare Noturno', time: '22:00', completed: false, icon: Moon },
    ]);

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="header-content">
                    <h1 className="page-title">Rotina Diária</h1>
                    <span className="page-subtitle">5 tarefas hoje</span>
                </div>
            </header>

            <div className="routine-list">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`routine-item ${task.completed ? 'completed' : ''}`}
                        onClick={() => toggleTask(task.id)}
                    >
                        <div className="routine-icon-container">
                            <task.icon size={20} className="routine-icon" />
                        </div>
                        <div className="routine-info">
                            <span className="routine-title">{task.title}</span>
                            <span className="routine-time">{task.time}</span>
                        </div>
                        <div className="routine-check">
                            {task.completed ? (
                                <CheckCircle size={24} className="check-icon-active" />
                            ) : (
                                <Circle size={24} className="check-icon-inactive" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
