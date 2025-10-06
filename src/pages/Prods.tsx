import React, { useState, useEffect } from 'react';


interface Produto {
  _id: string;
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
  imagem?: string;
}

const Prods: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [imagem, setImagem] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const response = await fetch(`api/produtos`);
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const clearForm = () => {
    setNome('');
    setPreco('');
    setDescricao('');
    setQuantidade('');
    setImagem('');
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const produtoData = { 
        nome, 
        preco: parseFloat(preco), 
        descricao, 
        quantidade: parseInt(quantidade), 
        imagem 
    };

    try {
      if (editId) {
        // Atualizar produto
        const response = await fetch(`api/produtos`,
         {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ produtoId: editId, ...produtoData }),
        });
        if (!response.ok) throw new Error('Erro ao atualizar produto');
      } else {
        // Adicionar produto
        const response = await fetch(`api/produtos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(produtoData),
        });
        if (!response.ok) throw new Error('Erro ao adicionar produto');
      }
      clearForm();
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditId(produto._id);
    setNome(produto.nome);
    setPreco(produto.preco.toString());
    setDescricao(produto.descricao);
    setQuantidade(produto.quantidade.toString());
    setImagem(produto.imagem || '');
  };

  const handleDelete = async (produtoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const response = await fetch(`api/produtos`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ produtoId }),
        });
        if (!response.ok) throw new Error('Erro ao excluir produto');
        fetchProdutos();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Gerenciamento de Produtos</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h3>{editId ? 'Editar Produto' : 'Adicionar Produto'}</h3>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" required style={{ display: 'block', margin: '10px 0', padding: '8px' }} />
        <input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="Preço" required style={{ display: 'block', margin: '10px 0', padding: '8px' }} />
        <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição" required style={{ display: 'block', margin: '10px 0', padding: '8px' }} />
        <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} placeholder="Quantidade" required style={{ display: 'block', margin: '10px 0', padding: '8px' }} />
        <input type="text" value={imagem} onChange={(e) => setImagem(e.target.value)} placeholder="URL da Imagem" style={{ display: 'block', margin: '10px 0', padding: '8px' }} />
        <button type="submit" style={{ padding: '10px 15px', marginRight: '10px' }}>{editId ? 'Atualizar' : 'Adicionar'}</button>
        {editId && <button type="button" onClick={clearForm} style={{ padding: '10px 15px' }}>Cancelar Edição</button>}
      </form>

      <h2>Lista de Produtos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {produtos.map((produto) => (
          <div key={produto._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <img src={produto.imagem || 'https://placehold.co/150'} alt={produto.nome} style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
            <h4>{produto.nome}</h4>
            <p>Preço: R$ {produto.preco}</p>
            <p>Estoque: {produto.quantidade}</p>
            <p>{produto.descricao}</p>
            <button onClick={() => handleEdit(produto)} style={{ marginRight: '10px' }}>Editar</button>
            <button onClick={() => handleDelete(produto._id)}>Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Prods;
