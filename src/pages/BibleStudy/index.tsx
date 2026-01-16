import { Plus } from 'lucide-react';
import StreakCard from './components/StreakCard';
import StudyCard from './components/StudyCard';
// import { useAuth } from '../../contexts/AuthContext';
import { type ActivityItem } from '../../services/activityService';

interface BibleStudyProps {
    embedded?: boolean;
    items?: ActivityItem[];
    onToggle?: (id: string, currentCompleted: boolean) => void;
    onAdd?: () => void;
    onEdit?: (item: ActivityItem) => void;
    onDelete?: (id: string) => void;
}

export default function BibleStudy({ embedded = false, items = [], onToggle, onAdd, onEdit, onDelete }: BibleStudyProps) {
    // Helper to get partner (placeholder for now, similar to original mock)
    // const partnerName = 'Parceiro';

    const completedCount = items.filter(i => i.completed).length;

    // Date Strip logic (static for now)
    const days = [
        { label: 'SEG', num: 12, active: false },
        { label: 'TER', num: 13, active: false },
        { label: 'HOJE', num: 14, active: true },
        { label: 'QUI', num: 15, active: false },
        { label: 'SEX', num: 16, active: false },
        { label: 'SÁB', num: 17, active: false },
    ];

    const parseMeta = (meta: any) => {
        if (!meta) return { description: '', type: 'reading' as const };
        try {
            const parsed = typeof meta === 'string' ? JSON.parse(meta) : meta;
            // Handle legacy/simple string meta
            if (typeof parsed === 'string') return { description: parsed, type: 'reading' as const, link: '' };
            return {
                description: parsed.description || '',
                type: (parsed.type || 'reading') as 'reading' | 'devotional' | 'prayer',
                link: parsed.link || '',
                channelName: parsed.channelName || '',
                coverUrl: parsed.coverUrl || '',
                scheduledDate: parsed.scheduledDate || '',
                scheduledTime: parsed.scheduledTime || ''
            };
        } catch {
            return { description: meta as string, type: 'reading' as const, link: '', channelName: '', coverUrl: '', scheduledDate: '', scheduledTime: '' };
        }
    };

    return (
        <div style={{ padding: embedded ? '0' : '20px', paddingBottom: '100px', maxWidth: '600px', margin: '0 auto' }}>
            {/* Header - Only show if NOT embedded */}
            {!embedded && (
                <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Semana 42 • O Livro de João
                    </span>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>Estudo Bíblico</h1>
                </div>
            )}

            {/* Streak Card */}
            <StreakCard days={15} currentSequence={15} />

            {/* Date Strip */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', overflowX: 'auto', paddingBottom: '4px' }}>
                {days.map((d, i) => (
                    <div
                        key={i}
                        style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            backgroundColor: d.active ? '#2563eb' : '#1e293b',
                            borderRadius: '12px',
                            minWidth: '50px',
                            padding: '12px 0',
                            border: d.active ? 'none' : '1px solid rgba(255,255,255,0.05)',
                            color: d.active ? 'white' : '#64748b'
                        }}
                    >
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, marginBottom: '4px' }}>{d.label}</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{d.num}</span>
                    </div>
                ))}
            </div>

            {/* Checklist Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Checklist Diário</h2>
                <span style={{ fontSize: '0.9rem', color: '#3b82f6', fontWeight: 600 }}>
                    {completedCount}/{items.length} Concluídos
                </span>
            </div>

            {/* List */}
            <div>
                {items.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>Nenhum estudo para hoje.</p>
                ) : (
                    items.map(item => {
                        const meta = parseMeta(item.meta);
                        return (
                            <StudyCard
                                key={item.id}
                                type={meta.type}
                                title={item.name}
                                description={meta.description}
                                link={meta.link}
                                channelName={meta.channelName}
                                coverUrl={meta.coverUrl}
                                scheduledDate={meta.scheduledDate}
                                scheduledTime={meta.scheduledTime}
                                completed={item.completed}

                                onToggle={() => onToggle && onToggle(item.id, item.completed)}
                                onEdit={() => onEdit && onEdit(item)}
                                onDelete={() => onDelete && onDelete(item.id)}
                            />
                        );
                    })
                )}
            </div>

            {/* Add Item Button */}
            <button
                onClick={onAdd}
                style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px dashed rgba(255,255,255,0.2)',
                    backgroundColor: 'transparent',
                    color: '#94a3b8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    cursor: 'pointer',
                    marginTop: '10px'
                }}
            >
                <Plus size={20} />
                <span>Adicionar Item</span>
            </button>
        </div>
    );
}
