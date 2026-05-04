import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-x py-32 text-center">
      <p className="eyebrow mb-6">Erro 404</p>
      <h1 className="mb-6">Página não encontrada.</h1>
      <p className="text-lg mb-10" style={{ color: "var(--color-muted)" }}>
        O endereço que você acessou não existe — ou foi removido.
      </p>
      <Link href="/" className="btn-accent">
        Voltar à home
      </Link>
    </main>
  );
}
