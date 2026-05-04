"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container-x py-32 text-center">
      <p className="eyebrow mb-6">Erro 500</p>
      <h1 className="mb-6">Algo deu errado.</h1>
      <p className="text-lg mb-10" style={{ color: "var(--color-muted)" }}>
        Tentamos carregar essa página e encontramos um problema.
      </p>
      <button onClick={reset} className="btn-accent">
        Tentar novamente
      </button>
    </main>
  );
}
