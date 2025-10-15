import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Product {
    _id: string;
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
    imagem: string;
}

export default function Home() {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItems, setCartItems] = useState<Product[]>([]);

    useEffect(() => {
        fetch('/api/produtos')
            .then(response => response.json())
            .then(data => {
                setProdutos(data);
                setLoading(false);
            })
            .catch(error => console.error(error));
    }, []);

    const filteredProducts = produtos.filter(produto =>
        produto.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product: Product) => {
        if ((product.quantidade ?? 0) > 0) {
            setCartItems(prev => [...prev, product]);
            // Here you would typically make an API call to add to cart
        }
    };

    const goToCart = () => {
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando produtos...</p>
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
                            <h1 className="text-2xl font-bold text-gray-900">🛒 ShopOnline</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar produtos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>

                            <button
                                onClick={goToCart}
                                className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center cursor-pointer"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6M9 19a1 1 0 102 0 1 1 0 00-2 0zm8 0a1 1 0 102 0 1 1 0 00-2 0z"></path>
                                </svg>
                                Carrinho ({cartItems.length})
                            </button>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                                >
                                    Cadastrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Bem-vindo à ShopOnline
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90">
                        Encontre os melhores produtos pelos menores preços!
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        Comece a Comprar
                    </button>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossos Produtos</h2>
                        <p className="text-gray-600 text-lg">Descubra nossa seleção exclusiva de produtos</p>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
                            <p className="text-gray-600">Tente ajustar sua busca ou volte mais tarde.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProducts.map(produto => (
                                <div key={produto._id} className="bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                    <div className="aspect-square bg-gray-200 relative">
                                        {produto.imagem ? (
                                            <img
                                                src={produto.imagem}
                                                alt={produto.nome || 'Produto sem nome'}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                        )}
                                        {(produto.quantidade ?? 0) <= 5 && (produto.quantidade ?? 0) > 0 && (
                                            <span className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                Últimas unidades
                                            </span>
                                        )}
                                        {(produto.quantidade ?? 0) === 0 && (
                                            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                Esgotado
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{produto.nome || 'Produto sem nome'}</h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{produto.descricao || 'Sem descrição'}</p>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <span className="text-2xl font-bold text-green-600">
                                                    R$ {(produto.preco ?? 0).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                                </svg>
                                                {produto.quantidade ?? 0} em estoque
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => addToCart(produto)}
                                            disabled={(produto.quantidade ?? 0) === 0}
                                            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                                                (produto.quantidade ?? 0) === 0
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                                            }`}
                                        >
                                            {(produto.quantidade ?? 0) === 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher a ShopOnline?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Entrega Rápida</h3>
                            <p className="text-gray-600">Receba seus produtos no conforto da sua casa</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Produtos de Qualidade</h3>
                            <p className="text-gray-600">Selecionamos apenas os melhores produtos para você</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Suporte 24/7</h3>
                            <p className="text-gray-600">Estamos sempre disponíveis para ajudar você</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}