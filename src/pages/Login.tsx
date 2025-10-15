import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Login(){

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !senha) {
            setError('Preencha todos os campos');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao fazer login. Verifique suas credenciais.');
            }

            const data = await response.json();
            
            console.log('Login bem-sucedido:', data);

            // Salvar o token e o ID do usuário
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data._id);

            // Redirecionar para a página inicial
            navigate('/');

        } catch (error) {
            console.error('Erro no login:', error);
            setError(error instanceof Error ? error.message : 'Ocorreu um erro inesperado.');
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Bem-vindo de volta!</h1>
                    <p className="text-gray-600">Entre na sua conta para continuar comprando</p>
                </div>

                <div className="bg-white rounded-lg shadow-xl p-8">
                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                                Senha
                            </label>
                            <input
                                id="senha"
                                type="password"
                                placeholder="••••••••"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Entrando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-gray-600">
                                Não tem uma conta?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/register')}
                                    className="text-blue-600 hover:text-blue-500 font-medium cursor-pointer"
                                >
                                    Cadastre-se aqui
                                </button>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="text-center text-sm text-gray-500">
                    <p>🔒 Suas informações estão seguras conosco</p>
                </div>
            </div>
        </div>
    )
}