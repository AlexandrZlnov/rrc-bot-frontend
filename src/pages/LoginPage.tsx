import LoginForm from '../components/forms/LoginForm';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 border">
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>
        <LoginForm onSuccess={() => nav('/')} />
      </div>
    </div>
  );
}
