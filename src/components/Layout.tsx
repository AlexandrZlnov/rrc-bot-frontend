import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Главная', icon: '🏠' },
    { path: '/blocks', label: 'Блоки', icon: '📑' },
    { path: '/admin/blocks', label: 'Дерево', icon: '🌳' },
    { path: '/users', label: 'Пользователи', icon: '👥' },
    { path: '/search-stats', label: 'Статистика', icon: '📊' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Montserrat, sans-serif' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '80px',
          background: '#28282D',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '1rem',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '2rem' }}>✚</div>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              margin: '1rem 0',
              color: location.pathname === item.path ? '#E1081A' : '#fff',
              fontSize: '20px',
              textDecoration: 'none',
            }}
            title={item.label}
          >
            {item.icon}
          </Link>
        ))}
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header
          style={{
            background: '#fff',
            padding: '1rem',
            borderBottom: '1px solid #DEDDD8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#28282D' }}>
            Панель администратора
          </h1>
          <button
            style={{
              background: '#E1081A',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Выйти
          </button>
        </header>

        {/* Content */}
        <main style={{ flex: 1, background: '#F9F9F9', padding: '1.5rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
