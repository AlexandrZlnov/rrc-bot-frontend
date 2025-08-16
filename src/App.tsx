import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Protected from './components/Protected';
import Layout from './components/Layout';
import LoginForm from './components/forms/LoginForm';

// ✅ Импортируем реальную страницу
import BlocksPage from './pages/BlocksPage';
import UsersPage from './pages/UsersPage';
import SearchStatsPage from './pages/SearchStatsPage';
import MenuBlocksPage from './pages/MenuBlocksPage';

function HomePage() {
  return <h2>Главная страница</h2>;
}

function LoginPage() {
  const navigate = useNavigate();
  return (
    <div style={{ 
        display: 'flex',
        placeItems: 'center',
        height: '100vh',
        backgroundImage: 'url("/page_logo1.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingLeft: '25%',
       }}>
      <div style={{ 
        width: '300px',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        background: 'white',
       }}>
        <h2>Вход</h2>
        <LoginForm onLogin={() => navigate('/')} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <Protected>
            <Layout>
              <HomePage />
            </Layout>
          </Protected>
        }
      />
      <Route
        path="/blocks"
        element={
          <Protected>
            <Layout>
              <BlocksPage /> {/* ✅ Теперь это страница с таблицей */}
            </Layout>
          </Protected>
        }
      />
      <Route
        path="/users"
        element={
          <Protected>
            <Layout>
              <UsersPage />
            </Layout>
          </Protected>
        }
      />
      <Route
        path="/admin/blocks"
        element={
          <Protected>
            <Layout>
             <MenuBlocksPage /> {/* дерево */}
            </Layout>
          </Protected>
        }
      />
      <Route
        path="/search-stats"
        element={
          <Protected>
            <Layout>
              <SearchStatsPage />
            </Layout>
          </Protected>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
