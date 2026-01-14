import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Header from './Header';
import './Layout.css';

export default function Layout() {
    return (
        <div className="layout-container">
            {/* Sidebar - Desktop Only */}
            <aside className="sidebar-area">
                <Sidebar />
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div className="header-area">
                    <Header />
                </div>

                <div className="page-container">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Nav - Mobile Only */}
            <nav className="bottom-nav-area">
                <BottomNav />
            </nav>
        </div>
    );
}
