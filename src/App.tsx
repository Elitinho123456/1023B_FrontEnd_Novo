import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';

type Produto = {
  _id: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  imagem: string;
};

function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch('/api/produtos');
        if (!response.ok) throw new Error('Erro ao carregar produtos');
        const data = await response.json();
        setProdutos(data);
      } catch (err) {
        setError('Erro ao carregar produtos. Tente novamente mais tarde.');
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const addToCart = async (id: string) => {
    if (!isLoggedIn) {
      alert('Por favor, faça login para adicionar itens ao carrinho. Redirecionando...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      return;
    }

    try {
      const response = await fetch('api/carrinho', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          produtoId: id,
          quantidade: 1,
          usuarioId: localStorage.getItem('userId')
        })
      });

      // if (!response.ok) throw new Error('Erro ao adicionar ao carrinho');
      console.log(await response.json())
      
      alert('Produto adicionado ao carrinho com sucesso!');
    } catch (err) {
      console.log('Error adding to cart:', err);
      alert('Erro ao adicionar ao carrinho. Tente novamente.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-800">Loja Online</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  to="/" 
                  className={`${location.pathname === '/' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Produtos
                </Link>
                <Link 
                  to="/carrinho" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Carrinho
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {isLoggedIn ? (
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-4">
                    Olá, {localStorage.getItem('userName') || 'Usuário'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Produtos</h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {produtos.map((produto) => (
                <div key={produto._id} className="group">
                  <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                    <div className="w-full h-full object-center object-cover group-hover:opacity-75 flex items-center justify-center bg-gray-100">
                      <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">{produto.nome}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{produto.descricao}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-lg font-medium text-gray-900">R$ {produto.preco.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{produto.quantidade} em estoque</p>
                  </div>
                  <button
                    onClick={() => addToCart(produto._id)}
                    disabled={produto.quantidade <= 0}
                    className={`mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
                      produto.quantidade <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {produto.quantidade > 0 ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/carrinho" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;