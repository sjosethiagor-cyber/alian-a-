import type { ReactNode } from 'react';
import './Card.css';

interface CardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export default function Card({ children, className = '', hoverEffect = true }: CardProps) {
    return (
        <div className={`ui-card ${hoverEffect ? 'hover-effect' : ''} ${className}`}>
            {children}
        </div>
    );
}
