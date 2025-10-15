import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface User {
    nome: string;
    idade: number;
    email: string;
    senha: string;
}

export default function Register(){

    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState<number>(0);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!nome || !idade || !email || !senha || !confirmarSenha) {
            setError('Preencha todos os campos');
            return;
        }

        if (idade < 18) {
            setError('Você deve ter pelo menos 18 anos para se cadastrar');
            return;
        }

        if (senha !== confirmarSenha) {
            setError('As senhas não coincidem');
            return;
        }

        if (senha.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const user: User = {
            nome,
            idade,
            email,
            senha
        }

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Cadastro realizado com sucesso! Faça o login para continuar.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.message || 'Erro ao criar conta');
            }
        } catch (error) {
            setError('Erro de conexão. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Crie sua conta</h1>
                    <p className="text-gray-600">Junte-se a nós e comece sua jornada de compras</p>
                </div>

                <div className="bg-white rounded-lg shadow-xl p-8">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                                Nome completo
                            </label>
                            <input
                                id="nome"
                                type="text"
                                placeholder="Seu nome completo"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="idade" className="block text-sm font-medium text-gray-700 mb-2">
                                Idade
                            </label>
                            <input
                                id="idade"
                                type="number"
                                placeholder="Sua idade"
                                value={idade || ''}
                                onChange={(e) => setIdade(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                min="18"
                                required
                            />
                        </div>

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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmar senha
                            </label>
                            <input
                                id="confirmarSenha"
                                type="password"
                                placeholder="••••••••"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                                {success}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleRegister}
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Criando conta...
                                </>
                            ) : (
                                'Criar conta'
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-gray-600">
                                Já tem uma conta?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="text-green-600 hover:text-green-500 font-medium cursor-pointer"
                                >
                                    Faça login aqui
                                </button>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="text-center text-sm text-gray-500">
                    <p> Suas informações estão seguras conosco</p>
                </div>
            </div>
        </div>
    )
}