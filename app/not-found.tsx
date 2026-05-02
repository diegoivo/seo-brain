import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-editorial py-section text-center md:text-left">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="mt-4 hero-title font-display font-bold">
        Esta página não existe.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">
        Pode ter sido movida ou removida. Volte para o início ou para o blog.
      </p>
      <p className="mt-8">
        <Link href="/">← Início</Link>
      </p>
    </section>
  );
}
