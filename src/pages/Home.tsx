import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Product{
    _id: string;
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
    imagem: string;
}

export default function Home(){

    const [produtos, setProdutos] = useState<Product[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('api/produtos') // essa linha já está correta
            .then(response => response.json())
            .then(data => {
                setProdutos(data);
                setLoading(false);
            })
            .catch(error => console.error(error));
    }, []);

    if(loading){
        return <p>Carregando...</p>;
    }

    const navigate = useNavigate();

    return(
        <div>
            {/* Hero Section */}
            <section className="Hero-Section">
                <div className="Inicio">
                    <h1>Seja bem-vindo(a) ao nosso site</h1>
                    <p>Encontre aqui os melhores produtos</p>
                    <p>Pelos menores preços!</p>
                    <button onClick={() => navigate('/register')}>Cadastre-se já!</button>
                </div>
                <div className="Imagem-Hero">
                    <img src="" alt="" />
                </div>
            </section>

            {/* Products Section */}
            <section>
                <h2>Produtos</h2>
                <div>
                    {produtos.map(produto => (
                        <div key={produto._id}>
                            <img src={produto.imagem} alt={produto.nome} />
                            <h3>{produto.nome}</h3>
                            <p>{produto.preco}</p>
                            <p>{produto.quantidade}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Products Promotion Section */}
            <section>
                <h2>Produtos em promoção</h2>
                {produtos.map(produto => (
                    <div key={produto._id}>
                        <img src={produto.imagem} alt={produto.nome} />
                        <h3>{produto.nome}</h3>
                        <p>{produto.preco}</p>
                        <p>{produto.quantidade}</p>
                    </div>
                ))}
            </section>

            {/* Products Most Sold Section */}
            <section>
                <h2>Produtos mais Vendidos</h2>
                {produtos.map(produto => (
                    <div key={produto._id}>
                        <img src={produto.imagem} alt={produto.nome} />
                        <h3>{produto.nome}</h3>
                        <p>{produto.preco}</p>
                        <p>{produto.quantidade}</p>
                    </div>
                ))}
            </section>

        </div>
    )
}