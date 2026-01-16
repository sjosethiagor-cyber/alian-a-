import { useMemo } from 'react';

interface DateStripProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

export default function DateStrip({ selectedDate, onSelectDate }: DateStripProps) {
    // Generate week days (centered on selectedDate)
    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(selectedDate);
            d.setDate(selectedDate.getDate() - 3 + i);
            return {
                day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3),
                num: d.getDate(),
                fullDate: d,
                active: d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth()
            };
        });
    }, [selectedDate]);

    return (
        <div className="date-strip-container">
            <div className="date-strip">
                {weekDays.map((d, idx) => (
                    <div
                        key={idx}
                        className={`date-item ${d.active ? 'active' : ''}`}
                        onClick={() => onSelectDate(d.fullDate)}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="day-label">{d.day}</span>
                        <span className="day-number">{d.num}</span>
                        {d.active && <div className="active-dot" />}
                    </div>
                ))}
            </div>
        </div>
    );
}
