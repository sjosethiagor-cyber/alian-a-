import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import RoutinePage from './pages/Routine/RoutinePage'; // Updated import
import Activities from './pages/Activities';
import Finances from './pages/Finances';
import Profile from './pages/Profile';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import GroupMenu from './pages/Group/GroupMenu';
import EnterGroup from './pages/Group/EnterGroup';
import CreateGroup from './pages/Group/CreateGroup';
import ManageGroup from './pages/Group/ManageGroup';
import Notifications from './pages/Notifications';
import Privacy from './pages/Privacy';
import HelpSupport from './pages/HelpSupport';
import About from './pages/About';
import './index.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';

function SimpleProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
}

import Onboarding from './pages/Onboarding';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/onboarding" element={
            <SimpleProtectedRoute>
              <Onboarding />
            </SimpleProtectedRoute>
          } />

          <Route path="/app" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="rotina" element={<RoutinePage />} /> {/* Use the new component */}
            <Route path="atividades" element={<Activities />} />
            <Route path="financas" element={<Finances />} />
            <Route path="perfil" element={<Profile />} />

            {/* Group Routes */}
            <Route path="perfil/grupo" element={<GroupMenu />} />
            <Route path="perfil/grupo/entrar" element={<EnterGroup />} />
            <Route path="perfil/grupo/criar" element={<CreateGroup />} />
            <Route path="perfil/grupo/gerenciar" element={<ManageGroup />} />

            {/* Settings Routes */}
            <Route path="perfil/notificacoes" element={<Notifications />} />
            <Route path="perfil/privacidade" element={<Privacy />} />
            <Route path="perfil/suporte" element={<HelpSupport />} />
            <Route path="perfil/sobre" element={<About />} />


          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
