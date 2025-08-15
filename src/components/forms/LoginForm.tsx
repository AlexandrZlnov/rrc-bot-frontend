import { useState } from 'react';
import { login } from '../../services/auth.service';

export default function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      onLogin();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
        display: 'grid',
        gap: '1rem',
        width: '100%',
        boxSizing: 'border-box',
        }}>
      <div>
        <label>Логин</label>
        <input
          style={{ 
            width: '100%',
            padding: '0.5rem',
            boxSizing: 'border-box',
          }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Пароль</label>
        <input
          type="password"
          style={{ 
            width: '100%',
            padding: '0.5rem',
            boxSizing: 'border-box',
           }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button
        type="submit"
        style={{ padding: '0.5rem', background: 'black', color: 'white' }}
        disabled={loading}
      >
        {loading ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
}
