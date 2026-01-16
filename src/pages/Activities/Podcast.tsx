import { useState } from 'react';
import PodcastPlayer from './components/Podcast/PodcastPlayer';
import PodcastLibrary from './components/Podcast/PodcastLibrary';
import JointSessionCard from './components/Podcast/JointSessionCard';
import EpisodeChecklist from './components/Podcast/EpisodeChecklist';
import SharedInsights from './components/Podcast/SharedInsights';
import AllPodcasts from './components/Podcast/AllPodcasts';
import { type ActivityItem } from '../../services/activityService';

interface PodcastProps {
    items?: ActivityItem[];
    onAdd?: () => void;
}

type ViewMode = 'home' | 'all';

export default function Podcast({ items = [], onAdd }: PodcastProps) {
    const [view, setView] = useState<ViewMode>('home');

    // Get the most recent podcast item
    const currentPodcast = items.length > 0 ? items[items.length - 1] : null;
    const meta = currentPodcast?.meta ? JSON.parse(currentPodcast.meta) : {};

    if (view === 'all') {
        return <AllPodcasts items={items} onBack={() => setView('home')} />;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: 'white' }}>
            <PodcastPlayer podcast={currentPodcast} onAdd={onAdd} />
            <PodcastLibrary onViewAll={() => setView('all')} />
            <JointSessionCard date={meta.scheduledDate} time={meta.scheduledTime} />
            <EpisodeChecklist />
            <SharedInsights />
        </div>
    );
}
