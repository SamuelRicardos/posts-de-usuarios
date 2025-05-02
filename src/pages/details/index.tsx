import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown, FaEye, FaArrowLeft } from "react-icons/fa";
import axios from "axios";

type Post = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
};

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`https://dummyjson.com/posts/${id}`);
        setPost(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Erro ao buscar post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Carregando...</p>;
  if (!post) return <p className="text-center mt-10">Post não encontrado.</p>;

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-xl">
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

        <p className="text-gray-700 mb-4">{post.body}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <FaThumbsUp /> {post.reactions.likes}
            </span>
            <span className="flex items-center gap-1">
              <FaThumbsDown /> {post.reactions.dislikes}
            </span>
            <span className="flex items-center gap-1">
              <FaEye /> {post.views}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 cursor-pointer"
        >
          <FaArrowLeft /> Voltar para a página inicial
        </button>
      </div>
    </div>
  );
}
