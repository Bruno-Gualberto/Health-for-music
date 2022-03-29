import { useParams } from "react-router-dom";

// adicionar timestamp no começo do artigo
// nao fazer modo ediçao nessa pagina
// editar somente no perfil do medico
// usar mesmo componente pra criar e editar

const SingleArticle = () => {
    const { articleId } = useParams();
    return <div>single article {articleId}</div>;
};

export default SingleArticle;
