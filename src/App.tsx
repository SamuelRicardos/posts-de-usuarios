import { useEffect, useState } from "react";
import axios from "axios";

type Post = {
  id: number;
  title: string;
  body: string;
};

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editPostId, setEditPostId] = useState<number | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://dummyjson.com/posts");
      setPosts(res.data.posts);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
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
      } else {
        const res = await axios.post("https://dummyjson.com/posts/add", {
          title,
          body,
          userId: 1,
        });
        setPosts([res.data, ...posts]);
      }

      setTitle("");
      setBody("");
    } catch (error) {
      console.error("Erro ao salvar post:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://dummyjson.com/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Erro ao deletar post:", error);
    }
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title);
    setBody(post.body);
    setEditPostId(post.id);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRUD de Posts</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Título"
          className="w-full p-2 border rounded mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Conteúdo"
          className="w-full p-2 border rounded mb-2"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          {editPostId ? "Atualizar Post" : "Criar Post"}
        </button>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded shadow bg-white">
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.body}</p>
            <div className="mt-2 flex gap-2">
              <button
                className="bg-yellow-400 px-3 py-1 rounded cursor-pointer"
                onClick={() => handleEdit(post)}
              >
                Editar
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                onClick={() => handleDelete(post.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
