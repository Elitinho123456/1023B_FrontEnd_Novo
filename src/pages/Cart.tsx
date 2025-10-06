import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  _id: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  nome: string;
}

export default function Cart() {
  const [cart, setCart] = useState<{
    _id: string;
    itens: CartItem[];
    total: number;
    dataAtualizacao: string;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const fetchCart = async () => {
    if (!userId) {
      setError('Você precisa estar logado para ver o carrinho');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`api/carrinho?usuarioId=${userId}`);
      console.log(response)
      // if (!response.ok) {
      //   if (response.status === 404) {
      //     // Carrinho vazio
      //     setCart(null);
      //     return;
      //   }
      //   throw new Error('Erro ao carregar o carrinho');
      // }

      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError('Erro ao carregar o carrinho. Tente novamente mais tarde.');
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch('/api/carrinho', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: userId,
          produtoId: itemId,
          quantidade: newQuantity,
        }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar quantidade');

      // Atualiza o carrinho localmente
      if (cart) {
        const updatedItems = cart.itens.map(item => 
          item.produtoId === itemId ? { ...item, quantidade: newQuantity } : item
        );
        
        const total = updatedItems.reduce(
          (sum, item) => sum + (item.precoUnitario * item.quantidade), 
          0
        );

        setCart({
          ...cart,
          itens: updatedItems,
          total,
          dataAtualizacao: new Date().toISOString()
        });
      }
    } catch (err) {
      setError('Erro ao atualizar a quantidade. Tente novamente.');
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!confirm('Tem certeza que deseja remover este item do carrinho?')) return;

    try {
      const response = await fetch('/api/carrinho/item', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: userId,
          produtoId: itemId,
        }),
      });

      if (!response.ok) throw new Error('Erro ao remover item');

      // Atualiza o carrinho localmente
      if (cart) {
        const updatedItems = cart.itens.filter(item => item.produtoId !== itemId);
        
        if (updatedItems.length === 0) {
          setCart(null);
        } else {
          const total = updatedItems.reduce(
            (sum, item) => sum + (item.precoUnitario * item.quantidade), 
            0
          );

          setCart({
            ...cart,
            itens: updatedItems,
            total,
            dataAtualizacao: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      setError('Erro ao remover o item. Tente novamente.');
      console.error('Error removing item:', err);
    }
  };

  const handleCheckout = () => {
    // Implementar lógica de finalização de compra
    alert('Funcionalidade de finalização de compra será implementada em breve!');
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">Carrinho Vazio</h2>
          <p className="mb-4">Você precisa estar logado para ver seu carrinho.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!cart || cart.itens.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">Seu carrinho está vazio</h2>
          <p className="mb-4">Adicione itens ao seu carrinho para continuar.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ver Produtos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Meu Carrinho</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Itens do Carrinho
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Última atualização: {new Date(cart.dataAtualizacao).toLocaleString()}
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {cart.itens.map((item) => (
                <li key={item._id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-200 rounded-md">
                          <span className="text-gray-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </span>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.nome}
                          </h4>
                          <p className="text-sm text-gray-500">
                            R$ {item.precoUnitario.toFixed(2)} un.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item.produtoId, item.quantidade - 1)}
                        className="text-gray-500 hover:text-gray-700 px-2 py-1"
                        disabled={item.quantidade <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2 w-8 text-center">{item.quantidade}</span>
                      <button
                        onClick={() => updateQuantity(item.produtoId, item.quantidade + 1)}
                        className="text-gray-500 hover:text-gray-700 px-2 py-1"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="ml-4 font-medium">
                      R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.produtoId)}
                      className="ml-4 text-red-600 hover:text-red-800"
                      title="Remover item"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="bg-gray-50 px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Total
                </h3>
                <p className="text-xl font-semibold text-gray-900">
                  R$ {cart.total.toFixed(2)}
                </p>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Finalizar Compra
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
