import './ProgressBar.css';

interface ProgressBarProps {
    progress: number; // 0 to 100
    color?: string;
    height?: number;
}

export default function ProgressBar({ progress, color = 'var(--color-primary)', height = 8 }: ProgressBarProps) {
    return (
        <div className="progress-container" style={{ height }}>
            <div
                className="progress-fill"
                style={{ width: `${progress}%`, backgroundColor: color }}
            />
        </div>
    );
}
