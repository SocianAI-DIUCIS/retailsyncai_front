"use client";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/api";
import { useRouter } from "next/navigation";
import { API_BASE } from "../../utils/config";

type Product = {
  id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  in_stock?: boolean;
  tags?: string[];
};

function emptyForm() {
  return { sku: "", name: "", description: "", price: 0, category: "", in_stock: true, tags: "" };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(()=>{ loadProducts(page, size, q); }, [page, size]);

  async function loadProducts(pageToLoad = 1, pageSize = 10, searchQ = "") {
    const params = new URLSearchParams();
    params.set("page", String(pageToLoad));
    params.set("size", String(pageSize));
    if (searchQ) params.set("q", searchQ);
    const res = await fetchWithAuth(`${API_BASE}/products/?${params.toString()}`, { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      setProducts(data.items || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
      setSize(data.size || pageSize);
      setTotalPages(data.total_pages || 0);
    } else if (res.status === 401) {
      router.push("/login");
    } else {
      setMsg("Failed to load products");
    }
  }

  function parseTags(str: string) {
    if (!str) return [];
    return str.split(",").map(s => s.trim()).filter(Boolean);
  }

  async function handleCreateOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      sku: form.sku,
      name: form.name,
      description: form.description,
      price: parseFloat(String(form.price)),
      category: form.category,
      in_stock: !!form.in_stock,
      tags: parseTags(form.tags),
    };
    if (editingId) {
      const res = await fetchWithAuth(`${API_BASE}/products/${editingId}/`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMsg("Product updated");
        setForm(emptyForm());
        setEditingId(null);
        loadProducts(page, size, q);
      } else {
        const txt = await res.text();
        setMsg("Error updating: " + txt);
      }
    } else {
      const res = await fetchWithAuth(`${API_BASE}/products/`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMsg("Created");
        setForm(emptyForm());
        loadProducts(page, size, q);
      } else {
        const txt = await res.text();
        setMsg("Error creating: " + txt);
      }
    }
  }

  async function handleEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      sku: p.sku || "",
      name: p.name || "",
      description: p.description || "",
      price: p.price || 0,
      category: p.category || "",
      in_stock: !!p.in_stock,
      tags: (p.tags || []).join(","),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetchWithAuth(`${API_BASE}/products/${id}/`, { method: "DELETE" });
    if (res.ok || res.status === 204) {
      setMsg("Deleted");
      await loadProducts(page, size, q);
      if (products.length === 1 && page > 1) setPage(page - 1);
    } else {
      setMsg("Delete failed");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    loadProducts(1, size, q);
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div className="text-sm text-green-600">{msg}</div>
      </div>

      <form onSubmit={handleCreateOrUpdate} className="bg-white rounded-md shadow p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">{editingId ? "Edit Product" : "Create Product"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">SKU</label>
            <input value={form.sku} onChange={e=>setForm({...form, sku:e.target.value})} className="mt-1 block w-full rounded border p-2" required />
          </div>
          <div>
            <label className="block text-sm">Name</label>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="mt-1 block w-full rounded border p-2" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm">Description</label>
            <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="mt-1 block w-full rounded border p-2" rows={3} />
          </div>
          <div>
            <label className="block text-sm">Price</label>
            <input type="number" step="0.01" value={form.price} onChange={e=>setForm({...form, price:Number(e.target.value)})} className="mt-1 block w-full rounded border p-2" required />
          </div>
          <div>
            <label className="block text-sm">Category</label>
            <input value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="mt-1 block w-full rounded border p-2" />
          </div>
          <div className="flex items-center gap-3">
            <input id="in_stock" type="checkbox" checked={form.in_stock} onChange={e=>setForm({...form, in_stock:e.target.checked})} className="h-4 w-4" />
            <label htmlFor="in_stock" className="text-sm">In stock</label>
          </div>
          <div>
            <label className="block text-sm">Tags (comma separated)</label>
            <input value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})} className="mt-1 block w-full rounded border p-2" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">{editingId ? "Update" : "Create"}</button>
          {editingId && <button type="button" onClick={cancelEdit} className="px-3 py-2 border rounded">Cancel</button>}
        </div>
      </form>

      <div className="mb-4 flex items-center gap-4">
        <form onSubmit={onSearchSubmit} className="flex items-center gap-2">
          <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} className="rounded border p-2" />
          <button className="px-3 py-2 bg-slate-100 rounded">Search</button>
        </form>

        <div className="ml-auto">
          <label className="text-sm mr-2">Page size</label>
          <select value={size} onChange={e=>{ setSize(Number(e.target.value)); setPage(1); }} className="rounded border p-2">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-md shadow p-4">
        <div className="mb-3 text-sm text-slate-600">Page {page} of {totalPages} — total: {total}</div>
        {products.length === 0 ? <div className="text-center text-slate-500 py-8">No products</div> : (
          <ul className="space-y-4">
            {products.map(p=>(
              <li key={p.id} className="flex justify-between p-4 border rounded">
                <div>
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-lg font-semibold">{p.name}</h4>
                    <span className="text-sm text-slate-500">({p.sku})</span>
                  </div>
                  <p className="text-sm text-slate-700">{p.description}</p>
                  <div className="text-xs text-slate-400 mt-2">Price: ${p.price} • Category: {p.category} • In stock: {p.in_stock ? "Yes":"No"}</div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <button onClick={()=>handleEdit(p)} className="px-3 py-1 border rounded">Edit</button>
                  <button onClick={()=>handleDelete(p.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded border">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex justify-center gap-3">
          <button onClick={()=>page>1 && setPage(page-1)} disabled={page<=1} className="px-3 py-1 bg-slate-100 rounded disabled:opacity-50">Prev</button>
          <span className="text-sm text-slate-600">Page {page} / {totalPages}</span>
          <button onClick={()=>page<totalPages && setPage(page+1)} disabled={page>=totalPages} className="px-3 py-1 bg-slate-100 rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
