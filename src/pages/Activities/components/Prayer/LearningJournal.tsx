import { useState, useEffect } from 'react';
import { Lock, BookmarkCheck } from 'lucide-react';

export default function LearningJournal() {
    const [note, setNote] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedNote = localStorage.getItem('prayer_journal_today');
        if (savedNote) setNote(savedNote);
    }, []);

    const handleSave = () => {
        localStorage.setItem('prayer_journal_today', note);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <section style={{ margin: '24px 0', marginBottom: '80px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '16px', paddingLeft: '4px' }}>Meus Aprendizados</h3>
            <div style={{
                backgroundColor: '#1e293b',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid rgba(255,255,255,0.05)'
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
                        minHeight: '120px',
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
                        style={{
                            backgroundColor: saved ? '#10b981' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'background-color 0.2s'
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
        </section>
    );
}
