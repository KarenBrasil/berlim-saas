import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Home, Briefcase, CheckSquare, Users, Package } from 'lucide-react';
import { supabase } from '../services/supabase';
import { User } from '../types';

interface NavigationProps {
  user: User;
  onLogout: () => void;
}

export default function Navigation({ user, onLogout }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: Home },
    { label: 'Obras', path: '/obras', icon: Briefcase },
    { label: 'Demandas', path: '/demandas', icon: CheckSquare },
    { label: 'Funcionários', path: '/funcionarios', icon: Users },
    { label: 'Materiais', path: '/materiais', icon: Package },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <span className="font-bold text-gray-900">Berlim</span>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isOpen && (
          <nav className="border-t border-gray-200 p-4 space-y-2">
            {menuItems.map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  setIsOpen(false);
                }}
                className={`w-full menu-item ${location.pathname === path ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
            <button onClick={handleLogout} className="w-full menu-item text-red-600 hover:bg-red-50">
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </nav>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <div className="font-bold text-gray-900">Berlim</div>
              <div className="text-xs text-gray-500">Gestão de Obras</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full menu-item ${location.pathname === path ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className="px-4 py-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">{user.nome}</div>
            <div className="text-xs text-gray-600 truncate">{user.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
