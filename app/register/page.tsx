"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "../../utils/config";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/auth/register/`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg("Registered. Redirecting to login...");
      setTimeout(()=> router.push("/login"), 700);
    } else {
      setMsg(JSON.stringify(data));
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={form.username} onChange={e=>setForm({...form, username:e.target.value})}
          placeholder="username" className="w-full p-2 rounded border" />
        <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})}
          placeholder="email" className="w-full p-2 rounded border" />
        <input value={form.password} onChange={e=>setForm({...form, password:e.target.value})}
          placeholder="password" type="password" className="w-full p-2 rounded border" />
        <div className="flex justify-between items-center">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">Register</button>
          <div className="text-sm text-red-600">{msg}</div>
        </div>
      </form>
    </div>
  );
}
