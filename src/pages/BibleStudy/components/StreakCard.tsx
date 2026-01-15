
import { Flame } from 'lucide-react';

interface StreakCardProps {
    days: number;
    currentSequence: number;
}

export default function StreakCard({ days, currentSequence }: StreakCardProps) {
    // Percent simulation for the bar
    const progress = Math.min((currentSequence / 30) * 100, 100);

    return (
        <div style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
            borderRadius: '24px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            color: 'white',
            marginBottom: '24px',
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)'
        }}>
            {/* Background Decorative Elements */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '150px',
                height: '150px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                zIndex: 1
            }} />
            <div style={{
                position: 'absolute',
                top: '40px',
                right: '40px',
                width: '80px',
                height: '80px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                zIndex: 1
            }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.9 }}>
                    <div style={{ padding: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}>
                        <Flame size={16} fill="white" />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px' }}>SEQUÊNCIA ATUAL</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1 }}>{days}</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>Dias</span>
                    <span style={{ fontSize: '1rem', opacity: 0.8, marginLeft: '4px' }}>Incansáveis!</span>
                </div>

                {/* Progress Bar */}
                <div style={{
                    marginTop: '20px',
                    height: '6px',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '3px',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${progress}%`,
                        background: 'white',
                        borderRadius: '3px',
                        boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                    }} />
                </div>
            </div>
        </div>
    );
}
