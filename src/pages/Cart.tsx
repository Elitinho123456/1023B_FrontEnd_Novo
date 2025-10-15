import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem {
    _id: string;
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
    imagem: string;
    cartQuantity: number;
}

export default function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartItems = async () => {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            if (!token || !userId) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`/api/cart?usuarioId=${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 404) {
                    setCartItems([]);
                    return;
                }

                if (!response.ok) {
                    throw new Error('Erro ao buscar carrinho');
                }

                const data = await response.json();
                setCartItems(data.itens.map((item: any) => ({
                    ...item,
                    _id: item.produtoId,
                    cartQuantity: item.quantidade
                })));
            } catch (error) {
                console.error(error);
                // Lidar com erro, talvez redirecionar para login
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [navigate]);


    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeItem(id);
            return;
        }

        setCartItems(prev =>
            prev.map(item =>
                item._id === id
                    ? { ...item, cartQuantity: newQuantity }
                    : item
            )
        );
    };

    const removeItem = (id: string) => {
        setCartItems(prev => prev.filter(item => item._id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.preco * item.cartQuantity), 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.cartQuantity, 0);
    };

    const handleCheckout = async () => {
        // Here you would typically make an API call to process the order
        alert(`Compra finalizada! Total: R$ ${getTotalPrice().toFixed(2)}`);
        clearCart();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando carrinho...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center text-gray-600 hover:text-gray-900 mr-4 cursor-pointer"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                Voltar às compras
                            </button>
                        </div>

                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900">🛒 Meu Carrinho</h1>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-lg shadow-sm p-12 max-w-md mx-auto">
                            <svg className="mx-auto h-24 w-24 text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19a1 1 0 102 0 1 1 0 00-2 0zm8 0a1 1 0 102 0 1 1 0 00-2 0z"></path>
                            </svg>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h2>
                            <p className="text-gray-600 mb-8">Adicione alguns produtos para começar suas compras</p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors cursor-pointer"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Itens do Carrinho ({getTotalItems()})
                                        </h2>
                                        <button
                                            onClick={clearCart}
                                            className="text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer"
                                        >
                                            Limpar Carrinho
                                        </button>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="p-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 relative">
                                                    {item.imagem ? (
                                                        <img
                                                            src={item.imagem}
                                                            alt={item.nome}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {item.nome || 'Produto sem nome'}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                        {item.descricao || 'Sem descrição'}
                                                    </p>
                                                    <p className="text-lg font-bold text-green-600">
                                                        R$ {(item.preco ?? 0).toFixed(2)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                                        <button
                                                            onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}
                                                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                                                            </svg>
                                                        </button>
                                                        <span className="px-4 py-2 text-lg font-medium border-x border-gray-300">
                                                            {item.cartQuantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item._id, item.cartQuantity + 1)}
                                                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item._id)}
                                                        className="text-red-600 hover:text-red-700 p-2 cursor-pointer"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({getTotalItems()} itens)</span>
                                        <span>R$ {getTotalPrice().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Frete</span>
                                        <span className="text-green-600">Grátis</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-lg font-semibold text-gray-900">
                                            <span>Total</span>
                                            <span>R$ {getTotalPrice().toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
                                >
                                    Finalizar Compra
                                </button>

                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
                                >
                                    Continuar Comprando
                                </button>

                                <div className="mt-6 text-xs text-gray-500">
                                    <p>🔒 Compra segura garantida</p>
                                    <p className="mt-1">📦 Entrega em até 3 dias úteis</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}