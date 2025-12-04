"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/api";
import { clearTokens } from "../../utils/auth";
import { useRouter } from "next/navigation";
import { API_BASE } from "../../utils/config";

type Article = {
  id: string;
  title: string;
  content: string;
  author?: string;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function load() {
    const res = await fetchWithAuth(`${API_BASE}/articles/`, { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      setArticles(data);
    } else if (res.status === 401) {
      setMsg("Unauthorized");
      router.push("/login");
    } else {
      setMsg("Error loading articles");
    }
  }

  useEffect(()=>{ load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetchWithAuth(`${API_BASE}/articles/`, {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ title: "", content: "" });
      load();
    } else if (res.status === 401) {
      router.push("/login");
    } else {
      setMsg("Error creating article");
    }
  }

  function logout() {
    clearTokens();
    router.push("/login");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Articles</h2>
        <button onClick={logout} className="text-sm text-slate-600">Logout</button>
      </div>

      <form onSubmit={create} className="bg-white p-4 rounded shadow mb-6">
        <input placeholder="title" className="w-full p-2 rounded border mb-2" value={form.title} onChange={e=>setForm({...form, title: e.target.value})}/>
        <textarea placeholder="content" className="w-full p-2 rounded border mb-2" value={form.content} onChange={e=>setForm({...form, content: e.target.value})}/>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Create</button>
      </form>

      <ul className="space-y-4">
        {articles.map(a => (
          <li key={a.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{a.title}</h3>
            <p className="text-sm text-slate-700">{a.content}</p>
            <div className="text-xs text-slate-400">by {a.author}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
