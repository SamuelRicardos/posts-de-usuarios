import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown, FaEye, FaArrowLeft, FaSun, FaMoon } from "react-icons/fa";
import axios from "axios";
import { useThemeStore } from "../../store/themeStore";

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
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`https://dummyjson.com/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.error("Erro ao buscar post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const containerClass =
    theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";

  const cardClass =
    theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900";

  if (loading)
    return (
      <div className={`h-screen flex items-center justify-center ${containerClass}`}>
        <div className={`max-w-3xl w-full p-6 shadow-md rounded-xl animate-pulse ${cardClass}`}>
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-11/12"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-10/12"></div>
          </div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </div>
          <div className="h-10 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );

  if (!post) return <p className="text-center mt-10">Post não encontrado.</p>;

  return (
    <div className={`min-h-screen flex items-center justify-center ${containerClass}`}>
      <div className={`max-w-3xl mx-auto p-4 shadow-md rounded-xl ${cardClass}`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <button
            onClick={toggleTheme}
            className="px-3 py-2 text-sm sm:text-base bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 transition-all duration-200 cursor-pointer"
          >
            {theme === "dark" ? <FaSun className="text-lg sm:text-xl" /> : <FaMoon className="text-lg sm:text-xl" />}
            <span className="hidden sm:inline">
              {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
            </span>
          </button>
        </div>

        <p className="mb-4">{post.body}</p>

        <p className="mb-1 font-semibold">Categoria da história:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className={`text-sm px-2 py-1 rounded ${theme === "dark"
                ? "bg-blue-900 text-blue-200"
                : "bg-blue-100 text-blue-800"
                }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
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
