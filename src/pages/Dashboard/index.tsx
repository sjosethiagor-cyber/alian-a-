import { useDashboardData } from './hooks/useDashboardData';
import DashboardHeader from './components/DashboardHeader';
import DateStrip from './components/DateStrip';
import HighlightCard from './components/HighlightCard';
import CategoryGrid from './components/CategoryGrid';
import ActivityFeed from './components/ActivityFeed';
import './Dashboard.css';

export default function Dashboard() {
    const {
        loading,
        profile,
        partner,
        selectedDate,
        setSelectedDate,
        pendingTasks,
        shoppingItems,
        financeSummary,
        todayHighlight
    } = useDashboardData();

    return (
        <div className="dashboard-container">
            <DashboardHeader
                loading={loading}
                profile={profile}
                partner={partner}
                selectedDate={selectedDate}
            />

            <DateStrip
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
            />

            <HighlightCard highlight={todayHighlight} />

            <CategoryGrid
                pendingTasks={pendingTasks}
                shoppingItems={shoppingItems}
                financeSummary={financeSummary}
            />

            <ActivityFeed />
        </div>
    );
}
