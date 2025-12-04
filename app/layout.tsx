import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "RetailSync AI",
  description: "Frontend for RetailSync AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold">RetailSync AI</h1>
                <nav className="hidden md:flex gap-3 text-sm text-slate-600">
                  <Link href="/">Home</Link>
                  <Link href="/register">Register</Link>
                  <Link href="/login">Login</Link>
                  <Link href="/articles">Articles</Link>
                  <Link href="/products">Products</Link>
                </nav>
              </div>
              <div className="text-sm text-slate-500 hidden md:block">Dev</div>
            </div>
          </header>

          <main className="flex-grow max-w-5xl mx-auto px-4 py-8">{children}</main>

          <footer className="bg-white border-t">
            <div className="max-w-5xl mx-auto px-4 py-4 text-xs text-slate-500">
              © {new Date().getFullYear()} — Tailwind + Next.js
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
