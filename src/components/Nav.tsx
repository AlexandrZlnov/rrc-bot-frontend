import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Главная' },
    { to: '/blocks', label: 'Блоки меню' },
    { to: '/users', label: 'Пользователи' },
    { to: '/search-stats', label: 'Статистика поиска' },
  ];

  return (
    <aside style={{ background: '#f5f5f5', padding: '1rem' }}>
      <h2 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Админка</h2>
      <nav>
        {links.map(link => (
          <div key={link.to} style={{ marginBottom: '0.5rem' }}>
            <Link
              to={link.to}
              style={{
                color: pathname === link.to ? 'blue' : 'black',
                textDecoration: 'none',
                fontWeight: pathname === link.to ? 'bold' : 'normal',
              }}
            >
              {link.label}
            </Link>
          </div>
        ))}
      </nav>
    </aside>
  );
}
