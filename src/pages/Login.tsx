import { useState } from 'react';
import { Shield, Lock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular autenticação
    setTimeout(() => {
      setIsLoading(false);
      // Aqui seria implementada a lógica de autenticação real
      alert('Funcionalidade de login será implementada com Supabase');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            CBMEPI Admin
          </h1>
          <p className="text-orange-100">
            Painel Administrativo
          </p>
        </div>

        {/* Formulário de login */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="admin@cbmepi.pi.gov.br"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Voltar para a lista de candidatos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}