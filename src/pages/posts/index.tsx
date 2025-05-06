import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaSearch, FaEye, FaPlus, FaSun, FaMoon } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useThemeStore } from "../../store/themeStore";

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const { theme, toggleTheme, setTheme } = useThemeStore();

  const isDarkMode = theme === "dark";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://dummyjson.com/posts");
      setPosts(res.data.posts);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    try {
      if (editPostId) {
        const res = await axios.put(`https://dummyjson.com/posts/${editPostId}`, {
          title,
          body,
        });
        setPosts(posts.map((post) => (post.id === editPostId ? res.data : post)));
        setEditPostId(null);
        toast.success("Post atualizado com sucesso!");
      } else {
        const res = await axios.post("https://dummyjson.com/posts/add", {
          title,
          body,
          userId: 1,
        });
        setPosts([res.data, ...posts]);
        toast.success("Post criado com sucesso!");
      }

      setTitle("");
      setBody("");
    } catch (error) {
      console.error("Erro ao salvar post:", error);
      toast.error("Erro ao salvar post!");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://dummyjson.com/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
      toast.success("Post deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      toast.error("Erro ao deletar post!");
    }
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title);
    setBody(post.body);
    setEditPostId(post.id);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen max-w-3xl mx-auto p-4 transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">CRUD de Posts</h1>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer sm:px-3 sm:py-1"
        >
          {isDarkMode ? <FaSun className="text-lg sm:text-xl" /> : <FaMoon className="text-lg sm:text-xl" />}
          <span className="hidden sm:inline">
            {isDarkMode ? "Modo Claro" : "Modo Escuro"}
          </span>
        </button>
      </div>

      <div
        className={`mb-6 flex items-center border rounded ${isDarkMode ? "bg-gray-800 border-gray-600" : ""
          }`}
      >
        <FaSearch className="ml-2 text-gray-600" />
        <input
          type="text"
          placeholder="Pesquisar por título"
          className={`w-full p-2 pl-8 border-none rounded outline-none ${isDarkMode
            ? "bg-gray-800 text-white placeholder-gray-400"
            : "bg-gray-100 text-black placeholder-gray-500"
            }`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Título"
          className={`w-full p-2 border rounded mb-2 ${isDarkMode
            ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
            : "bg-gray-100 text-black placeholder-gray-500"
            }`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Conteúdo"
          className={`w-full h-50 p-2 border rounded mb-2 ${isDarkMode
            ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
            : "bg-gray-100 text-black placeholder-gray-500"
            }`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          type="submit"
          className="flex flex-row items-center justify-center bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:opacity-90"
        >
          {editPostId ? "Atualizar Post" : (
            <>
              <FaPlus className="mr-2" />
              Criar post
            </>
          )}
        </button>
      </form>

      <div className="space-y-4">
        {loading
          ? Array(5)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className={`relative border p-4 rounded shadow ${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white"
                  }`}
              >
                <Skeleton
                  height={30}
                  width="60%"
                  baseColor={isDarkMode ? "#374151" : undefined}
                  highlightColor={isDarkMode ? "#4b5563" : undefined}
                />
                <Skeleton
                  count={3}
                  baseColor={isDarkMode ? "#374151" : undefined}
                  highlightColor={isDarkMode ? "#4b5563" : undefined}
                />
              </div>
            ))
          : filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`relative border p-4 rounded shadow flex flex-col gap-4 ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-white text-gray-700"
                }`}
            >
              <div className="flex gap-2 sm:absolute sm:top-2 sm:right-2 self-end">
                <Link
                  to={`/details/${post.id}`}
                  className="bg-blue-400 px-3 py-1 rounded text-white cursor-pointer"
                >
                  <FaEye />
                </Link>
                <button
                  className="bg-yellow-400 px-3 py-1 rounded text-white cursor-pointer"
                  onClick={() => handleEdit(post)}
                >
                  <FaEdit />
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                  onClick={() => handleDelete(post.id)}
                >
                  <FaTrashAlt />
                </button>
              </div>

                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p>{post.body}</p>
                
            </div>
          ))}
      </div>

      <ToastContainer />
    </div>
  );
}
