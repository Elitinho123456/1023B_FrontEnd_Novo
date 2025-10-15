import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Product {
    _id?: string;
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
    imagem: string;
}

export default function Products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Product>({
        nome: '',
        descricao: '',
        preco: 0,
        quantidade: 0,
        imagem: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Check if user is authenticated
    useEffect(() => {
        // Temporariamente desabilitando verificação de autenticação
        // TODO: Reabilitar quando autenticação estiver funcionando
        console.log('⚠️  VERIFICAÇÃO DE AUTENTICAÇÃO TEMPORARIAMENTE DESABILITADA');

        /*
        if (!auth.isAuthenticated()) {
            navigate('/login');
            return;
        }
        */

        fetchProducts();
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/produtos');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            setError('Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.nome || !formData.descricao || !formData.preco || !formData.quantidade) {
            setError('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            if (editingProduct) {
                // Update product
                const response = await fetch(`/api/produtos`, {
                    method: 'PUT',
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    setSuccess('Produto atualizado com sucesso!');
                    setEditingProduct(null);
                    fetchProducts();
                } else {
                    setError('Erro ao atualizar produto');
                }
            } else {
                // Add new product
                const response = await fetch(`/api/produtos`, {
                    method: 'POST',
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    setSuccess('Produto adicionado com sucesso!');
                    setShowAddForm(false);
                    setFormData({
                        nome: '',
                        descricao: '',
                        preco: 0,
                        quantidade: 0,
                        imagem: ''
                    });
                    fetchProducts();
                } else {
                    setError('Erro ao adicionar produto');
                }
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro interno do servidor');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData(product);
        setShowAddForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            const response = await fetch(`/api/produtos`, {
                method: 'DELETE',
                body: JSON.stringify({ produtoId: id }),
            });

            console.log(response);
            setSuccess('Produto excluído com sucesso!');
            fetchProducts();

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro interno do servidor');
        }
    };

    const resetForm = () => {
        setFormData({
            nome: '',
            descricao: '',
            preco: 0,
            quantidade: 0,
            imagem: ''
        });
        setEditingProduct(null);
        setShowAddForm(false);
        setError('');
        setSuccess('');
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
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                Voltar à loja
                            </button>
                        </div>

                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900">🛠️ Gerenciar Produtos</h1>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Alerts */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                        {success}
                    </div>
                )}

                {/* Add Product Button */}
                <div className="mb-8">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Adicionar Produto
                    </button>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                    <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome do Produto *
                                    </label>
                                    <input
                                        id="nome"
                                        type="text"
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Nome do produto"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-2">
                                        Preço *
                                    </label>
                                    <input
                                        id="preco"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.preco || ''}
                                        onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantidade em Estoque *
                                    </label>
                                    <input
                                        id="quantidade"
                                        type="number"
                                        min="0"
                                        value={formData.quantidade || ''}
                                        onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 mb-2">
                                        URL da Imagem
                                    </label>
                                    <input
                                        id="imagem"
                                        type="url"
                                        value={formData.imagem}
                                        onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://exemplo.com/imagem.jpg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                                    Descrição *
                                </label>
                                <textarea
                                    id="descricao"
                                    rows={4}
                                    value={formData.descricao}
                                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Descrição detalhada do produto"
                                    required
                                />
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    {editingProduct ? 'Atualizar Produto' : 'Adicionar Produto'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Lista de Produtos ({products.length})
                        </h2>
                    </div>

                    {products.length === 0 ? (
                        <div className="p-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto cadastrado</h3>
                            <p className="text-gray-600">Adicione seu primeiro produto para começar.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Produto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Preço
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estoque
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 mr-4">
                                                        {product.imagem ? (
                                                            <img
                                                                src={product.imagem}
                                                                alt={product.nome}
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {product.nome}
                                                        </div>
                                                        <div className="text-sm text-gray-500 max-w-xs truncate">
                                                            {product.descricao}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-green-600">
                                                    R$ {product.preco.toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.quantidade > 10
                                                    ? 'bg-green-100 text-green-800'
                                                    : product.quantidade > 0
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.quantidade} unidades
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => product._id && handleDelete(product._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}