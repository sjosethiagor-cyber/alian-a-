import { useState, useEffect } from 'react';
import { Lock, BookmarkCheck, Trash2, Calendar } from 'lucide-react';

interface JournalNote {
    id: string;
    text: string;
    date: string;
    timestamp: number;
}

export default function LearningJournal() {
    const [note, setNote] = useState('');
    const [savedNotes, setSavedNotes] = useState<JournalNote[]>([]);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('prayer_journal_history');
        if (savedData) {
            try {
                setSavedNotes(JSON.parse(savedData));
            } catch (e) {
                console.error("Failed to parse journal history", e);
            }
        }
    }, []);

    const handleSave = () => {
        if (!note.trim()) return;

        const newNote: JournalNote = {
            id: Date.now().toString(),
            text: note,
            date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }),
            timestamp: Date.now()
        };

        const updatedNotes = [newNote, ...savedNotes];
        setSavedNotes(updatedNotes);
        localStorage.setItem('prayer_journal_history', JSON.stringify(updatedNotes));

        setNote(''); // Clear input
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleDelete = (id: string) => {
        const updatedNotes = savedNotes.filter(n => n.id !== id);
        setSavedNotes(updatedNotes);
        localStorage.setItem('prayer_journal_history', JSON.stringify(updatedNotes));
    };

    return (
        <section style={{ margin: '24px 0', marginBottom: '80px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '16px', paddingLeft: '4px' }}>Meus Aprendizados</h3>

            {/* Input Area */}
            <div style={{
                backgroundColor: '#1e293b',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '24px'
            }}>
                <label style={{
                    display: 'block',
                    color: '#94a3b8',
                    fontSize: '0.9rem',
                    marginBottom: '12px'
                }}>
                    O que Deus falou com você hoje?
                </label>
                <textarea
                    placeholder="Escreva aqui suas reflexões e insights..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{
                        width: '100%',
                        minHeight: '100px',
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '16px',
                        color: 'white',
                        fontSize: '0.95rem',
                        lineHeight: 1.5,
                        resize: 'none',
                        outline: 'none',
                        marginBottom: '16px'
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.8rem' }}>
                        <Lock size={14} />
                        <span>Privado</span>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={!note.trim()}
                        style={{
                            backgroundColor: saved ? '#10b981' : (note.trim() ? '#3b82f6' : '#334155'),
                            color: 'white',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: note.trim() ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            opacity: note.trim() ? 1 : 0.7
                        }}
                    >
                        {saved ? (
                            <>
                                <BookmarkCheck size={16} />
                                Salvo
                            </>
                        ) : 'Salvar anotação'}
                    </button>
                </div>
            </div>

            {/* Bloquinho de Notas (History) */}
            {savedNotes.length > 0 && (
                <div>
                    <h4 style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '12px', paddingLeft: '4px' }}>
                        Bloco de Anotações ({savedNotes.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {savedNotes.map(noteItem => (
                            <div key={noteItem.id} style={{
                                backgroundColor: '#1e293b',
                                borderRadius: '12px',
                                padding: '16px',
                                borderLeft: '4px solid #3b82f6',
                                position: 'relative'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem' }}>
                                        <Calendar size={12} />
                                        <span>{noteItem.date}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(noteItem.id)}
                                        style={{
                                            background: 'none', border: 'none', color: '#ef4444',
                                            cursor: 'pointer', padding: '4px', opacity: 0.6
                                        }}
                                        title="Excluir anotação"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <p style={{ color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                                    {noteItem.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
