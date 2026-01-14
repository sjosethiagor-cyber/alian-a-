import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Routine from './pages/Routine';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="rotina" element={<Routine />} />
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

        {/* Catches unknown routes and redirects to Welcome */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
