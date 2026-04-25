import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './services/supabase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Obras from './pages/Obras';
import Demandas from './pages/Demandas';
import Funcionarios from './pages/Funcionarios';
import Materiais from './pages/Materiais';
import { AuthState } from './types';
import './styles/index.css';

export default function App() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setAuth({
            user: {
              id: user.id,
              email: user.email || '',
              nome: user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário',
              criado_em: user.created_at || new Date().toISOString(),
            },
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuth({ user: null, isLoading: false, isAuthenticated: false });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setAuth({ user: null, isLoading: false, isAuthenticated: false });
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setAuth({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              nome: session.user.user_metadata?.nome || session.user.email?.split('@')[0] || 'Usuário',
              criado_em: session.user.created_at || new Date().toISOString(),
            },
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuth({ user: null, isLoading: false, isAuthenticated: false });
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (auth.isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Carregando Berlim SaaS...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={auth.isAuthenticated ? <Navigate to="/" /> : <Login onLoginSuccess={(user) => setAuth({ user, isLoading: false, isAuthenticated: true })} />}
        />
        <Route
          path="/"
          element={auth.isAuthenticated ? <Dashboard user={auth.user!} /> : <Navigate to="/login" />}
        />
        <Route
          path="/obras"
          element={auth.isAuthenticated ? <Obras user={auth.user!} /> : <Navigate to="/login" />}
        />
        <Route
          path="/demandas"
          element={auth.isAuthenticated ? <Demandas user={auth.user!} /> : <Navigate to="/login" />}
        />
        <Route
          path="/funcionarios"
          element={auth.isAuthenticated ? <Funcionarios user={auth.user!} /> : <Navigate to="/login" />}
        />
        <Route
          path="/materiais"
          element={auth.isAuthenticated ? <Materiais user={auth.user!} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}
